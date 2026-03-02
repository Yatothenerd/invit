<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7b40a33f-eed7-4e49-b124-4e61069486bc

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy on Vercel

- Framework: select **Vite** (or let Vercel auto-detect).
- Build command: `npm run build`
- Output directory: `dist`
- APIs: the following serverless functions are available on Vercel:
   - `GET/POST /api/wishes` – in-memory wishes (resets on cold start).
   - `GET /api/guests` – reads guests from `src/WeddingGuest.xlsx` on every request (fallback: `guests.json`) and uses `guestCodes.json` for codes.
   - `POST /api/upload-guests` – **disabled on Vercel**; use the local server to update guest data and commit the resulting files.

When you push a new `src/WeddingGuest.xlsx` and redeploy, guest data is converted to JSON at runtime automatically by `/api/guests` (no manual conversion step needed).

After pushing to a Git repo (GitHub/GitLab/Bitbucket), import the project in Vercel, verify the settings above, and deploy.
