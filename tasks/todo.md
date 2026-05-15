# Phase 4 — Section 4.1: Schema + TypeScript types ✅

Todos os itens concluídos. Schema validado, RLS confirmado, build limpo.

---

# Phase 4 — Section 4.2: Tela /recorrentes (CRUD de templates) ✅

Tela completa entregue. Templates de despesa e renda gerenciados via duas abas. Dois bugs de schema corrigidos via ALTER TABLE no Supabase (`payment_method` DROP NOT NULL, DROP FK de categoria).

**Arquivos criados/modificados:**
- `components/shared/Sidebar.tsx` — link Recorrentes adicionado
- `components/feature/RecurringTemplateItem.tsx` — item com toggle, edit, delete
- `components/feature/RecurringTemplateDialog.tsx` — dialog com campos condicionais por type
- `app/(app)/recorrentes/page.tsx` — página com abas chip-style

---

# Phase 4 — Section 4.3: Confirmação mensal de recorrentes

Fluxo de confirmação: no início de cada mês, o usuário revisa os templates ativos e confirma quais lançamentos devem ser efetivados. Templates confirmados viram despesas reais (tabela `expenses`) ou entradas de renda (tabela `income_entries`).

---

## Escopo

- Confirmar lançamentos de templates ativos para o mês corrente
- Templates de despesa → `createExpense` (já existe)
- Templates de renda → `createIncomeEntry` (a criar, tabela `income_entries` da fase 4.1)
- Registro de confirmação em `recurring_confirmations` para evitar duplicatas no mesmo mês
- Lançamento manual avulso de renda (fora de templates)

---

## Checklist de Execução

### A. DB — `lib/db/income-entries.ts` e `lib/db/recurring-confirmations.ts`

- [ ] `getIncomeEntries(month: string)` — retorna entradas do mês
- [ ] `createIncomeEntry(input)` — INSERT em `income_entries`
- [ ] `getConfirmationsForMonth(month: string)` — quais templates já foram confirmados
- [ ] `confirmRecurringTemplate(templateId, month)` — INSERT em `recurring_confirmations` + cria expense/income entry

### B. Tela de confirmação — seção na página `/recorrentes`

- [ ] Nova aba ou seção "Este mês" na página existente
- [ ] Lista templates ativos com status: **pendente** / **confirmado** para o mês atual
- [ ] Botão "Confirmar" por template → chama `confirmRecurringTemplate` → marca como confirmado
- [ ] Templates já confirmados exibem data/valor lançado (read-only)
- [ ] Confirmação de despesa usa `amount` do template (editável antes de confirmar?)

### C. Lançamento manual de renda avulsa

- [ ] Botão "Lançar renda" na aba Renda da página `/recorrentes` (ou em `/despesas`)
- [ ] Dialog simples: description, amount, category (INCOME_CATEGORIES), date
- [ ] Chama `createIncomeEntry` diretamente (sem template)

### D. Verificação

- [ ] Confirmar template de despesa → aparece em `/despesas` no mês correto
- [ ] Confirmar template de renda → aparece no dashboard como entrada
- [ ] Tentar confirmar o mesmo template duas vezes no mesmo mês → bloqueado
- [ ] Lançar renda avulsa → visível no histórico

---

**Aguardando aprovação para iniciar 4.3.**
