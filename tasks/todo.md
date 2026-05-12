# Phase 3 — Section 3.2: `used` derivado + drill-down de fatura ✅

## Escopo acordado
- Remover coluna `used` da tabela `credit_cards` (campo derivado, calculado no client a partir do sum das invoices OPEN)
- Drill-down de fatura via Sheet lateral (shadcn) com lista cronológica de despesas
- Fora do escopo: projeção de faturas futuras e marcação PAID (ficam para 3.3)

---

## Checklist de Execução

### A. Schema + Tipos
- [x] **[SQL]** `ALTER TABLE credit_cards DROP COLUMN used;` — executado pelo usuário
- [x] **`lib/types.ts`** — removido `used: number` de `CreditCard`

### B. Camada de dados
- [x] **`lib/db/credit-cards.ts`** — removido `used` de `DbCreditCard`, `toCreditCard`, `createCreditCard` e `updateCreditCard`; `select("*")` trocado por colunas explícitas
- [x] **`lib/db/expenses.ts`** — adicionado `getExpensesByInvoice(cardId, competenceMonth)`

### C. Componentes existentes
- [x] **`CreditCardDialog`** — removido `used: card?.used ?? 0` do payload
- [x] **`CardItem`** — aceita `used: number` como prop explícita
- [x] **`InvoiceCard`** — aceita `onClick?: () => void`
- [x] **`lib/mock-data.ts`** — removido `used` dos cartões mock

### D. Sheet de drill-down
- [x] Instalado `shadcn sheet`
- [x] Criado `components/feature/InvoiceDetailSheet.tsx`

### E. Pages atualizadas
- [x] **`app/(app)/cartoes/page.tsx`** — `usedByCardId` derivado de invoices OPEN; Sheet wired
- [x] **`app/(app)/page.tsx`** (dashboard) — carrega `getInvoices()`; `usedByCardId` derivado; sem referência a `card.used`

### F. Verificação
- [x] `npm run build --no-lint` passa sem erros

---

## Review

✅ **Section 3.2 Complete**

- **`used` eliminado do banco:** campo era stale por definição — agora calculado em runtime como `sum(invoice.total)` das faturas OPEN por cartão
- **Drill-down:** click em qualquer `InvoiceCard` abre Sheet lateral com `getExpensesByInvoice` (filtra por `card_id + competence_month`); lista cronológica com `ExpenseItem` read-only
- **Dashboard corrigido:** carrega invoices junto com cartões; mesma lógica de `usedByCardId`
- **Build limpo:** zero erros de type

---

**Next:** Section 3.3 (projeção de faturas futuras + marcação PAID)
