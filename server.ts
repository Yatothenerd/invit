// --- Guest code mapping helpers ---
const CODE_LENGTH = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const guestCodesPath = path.join(process.cwd(), "guestCodes.json");

// Each code is stored with a snapshot of the guest row so we
// can find the same person again even if rows are reordered
// or new rows are inserted above them.
interface GuestCodeEntry {
  index: number; // current index when saved (for convenience)
  guest: any; // snapshot of the row when the code was created
}

function loadGuestCodes(): Record<string, GuestCodeEntry | number> {
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
  fs.writeFileSync(guestCodesPath, JSON.stringify(codes, null, 2));
}

function randomCode(existing: Set<string>): string {
  let code = "";
  do {
    code = Array.from({ length: CODE_LENGTH }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
  } while (existing.has(code));
  return code;
}
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import * as XLSX from "xlsx/xlsx.mjs";
import fs from "fs";
import multer from "multer";

// Configure XLSX for Node file access
XLSX.set_fs(fs as any);

// Multer for optional XLSX uploads
const upload = multer({ dest: "uploads/" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple in-memory wishes store (no wedding.db)
  const wishes: { id: number; name: string; message: string; created_at: string }[] = [];
  let nextWishId = 1;

  app.get("/api/wishes", (req, res) => {
    res.json(wishes.slice().reverse());
  });

  app.post("/api/wishes", (req, res) => {
    const { name, message } = req.body as { name?: string; message?: string };
    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required" });
    }
    const wish = {
      id: nextWishId++,
      name,
      message,
      created_at: new Date().toISOString(),
    };
    wishes.push(wish);
    res.json(wish);
  });

  // Endpoint to fetch guest names
  // /api/guests returns { guests: [...], codes: { code: index } }
  app.get("/api/guests", (req, res) => {
    try {
      const excelPathSrc = path.join(process.cwd(), "src", "WeddingGuest.xlsx");
      const excelPathRoot = path.join(process.cwd(), "WeddingGuest.xlsx");
      const excelPath = fs.existsSync(excelPathSrc) ? excelPathSrc : fs.existsSync(excelPathRoot) ? excelPathRoot : null;

      let guests: any[] = [];
      if (excelPath) {
        const workbook = XLSX.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        guests = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(`[API] Loaded ${guests.length} guests from Excel: ${excelPath}`);
      } else {
        const jsonPath = path.join(process.cwd(), "guests.json");
        if (fs.existsSync(jsonPath)) {
          const raw = fs.readFileSync(jsonPath, "utf-8");
          guests = JSON.parse(raw);
          console.log(`[API] Loaded ${guests.length} guests from guests.json`);
        } else {
          console.log(`[API] No guest source found`);
        }
      }

      // Load or generate codes. We store a snapshot of the guest row
      // so we can re-find the same person even if Excel rows move.
      const rawCodes = loadGuestCodes();
      const normalizedCodes: Record<string, GuestCodeEntry> = {};

      // Helper to stringify a guest consistently
      const guestKey = (g: any) => JSON.stringify(g ?? {});

      // First, normalize any old-format entries (code -> index number)
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
      let changed = false;

      // Ensure every current guest has a code, based on its row contents
      guests.forEach((guest, idx) => {
        const key = guestKey(guest);
        const existingCode = Object.entries(normalizedCodes).find(
          ([, value]) => guestKey(value.guest) === key
        )?.[0];

        if (!existingCode) {
          const code = randomCode(usedCodes);
          normalizedCodes[code] = { index: idx, guest };
          usedCodes.add(code);
          changed = true;
        } else {
          // Update stored index in case the row moved
          const entry = normalizedCodes[existingCode];
          if (entry.index !== idx) {
            entry.index = idx;
            changed = true;
          }
        }
      });

      if (changed) saveGuestCodes(normalizedCodes);

      // For the frontend we still expose codes as { code: index }
      const responseCodes: Record<string, number> = {};
      for (const [code, entry] of Object.entries(normalizedCodes)) {
        if (entry.index >= 0 && entry.index < guests.length) {
          responseCodes[code] = entry.index;
        }
      }

      return res.json({ guests, codes: responseCodes });
    } catch (error) {
      console.error("/api/guests error", error);
      res.status(500).json({ error: "Failed to fetch guest names" });
    }
  });

  // Endpoint to upload XLSX file and convert to JSON (optional admin tool)
  app.post("/api/upload-guests", upload.single("file"), (req, res) => {
    try {
      const filePath = (req as any).file?.path as string | undefined;
      if (!filePath) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Save JSON data to a file
      fs.writeFileSync("guests.json", JSON.stringify(jsonData, null, 2));

      res.json({ message: "File uploaded and converted successfully", data: jsonData });
    } catch (error) {
      res.status(500).json({ error: "Failed to process file" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
