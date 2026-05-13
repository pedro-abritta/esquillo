import { createClient } from "@/lib/supabase/client";
import type { IncomeEntry, IncomeCategory } from "@/lib/types";

const SELECT_COLS =
  "id, description, amount, date, competence_month, category, recurring_template_id";

type DbIncomeEntry = {
  id: string;
  description: string;
  amount: number;
  date: string;
  competence_month: string;
  category: string;
  recurring_template_id: string | null;
};

function toIncomeEntry(row: DbIncomeEntry): IncomeEntry {
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    date: row.date,
    competenceMonth: row.competence_month,
    category: row.category as IncomeCategory,
    recurringTemplateId: row.recurring_template_id ?? undefined,
  };
}

export interface CreateIncomeInput {
  description: string;
  amount: number;
  date: string;
  category: IncomeCategory;
  recurringTemplateId?: string;
}

export async function getIncomeEntries(year: number, month: number): Promise<IncomeEntry[]> {
  const supabase = createClient();
  const competenceMonth = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("income_entries")
    .select(SELECT_COLS)
    .eq("competence_month", competenceMonth)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbIncomeEntry[]).map(toIncomeEntry);
}

export async function createIncomeEntry(input: CreateIncomeInput): Promise<IncomeEntry> {
  const supabase = createClient();
  const competenceMonth = input.date.slice(0, 7) + "-01";

  const { data, error } = await supabase
    .from("income_entries")
    .insert({
      description: input.description.trim(),
      amount: input.amount,
      date: input.date,
      competence_month: competenceMonth,
      category: input.category,
      recurring_template_id: input.recurringTemplateId ?? null,
    })
    .select(SELECT_COLS)
    .single();

  if (error) throw new Error(error.message);
  return toIncomeEntry(data as DbIncomeEntry);
}

export async function updateIncomeEntry(
  id: string,
  input: Partial<CreateIncomeInput>
): Promise<IncomeEntry> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.description !== undefined) patch.description = input.description.trim();
  if (input.amount !== undefined) patch.amount = input.amount;
  if (input.category !== undefined) patch.category = input.category;
  if (input.date !== undefined) {
    patch.date = input.date;
    patch.competence_month = input.date.slice(0, 7) + "-01";
  }

  const { data, error } = await supabase
    .from("income_entries")
    .update(patch)
    .eq("id", id)
    .select(SELECT_COLS)
    .single();

  if (error) throw new Error(error.message);
  return toIncomeEntry(data as DbIncomeEntry);
}

export async function deleteIncomeEntry(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("income_entries")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
