"use client";

import { Header } from "@/components/shared/Header";
import { InvestmentCard } from "@/components/feature/InvestmentCard";
import { StockRow } from "@/components/feature/StockRow";
import { mockFixedIncomeInvestments, mockStockInvestments } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function Investimentos() {
  const totalFixedIncome = mockFixedIncomeInvestments.reduce(
    (sum, inv) => sum + inv.balance,
    0
  );

  const totalStocks = mockStockInvestments.reduce(
    (sum, stock) => sum + stock.totalValue,
    0
  );

  const totalPatrimony = totalFixedIncome + totalStocks;

  return (
    <div className="flex flex-col h-full">
      <Header title="Investimentos" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Header with buttons */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-600 text-gray-900">Carteira de Investimentos</h1>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-500">
                <Plus size={16} />
                Renda fixa
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-900 rounded-md hover:bg-gray-50 transition-colors text-sm font-500">
                <Plus size={16} />
                Ação
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Patrimônio total</p>
              <h3 className="text-2xl font-600 text-primary">
                {formatCurrency(totalPatrimony)}
              </h3>
            </div>

            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Renda fixa</p>
              <h3 className="text-2xl font-600 text-gray-900">
                {formatCurrency(totalFixedIncome)}
              </h3>
            </div>

            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Ações</p>
              <h3 className="text-2xl font-600 text-gray-900">
                {formatCurrency(totalStocks)}
              </h3>
            </div>
          </div>

          {/* Fixed Income Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-600 text-gray-900">Renda fixa</h2>

            <div className="grid grid-cols-2 gap-4">
              {mockFixedIncomeInvestments.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
          </div>

          {/* Stocks Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-600 text-gray-900">Ações</h2>

            <div className="bg-white border-thin border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-600 text-gray-700">
                      Ticker
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-600 text-gray-700">
                      Quantidade
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-600 text-gray-700">
                      Valor total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-600 text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockStockInvestments.map((stock) => (
                    <StockRow key={stock.id} stock={stock} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
