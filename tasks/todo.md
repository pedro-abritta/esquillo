# Phase 3 — Section 3.1: Lógica de Ciclo de Fatura ✅

## Entregáveis

### Algoritmo de fatura (`lib/invoice-cycle.ts`)
- [x] `getInvoicePeriodForDate` — período de fatura para uma data, com clamp de closing_day
- [x] `getUpcomingPeriods` — N períodos consecutivos a partir de uma data
- [x] `getInvoicePeriodForExpense` — período considerando offset de parcela
- [x] `getCompetenceMonth` — competence_month calculado no client (timezone-safe, string-based)

### Schema (`expenses.competence_month`)
- [x] Coluna `competence_month DATE NOT NULL` adicionada
- [x] DEFAULT removido — campo calculado no client, nunca delegado ao banco
- [x] Migração de dados existentes (2a/2b/2c) executada e validada

### Camada de dados
- [x] `createExpense` — busca closing/due day do cartão e calcula `competence_month` no INSERT
- [x] `createInstallmentGroup` — todas parcelas com `date = base.date`; `competence_month` por parcela via `getCompetenceMonth`
- [x] `getExpenses` — filtra por `competence_month` (não mais por `date`)
- [x] `getAllExpenses` — ordena por `competence_month DESC, date DESC`
- [x] `getInvoices` — derivado de `competence_month` + `getInvoicePeriodForDate`; sem dependência de `installment_number` em query time

### Tipos
- [x] `Expense.competenceMonth: string` em `lib/types.ts`
- [x] `CreateExpenseInput` exclui `competenceMonth` (campo derivado)

### UI
- [x] `ExpenseItem` — label "parcela N/T" na linha de categoria para parceladas
- [x] `ExpenseItem` — "compra em DD/MM" à direita para todos os tipos de pagamento
- [x] `ExpenseDialog` — validação: cartão obrigatório quando `paymentMethod === "CREDITO"`

### Verificação
- [x] `npm run build --no-lint` passa em todas as etapas
- [x] Migração validada: competence_month correto nas 3 parcelas (jun/jul/ago)
- [x] Aba Despesas: parcelas aparecem no mês correto da fatura
- [x] Aba Cartões: 3 faturas distintas com totais corretos

---

## Review

✅ **Section 3.1 Complete**

- **Conceito central:** `date` = data da compra (imutável); `competence_month` = mês em que o valor impacta o fluxo (para crédito: mês de fechamento da fatura; para outros: mês da compra)
- **Algoritmo:** `getInvoicePeriodForDate` com clamp de mês, `getCompetenceMonth` com cálculo puro por string sem timezone
- **Dados:** INSERT sempre calcula `competence_month` no client TypeScript — sem DEFAULT no banco
- **Queries:** `getExpenses` e `getInvoices` baseados em `competence_month`, eliminando lógica de offset em query time
- **UI:** label de parcela + "compra em DD/MM" padronizado em todos os tipos

---

**Next:** Section 3.2 (Phase 3 — Cards + Invoices)
