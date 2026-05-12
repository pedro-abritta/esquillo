import { createClient } from "@/lib/supabase/client";
import type { CreditCard, CardStatus } from "@/lib/types";

type DbCreditCard = {
  id: string;
  name: string;
  last_four_digits: string | null;
  limit: number;
  status: string;
  closing_day: number;
  due_day: number;
};

function toCreditCard(row: DbCreditCard): CreditCard {
  return {
    id: row.id,
    name: row.name,
    lastFourDigits: row.last_four_digits ?? "",
    limit: row.limit,
    status: row.status as CardStatus,
    closingDay: row.closing_day,
    dueDay: row.due_day,
  };
}

export async function getCreditCards(): Promise<CreditCard[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("credit_cards")
    .select("id, name, last_four_digits, limit, status, closing_day, due_day")
    .order("name");

  if (error) throw new Error(error.message);
  return (data as DbCreditCard[]).map(toCreditCard);
}

type CreateCardInput = Omit<CreditCard, "id">;

export async function createCreditCard(input: CreateCardInput): Promise<CreditCard> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("credit_cards")
    .insert({
      name: input.name,
      last_four_digits: input.lastFourDigits || null,
      limit: input.limit,
      status: input.status,
      closing_day: input.closingDay,
      due_day: input.dueDay,
    })
    .select("id, name, last_four_digits, limit, status, closing_day, due_day")
    .single();

  if (error) throw new Error(error.message);
  return toCreditCard(data as DbCreditCard);
}

export async function updateCreditCard(id: string, input: Partial<CreateCardInput>): Promise<CreditCard> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.lastFourDigits !== undefined) patch.last_four_digits = input.lastFourDigits || null;
  if (input.limit !== undefined) patch.limit = input.limit;
  if (input.status !== undefined) patch.status = input.status;
  if (input.closingDay !== undefined) patch.closing_day = input.closingDay;
  if (input.dueDay !== undefined) patch.due_day = input.dueDay;

  const { data, error } = await supabase
    .from("credit_cards")
    .update(patch)
    .eq("id", id)
    .select("id, name, last_four_digits, limit, status, closing_day, due_day")
    .single();

  if (error) throw new Error(error.message);
  return toCreditCard(data as DbCreditCard);
}

export async function deleteCreditCard(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("credit_cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
