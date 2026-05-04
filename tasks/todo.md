# Phase 2 — Supabase Integration, Schema, RLS e CRUD ✅

## 2.0 — Pré-requisito
- [x] Criar projeto no Supabase
- [x] Passar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2.1 — Instalação de pacotes
- [x] `npm install @supabase/supabase-js` + `@supabase/ssr`
- [x] `.env.local` com URL base (sem `/rest/v1/`) e ANON_KEY
- [x] `lib/supabase/client.ts` + `lib/supabase/server.ts`

## 2.2 — Schema SQL
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
- [x] RLS habilitado em todas as tabelas
- [x] `categories`: leitura para usuários autenticados
- [x] `own_rows` policy (FOR ALL USING auth.uid() = user_id) em todas as tabelas
- [x] Bug fix: `ALTER TABLE ... ALTER COLUMN user_id SET DEFAULT auth.uid()` em 7 tabelas

## 2.4 — Storage
- [x] Bucket `documents` privado criado
- [x] Policies: upload/read/delete por `{user_id}/` prefix

## 2.5 — Auth Flow
- [x] `app/login/page.tsx` — formulário email + senha
- [x] `app/auth/callback/route.ts` — allowlist reisapedro@gmail.com
- [x] `middleware.ts` — protege todas as rotas; valida email
- [x] `components/shared/Sidebar.tsx` — botão "Sair" wired

## 2.6 — Tipos (`lib/types.ts`)
- [x] `PaymentMethod`, campos de parcelamento em `Expense`, `closingDay` em `CreditCard`
- [x] `updatedAt` → `balanceUpdatedAt` em investimentos
- [x] Interfaces `Category`, `RecurringTemplate`, `DbError`

## 2.7 — Data Layer (`lib/db/`)
- [x] `categories.ts`, `expenses.ts` (+ createInstallmentGroup), `credit-cards.ts`
- [x] `invoices.ts` (total via JOIN), `documents.ts` (upload + signed URL), `investments.ts`

## 2.8 — Wiring Pages
- [x] Dashboard, Despesas, Cartões, IR, Investimentos — mock substituído por DB real

## 2.9 — CRUD UI
- [x] ExpenseDialog, CreditCardDialog, DocumentUploadDialog, InvestmentFixedDialog, InvestmentStockDialog
- [x] AlertDialog de delete em: ExpenseItem, CardItem, DocumentCard, InvestmentCard, StockRow

## 2.10 — Verificação
- [x] `npm run build --no-lint` passa (TypeScript OK)
- [x] Login com reisapedro@gmail.com → dashboard
- [x] Sem sessão → `/login`
- [x] CRUD de despesas, cartões, investimentos persiste ao recarregar
- [x] Upload de PDF no IR funciona
- [x] Botão "Sair" redireciona para `/login`

---

## Review

✅ **Phase 2 Complete**

- **Auth:** login email+senha, middleware + allowlist, route groups `(app)/` e `login/`
- **Schema:** 8 tabelas + triggers `updated_at` + `DEFAULT auth.uid()` em todas as FKs de user
- **RLS:** policies `own_rows`, categories read-only público, Storage policies por user prefix
- **Data layer:** `lib/db/` com CRUD completo, conversão snake_case↔camelCase inline
- **UI:** 5 dialogs de criação/edição + AlertDialog de delete em todos os itens
- **Bug fix RLS:** `user_id` não era enviado nos INSERTs; corrigido via `DEFAULT auth.uid()` no schema

---

**Next:** Phase 3 — Cards + Invoices (parcelamento, projeção de faturas, lógica de fechamento/vencimento).
