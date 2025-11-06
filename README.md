# Void Mindfulness MVP

Void is a one-page AI-inspired mindfulness companion. This repo contains a Vite + React implementation that matches the product outline: onboarding drawer, daily plan card, AI-generated script with breathing timer, streak tracking, and privacy messaging.

## Getting started

```bash
npm install
npm run dev
```

> **Note:** Package installation requires access to the npm registry. If you are working offline, mirror the dependencies listed in `package.json`.

The dev server runs at http://localhost:5173/ by default.

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

## Deployment

Use `npm run build` to produce static assets in `dist/`. The output is compatible with Netlify, Vercel, or any static host. For PWA capabilities (notifications, offline scripts), integrate a service worker in a future iteration.
