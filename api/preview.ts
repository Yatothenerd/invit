/**
 * Dynamic SSR endpoint for social media previews
 * Generates personalized meta tags for each guest code
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://toqcfxmppbuciuapupct.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcWNmeG1wcGJ1Y2l1YXB1cGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ1MjMzOSwiZXhwIjoyMDg4MDI4MzM5fQ.xiXlCLWTwPKkZS_-sbb8zGBop_uqNt5rsmR7yxnLRuA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getGuestNameByCode(code: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('guestlist_tb')
    .select('guestname')
    .eq('guestcode', code)
    .single();

  if (error || !data) return null;
  return data.guestname || null;
}

function generateHTML(pageUrl: string, guestName?: string): string {
  const title = guestName ? `${guestName}'s Wedding Invitation` : 'Wedding Invitation - You\'re Invited!';
  const description = guestName
    ? `Dear ${guestName}, we joyfully invite you to celebrate our special day!`
    : 'We joyfully invite you to celebrate our special day. Please join us for our wedding celebration.';

  return `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>

    <!-- Social sharing / thumbnail -->
    <meta property="fb:app_id" content="911892381556089" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${pageUrl}" />
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

export default async function handler(req: any, res: any) {
  const code = req.query.code || req.url?.split('?')[1]?.split('=')[1];

  if (!code || typeof code !== 'string' || code.length !== 6) {
    res.status(400).json({ error: 'Invalid guest code' });
    return;
  }

  try {
    const pageUrl = `https://invite.godyato.xyz/${code}`;
    const guestName = await getGuestNameByCode(code);
    const html = generateHTML(pageUrl, guestName || undefined);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('/api/preview error', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
}
