import { Expense } from "@/lib/types";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { formatCurrency, formatShortDate, cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  ALIMENTACAO: "bg-blue-500",
  TRANSPORTE: "bg-green-500",
  SAUDE: "bg-red-500",
  EDUCACAO: "bg-yellow-500",
  LAZER: "bg-purple-500",
  MORADIA: "bg-orange-500",
  UTILIDADES: "bg-cyan-500",
  TELEFONE: "bg-pink-500",
  SEGUROS: "bg-indigo-500",
  DIVERSOS: "bg-gray-500",
};

interface ExpenseItemProps {
  expense: Expense;
}

export function ExpenseItem({ expense }: ExpenseItemProps) {
  const categoryLabel =
    EXPENSE_CATEGORIES[expense.category as keyof typeof EXPENSE_CATEGORIES];
  const dotColor = categoryColors[expense.category] || "bg-gray-500";

  return (
    <div className="flex items-center justify-between px-4 py-3 border-thin border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className={cn("w-2 h-2 rounded-full", dotColor)} />
        <div className="flex-1">
          <p className="text-sm font-500 text-gray-900">{expense.description}</p>
          <p className="text-xs text-gray-500">{categoryLabel}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-600 text-gray-900">
          {formatCurrency(expense.amount)}
        </p>
        <p className="text-xs text-gray-500">{formatShortDate(expense.date)}</p>
      </div>
    </div>
  );
}
