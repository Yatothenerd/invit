/**
 * Build script to generate guest codes from WeddingGuest.xlsx
 * Runs during Vercel deployment to ensure guestCodes.json is always in sync
 */
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx/xlsx.mjs";

XLSX.set_fs(fs as any);

interface GuestCodeEntry {
  index: number;
  guest: any;
}

const CODE_LENGTH = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomCode(existing: Set<string>): string {
  let code = "";
  do {
    code = Array.from({ length: CODE_LENGTH }, () =>
      ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    ).join("");
  } while (existing.has(code));
  return code;
}

function loadGuestCodes(): Record<string, GuestCodeEntry | number> {
  const guestCodesPath = path.join(process.cwd(), "guestCodes.json");
  if (fs.existsSync(guestCodesPath)) {
    try {
      return JSON.parse(fs.readFileSync(guestCodesPath, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveGuestCodes(codes: Record<string, GuestCodeEntry>) {
  const guestCodesPath = path.join(process.cwd(), "guestCodes.json");
  fs.writeFileSync(guestCodesPath, JSON.stringify(codes, null, 2));
  console.log(`[BUILD] Updated ${guestCodesPath}`);
}

function main() {
  console.log("[BUILD] Generating guest codes from WeddingGuest.xlsx...");

  // Find Excel file
  const excelCandidates = [
    path.join(process.cwd(), "src", "WeddingGuest.xlsx"),
    path.join(process.cwd(), "WeddingGuest.xlsx"),
  ];
  const excelPath = excelCandidates.find((candidate) => fs.existsSync(candidate));

  if (!excelPath) {
    console.log("[BUILD] No WeddingGuest.xlsx found, skipping code generation");
    return;
  }

  console.log(`[BUILD] Reading guests from: ${excelPath}`);

  try {
    // Load guests from Excel
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const guests: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`[BUILD] Found ${guests.length} guests in Excel`);

    // Load existing codes
    const rawCodes = loadGuestCodes();
    const normalizedCodes: Record<string, GuestCodeEntry> = {};

    const guestKey = (g: any) => JSON.stringify(g ?? {});

    // Normalize and preserve existing codes
    for (const [code, entry] of Object.entries(rawCodes)) {
      if (typeof entry === "number") {
        const idx = entry;
        if (idx >= 0 && idx < guests.length) {
          normalizedCodes[code] = { index: idx, guest: guests[idx] };
        }
      } else if (entry && typeof entry === "object") {
        const prevGuest = (entry as GuestCodeEntry).guest;
        if (prevGuest) {
          const key = guestKey(prevGuest);
          const idx = guests.findIndex((g) => guestKey(g) === key);
          if (idx !== -1) {
            normalizedCodes[code] = { index: idx, guest: guests[idx] };
          }
        }
      }
    }

    const usedCodes = new Set(Object.keys(normalizedCodes));
    let newCodesGenerated = 0;

    // Generate codes for new guests
    guests.forEach((guest, idx) => {
      const key = guestKey(guest);
      const existingCode = Object.entries(normalizedCodes).find(
        ([, value]) => guestKey(value.guest) === key
      )?.[0];

      if (!existingCode) {
        const code = randomCode(usedCodes);
        normalizedCodes[code] = { index: idx, guest };
        usedCodes.add(code);
        newCodesGenerated++;
        console.log(
          `[BUILD] Generated code ${code} for new guest: ${JSON.stringify(guest).substring(0, 50)}...`
        );
      } else {
        // Update index in case rows moved
        normalizedCodes[existingCode].index = idx;
      }
    });

    saveGuestCodes(normalizedCodes);
    console.log(
      `[BUILD] ✓ Codes synced. Generated ${newCodesGenerated} new code(s) for ${guests.length} total guests.`
    );
  } catch (error) {
    console.error("[BUILD] Failed to generate guest codes:", error);
    process.exit(1);
  }
}

main();
