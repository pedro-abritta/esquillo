# Phase 3 — Section 3.3: Projeção de faturas futuras + marcação PAID ✅

## Escopo
- Projetar 3 períodos futuros por cartão ACTIVE, mesmo sem despesas (total = R$0,00)
- Persistir marcação PAID em nova tabela `invoice_payments`
- Botão "Marcar como paga" / "Desfazer pagamento" no Dialog de detalhe da fatura
- Fora do escopo: edição de despesas dentro da fatura, filtro por status

---

## Checklist de Execução

### A. Schema
- [x] **[SQL]** Tabela `invoice_payments` + RLS criada no Supabase Studio

### B. Camada de dados
- [x] **`lib/db/invoice-payments.ts`** — `getInvoicePaymentKeys`, `markInvoicePaid`, `unmarkInvoicePaid`
- [x] **`lib/db/invoices.ts`** — 3ª query paralela de paid keys + projeção de 3 períodos futuros por cartão ACTIVE via `getUpcomingPeriods`; status PAID/CLOSED/OPEN derivado em runtime

### C. UI — InvoiceDetailSheet (Dialog)
- [x] Prop `onRefresh: () => void` adicionada
- [x] Botão "Marcar como paga" / "Desfazer pagamento" no rodapé com loading local

### D. Page
- [x] `app/(app)/cartoes/page.tsx` — passa `onRefresh={refresh}` para `InvoiceDetailSheet`

### E. Verificação
- [x] `npm run build --no-lint` passa sem erros

---

## Review

✅ **Section 3.3 Complete**

- **Projeção:** `getInvoices()` injeta slots vazios (total = 0) para os próximos 3 períodos de cada cartão ACTIVE, usando `getUpcomingPeriods` — sem nova coluna no banco
- **PAID persistido:** tabela `invoice_payments` com RLS; chave composta `(user_id, card_id, period_end)`; status derivado em runtime — PAID tem precedência sobre CLOSED/OPEN
- **Toggle:** "Marcar como paga" → `upsert`; "Desfazer" → `delete`; após ação fecha Dialog e recarrega lista

---

**Next:** Section 3.4 — Dashboard com dados reais (gráficos, KPIs, projeção).
