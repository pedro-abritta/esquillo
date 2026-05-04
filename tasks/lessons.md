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

## Supabase / DB

### user_id ausente nos INSERTs causa violação de RLS
- **Pattern:** Escrevi payloads de INSERT para todas as funções de DB sem incluir `user_id`. A coluna é `NOT NULL` e a policy RLS avalia `auth.uid() = user_id` — com `user_id = NULL` o resultado é `NULL` (não `TRUE`), bloqueando o INSERT antes mesmo da constraint NOT NULL disparar.
- **Rule:** Para tabelas Supabase com RLS baseada em `user_id`, definir `DEFAULT auth.uid()` na coluna no schema. Isso elimina a necessidade de passar `user_id` no código e torna o erro impossível no futuro — o banco garante o preenchimento. Nunca depender de código de aplicação para lembrar de incluir `user_id`.
- **Surfaced:** Phase 2 — primeiro teste de createExpense em produção.

### URL do Supabase no `.env.local` não deve ter path suffix
- **Pattern:** URL colada pelo usuário continha `/rest/v1/` no final (`https://xxx.supabase.co/rest/v1/`). O `@supabase/ssr` espera apenas a URL base e quebra silenciosamente com o suffix.
- **Rule:** `NEXT_PUBLIC_SUPABASE_URL` deve ser sempre a URL base pura: `https://xxx.supabase.co`. Validar o formato antes de prosseguir com qualquer setup de client.
- **Surfaced:** Phase 2 — setup do `.env.local`.
