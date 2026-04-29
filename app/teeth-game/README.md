# 🦷 Tooth Explorer — Next.js + TypeScript

A fun teeth anatomy game for kids aged 5–10, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Teeth Quiz** — 8 questions covering tooth types, cavity causes, brushing habits, enamel, roots, and more. Every question shows a fun fact after answering.
- **Label a Tooth** — Interactive cross-section diagram where kids match part names (Enamel, Crown, Pulp, Gum line, Root) to numbered slots.
- **Result screen** — Score display, fun fact, and replay option.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Home page
│   └── globals.css       # Tailwind base styles
├── components/
│   ├── ToothGame.tsx     # Main orchestrator (screen state)
│   ├── HomeScreen.tsx    # Mode selection screen
│   ├── QuizScreen.tsx    # 8-question quiz
│   ├── LabelScreen.tsx   # Drag-and-label tooth diagram
│   ├── ToothDiagram.tsx  # SVG cross-section of a tooth
│   └── ResultScreen.tsx  # Final score + fun fact
├── data/
│   └── gameData.ts       # Questions, label parts, fun facts
└── types/
    └── index.ts          # Shared TypeScript types
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Customisation

- **Add questions**: Edit `src/data/gameData.ts` — add objects to the `questions` array following the existing shape.
- **Change colours**: All styling uses Tailwind utility classes — edit component files directly.
- **Add more label parts**: Extend `labelParts` in `gameData.ts` and update `ToothDiagram.tsx` with new pointer dots and leader lines.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- React 18 hooks (`useState`, `useRef`, `useMemo`, `useCallback`)
