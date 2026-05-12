export interface InvoicePeriod {
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  label: string; // e.g. "Fev/2025"
}

const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function lastDay(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function clamp(day: number, year: number, month: number): number {
  return Math.min(day, lastDay(year, month));
}

function fmt(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function nextMonth(year: number, month: number): { year: number; month: number } {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

function prevMonth(year: number, month: number): { year: number; month: number } {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

/**
 * Returns the invoice period that contains the given date.
 *
 * Rule: a purchase on day D with closing_day C belongs to the invoice whose
 * period_end is the first closing day >= D. Purchases on the closing day
 * itself count as the current invoice (D <= C → same month).
 *
 * Handles closing_day > 28 by clamping to the actual last day of each month.
 */
export function getInvoicePeriodForDate(
  date: string,
  closingDay: number,
  dueDay: number
): InvoicePeriod {
  const [y, m, d] = date.split("-").map(Number);

  // Determine end month of the invoice this date belongs to
  const closingThisMonth = clamp(closingDay, y, m);
  let endYear: number, endMonth: number;

  if (d <= closingThisMonth) {
    endYear = y;
    endMonth = m;
  } else {
    const next = nextMonth(y, m);
    endYear = next.year;
    endMonth = next.month;
  }

  // period_end: clamped closing day of end month
  const periodEndDay = clamp(closingDay, endYear, endMonth);
  const periodEnd = fmt(endYear, endMonth, periodEndDay);

  // period_start: the day after the closing day of the previous month
  const prev = prevMonth(endYear, endMonth);
  const prevClosingDay = clamp(closingDay, prev.year, prev.month);
  const prevCloseDate = new Date(prev.year, prev.month - 1, prevClosingDay);
  prevCloseDate.setDate(prevCloseDate.getDate() + 1);
  const periodStart = prevCloseDate.toISOString().slice(0, 10);

  // due_date: dueDay of the month after end month, clamped
  const due = nextMonth(endYear, endMonth);
  const dueDayActual = clamp(dueDay, due.year, due.month);
  const dueDate = fmt(due.year, due.month, dueDayActual);

  const label = `${MONTH_NAMES[endMonth - 1]}/${endYear}`;

  return { periodStart, periodEnd, dueDate, label };
}

/**
 * Returns the first-of-month competence date for an expense.
 *
 * CREDITO + card: competence = first of the month of the invoice period_end.
 *   The invoice period is shifted by (installmentNumber - 1) for installments.
 * Everything else: competence = first of the purchase month.
 *
 * Uses pure string slicing — no Date objects, no timezone dependency.
 */
export function getCompetenceMonth(
  date: string,
  paymentMethod: string,
  card?: { closingDay: number; dueDay: number },
  installmentNumber?: number
): string {
  if (paymentMethod === "CREDITO" && card) {
    const period = getInvoicePeriodForExpense(
      { date, isInstallment: installmentNumber !== undefined, installmentNumber },
      card
    );
    return period.periodEnd.slice(0, 7) + "-01";
  }
  return date.slice(0, 7) + "-01";
}

/**
 * Returns the invoice period for a given expense, accounting for installments.
 *
 * Non-installment → period of the purchase date.
 * Installment N   → period of the purchase date advanced by (N - 1) periods.
 *
 * The expense `date` is always the original purchase date on every installment row.
 * The invoice offset is encoded in `installmentNumber`, not in the date field.
 */
export function getInvoicePeriodForExpense(
  expense: { date: string; isInstallment: boolean; installmentNumber?: number },
  card: { closingDay: number; dueDay: number }
): InvoicePeriod {
  const basePeriod = getInvoicePeriodForDate(expense.date, card.closingDay, card.dueDay);
  const offset = expense.isInstallment ? (expense.installmentNumber ?? 1) - 1 : 0;
  if (offset === 0) return basePeriod;
  return getUpcomingPeriods(card.closingDay, card.dueDay, basePeriod.periodStart, offset + 1)[offset];
}

/**
 * Returns `count` consecutive invoice periods starting from the period
 * that contains `from`.
 */
export function getUpcomingPeriods(
  closingDay: number,
  dueDay: number,
  from: string,
  count: number
): InvoicePeriod[] {
  const periods: InvoicePeriod[] = [];
  let current = getInvoicePeriodForDate(from, closingDay, dueDay);
  periods.push(current);

  for (let i = 1; i < count; i++) {
    // Next period starts the day after current period_end
    const after = new Date(current.periodEnd);
    after.setDate(after.getDate() + 1);
    current = getInvoicePeriodForDate(after.toISOString().slice(0, 10), closingDay, dueDay);
    periods.push(current);
  }

  return periods;
}
