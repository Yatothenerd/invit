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
  // Logic is aligned with the Vercel serverless function in api/guests.ts
  app.get("/api/guests", (req, res) => {
    try {
      const cwd = process.cwd();

      // 1) Load guests from Excel (preferred) or JSON
      const excelCandidates = [
        path.join(cwd, "src", "WeddingGuest.xlsx"),
        path.join(cwd, "WeddingGuest.xlsx"),
      ];
      const excelPath = excelCandidates.find((candidate) => fs.existsSync(candidate)) ?? null;

      let guests: any[] = [];
      if (excelPath) {
        const workbook = XLSX.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        guests = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(`[API] Loaded ${guests.length} guests from Excel: ${excelPath}`);
      } else {
        const jsonPath = path.join(cwd, "guests.json");
        if (fs.existsSync(jsonPath)) {
          const raw = fs.readFileSync(jsonPath, "utf-8");
          guests = JSON.parse(raw);
          console.log(`[API] Loaded ${guests.length} guests from guests.json`);
        } else {
          console.log("[API] No guest source found");
        }
      }

      // 2) Load pre-generated codes from guestCodes.json (treated as read-only)
      const guestCodesPathLocal = path.join(cwd, "guestCodes.json");
      let rawCodes: Record<string, any> = {};
      if (fs.existsSync(guestCodesPathLocal)) {
        try {
          rawCodes = JSON.parse(fs.readFileSync(guestCodesPathLocal, "utf-8"));
        } catch (err) {
          console.error("Failed to parse guestCodes.json", err);
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

        if (typeof preferredIndex === "number") {
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
        if (entry && typeof entry === "object" && "guest" in entry) {
          idx = takeIndexByGuestSnapshot((entry as any).guest, (entry as any).index);
        }

        if (idx === -1 && typeof entry === "number") {
          idx = claimRawIndex(entry);
        }

        if (idx === -1 && entry && typeof entry === "object" && "index" in entry) {
          const rawIdx = (entry as any).index;
          if (typeof rawIdx === "number") {
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
          const code = `G${(idx + 1).toString().padStart(5, "0")}`;
          responseCodes[code] = idx;
        });
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

  // Helper to get guest name by code
  function getGuestNameByCode(code: string): string | null {
    const codes = loadGuestCodes();
    const entry = codes[code];

    if (!entry) {
      return null;
    }

    let guestData: any = null;

    if (typeof entry === "number") {
      try {
        const excelPathSrc = path.join(process.cwd(), "src", "WeddingGuest.xlsx");
        const excelPathRoot = path.join(process.cwd(), "WeddingGuest.xlsx");
        const excelPath = fs.existsSync(excelPathSrc)
          ? excelPathSrc
          : fs.existsSync(excelPathRoot)
          ? excelPathRoot
          : null;

        if (excelPath) {
          const workbook = XLSX.readFile(excelPath);
          const sheetName = workbook.SheetNames[0];
          const guests = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          guestData = guests[entry];
        }
      } catch (err) {
        console.error("Error loading guest by index", err);
      }
    } else if (entry && typeof entry === "object" && "guest" in entry) {
      guestData = (entry as GuestCodeEntry).guest;
    }

    if (guestData) {
      return (
        guestData.name ||
        guestData.Name ||
        guestData.Guestname ||
        (Object.values(guestData).find((v) => typeof v === "string" && (v as string).trim().length > 0) as string | undefined) ||
        null
      );
    }

    return null;
  }

  // Helper to generate personalized HTML
  function generatePersonalizedHTML(guestName?: string): string {
    const title = guestName ? `${guestName}'s Wedding Invitation` : "Wedding Invitation - You're Invited!";
    const description = guestName
      ? `Dear ${guestName}, we joyfully invite you to celebrate our special day!`
      : "We joyfully invite you to celebrate our special day. Please join us for our wedding celebration.";

    return `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>

    <!-- Social sharing / thumbnail -->
    <meta property="fb:app_id" content="911892381556089" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://invite.godyato.xyz/" />
    <meta property="og:title" content="${title}" />
    <meta property="og:site_name" content="Wedding Invitation" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="https://invite.godyato.xyz/image/Asset/Thumbnail_Messenger.jpg" />
    <meta property="og:image:url" content="https://invite.godyato.xyz/image/Asset/Thumbnail_Messenger.jpg" />
    <meta property="og:image:secure_url" content="https://invite.godyato.xyz/image/Asset/Thumbnail_Messenger.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Wedding Invitation" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="https://invite.godyato.xyz/image/Asset/Thumbnail_Messenger.jpg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"><\/script>
  </body>
</html>`;
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Handle guest code routes with SSR before Vite middleware
    app.get("/:guestCode", (req, res, next) => {
      const code = req.params.guestCode;
      // Only intercept 6-character alphanumeric strings
      if (code && /^[a-zA-Z0-9]{6}$/.test(code)) {
        try {
          const guestName = getGuestNameByCode(code);
          const html = generatePersonalizedHTML(guestName || undefined);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.send(html);
        } catch (error) {
          console.error("Error generating SSR HTML for code", code, error);
          next();
        }
      } else {
        next();
      }
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
