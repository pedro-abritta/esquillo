import { createClient } from "@/lib/supabase/client";

export async function getInvoicePaymentKeys(): Promise<Set<string>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoice_payments")
    .select("card_id, period_end");

  if (error) throw new Error(error.message);
  return new Set(
    (data ?? []).map((row: { card_id: string; period_end: string }) =>
      `${row.card_id}__${row.period_end}`
    )
  );
}

export async function markInvoicePaid(cardId: string, periodEnd: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("invoice_payments")
    .upsert({ card_id: cardId, period_end: periodEnd }, { onConflict: "user_id,card_id,period_end" });

  if (error) throw new Error(error.message);
}

export async function unmarkInvoicePaid(cardId: string, periodEnd: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("invoice_payments")
    .delete()
    .eq("card_id", cardId)
    .eq("period_end", periodEnd);

  if (error) throw new Error(error.message);
}
