
# Emotion Journal — React + TypeScript (Vite)

An advanced frontend for **Design and Evaluation of an AI‑Driven Emotion‑Aware Journaling Platform for Digital Well‑Being**.

## Features
- 📝 Text & 🎙️ voice journal entries (MediaRecorder)
- 🔮 Local AI placeholders for emotion & sentiment (swap with real API later)
- 📊 Insights dashboard with radar chart
- 🏷️ Tags, search, recent entries
- 🌙 Dark/light theme (persisted)
- 💾 Local‑first persistence (Zustand + localStorage)
- 🔐 Auth placeholders (swap with backend later)
- 📦 PWA shell & basic offline cache
- 📤 Export entries (JSON)

## Tech
React 18, TypeScript, Vite 5, Tailwind CSS, Zustand, Recharts, React Router.

## Quick start
```bash
# 1) Install deps
npm install

# 2) Run dev server
npm run dev

# 3) Build for production
npm run build
npm run preview
```

## Connect your models later
Replace functions in `src/services/ai.ts` with calls to your **text** and **speech** emotion models (REST or WebSocket).

## Backend integration
- Swap auth in `src/state/auth.ts` with real endpoints (sign in/up/out).
- Replace journal store with server‑synced API (keep local cache for offline).

## Notes
- This is a research prototype frontend compliant with accessible defaults (labels, ARIA where relevant).
- For dissertation screenshots: Dashboard, Journal Editor (with audio), Insights.
- License: MIT
