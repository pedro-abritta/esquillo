"use client";

import { Header } from "@/components/shared/Header";
import { MonthSelector } from "@/components/shared/MonthSelector";
import { ExpenseItem } from "@/components/feature/ExpenseItem";
import { CardItem } from "@/components/feature/CardItem";
import { Mascot } from "@/components/shared/Mascot";
import { mockExpenses, mockCreditCards } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo } from "react";

const chartData = [
  { name: "Sem 1", valor: 850 },
  { name: "Sem 2", valor: 1200 },
  { name: "Sem 3", valor: 950 },
  { name: "Sem 4", valor: 1400 },
];

export default function Dashboard() {
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
  const totalCardUsage = mockCreditCards.reduce((sum, card) => sum + card.used, 0);
  const totalCardLimit = mockCreditCards.reduce((sum, card) => sum + card.limit, 0);

  const activeCards = mockCreditCards.filter((card) => card.status === "ACTIVE").length;

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Saldo do mês</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-600 text-gray-900">
                  {formatCurrency(5000 - totalExpenses)}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Despesas</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-600 text-gray-900">
                  {formatCurrency(totalExpenses)}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Cartões ativos</p>
              <h3 className="text-2xl font-600 text-gray-900">{activeCards}</h3>
            </div>

            <div className="p-4 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Limite utilizado</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-600 text-gray-900">
                  {((totalCardUsage / totalCardLimit) * 100).toFixed(0)}%
                </h3>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <h2 className="text-sm font-600 text-gray-900 mb-4">
                Despesas da semana
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#BA7517"
                    strokeWidth={2}
                    dot={{ fill: "#BA7517", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <h2 className="text-sm font-600 text-gray-900 mb-4">Cartões</h2>
              <div className="space-y-3">
                {mockCreditCards.slice(0, 2).map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm text-gray-900">{card.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(card.used / card.limit) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-500 text-gray-600 w-10 text-right">
                        {((card.used / card.limit) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-600 text-gray-900">
                  Últimas despesas
                </h2>
                <MonthSelector onChange={setCurrentMonth} />
              </div>
              <button className="text-xs font-500 text-primary hover:text-primary/80 transition-colors">
                Ver todas
              </button>
            </div>

            {thisMonthExpenses.length > 0 ? (
              <div className="space-y-0">
                {thisMonthExpenses.slice(0, 5).map((expense) => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <Mascot size="md" />
                <p className="text-sm text-gray-500">
                  Nenhuma despesa registrada neste mês
                </p>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
            <h2 className="text-sm font-600 text-gray-900 mb-4">
              Seus cartões
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {mockCreditCards.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
