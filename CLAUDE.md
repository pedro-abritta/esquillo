# CLAUDE.md — Esquilo

Personal finance app for Brazilian users. Tracks income, expenses, credit card invoices with installment projection, and organizes deductible documents (PDFs) for income tax declaration. Single-user, mobile + desktop, Windows/PowerShell dev environment.

---

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui
- Recharts · lucide-react · date-fns (pt-BR locale)
- Supabase (Postgres + Auth + Storage) — phase 2+
- Vercel (deploy) — phase 0+

Single repo, full-stack Next.js. No separate FastAPI service.

---

## Project Phases

Tracked in `tasks/roadmap.md`. Current phase determines what is valid to install/build.

| Phase | Includes |
|---|---|
| 0. Setup | Repo, Next.js scaffold, Tailwind, shadcn primitives |
| 1. UI Mockup | 4 main screens with mock data, full navigation |
| 2. Schema + Core CRUD | Supabase, types, RLS, basic CRUD |
| 3. Cards + Invoices | Cards CRUD, installment splitting, invoice projection |
| 4. Recurring | Templates + monthly confirmation flow |
| 5. Dashboard (real data) | Charts wired to real aggregations |
| 6. Security | RLS audit, rate limit, CSP/HSTS, upload validation, audit log |
| 7. IR Folder | PDF storage, deductible categories, zip export |
| 8. Extras | NL quick-add, OCR for receipts |

**Never anticipate features from a future phase without explicit user approval.**

---

## Shell Execution Rules (HARD RULES)

These rules exist because violating them caused real damage in past sessions. They are non-negotiable.

### 1. One command per turn
- **Never** chain commands with `&&`, `;`, or `|`.
- Run **one command**, wait for output, verify success, then run the next.
- This applies even to "trivial" sequences. Especially during setup.
- Exception: a single pipe in a read-only inspection (`Get-ChildItem | Select-Object Name`) is fine. Anything that mutates state must be standalone.

### 2. PowerShell-native syntax only
- ❌ `&&` does NOT work in PowerShell 5.1. Do not use it under any circumstance.

### 3. Validate before bulk operations
- Before any `Copy-Item`, `Move-Item`, or `Remove-Item` that touches multiple files: run `Get-ChildItem -Force <path>` first and confirm what's there.
- Never copy "the obvious files" from memory — list, then act.

### 4. No file dancing
- **Never** rename project files to `.bak` to bypass an installer's "directory not empty" check.
- If an installer (like `create-next-app`) requires an empty directory, create a separate temporary directory, run the installer there, then move only what's needed into the project root.
- Renaming the user's files to "fix" something is an anti-pattern and breaks trust.

---

## Workflow Orchestration

### 1. Plan First (Mandatory)
- Enter plan mode for any non-trivial task (3+ steps or architectural decisions).
- Write the plan to `tasks/todo.md` with checkable items before coding.
- If something goes sideways mid-execution: STOP and re-plan. Don't keep pushing.
- Detailed specs upfront beat ambiguity that surfaces mid-build.

### 2. Subagent Strategy
- Offload research, exploration, and parallel analysis to subagents to keep main context clean.
- One task per subagent — focused execution.
- For complex problems, throw more compute at it via parallel subagents.

### 3. Self-Improvement Loop (CRITICAL)
- After **any** correction from the user: STOP, append the pattern to `tasks/lessons.md`, **then** continue.
- Registering happens **before** resuming work, not after — "after" tends to become "never".
- Use this exact format for each entry:
```markdown
  ### <Short title>
  - **Pattern:** what went wrong, in one sentence.
  - **Rule:** the rule for myself that prevents recurrence.
  - **Surfaced:** which session or task it appeared in.
```
- Read `tasks/lessons.md` at the start of every session.
- Iterate ruthlessly until the same mistake stops happening.

### 4. Verification Before Done
- Never mark a task complete without proof it works.
- UI work: run `npm run dev`, navigate the affected route, visually confirm.
- Logic work: write a quick test or script that exercises the change.
- Diff behavior between previous state and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution."
- Skip this for trivial/obvious fixes — don't over-engineer.
- Challenge your own work before presenting it.

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context-switching required from the user.

---

## Task Management

