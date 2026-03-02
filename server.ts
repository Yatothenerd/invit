// --- Supabase client for guest lookups ---
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://toqcfxmppbuciuapupct.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcWNmeG1wcGJ1Y2l1YXB1cGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ1MjMzOSwiZXhwIjoyMDg4MDI4MzM5fQ.xiXlCLWTwPKkZS_-sbb8zGBop_uqNt5rsmR7yxnLRuA';

const supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CODE_LENGTH = 6;

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

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

  // Endpoint to fetch guest names from Supabase
  app.get("/api/guests", async (req, res) => {
    try {
      const { data, error } = await supabaseServer
        .from('guestlist_tb')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("/api/guests Supabase error", error);
        return res.status(500).json({ error: "Failed to fetch guests from database" });
      }

      const guests = (data || []).map((row: any) => ({
        name: row.guestname,
        code: row.guestcode,
        id: row.id,
      }));

      const codes: Record<string, number> = {};
      (data || []).forEach((row: any, idx: number) => {
        codes[row.guestcode] = idx;
      });

      return res.json({ guests, codes });
    } catch (error) {
      console.error("/api/guests error", error);
      res.status(500).json({ error: "Failed to fetch guest names" });
    }
  });

  // Endpoint to update a guest in Supabase
  app.put("/api/guests", async (req, res) => {
    try {
      const { id, guestname, guestcode } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: "Missing guest id" });
      }

      const update: Record<string, any> = {};
      if (guestname !== undefined) update.guestname = guestname;
      if (guestcode !== undefined) update.guestcode = guestcode;

      const { error } = await supabaseServer
        .from("guestlist_tb")
        .update(update)
        .eq("id", id);

      if (error) {
        console.error("/api/guests PUT error", error);
        return res.status(500).json({ error: "Failed to update guest" });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("/api/guests PUT error", error);
      res.status(500).json({ error: "Failed to update guest" });
    }
  });

  // Endpoint to add a new guest (auto-generate code)
  app.post("/api/guests", async (req, res) => {
    try {
      const { guestname } = req.body || {};
      if (!guestname || !guestname.trim()) {
        return res.status(400).json({ error: "Guest name is required" });
      }

      // Fetch existing codes to avoid duplicates
      const { data: existing } = await supabaseServer
        .from("guestlist_tb")
        .select("guestcode");
      const usedCodes = new Set((existing || []).map((r: any) => r.guestcode));

      const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let code = "";
      do {
        code = Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
      } while (usedCodes.has(code));

      const { data: inserted, error } = await supabaseServer
        .from("guestlist_tb")
        .insert({ guestname: guestname.trim(), guestcode: code })
        .select()
        .single();

      if (error) {
        console.error("/api/guests POST error", error);
        return res.status(500).json({ error: "Failed to add guest" });
      }

      return res.status(201).json({
        success: true,
        guest: { id: inserted.id, name: inserted.guestname, code: inserted.guestcode },
      });
    } catch (error) {
      console.error("/api/guests POST error", error);
      res.status(500).json({ error: "Failed to add guest" });
    }
  });

  // Helper to get guest name by code (from Supabase)
  async function getGuestNameByCode(code: string): Promise<string | null> {
    const { data, error } = await supabaseServer
      .from('guestlist_tb')
      .select('guestname')
      .eq('guestcode', code)
      .single();

    if (error || !data) return null;
    return data.guestname || null;
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
    app.get("/:guestCode", async (req, res, next) => {
      const code = req.params.guestCode;
      // Only intercept 6-character alphanumeric strings
      if (code && /^[a-zA-Z0-9]{6}$/.test(code)) {
        try {
          const guestName = await getGuestNameByCode(code);
          const rawHtml = generatePersonalizedHTML(guestName || undefined);
          // Let Vite transform the HTML so HMR and module resolution work
          const html = await vite.transformIndexHtml(req.originalUrl, rawHtml);
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
