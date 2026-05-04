import { createClient } from "@/lib/supabase/client";
import type { Invoice, InvoiceStatus } from "@/lib/types";

type DbInvoice = {
  id: string;
  card_id: string;
  period_start: string;
  period_end: string;
  due_date: string;
  status: string;
  credit_cards: { name: string } | null;
};

function toInvoice(row: DbInvoice, total: number): Invoice {
  return {
    id: row.id,
    cardId: row.card_id,
    cardName: row.credit_cards?.name ?? "",
    periodStart: row.period_start,
    periodEnd: row.period_end,
    total,
    status: row.status as InvoiceStatus,
    dueDate: row.due_date,
  };
}

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = createClient();

  const { data: invoiceRows, error: invError } = await supabase
    .from("invoices")
    .select("*, credit_cards(name)")
    .order("period_start", { ascending: false });

  if (invError) throw new Error(invError.message);

  const invoices = await Promise.all(
    (invoiceRows as DbInvoice[]).map(async (row) => {
      const { data: expenseData, error: expError } = await supabase
        .from("expenses")
        .select("amount")
        .eq("card_id", row.card_id)
        .gte("date", row.period_start)
        .lte("date", row.period_end);

      if (expError) throw new Error(expError.message);
      const total = (expenseData ?? []).reduce((sum, e) => sum + e.amount, 0);
      return toInvoice(row, total);
    })
  );

  return invoices;
}
