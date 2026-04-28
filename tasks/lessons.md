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