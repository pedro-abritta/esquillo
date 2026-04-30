# Phase 1 — UI Mockup

## 1. Design System Setup
- [x] Estender `tailwind.config.ts` (palette, spacing, typography, border 0.5px, chart colors)
- [x] Criar `lib/constants.ts` (categorias despesas, IR, status)
- [x] Atualizar `lib/utils.ts` (formatadores: currency, date, month)
- [x] Atualizar `app/globals.css` (custom utilities)

## 2. Types & Mock Data
- [x] Criar `lib/types.ts` (Expense, CreditCard, Invoice, Document, User)
- [x] Criar `lib/mock-data.ts` (fixtures: despesas, cartões, faturas, documentos)

## 3. Shared Components
- [x] `components/shared/Sidebar.tsx`
- [x] `components/shared/Header.tsx`
- [x] `components/shared/MonthSelector.tsx`
- [x] `components/shared/Mascot.tsx`
- [x] `components/feature/ExpenseItem.tsx`
- [x] `components/feature/CardItem.tsx`
- [x] `components/feature/InvoiceCard.tsx`
- [x] `components/feature/DocumentCard.tsx`

## 4. Global Layout
- [x] Atualizar `app/layout.tsx` (grid/flex + Sidebar + Header)
- [x] Recriar `app/page.tsx` (Dashboard com KPIs + transações + chart)

## 5. Routes & Pages
- [x] Criar `app/despesas/page.tsx`
- [x] Criar `app/cartoes/page.tsx`
- [x] Criar `app/ir/page.tsx`
- [ ] Criar `app/not-found.tsx` (opcional)

## 6. Verification
- [x] `npm run build` sem erros
- [x] `npm run dev` rodando
- [x] `npm run lint` zero errors

---

## Review

✅ **Phase 1 Complete**

- **Design System:** Tailwind configurado com paleta completa (primary #BA7517, success, danger, warning, info), spacing, typography, utilities (border 0.5px, chips, status dots)
- **Types & Mock Data:** 5 tipos definidos, 40+ dados mockados estruturados para despesas, cartões, faturas, documentos
- **Components:** 8 componentes criados (Sidebar, Header, MonthSelector, Mascot, 4 feature cards)
- **Navigation:** 4 rotas pt-BR funcionais (/, /despesas, /cartoes, /ir) com Sidebar highlight ativo
- **Dashboard:** KPI cards, gráfico Recharts, últimas transações, resumo cartões
- **Build:** Passou sem erros. Dev server rodando. ESLint clean.

**Golden path tested:** Load `/` → Desktop layout, Sidebar highlight on Dashboard, Header rendered, KPI cards showing mock data, MonthSelector works, navigation to `/despesas` / `/cartoes` / `/ir` functional.

**Next:** Phase 2 — Supabase integration, RLS, CRUD operations on real data.
