// Vercel Serverless Function for guests
// Reads guests from Excel or guests.json and maps them to
// pre-generated codes from guestCodes.json (read-only on Vercel).

import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx/xlsx.mjs';

// Configure XLSX for Node file access
XLSX.set_fs(fs as any);

export default function handler(req: any, res: any) {
  if ((req.method || 'GET') !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cwd = process.cwd();

    // 1) Load guests from Excel (preferred) or JSON, same logic as server.ts
    const excelCandidates = [
      path.join(cwd, 'src', 'WeddingGuest.xlsx'),
      path.join(cwd, 'WeddingGuest.xlsx'),
      '/var/task/src/WeddingGuest.xlsx',
      '/var/task/WeddingGuest.xlsx',
    ];
    const excelPath = excelCandidates.find((candidate) => fs.existsSync(candidate)) ?? null;

    let guests: any[] = [];
    if (excelPath) {
      const workbook = XLSX.readFile(excelPath);
      const sheetName = workbook.SheetNames[0];
      guests = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      console.log(`[API] Loaded ${guests.length} guests from Excel: ${excelPath}`);
    } else {
      const jsonPath = path.join(cwd, 'guests.json');
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        guests = JSON.parse(raw);
        console.log(`[API] Loaded ${guests.length} guests from guests.json`);
      } else {
        console.log('[API] No guest source found');
      }
    }

    // 2) Load pre-generated codes from guestCodes.json (checked into repo)
    const guestCodesPath = path.join(cwd, 'guestCodes.json');
    let rawCodes: Record<string, any> = {};
    if (fs.existsSync(guestCodesPath)) {
      try {
        rawCodes = JSON.parse(fs.readFileSync(guestCodesPath, 'utf-8'));
      } catch (err) {
        console.error('Failed to parse guestCodes.json', err);
      }
    }

    const responseCodes: Record<string, number> = {};
    const guestKey = (guest: any) => JSON.stringify(guest ?? {});
    const claimedIndices = new Set<number>();
    const guestIndicesByKey = new Map<string, number[]>();

    guests.forEach((guest, idx) => {
      const key = guestKey(guest);
      const list = guestIndicesByKey.get(key) ?? [];
      list.push(idx);
      guestIndicesByKey.set(key, list);
    });

    const claimRawIndex = (idx: number): number => {
      if (idx < 0 || idx >= guests.length || claimedIndices.has(idx)) {
        return -1;
      }
      claimedIndices.add(idx);
      return idx;
    };

    const takeIndexByGuestSnapshot = (snapshotGuest: any, preferredIndex?: number): number => {
      const key = guestKey(snapshotGuest);
      const list = guestIndicesByKey.get(key);
      if (!list || list.length === 0) {
        return -1;
      }

      if (typeof preferredIndex === 'number') {
        const preferredPos = list.indexOf(preferredIndex);
        if (preferredPos !== -1) {
          const [idx] = list.splice(preferredPos, 1);
          guestIndicesByKey.set(key, list);
          claimedIndices.add(idx);
          return idx;
        }
      }

      const idx = list.shift() as number;
      guestIndicesByKey.set(key, list);
      claimedIndices.add(idx);
      return idx;
    };

    // Support both old style (code -> index number)
    // and new style (code -> { index, guest })
    for (const [code, entry] of Object.entries(rawCodes)) {
      let idx = -1;
      if (entry && typeof entry === 'object' && 'guest' in entry) {
        idx = takeIndexByGuestSnapshot((entry as any).guest, (entry as any).index);
      }

      if (idx === -1 && typeof entry === 'number') {
        idx = claimRawIndex(entry);
      }

      if (idx === -1 && entry && typeof entry === 'object' && 'index' in entry) {
        const rawIdx = (entry as any).index;
        if (typeof rawIdx === 'number') {
          idx = claimRawIndex(rawIdx);
        }
      }

      if (idx >= 0 && idx < guests.length) {
        responseCodes[code] = idx;
      }
    }

    // Fallback: if no codes at all, generate simple deterministic ones
    if (Object.keys(responseCodes).length === 0 && guests.length > 0) {
      guests.forEach((_, idx) => {
        const code = `G${(idx + 1).toString().padStart(5, '0')}`;
        responseCodes[code] = idx;
      });
    }

    return res.status(200).json({ guests, codes: responseCodes });
  } catch (error) {
    console.error('/api/guests error', error);
    return res.status(500).json({ error: 'Failed to fetch guest names' });
  }
}
