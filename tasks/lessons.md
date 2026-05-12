# Lessons

## Environment

### PowerShell `&&` failure
- **Pattern:** Used `&&` to chain commands during initial scaffold. Failed in PowerShell 5.1.
- **Rule:** See "Shell Execution Rules" in `CLAUDE.md`.
- **Surfaced:** Phase 1 setup.

### Unix commands not available in PowerShell
- **Pattern:** Used `cp` to copy scaffold files. Command not found in stock PowerShell 5.1.
- **Rule:** See "Shell Execution Rules" in `CLAUDE.md`.
- **Surfaced:** Phase 1 setup.

### create-next-app workaround via file rename
- **Pattern:** Tried to rename project files (`CLAUDE.md`, `README.md`) to `.bak` to bypass `create-next-app`'s "directory not empty" check.
- **Rule:** See "Shell Execution Rules" in `CLAUDE.md` (rule 4 — no file dancing).
- **Surfaced:** Phase 1 setup.

## Build & Lint

### ESLint `Unexpected token ')'` falso positivo no Next.js 14
- **Pattern:** `npm run lint` retorna `Unexpected token ')'` mesmo com código sintaticamente correto. O erro vem do parser do ESLint ao processar arquivos internos do Next.js/date-fns, não do código do projeto.
- **Rule:** Usar `npm run build --no-lint` para verificar compilação real. O lint broken não impede dev server nem build de funcionarem. Investigar upgrade do ESLint ou config de ignores se necessário antes da Phase 6 (security review).
- **Surfaced:** Phase 1 — adição da tela de Investimentos.

## Modelagem de Dados

### "Data do evento" vs "âncora de período" em parcelamentos
- **Pattern:** Em `createInstallmentGroup`, usei o campo `date` de cada parcela como proxy para indicar a qual fatura ela pertence — distribuindo as datas mensalmente. Isso conflou dois conceitos distintos: (1) *quando* a compra aconteceu e (2) *em qual fatura* cada parcela cai. O resultado: histórico de despesas corrompido e `getInvoices` agrupando todas as parcelas na mesma fatura quando têm a mesma data.
- **Rule:** `date` é sempre a **data original da compra** — idêntica em todas as parcelas do mesmo grupo. Qual fatura cada parcela pertence é responsabilidade do campo `installment_number`: calcule o período como `getInvoicePeriodForExpense({ date, isInstallment, installmentNumber }, card)`. Nunca manipular `date` para fins de agrupamento de fatura — são conceitos ortogonais.
- **Surfaced:** Phase 3 — Section 3.1, validação manual do parcelamento.

### "Data do evento" vs "competência financeira" em sistemas de crédito
- **Pattern:** Modelei parcelamentos usando apenas `date` para representar tanto a data da compra quanto o posicionamento temporal de cada parcela, levando a múltiplas iterações de correção. Para crédito, três conceitos divergem: (1) `date` — quando a compra ocorreu (imutável); (2) `competence_month` — em qual mês o valor impacta o fluxo de caixa; (3) período de fatura — derivado de `closing_day`. Comprar no dia 19 num cartão que fecha dia 15 faz a competência cair em junho, não em maio.
- **Rule:** Em sistemas com crédito parcelado, persistir `competence_month` explicitamente no banco. Para crédito com cartão: `competence_month = primeiro do mês do period_end da fatura` (via `closing_day`). Para débito/PIX/boleto: `competence_month = primeiro do mês da date`. Nunca derivar competência on-the-fly de `date` bruta — o resultado é inconsistente entre views.
- **Surfaced:** Phase 3 — Section 3.1, após múltiplas iterações no design de parcelamentos.

## Modelagem — Campos Derivados

### Campos derivados não devem viver no banco
- **Pattern:** A coluna `used` em `credit_cards` foi persistida no banco, mas seu valor correto é sempre a soma das invoices OPEN do cartão — tornando o campo uma cópia stale que diverge dos dados reais a cada nova despesa.
- **Rule:** Campos cujo valor é 100% computável a partir de outros registros são derivados e não pertencem ao banco. Calcule no client no momento da leitura. Se o cálculo for caro, use uma view ou função Postgres — nunca uma coluna que precisa de UPDATE manual para ficar em sincronia.
- **Surfaced:** Phase 3 — Section 3.2, remoção de `credit_cards.used`.

## UI / Componentes

