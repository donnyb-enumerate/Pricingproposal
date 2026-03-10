# Enumerate Proposal Generator

Internal sales tool for generating branded pricing proposal PDFs.

## Quick Deploy to Vercel

### Option A: One-click (Recommended)

1. Push this folder to a **GitHub repo** (public or private)
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"**
4. Select your repo
5. Vercel auto-detects Vite — just click **"Deploy"**
6. Done! Share the URL with your team.

### Option B: CLI

```bash
npm install
npx vercel
```

Follow the prompts. Takes about 60 seconds.

## Quick Deploy to Netlify

1. Push this folder to a **GitHub repo**
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click **"Add new site" → "Import an existing project"**
4. Select your repo
5. Build settings will auto-detect:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## How It Works

Sales reps fill in:
- **Account name** — appears on the cover page and file name
- **Rep name** — appears on the closing/contact page
- **Number of doors** — recalculates all per-door pricing
- **Custom price per package** — if below list, PDF shows strikethrough + discount badge
- **Waive onboarding toggle** — strikes through onboarding fee and shows "WAIVED"

Clicking "Generate Proposal PDF" creates a 5-page branded PDF that downloads instantly.

## Updating Pricing

Edit the `LIST_PRICES` object at the top of `src/App.jsx`:

```js
const LIST_PRICES = {
  growth: { base: 475, perDoor: 1.0, onboarding: 2500 },
  enterprise: { base: 575, perDoor: 1.2, onboarding: 5000 },
};
```

Features, AR/AP fees, and implementation phases can also be edited in the same file.

## Tech Stack

- React 18 + Vite
- jsPDF (loaded from CDN at runtime for PDF generation)
- Zero backend — runs entirely in the browser
