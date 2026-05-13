import { createClient } from "@/lib/supabase/client";
import type { RecurringTemplate, RecurringType, ExpenseCategory, IncomeCategory, PaymentMethod } from "@/lib/types";

const SELECT_COLS =
  "id, type, description, category, amount, payment_method, card_id, is_deductible, day_of_month, active";

type DbRecurringTemplate = {
  id: string;
  type: string;
  description: string;
  category: string;
  amount: number;
  payment_method: string | null;
  card_id: string | null;
  is_deductible: boolean;
  day_of_month: number;
  active: boolean;
};

function toRecurringTemplate(row: DbRecurringTemplate): RecurringTemplate {
  return {
    id: row.id,
    type: row.type as RecurringType,
    description: row.description,
    category: row.category as ExpenseCategory | IncomeCategory,
    amount: row.amount,
    paymentMethod: row.payment_method ? (row.payment_method as PaymentMethod) : undefined,
    cardId: row.card_id ?? undefined,
    isDeductible: row.is_deductible,
    dayOfMonth: row.day_of_month,
    active: row.active,
  };
}

export interface CreateTemplateInput {
  type: RecurringType;
  description: string;
  category: string;
  amount: number;
  dayOfMonth: number;
  isDeductible?: boolean;
  paymentMethod?: PaymentMethod;
  cardId?: string;
}

export async function getRecurringTemplates(): Promise<RecurringTemplate[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recurring_templates")
    .select(SELECT_COLS)
    .order("description");

  if (error) throw new Error(error.message);
  return (data as DbRecurringTemplate[]).map(toRecurringTemplate);
}

export async function createRecurringTemplate(input: CreateTemplateInput): Promise<RecurringTemplate> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recurring_templates")
    .insert({
      type: input.type,
      description: input.description.trim(),
      category: input.category,
      amount: input.amount,
      day_of_month: input.dayOfMonth,
      is_deductible: input.isDeductible ?? false,
      payment_method: input.paymentMethod ?? null,
      card_id: input.cardId ?? null,
    })
    .select(SELECT_COLS)
    .single();

  if (error) throw new Error(error.message);
  return toRecurringTemplate(data as DbRecurringTemplate);
}

export async function updateRecurringTemplate(
  id: string,
  input: Partial<CreateTemplateInput>
): Promise<RecurringTemplate> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.description !== undefined) patch.description = input.description.trim();
  if (input.category !== undefined) patch.category = input.category;
  if (input.amount !== undefined) patch.amount = input.amount;
  if (input.dayOfMonth !== undefined) patch.day_of_month = input.dayOfMonth;
  if (input.isDeductible !== undefined) patch.is_deductible = input.isDeductible;
  if (input.paymentMethod !== undefined) patch.payment_method = input.paymentMethod;
  if (input.cardId !== undefined) patch.card_id = input.cardId;

  const { data, error } = await supabase
    .from("recurring_templates")
    .update(patch)
    .eq("id", id)
    .select(SELECT_COLS)
    .single();

  if (error) throw new Error(error.message);
  return toRecurringTemplate(data as DbRecurringTemplate);
}

export async function deleteRecurringTemplate(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("recurring_templates")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function toggleRecurringTemplate(id: string, active: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("recurring_templates")
    .update({ active })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
