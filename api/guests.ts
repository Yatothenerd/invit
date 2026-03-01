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
    const excelPathSrc = path.join(cwd, 'src', 'WeddingGuest.xlsx');
    const excelPathRoot = path.join(cwd, 'WeddingGuest.xlsx');
    const excelPath = fs.existsSync(excelPathSrc)
      ? excelPathSrc
      : fs.existsSync(excelPathRoot)
      ? excelPathRoot
      : null;

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

    // Support both old style (code -> index number)
    // and new style (code -> { index, guest })
    for (const [code, entry] of Object.entries(rawCodes)) {
      if (typeof entry === 'number') {
        const idx = entry;
        if (idx >= 0 && idx < guests.length) {
          responseCodes[code] = idx;
        }
      } else if (entry && typeof entry === 'object' && 'index' in entry) {
        const idx = (entry as any).index as number;
        if (typeof idx === 'number' && idx >= 0 && idx < guests.length) {
          responseCodes[code] = idx;
        }
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
