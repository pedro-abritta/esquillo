import { createClient } from "@/lib/supabase/client";
import type { FixedIncomeInvestment, StockInvestment, FixedIncomeType } from "@/lib/types";

type DbFixed = {
  id: string;
  name: string;
  type: string;
  balance: number;
  contracted_rate: number;
  maturity_date: string;
  balance_updated_at: string;
};

type DbStock = {
  id: string;
  ticker: string;
  quantity: number;
  total_value: number;
  balance_updated_at: string;
};

function toFixed(row: DbFixed): FixedIncomeInvestment {
  return {
    id: row.id,
    name: row.name,
    type: row.type as FixedIncomeType,
    balance: row.balance,
    contractedRate: row.contracted_rate,
    maturityDate: row.maturity_date,
    balanceUpdatedAt: row.balance_updated_at,
  };
}

function toStock(row: DbStock): StockInvestment {
  return {
    id: row.id,
    ticker: row.ticker,
    quantity: row.quantity,
    totalValue: row.total_value,
    balanceUpdatedAt: row.balance_updated_at,
  };
}

export async function getFixedInvestments(): Promise<FixedIncomeInvestment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("investments_fixed")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data as DbFixed[]).map(toFixed);
}

export async function getStockInvestments(): Promise<StockInvestment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("investments_stock")
    .select("*")
    .order("ticker");

  if (error) throw new Error(error.message);
  return (data as DbStock[]).map(toStock);
}

export async function createFixedInvestment(
  input: Omit<FixedIncomeInvestment, "id">
): Promise<FixedIncomeInvestment> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("investments_fixed")
    .insert({
      name: input.name,
      type: input.type,
      balance: input.balance,
      contracted_rate: input.contractedRate,
      maturity_date: input.maturityDate,
      balance_updated_at: input.balanceUpdatedAt,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toFixed(data as DbFixed);
}

export async function updateFixedInvestment(
  id: string,
  input: Partial<Omit<FixedIncomeInvestment, "id">>
): Promise<FixedIncomeInvestment> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.type !== undefined) patch.type = input.type;
  if (input.balance !== undefined) patch.balance = input.balance;
  if (input.contractedRate !== undefined) patch.contracted_rate = input.contractedRate;
  if (input.maturityDate !== undefined) patch.maturity_date = input.maturityDate;
  if (input.balanceUpdatedAt !== undefined) patch.balance_updated_at = input.balanceUpdatedAt;

  const { data, error } = await supabase
    .from("investments_fixed")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toFixed(data as DbFixed);
}

export async function createStockInvestment(
  input: Omit<StockInvestment, "id">
): Promise<StockInvestment> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("investments_stock")
    .insert({
      ticker: input.ticker,
      quantity: input.quantity,
      total_value: input.totalValue,
      balance_updated_at: input.balanceUpdatedAt,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toStock(data as DbStock);
}

export async function updateStockInvestment(
  id: string,
  input: Partial<Omit<StockInvestment, "id">>
): Promise<StockInvestment> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.ticker !== undefined) patch.ticker = input.ticker;
  if (input.quantity !== undefined) patch.quantity = input.quantity;
  if (input.totalValue !== undefined) patch.total_value = input.totalValue;
  if (input.balanceUpdatedAt !== undefined) patch.balance_updated_at = input.balanceUpdatedAt;

  const { data, error } = await supabase
    .from("investments_stock")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toStock(data as DbStock);
}

export async function deleteInvestment(
  table: "investments_fixed" | "investments_stock",
  id: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
