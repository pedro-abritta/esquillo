# Phase 2 — Supabase Integration, Schema, RLS e CRUD

## 2.0 — Pré-requisito (ação do usuário)
- [x] Criar projeto no Supabase
- [x] Passar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2.1 — Instalação de pacotes
- [x] `npm install @supabase/supabase-js`
- [x] `npm install @supabase/ssr`
- [x] Criar `.env.local` com URL e ANON_KEY
- [x] Criar `lib/supabase/client.ts` (browser client)
- [x] Criar `lib/supabase/server.ts` (server client para middleware)

## 2.2 — Schema SQL (usuário colou no SQL Editor do Supabase)
- [x] Trigger `set_updated_at()` compartilhado
- [x] Tabela `categories` + seed (10 categorias com cor, ícone, ir_category)
- [x] Tabela `credit_cards` (closing_day + due_day separados)
- [x] Tabela `expenses` (payment_method, is_deductible, campos de parcelamento)
- [x] Tabela `invoices` (metadata; total computado via query, não armazenado)
- [x] Tabela `documents` (storage_path para Supabase Storage)
- [x] Tabela `investments_fixed` (balance_updated_at ≠ updated_at)
- [x] Tabela `investments_stock` (balance_updated_at ≠ updated_at)
- [x] Tabela `recurring_templates` (schema agora, UI na Phase 4)

## 2.3 — RLS Policies
- [x] Habilitar RLS em todas as tabelas
- [x] `categories`: leitura para usuários autenticados
- [x] `own_rows` policy em todas as tabelas de dados

## 2.4 — Storage: bucket `documents` + policies
- [x] Bucket `documents` (privado) criado no Supabase Dashboard
- [x] Policies: upload/read/delete por `{user_id}/` como prefixo de caminho

## 2.5 — Auth Flow
- [x] `app/login/page.tsx` — formulário email + senha
- [x] `app/auth/callback/route.ts` — allowlist reisapedro@gmail.com
- [x] `middleware.ts` — protege todas as rotas; valida email
- [x] `components/shared/Sidebar.tsx` — botão "Sair" wired

## 2.6 — Atualização de tipos (`lib/types.ts`)
- [x] Novo tipo `PaymentMethod`
- [x] `Expense`: paymentMethod, isDeductible, campos de parcelamento
- [x] `CreditCard`: `closingDay` adicionado
- [x] `FixedIncomeInvestment` + `StockInvestment`: `updatedAt` → `balanceUpdatedAt`
- [x] Nova interface `Category`
- [x] Nova interface `RecurringTemplate`
- [x] `Invoice`: `total` computado, `installments` removido

## 2.7 — Data Layer (`lib/db/`)
- [x] `lib/db/categories.ts`
- [x] `lib/db/expenses.ts` (CRUD + createInstallmentGroup)
- [x] `lib/db/credit-cards.ts`
- [x] `lib/db/invoices.ts` (getInvoicesWithTotal via join)
- [x] `lib/db/documents.ts` (upload + signed URL + status update)
- [x] `lib/db/investments.ts` (CRUD para renda fixa e ações)

## 2.8 — Wiring Pages
- [x] `app/(app)/page.tsx` (Dashboard)
- [x] `app/(app)/despesas/page.tsx`
- [x] `app/(app)/cartoes/page.tsx`
- [x] `app/(app)/ir/page.tsx`
- [x] `app/(app)/investimentos/page.tsx`

## 2.9 — CRUD UI (modais shadcn/ui Dialog)
- [x] `components/feature/ExpenseDialog.tsx` (payment_method, is_deductible, parcelamento)
- [x] `components/feature/CreditCardDialog.tsx` (closing_day + due_day)
- [x] `components/feature/DocumentUploadDialog.tsx` (upload PDF + metadados)
- [x] `components/feature/InvestmentFixedDialog.tsx`
- [x] `components/feature/InvestmentStockDialog.tsx`
- [x] `AlertDialog` de delete em: ExpenseItem, CardItem, DocumentCard, InvestmentCard, StockRow

## 2.10 — Verificação
- [ ] `npm run build --no-lint` passa ✅ (feito)
- [ ] Login com reisapedro@gmail.com → dashboard
- [ ] Outro email → `/login?error=unauthorized`
- [ ] Sem sessão → `/login`
- [ ] Dashboard: dados reais (sem mock)
- [ ] Despesas: CRUD (simples + parcelada)
- [ ] Cartões: CRUD
- [ ] IR: upload PDF, status, delete
- [ ] Investimentos: CRUD renda fixa e ação

---

## Review

**Phase 2 — implementação concluída, aguardando validação end-to-end pelo usuário.**

### O que foi feito
- **Auth:** login email+senha, middleware com allowlist, callback route, botão Sair wired
- **Route groups:** `app/(app)/` com Sidebar, `app/login/` sem Sidebar
- **Schema:** 8 tabelas (categories, credit_cards, expenses, invoices, documents, investments_fixed, investments_stock, recurring_templates) com triggers de updated_at
- **RLS:** policies own_rows em todas as tabelas, leitura pública para categories
- **Storage:** bucket documents privado + 3 policies por user_id/prefix
- **Data layer:** `lib/db/` com funções CRUD para todas as entidades, conversão snake_case↔camelCase inline
- **Wiring:** todas as 5 páginas substituíram mock-data por chamadas reais ao Supabase
- **CRUD UI:** 5 dialogs (ExpenseDialog, CreditCardDialog, DocumentUploadDialog, InvestmentFixedDialog, InvestmentStockDialog) + AlertDialog de delete em todos os itens de lista

**Next:** validação end-to-end pelo usuário no dev server (http://localhost:3001).
