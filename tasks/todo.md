# Phase 3 — Section 3.4: Dashboard com dados reais

## Escopo
- Substituir mock data restante por dados reais
- Nenhuma feature nova — apenas wiring de dados existentes a componentes existentes
- Fora do escopo: receitas/saldo real (depende de Phase 4), novos gráficos complexos

### O que está hardcoded hoje e precisa de correção
| Elemento | Problema | Solução |
|---|---|---|
| KPI "Saldo do mês" | `5000 - totalExpenses` hardcoded | Substituir por "Faturas abertas" (R$ das invoices OPEN) |
| Gráfico "Despesas da semana" | Array `chartData` estático | Agrupar `expenses` por semana do mês selecionado |

### O que já está real e fica como está
- KPI "Despesas" (totalExpenses) ✅
- KPI "Cartões ativos" (count real) ✅
- KPI "Limite utilizado %" (real via invoices) ✅
- Mini-barras de cartões (usedByCardId real) ✅
- Lista "Últimas despesas" (real) ✅
- Grid "Seus cartões" (real via CardItem) ✅

---

## Checklist de Execução

### A. KPI 1 — remover hardcoded
- [ ] **`app/(app)/page.tsx`** — substituir KPI "Saldo do mês" (hardcoded `5000`) por:
  - Label: "Faturas abertas"
  - Valor: `totalCardUsage` (já computado na página via invoices OPEN)

### B. Gráfico — despesas por semana com dados reais
- [ ] **`app/(app)/page.tsx`** — remover `chartData` estático; calcular `weeklyData` a partir de `expenses`:
  - 4 buckets fixos: "Sem 1" (dias 1–7), "Sem 2" (8–14), "Sem 3" (15–21), "Sem 4" (22+)
  - Agrupar por `expense.date` (dia da compra); somar `expense.amount` no bucket correspondente
  - Tipo: `{ name: string; valor: number }[]` — mesma forma que o `chartData` atual (zero mudança no componente Recharts)

### C. Verificação
- [ ] `npm run build --no-lint` passa
- [ ] KPI "Faturas abertas" exibe valor real das invoices OPEN
- [ ] Gráfico reflete despesas reais do mês selecionado (buckets mudam ao trocar mês)
- [ ] Nenhum valor hardcoded restante no dashboard

---

## Sequência de execução (após aprovação)
1. `app/(app)/page.tsx` — duas mudanças cirúrgicas: KPI + weeklyData
2. Build + verificação visual
