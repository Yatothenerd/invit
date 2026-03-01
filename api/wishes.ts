// Vercel Serverless Function for wishes
// Ephemeral in-memory store (resets on cold start),
// same behavior as the local dev server.

interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

const wishes: Wish[] = [];
let nextWishId = 1;

export default function handler(req: any, res: any) {
  const method = req.method || 'GET';

  if (method === 'GET') {
    // Return newest first, like the Express server
    return res.status(200).json([...wishes].reverse());
  }

  if (method === 'POST') {
    const body = (req.body || {}) as { name?: string; message?: string };
    const { name, message } = body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    const wish: Wish = {
      id: nextWishId++,
      name,
      message,
      created_at: new Date().toISOString(),
    };
    wishes.push(wish);
    return res.status(200).json(wish);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
