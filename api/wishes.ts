// Vercel Serverless Function for wishes
// Backed by the persistent Supabase "wishes" table using the service role key
// so writes succeed even when row level security is enabled.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://toqcfxmppbuciuapupct.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcWNmeG1wcGJ1Y2l1YXB1cGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ1MjMzOSwiZXhwIjoyMDg4MDI4MzM5fQ.xiXlCLWTwPKkZS_-sbb8zGBop_uqNt5rsmR7yxnLRuA';

const supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export default async function handler(req: any, res: any) {
  const method = req.method || 'GET';

  if (method === 'GET') {
    try {
      const { data, error } = await supabaseServer
        .from('wishes')
        .select('id, name, message, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('/api/wishes GET error', error);
        return res.status(500).json({ error: 'Failed to fetch wishes' });
      }

      return res.status(200).json(data || []);
    } catch (err) {
      console.error('/api/wishes GET exception', err);
      return res.status(500).json({ error: 'Failed to fetch wishes' });
    }
  }

  if (method === 'POST') {
    const body = (req.body || {}) as { name?: string; message?: string };
    const { name, message } = body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    try {
      const { data, error } = await supabaseServer
        .from('wishes')
        .insert({ name, message })
        .select('id, name, message, created_at')
        .single();

      if (error) {
        console.error('/api/wishes POST error', error);
        return res.status(500).json({ error: 'Failed to save wish' });
      }

      return res.status(201).json(data);
    } catch (err) {
      console.error('/api/wishes POST exception', err);
      return res.status(500).json({ error: 'Failed to save wish' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
