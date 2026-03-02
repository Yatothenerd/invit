/**
 * Batch re-scrape all guest URLs on Facebook to refresh OG metadata/thumbnails.
 *
 * Usage:
 *   npx tsx scripts/fb-rescrape.ts <FACEBOOK_ACCESS_TOKEN>
 *
 * Get a token from: https://developers.facebook.com/tools/explorer/
 * (Select your app, no special permissions needed)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://toqcfxmppbuciuapupct.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcWNmeG1wcGJ1Y2l1YXB1cGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ1MjMzOSwiZXhwIjoyMDg4MDI4MzM5fQ.xiXlCLWTwPKkZS_-sbb8zGBop_uqNt5rsmR7yxnLRuA";
const BASE_URL = "https://invite.godyato.com";

const FB_GRAPH = "https://graph.facebook.com/v19.0/";

async function rescrape(url: string, token: string): Promise<{ url: string; ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${FB_GRAPH}?id=${encodeURIComponent(url)}&scrape=true&access_token=${token}`,
      { method: "POST" }
    );
    if (!res.ok) {
      const body = await res.text();
      return { url, ok: false, error: `${res.status} - ${body}` };
    }
    return { url, ok: true };
  } catch (e: any) {
    return { url, ok: false, error: e.message };
  }
}

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("Usage: npx tsx scripts/fb-rescrape.ts <FACEBOOK_ACCESS_TOKEN>");
    console.error("Get a token from: https://developers.facebook.com/tools/explorer/");
    process.exit(1);
  }

  // Fetch all guest codes from Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: guests, error } = await supabase
    .from("guestlist_tb")
    .select("guestcode");

  if (error) {
    console.error("Failed to fetch guests:", error.message);
    process.exit(1);
  }

  const codes = guests.map((g: any) => g.guestcode).filter(Boolean);
  console.log(`Found ${codes.length} guest codes. Starting batch re-scrape...\n`);

  let success = 0;
  let failed = 0;

  // Process in batches of 5 to avoid rate-limiting
  const BATCH_SIZE = 5;
  for (let i = 0; i < codes.length; i += BATCH_SIZE) {
    const batch = codes.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((code: string) => rescrape(`${BASE_URL}/${code}`, token))
    );

    for (const r of results) {
      if (r.ok) {
        success++;
        console.log(`✓ ${r.url}`);
      } else {
        failed++;
        console.error(`✗ ${r.url} — ${r.error}`);
      }
    }

    // Small delay between batches
    if (i + BATCH_SIZE < codes.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\nDone! ${success} succeeded, ${failed} failed out of ${codes.length} total.`);
}

main();
