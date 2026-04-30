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
- [x] Criar `app/investimentos/page.tsx` (Fase 1 — expandida)
- [ ] Criar `app/not-found.tsx` (opcional)

## 6. Investimentos (Fase 1 — Expanded)

### 6.1 Types & Mock Data
- [x] Estender `lib/types.ts` com `FixedIncomeInvestment` (name, type, balance, contractedRate, maturityDate, updatedAt)
- [x] Estender `lib/types.ts` com `StockInvestment` (ticker, quantity, totalValue, updatedAt)
- [x] Estender `lib/mock-data.ts` com 3 investimentos de renda fixa (CDB, Tesouro, LCI) e 3 ações

### 6.2 Sidebar & Routing
- [x] Adicionar menu item "Investimentos" na `components/shared/Sidebar.tsx` (entre "Cartões" e "IR", ícone `TrendingUp`)

### 6.3 Utility Functions
- [x] Criar em `lib/utils.ts` função `calculateFixedIncomeProjection(investment, months)` que calcula projeção anual (taxa fixa até dez do ano corrente, 1 ano, 2 anos)

### 6.4 Components
- [x] Criar `components/feature/InvestmentCard.tsx` (renda fixa: nome, saldo, taxa, status "atualizado há X dias", projeções em colunas)
- [x] Criar `components/feature/StockRow.tsx` (ações: ticker, qtd cotas, valor total, status atualização)

### 6.5 Page
- [x] Criar `app/investimentos/page.tsx` com:
  - Header + botões "+ renda fixa" e "+ ação"
  - 3 KPIs: patrimônio total, total renda fixa, total ações
  - Seção "Renda fixa" com grid de cards
  - Seção "Ações" com tabela enxuta

### 6.6 Verification
- [x] `npm run dev` rodando sem erros
- [x] Navegação até `/investimentos` funciona
- [x] Mock data renderiza corretamente (3 renda fixa + 3 ações)
- [x] KPIs calculam corretamente (R$ 65.700 total)
- [x] Projeções exibem corretamente para renda fixa (eoy, +1y, +2y)
- [x] Status "atualizado há X dias" funciona (verde se ≤30d, vermelho se >30d)

---

## 7. Verification (Global)
- [x] `npm run build --no-lint` passou (TypeScript + compile OK)
- [x] `npm run dev` rodando na porta 3003
- [ ] `npm run lint` (ESLint tem issue com parser, não afeta build/dev)

---

## Review

✅ **Phase 1 Complete + Investimentos (5ª tela)**

### Original 4 Screens (✅ Phase 1)
- **Design System:** Tailwind configurado com paleta completa (primary #BA7517, success, danger, warning, info), spacing, typography, utilities (border 0.5px, chips, status dots)
- **Types & Mock Data:** 5 tipos originais + 2 novos (FixedIncomeInvestment, StockInvestment), 40+ dados mockados originais + 6 investimentos
- **Components:** 8 compartilhados + 2 novos feature cards (InvestmentCard, StockRow)
- **Navigation:** 5 rotas pt-BR funcionais (/, /despesas, /cartoes, **investimentos**, /ir) com Sidebar highlight ativo
- **Dashboard:** KPI cards, gráfico Recharts, últimas transações, resumo cartões

### Nova Tela (✅ Investimentos)
- **Mock Data:** 3 investimentos renda fixa (CDB, Tesouro, LCI) + 3 ações (VALE3, PETR4, ITUB4)
- **KPIs:** Patrimônio total (R$ 65.700), renda fixa (R$ 50.000), ações (R$ 15.700)
- **Renda Fixa:** Cards com saldo, taxa, projeções (eoy/+1y/+2y), status atualização (verde ≤30d, vermelho >30d)
- **Ações:** Tabela com ticker, quantidade, valor, status
- **Build:** `npm run build --no-lint` ✓ (TypeScript OK, rota compilada 3.17 kB)
- **Dev:** `npm run dev` ✓ (página renderiza corretamente em http://localhost:3003/investimentos)

**Golden path tested (Investimentos):** Load `/investimentos` → Header rendered, 3 KPI cards calculated correctly, 6 investments displayed, grid + table layouts work, status colors correct, sidebar highlight on Investimentos.

**Next:** Phase 2 — Supabase integration, RLS, CRUD operations on real data.
