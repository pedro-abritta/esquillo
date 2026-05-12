import { createClient } from "@/lib/supabase/client";
import { getInvoicePeriodForDate } from "@/lib/invoice-cycle";
import type { Invoice, InvoiceStatus } from "@/lib/types";

type DbCard = {
  id: string;
  name: string;
  closing_day: number;
  due_day: number;
};

type DbExpenseRow = {
  amount: number;
  competence_month: string;
  card_id: string;
};

/**
 * Derives invoices from credit_cards + expenses.
 *
 * competence_month is always stored as the first day of a month.
 * Since closing_day >= 1, getInvoicePeriodForDate("YYYY-MM-01", closing_day, due_day)
 * always resolves to the period ending on closing_day of that same month —
 * no need for installment_number offsets at query time.
 *
 * Invoice id: stable composite key `${cardId}__${periodEnd}`.
 * Status: periodEnd < today → CLOSED, otherwise OPEN.
 */
export async function getInvoices(): Promise<Invoice[]> {
  const supabase = createClient();

  const [{ data: cardRows, error: cardError }, { data: expRows, error: expError }] =
    await Promise.all([
      supabase.from("credit_cards").select("id, name, closing_day, due_day"),
      supabase
        .from("expenses")
        .select("amount, competence_month, card_id")
        .eq("payment_method", "CREDITO")
        .not("card_id", "is", null),
    ]);

  if (cardError) throw new Error(cardError.message);
  if (expError) throw new Error(expError.message);

  const cardMap = new Map((cardRows as DbCard[]).map((c) => [c.id, c]));

  const groups = new Map<
    string,
    { card: DbCard; periodStart: string; periodEnd: string; dueDate: string; total: number }
  >();

  for (const exp of (expRows ?? []) as DbExpenseRow[]) {
    const card = cardMap.get(exp.card_id);
    if (!card) continue;

    const period = getInvoicePeriodForDate(exp.competence_month, card.closing_day, card.due_day);
    const key = `${exp.card_id}__${period.periodEnd}`;

    const existing = groups.get(key);
    if (existing) {
      existing.total += exp.amount;
    } else {
      groups.set(key, {
        card,
        periodStart: period.periodStart,
        periodEnd: period.periodEnd,
        dueDate: period.dueDate,
        total: exp.amount,
      });
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return Array.from(groups.entries())
    .map(([key, { card, periodStart, periodEnd, dueDate, total }]) => ({
      id: key,
      cardId: card.id,
      cardName: card.name,
      periodStart,
      periodEnd,
      total,
      status: (periodEnd < today ? "CLOSED" : "OPEN") as InvoiceStatus,
      dueDate,
    }))
    .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd));
}
