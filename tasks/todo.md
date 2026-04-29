# Phase 0 — Setup & Scaffold

## Scaffold & Dependencies
- [x] Create `scaffold-temp` folder at repo root
- [x] Run `create-next-app@14` with TypeScript, Tailwind, App Router, @/* alias
- [x] Move scaffold files to root (package.json, tsconfig.json, app/, etc.)
- [x] Delete `scaffold-temp`
- [x] Run `npm install`
- [x] Install Recharts, lucide-react, date-fns, clsx, tailwind-merge
- [x] Initialize shadcn (`npx shadcn@latest init`)

## Build Fixes
- [x] Replace Geist → Inter in `app/layout.tsx`
- [x] Clean `app/globals.css` to only @tailwind directives

---

## Review

✅ **Phase 0 Complete**

- Next.js 14 scaffold live and running on `http://localhost:3001`
- All dependencies installed (React, Tailwind, shadcn, Recharts, date-fns, etc.)
- Build passes without errors
- Ready for Phase 1 (Design System, Types, Mock Data, Components, Routes, Screens)

**Next:** Phase 1 — UI Mockup with mock data. Start with Design System setup (Tailwind tokens, utilities, lib utilities).
