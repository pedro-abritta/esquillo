# Phase 4 — Section 4.1: Schema + TypeScript types ✅

Todos os itens concluídos. Schema validado, RLS confirmado, build limpo.

---

# Phase 4 — Section 4.2: Tela /recorrentes (CRUD de templates)

Tela completa para gerenciar templates de despesa recorrente e templates de renda recorrente. Nenhuma lógica de confirmação mensal aqui — isso é Section 4.3.

---

## Checklist de Execução

### A. Rota — `app/(app)/recorrentes/page.tsx`

- [ ] Criar arquivo `app/(app)/recorrentes/page.tsx` com `"use client"`
- [ ] Carregar templates via `getRecurringTemplates()` no `useEffect`
- [ ] Estado: `templates`, `loading`, `error`, `dialogOpen`, `editingTemplate`, `activeTab: "expense" | "income"`
- [ ] Duas abas: **"Despesas"** e **"Renda"** — filtra `templates` por `type` para cada aba
- [ ] Botão "Novo template" em cada aba — abre dialog já com `defaultType` correto
- [ ] `RecurringTemplateItem` para cada template da aba ativa
- [ ] Empty state por aba ("Nenhum template cadastrado.")
- [ ] Error state com mensagem

### B. Componente — `components/feature/RecurringTemplateItem.tsx`

- [ ] Props: `template: RecurringTemplate`, `onEdit?: () => void`, `onDelete: () => void`, `onToggle: () => void`
- [ ] Exibe: description, label da categoria (`EXPENSE_CATEGORIES` ou `INCOME_CATEGORIES` conforme `type`), `formatCurrency(amount)`, "Todo dia {dayOfMonth}"
- [ ] Toggle active/inactive: chama `toggleRecurringTemplate(id, !active)` → `onToggle()`
- [ ] Botões edit/delete on-hover (padrão `group-hover:opacity-100`)
- [ ] `AlertDialog` de confirmação no delete → `deleteRecurringTemplate(id)` → `onDelete()`
- [ ] Visual: template inativo com `opacity-50` no texto

### C. Componente — `components/feature/RecurringTemplateDialog.tsx`

- [ ] Props: `open`, `onOpenChange`, `template?: RecurringTemplate`, `defaultType: RecurringType`, `cards: CreditCard[]`, `onSuccess: () => void`
- [ ] Campo `type` fixo (não editável após criação) — herdado de `defaultType` ou `template.type`
- [ ] **Campos comuns:** description (text), amount (number), dayOfMonth (1–31, number input)
- [ ] **Campo category:** dropdown — `EXPENSE_CATEGORIES` se `type === "expense"`, `INCOME_CATEGORIES` se `type === "income"`
- [ ] **Campos expense-only** (só renderiza se `type === "expense"`):
  - paymentMethod (select: PIX, DÉBITO, CRÉDITO, BOLETO)
  - cardId (select de `cards`, só visível se paymentMethod === "CREDITO")
  - isDeductible (checkbox)
- [ ] Validação: description não-vazio, amount > 0, dayOfMonth 1–31, category selecionada
- [ ] Validação extra: se expense + CREDITO, cardId obrigatório
- [ ] Chama `createRecurringTemplate` ou `updateRecurringTemplate` conforme `template` presente
- [ ] Exibe erro inline em caso de falha

### D. Sidebar — adicionar link "Recorrentes"

- [ ] Abrir `components/shared/Sidebar.tsx` (ou equivalente) e adicionar item entre Cartões e Investimentos
- [ ] Label: `"Recorrentes"`, rota: `/recorrentes`, ícone: `RefreshCw` (lucide-react)

### E. Verificação

- [ ] `npm run dev` — navegar até `/recorrentes`
- [ ] Criar template de despesa (com cartão), editar, desativar, deletar
- [ ] Criar template de renda, editar, deletar
- [ ] Confirmar que troca de aba mantém estado correto
- [ ] `npm run build --no-lint` passa

---

## Decisões de design

| Decisão | Motivo |
|---|---|
| Duas abas em vez de lista única com filtro | Separação clara entre despesa e renda; evita confusão de categoria cross-type |
| `type` imutável no dialog de edição | Mudar o tipo quebraria a semântica dos campos opcionais (ex: template de renda sem paymentMethod tornando-se despesa) |
| `cards` passados como prop ao Dialog | Página já os carrega para o seletor de cartão; evita segundo fetch dentro do componente |
| Template inativo com `opacity-50` | Padrão visual simples; toggle é o CTA principal, não delete |

---

**Próxima seção após aprovação:** 4.3 — Lançamento manual de renda + tela de confirmação mensal.
