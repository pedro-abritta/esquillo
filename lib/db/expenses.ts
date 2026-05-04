import { createClient } from "@/lib/supabase/client";
import type { Expense, ExpenseCategory, PaymentMethod } from "@/lib/types";

type DbExpense = {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  payment_method: string;
  is_deductible: boolean;
  card_id: string | null;
  is_installment: boolean;
  installment_number: number | null;
  total_installments: number | null;
  installment_group_id: string | null;
};

function toExpense(row: DbExpense): Expense {
  return {
    id: row.id,
    description: row.description,
    category: row.category as ExpenseCategory,
    amount: row.amount,
    date: row.date,
    paymentMethod: row.payment_method as PaymentMethod,
    isDeductible: row.is_deductible,
    cardId: row.card_id ?? undefined,
    isInstallment: row.is_installment,
    installmentNumber: row.installment_number ?? undefined,
    totalInstallments: row.total_installments ?? undefined,
    installmentGroupId: row.installment_group_id ?? undefined,
  };
}

export async function getExpenses(year: number, month: number): Promise<Expense[]> {
  const supabase = createClient();
  const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const end = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbExpense[]).map(toExpense);
}

export async function getAllExpenses(): Promise<Expense[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbExpense[]).map(toExpense);
}

type CreateExpenseInput = Omit<Expense, "id">;

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      description: input.description,
      category: input.category,
      amount: input.amount,
      date: input.date,
      payment_method: input.paymentMethod,
      is_deductible: input.isDeductible,
      card_id: input.cardId ?? null,
      is_installment: input.isInstallment,
      installment_number: input.installmentNumber ?? null,
      total_installments: input.totalInstallments ?? null,
      installment_group_id: input.installmentGroupId ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toExpense(data as DbExpense);
}

export async function createInstallmentGroup(
  base: Omit<Expense, "id" | "isInstallment" | "installmentNumber" | "totalInstallments" | "installmentGroupId">,
  totalInstallments: number
): Promise<void> {
  const supabase = createClient();
  const groupId = crypto.randomUUID();
  const installmentAmount = base.amount / totalInstallments;
  const baseDate = new Date(base.date);

  const rows = Array.from({ length: totalInstallments }, (_, i) => {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + i);
    return {
      description: base.description,
      category: base.category,
      amount: installmentAmount,
      date: date.toISOString().slice(0, 10),
      payment_method: base.paymentMethod,
      is_deductible: base.isDeductible,
      card_id: base.cardId ?? null,
      is_installment: true,
      installment_number: i + 1,
      total_installments: totalInstallments,
      installment_group_id: groupId,
    };
  });

  const { error } = await supabase.from("expenses").insert(rows);
  if (error) throw new Error(error.message);
}

export async function updateExpense(id: string, input: Partial<CreateExpenseInput>): Promise<Expense> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.description !== undefined) patch.description = input.description;
  if (input.category !== undefined) patch.category = input.category;
  if (input.amount !== undefined) patch.amount = input.amount;
  if (input.date !== undefined) patch.date = input.date;
  if (input.paymentMethod !== undefined) patch.payment_method = input.paymentMethod;
  if (input.isDeductible !== undefined) patch.is_deductible = input.isDeductible;
  if (input.cardId !== undefined) patch.card_id = input.cardId ?? null;

  const { data, error } = await supabase
    .from("expenses")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toExpense(data as DbExpense);
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
