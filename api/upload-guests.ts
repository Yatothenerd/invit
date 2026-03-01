// Vercel Serverless Function stub for guest uploads.
// The real upload + Excel-to-JSON logic is available in the local
// Express server (server.ts) using Multer and file I/O.
// On Vercel, persistent file writes are not supported, so this
// endpoint is intentionally disabled in production.

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    return res
      .status(501)
      .json({ error: 'Guest upload is disabled on Vercel. Use the local admin/server to update guests.json and commit changes.' });
  }

  res.setHeader('Allow', 'POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
