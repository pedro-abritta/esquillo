import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

type DbCategory = {
  id: string;
  key: string;
  label: string;
  color: string;
  icon: string;
  ir_category: string | null;
};

function toCategory(row: DbCategory): Category {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    color: row.color,
    icon: row.icon,
    irCategory: row.ir_category ?? undefined,
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("label");

  if (error) throw new Error(error.message);
  return (data as DbCategory[]).map(toCategory);
}
