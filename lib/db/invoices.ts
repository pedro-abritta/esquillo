import { createClient } from "@/lib/supabase/client";
import { getInvoicePeriodForDate, getUpcomingPeriods } from "@/lib/invoice-cycle";
import { getInvoicePaymentKeys } from "@/lib/db/invoice-payments";
import type { Invoice, InvoiceStatus } from "@/lib/types";

const FUTURE_PERIODS = 3;

type DbCard = {
  id: string;
  name: string;
  closing_day: number;
  due_day: number;
  status: string;
};

type DbExpenseRow = {
  amount: number;
  competence_month: string;
  card_id: string;
};

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = createClient();

  const [
    { data: cardRows, error: cardError },
    { data: expRows, error: expError },
    paidKeys,
  ] = await Promise.all([
    supabase.from("credit_cards").select("id, name, closing_day, due_day, status"),
    supabase
      .from("expenses")
      .select("amount, competence_month, card_id")
      .eq("payment_method", "CREDITO")
      .not("card_id", "is", null),
    getInvoicePaymentKeys(),
  ]);

  if (cardError) throw new Error(cardError.message);
  if (expError) throw new Error(expError.message);

  const cardMap = new Map((cardRows as DbCard[]).map((c) => [c.id, c]));

  const groups = new Map<
    string,
    { card: DbCard; periodStart: string; periodEnd: string; dueDate: string; total: number }
  >();

  // Build real invoices from expenses
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

  // Project future periods for each ACTIVE card
  const today = new Date().toISOString().slice(0, 10);
  for (const card of (cardRows as DbCard[])) {
    if (card.status !== "ACTIVE") continue;
    const upcoming = getUpcomingPeriods(card.closing_day, card.due_day, today, FUTURE_PERIODS);
    for (const period of upcoming) {
      const key = `${card.id}__${period.periodEnd}`;
      if (!groups.has(key)) {
        groups.set(key, {
          card,
          periodStart: period.periodStart,
          periodEnd: period.periodEnd,
          dueDate: period.dueDate,
          total: 0,
        });
      }
    }
  }

  return Array.from(groups.entries())
    .map(([key, { card, periodStart, periodEnd, dueDate, total }]) => {
      let status: InvoiceStatus;
      if (paidKeys.has(key)) {
        status = "PAID";
      } else if (periodEnd < today) {
        status = "CLOSED";
      } else {
        status = "OPEN";
      }
      return {
        id: key,
        cardId: card.id,
        cardName: card.name,
        periodStart,
        periodEnd,
        total,
        status,
        dueDate,
      };
    })
    .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd));
}