### Sheet não é substituto de Dialog para modal sólido
- **Pattern:** Usei `Sheet` (painel lateral deslizante) para o drill-down de fatura esperando comportamento de modal. O resultado foi um painel lateral com fundo transparente, fora do padrão visual esperado.
- **Rule:** Para modal centralizado com fundo sólido, usar `Dialog` (`DialogContent` com `bg-white` explícito). `Sheet` é exclusivo para painéis laterais deslizantes. O token `bg-popover` padrão do shadcn pode não ser sólido dependendo do tema — sempre sobrescrever com `bg-white` em dialogs de conteúdo.
- **Surfaced:** Phase 3 — Section 3.2, ajustes visuais do InvoiceDetailSheet.

### `position: absolute` em botões de ação causa sobreposição com elementos do fluxo normal
- **Pattern:** Coloquei botões de editar/deletar com `absolute top-3 right-3` no `CardItem`. Eles sobrepuseram o chip de status que estava no mesmo canto via fluxo normal flex, resultando em sobreposição visual mesmo com `opacity-0` por padrão.
- **Rule:** Botões de ação on-hover devem viver no fluxo normal do layout (ex: dentro do mesmo flex row que o elemento vizinho), com `opacity-0 group-hover:opacity-100`. Evitar `position: absolute` para ícones de ação — o posicionamento absoluto ignora o layout adjacente e cria colisões silenciosas.
- **Surfaced:** Phase 3 — Section 3.2, ajustes visuais do CardItem.

## Supabase / DB

### Nunca usar DEFAULT do banco para campos calculados pela lógica de negócio
- **Pattern:** Adicionei `DEFAULT CURRENT_DATE` à coluna `competence_month` para facilitar o `NOT NULL`. Expenses criadas após o `ALTER TABLE` e antes dos `UPDATE`s de migração ficaram com a data errada (hoje em vez do mês correto calculado).
- **Rule:** Campos derivados de lógica de negócio devem ser calculados no client antes do INSERT — nunca delegados ao DEFAULT do banco. Se a coluna for `NOT NULL`, adicionar temporariamente como nullable, rodar a migração, depois adicionar a constraint. O DEFAULT do banco só é válido para campos técnicos (`created_at`, `id`, `user_id`).
- **Surfaced:** Phase 3 — Section 3.1, migração de `competence_month`.

### CURRENT_DATE no Postgres/Supabase usa UTC — evitar para usuários BR
- **Pattern:** `CURRENT_DATE` no Postgres do Supabase retorna a data UTC. Após 21h no Brasil (UTC-3), já é o dia seguinte em UTC — causando off-by-one em qualquer campo baseado em "hoje" para usuários brasileiros.
- **Rule:** Nunca usar `CURRENT_DATE`, `NOW()`, ou `DEFAULT CURRENT_DATE` para campos de negócio em apps com usuários BR. Calcular a data no client TypeScript (onde o timezone é o do usuário) e enviar o valor explicitamente no payload do INSERT.
- **Surfaced:** Phase 3 — Section 3.1, migração de `competence_month` após as 21h.



### user_id ausente nos INSERTs causa violação de RLS
- **Pattern:** Escrevi payloads de INSERT para todas as funções de DB sem incluir `user_id`. A coluna é `NOT NULL` e a policy RLS avalia `auth.uid() = user_id` — com `user_id = NULL` o resultado é `NULL` (não `TRUE`), bloqueando o INSERT antes mesmo da constraint NOT NULL disparar.
- **Rule:** Para tabelas Supabase com RLS baseada em `user_id`, definir `DEFAULT auth.uid()` na coluna no schema. Isso elimina a necessidade de passar `user_id` no código e torna o erro impossível no futuro — o banco garante o preenchimento. Nunca depender de código de aplicação para lembrar de incluir `user_id`.
- **Surfaced:** Phase 2 — primeiro teste de createExpense em produção.

### URL do Supabase no `.env.local` não deve ter path suffix
- **Pattern:** URL colada pelo usuário continha `/rest/v1/` no final (`https://xxx.supabase.co/rest/v1/`). O `@supabase/ssr` espera apenas a URL base e quebra silenciosamente com o suffix.
- **Rule:** `NEXT_PUBLIC_SUPABASE_URL` deve ser sempre a URL base pura: `https://xxx.supabase.co`. Validar o formato antes de prosseguir com qualquer setup de client.
- **Surfaced:** Phase 2 — setup do `.env.local`.
