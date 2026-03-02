// Vercel Serverless Function for guests
// Reads guests from Supabase guestlist_tb table

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://toqcfxmppbuciuapupct.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcWNmeG1wcGJ1Y2l1YXB1cGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ1MjMzOSwiZXhwIjoyMDg4MDI4MzM5fQ.xiXlCLWTwPKkZS_-sbb8zGBop_uqNt5rsmR7yxnLRuA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req: any, res: any) {
  const method = req.method || 'GET';

  // --- PUT: update a guest ---
  if (method === 'PUT') {
    try {
      const { id, guestname, guestcode } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Missing guest id' });
      }

      const update: Record<string, any> = {};
      if (guestname !== undefined) update.guestname = guestname;
      if (guestcode !== undefined) update.guestcode = guestcode;

      const { error } = await supabase
        .from('guestlist_tb')
        .update(update)
        .eq('id', id);

      if (error) {
        console.error('/api/guests PUT error', error);
        return res.status(500).json({ error: 'Failed to update guest' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('/api/guests PUT error', error);
      return res.status(500).json({ error: 'Failed to update guest' });
    }
  }

  // --- POST: add a new guest (auto-generate code) ---
  if (method === 'POST') {
    try {
      const { guestname } = req.body || {};
      if (!guestname || !guestname.trim()) {
        return res.status(400).json({ error: 'Guest name is required' });
      }

      // Fetch existing codes to avoid duplicates
      const { data: existing } = await supabase
        .from('guestlist_tb')
        .select('guestcode');
      const usedCodes = new Set((existing || []).map((r: any) => r.guestcode));

      const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      do {
        code = Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
      } while (usedCodes.has(code));

      const { data: inserted, error } = await supabase
        .from('guestlist_tb')
        .insert({ guestname: guestname.trim(), guestcode: code })
        .select()
        .single();

      if (error) {
        console.error('/api/guests POST error', error);
        return res.status(500).json({ error: 'Failed to add guest' });
      }

      return res.status(201).json({ success: true, guest: { id: inserted.id, name: inserted.guestname, code: inserted.guestcode } });
    } catch (error) {
      console.error('/api/guests POST error', error);
      return res.status(500).json({ error: 'Failed to add guest' });
    }
  }

  // --- GET: list all guests ---
  if (method !== 'GET') {
    res.setHeader('Allow', 'GET, PUT, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('guestlist_tb')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('/api/guests Supabase error', error);
      return res.status(500).json({ error: 'Failed to fetch guests from database' });
    }

    const guests = (data || []).map((row: any) => ({
      name: row.guestname,
      code: row.guestcode,
      id: row.id,
    }));

    // Build codes map for backward compatibility
    const codes: Record<string, number> = {};
    (data || []).forEach((row: any, idx: number) => {
      codes[row.guestcode] = idx;
    });

    return res.status(200).json({ guests, codes });
  } catch (error) {
    console.error('/api/guests error', error);
    return res.status(500).json({ error: 'Failed to fetch guest names' });
  }
}
