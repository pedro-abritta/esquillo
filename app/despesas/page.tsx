"use client";

import { Header } from "@/components/shared/Header";
import { MonthSelector } from "@/components/shared/MonthSelector";
import { ExpenseItem } from "@/components/feature/ExpenseItem";
import { Mascot } from "@/components/shared/Mascot";
import { mockExpenses } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState, useMemo } from "react";

export default function Despesas() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const thisMonthExpenses = useMemo(() => {
    return mockExpenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return (
        expDate.getMonth() === currentMonth.getMonth() &&
        expDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  }, [currentMonth]);

  const totalExpenses = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="flex flex-col h-full">
      <Header title="Despesas" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Month Selector & Summary */}
          <div className="mb-8 p-6 bg-white border-thin border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <MonthSelector onChange={setCurrentMonth} />
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-500">
                <Plus size={16} />
                Nova despesa
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Total do mês</p>
              <h2 className="text-3xl font-600 text-gray-900">
                {formatCurrency(totalExpenses)}
              </h2>
            </div>
          </div>

          {/* Expenses List */}
          {thisMonthExpenses.length > 0 ? (
            <div className="bg-white border-thin border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-thin border-b border-gray-200">
                <p className="text-xs font-600 text-gray-600 uppercase">
                  {thisMonthExpenses.length} despesa
                  {thisMonthExpenses.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {thisMonthExpenses.map((expense) => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white border-thin border border-gray-200 rounded-lg">
              <Mascot size="lg" />
              <p className="text-sm text-gray-500 mt-4">
                Nenhuma despesa registrada neste mês
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
