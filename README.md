# Void Mindfulness MVP

Void is a one-page AI-inspired mindfulness companion. This repo contains a Vite + React implementation that matches the product outline: onboarding drawer, daily plan card, AI-generated script with breathing timer, streak tracking, and privacy messaging.

## Prerequisites

- Node.js 18 or newer (LTS recommended)
- npm 9 or newer (bundled with Node)

Check your versions:

```bash
node --version
npm --version
```

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server with hot reloading:
   ```bash
   npm run dev
   ```
3. Open http://localhost:5173/ in your browser. Vite will automatically reload when you edit files in `src/`.

> **Note:** Package installation requires access to the npm registry. If you are working offline, mirror the dependencies listed in `package.json`.

## Building for production

Create an optimized production build:

```bash
npm run build
```

The static assets are output to `dist/`. To preview the build locally you can run:

```bash
npm run preview
```

## Deploying as a web page

The `dist/` folder can be deployed to any static hosting provider. Common options include:

- **Vercel**
  1. Install the Vercel CLI and log in (`npm i -g vercel && vercel login`).
  2. Run `npm run build`.
  3. Deploy with `vercel --prod`, pointing to the `dist/` directory when prompted.

- **Netlify**
  1. Install the Netlify CLI (`npm i -g netlify-cli`).
  2. Build the project locally with `npm run build`.
  3. Deploy with `netlify deploy --dir=dist` (add `--prod` for production).

- **GitHub Pages**
  - **Automatic (recommended)**: The repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds on every push to `main` and publishes the result to the `gh-pages` branch. Enable Pages in **Settings → Pages** and select "GitHub Actions" as the source.
  - **Manual**: Run `npm run build`, then commit and push the contents of `dist/` to the `gh-pages` branch (for example, using `git subtree push --prefix dist origin gh-pages`).

If you prefer manual hosting (e.g., S3, Cloudflare Pages, or a custom server), upload the files in `dist/` to your host's public directory and ensure the root is served as `index.html`.

## Key features

- Guided onboarding drawer collecting name, goal, mood, session length, and reminder time.
- Local-first data storage using Zustand with persistence.
- AI content generator stub (`src/utils/ai.ts`) that outputs guidance script, reflection, and micro-tip.
- Session player with Web Speech API playback, animated breathing timer, and post-session checkout.
- Crisis safety banner that surfaces after three consecutive mood scores of 1.
- Privacy modal, streak pill, and history chip summarizing the last 7 days.

## Project structure

```
├── index.html
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── BreathingTimer.tsx
│   │   ├── CheckOut.tsx
│   │   ├── HistoryChip.tsx
│   │   ├── OnboardingDrawer.tsx
│   │   ├── PrivacyModal.tsx
│   │   ├── SessionPlayer.tsx
│   │   ├── StreakPill.tsx
│   │   └── TodayCard.tsx
│   ├── hooks
│   │   └── useAppStore.ts
│   ├── main.tsx
│   ├── styles
│   │   └── index.css
│   └── utils
│       └── ai.ts
├── tailwind.config.cjs
└── vite.config.ts
```

## Testing checklist

- On first load the onboarding drawer opens.
- After saving preferences, the Today card greets the user and offers a start CTA.
- Starting a session generates guidance, plays audio (if supported), and shows the breathing timer.
- Completing checkout updates streak count and stores notes locally.
- Privacy modal and crisis banner behave per the MVP spec.

## Deployment roadmap

For PWA capabilities (notifications, offline scripts), integrate a service worker and add manifest metadata. Ensure a privacy policy is hosted and linked in the footer before launch.
