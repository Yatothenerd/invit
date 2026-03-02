/**
 * Dynamic SSR endpoint for social media previews
 * Generates personalized meta tags for each guest code
 */
import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx/xlsx.mjs';

XLSX.set_fs(fs as any);

interface GuestCodeEntry {
  index: number;
  guest: any;
}

function loadGuestCodes(): Record<string, GuestCodeEntry | number> {
  const guestCodesPath = path.join(process.cwd(), 'guestCodes.json');
  if (fs.existsSync(guestCodesPath)) {
    try {
      return JSON.parse(fs.readFileSync(guestCodesPath, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

function loadGuests(): any[] {
  const cwd = process.cwd();
  const excelCandidates = [
    path.join(cwd, 'src', 'WeddingGuest.xlsx'),
    path.join(cwd, 'WeddingGuest.xlsx'),
    '/var/task/src/WeddingGuest.xlsx',
    '/var/task/WeddingGuest.xlsx',
  ];
  const excelPath = excelCandidates.find((candidate) => fs.existsSync(candidate));

  if (excelPath) {
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  const jsonPath = path.join(cwd, 'guests.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(raw);
  }

  return [];
}

function getGuestNameByCode(code: string): string | null {
  const codes = loadGuestCodes();
  const entry = codes[code];

  if (!entry) {
    return null;
  }

  let guestData: any = null;

  if (typeof entry === 'number') {
    const guests = loadGuests();
    guestData = guests[entry];
  } else if (entry && typeof entry === 'object' && 'guest' in entry) {
    guestData = (entry as GuestCodeEntry).guest;
  }

  if (guestData) {
    return (
      guestData.name ||
      guestData.Name ||
      guestData.Guestname ||
      (Object.values(guestData).find((v) => typeof v === 'string' && (v as string).trim().length > 0) as string | undefined) ||
      null
    );
  }

  return null;
}

function generateHTML(guestName?: string): string {
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

export default function handler(req: any, res: any) {
  const code = req.query.code || req.url?.split('?')[1]?.split('=')[1];

  if (!code || typeof code !== 'string' || code.length !== 6) {
    res.status(400).json({ error: 'Invalid guest code' });
    return;
  }

  try {
    const guestName = getGuestNameByCode(code);
    const html = generateHTML(guestName || undefined);
    res.setHeader('Content-Type', 'text/html; charset=utensils');
    res.send(html);
  } catch (error) {
    console.error('/api/preview error', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
}