- **Plan First:** write the plan to `tasks/todo.md` with checkable items.
- **Verify Plan:** check in with the user before implementing for any non-trivial task.
- **Track Progress:** mark items complete as you go.
- **Explain Changes:** high-level summary at each milestone, not every line.
- **Document Results:** add a brief review section to `tasks/todo.md` when a phase closes.
- **Capture Lessons:** update `tasks/lessons.md` after every correction, before continuing.

---

## Core Principles

- **Simplicity first.** Make every change as simple as possible. Touch the minimum code.
- **No laziness.** Find root causes. No temporary fixes. Senior developer standards.
- **Minimal blast radius.** Changes only touch what's necessary. Avoid collateral bugs.
- **Token efficiency.** Don't dump entire files when an excerpt suffices. Don't restate context the user already has. Be concise.

---

## Code Conventions

### Naming & Language
- Code, variables, function names, comments: **English**.
- UI strings, copy, validation messages, route slugs: **Portuguese (pt-BR)**.
- Files: `kebab-case.tsx` for components, `kebab-case.ts` for utils.
- Components: `PascalCase`. Hooks: `useCamelCase`.

### File Organization
```
app/                  # Next.js App Router (pt-BR slugs: /despesas, /cartoes, /ir)
components/
  ui/                 # shadcn primitives only
  shared/             # cross-route (Sidebar, MonthSelector, Mascot)
  feature/            # feature-scoped (DashboardKpi, InvoiceItem, IRCategoryCard)
lib/
  utils.ts            # cn(), formatters
  types.ts            # global TS types
  mock-data.ts        # phase 1 only
  constants.ts        # static config (categories, IR rules)
hooks/
tasks/
  todo.md
  lessons.md
  roadmap.md
```

### TypeScript
- `strict: true`. No `any` without an inline `// reason: ...` comment.
- `type` for unions, `interface` for object shapes.
- Shared types live in `lib/types.ts`.

### Components
- Server components by default. `"use client"` only when needed (state, effects, browser APIs).
- Keep components small. Reused twice or past ~80 lines → extract.
- Props typed inline for one-off; exported as `XxxProps` when shared.

### Styling
- Tailwind utilities first. Custom CSS only when utilities cannot express it.
- Use `cn()` from `lib/utils.ts` for conditional classes.
- Reference colors via Tailwind tokens (`bg-primary`, `text-success`), not hex literals.

### Imports
- Order: react/next → external libs → `@/components` → `@/lib` → relative → CSS.
- Absolute imports via `@/*` alias.

---

## Visual Identity (quick reference)

### Palette
- **Primary** cobre/âmbar `#BA7517` — CTAs, active state, mascot. Use sparingly.
- **Primary light** `#FAEEDA` — highlighted backgrounds, active chips.
- **Success** `#639922` · **Danger** `#DC3939` · **Warning** `#EF9F27` · **Info** `#378ADD`.
- Chart colors: `#BA7517`, `#0F6E56`, `#185FA5`, `#534AB7`, `#993556`, `#888780`.

### Typography
- Inter via `next/font/google`.
- Tailwind scale (`text-xs` to `text-2xl`). Keep small — design is dense.
- Weights: 400 default, 500 for emphasis. **Never 600/700.**

### Patterns
- Borders: `0.5px` (custom utility, not 1px).
- Radius: `rounded-md` (inputs, small cards), `rounded-lg` (section cards).
- Density: 9–12px padding on list items, 12–16px in cards.
- Status: dot + label (don't rely on color alone).
- Chips: `rounded-full`.

---

## Environment

- OS: Windows + PowerShell 5.1.
- Package manager: npm.
- Node: assume system Node install (no nvm assumption).
- See "Shell Execution Rules" above. Those rules are not optional.

---

## Don't Do (Phase 1)

- Don't install Supabase, Prisma, NextAuth, Zod, React Hook Form, Mercado Pago, or any backend dep.
- Don't build API routes.
- Don't wire up auth.
- Don't persist data — read everything from `lib/mock-data.ts`.
- Don't implement the IR zip export logic — render the UI only.

---

## Communication

- Be concise. The user reads carefully — no need to over-explain.
- Show options before deciding for non-trivial choices.
- After completing a task: 2–4 line summary covering *what changed*, *what to test*, *what's next*.
- If blocked: state the block, list 2–3 ways forward, ask.