# Phase 3 — Section 3.4: Dashboard com dados reais ✅

## Checklist de Execução

### A. KPI 1 — remover hardcoded
- [x] **`app/(app)/page.tsx`** — KPI "Saldo do mês" (hardcoded `5000`) substituído por "Faturas abertas" (`totalCardUsage`)

### B. Gráfico — despesas por semana com dados reais
- [x] **`app/(app)/page.tsx`** — `chartData` estático removido; `weeklyData` calculado de `expenses` em 4 buckets por dia da compra

### C. Verificação
- [x] `npm run build --no-lint` passa sem erros

---

## Review — Phase 3 completa ✅

### Seções entregues

| Section | Entregável principal |
|---|---|
| 3.1 | Algoritmo de ciclo de fatura (`invoice-cycle.ts`), `competence_month` no banco, `getInvoices` derivado |
| 3.2 | `credit_cards.used` removido (campo derivado); drill-down de fatura via Dialog com `getExpensesByInvoice` |
| 3.3 | Projeção de 3 faturas futuras por cartão ACTIVE; tabela `invoice_payments` + toggle PAID/desfazer |
| 3.4 | Dashboard 100% dados reais: KPI "Faturas abertas" + gráfico semanal calculado de `expenses` |

### Decisões de arquitetura consolidadas
- `date` = data da compra (imutável); `competence_month` = mês de impacto no fluxo (calculado no client, persistido)
- Campos derivados (`used`, status de invoice) nunca no banco — calculados em runtime
- Projeção de faturas: client-side via `getUpcomingPeriods`, sem coluna extra no banco
- PAID é o único estado novo que exige persistência → tabela dedicada `invoice_payments`

---

**Next:** Phase 4 — Recurring templates + monthly confirmation flow.
