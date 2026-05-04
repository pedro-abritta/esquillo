"use client";

import { Header } from "@/components/shared/Header";
import { InvestmentCard } from "@/components/feature/InvestmentCard";
import { StockRow } from "@/components/feature/StockRow";
import { InvestmentFixedDialog } from "@/components/feature/InvestmentFixedDialog";
import { InvestmentStockDialog } from "@/components/feature/InvestmentStockDialog";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getFixedInvestments, getStockInvestments } from "@/lib/db/investments";
import type { FixedIncomeInvestment, StockInvestment } from "@/lib/types";

export default function Investimentos() {
  const [fixed, setFixed] = useState<FixedIncomeInvestment[]>([]);
  const [stocks, setStocks] = useState<StockInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fixedDialogOpen, setFixedDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [editingFixed, setEditingFixed] = useState<FixedIncomeInvestment | undefined>();
  const [editingStock, setEditingStock] = useState<StockInvestment | undefined>();

  const refresh = useCallback(() => {
    Promise.all([getFixedInvestments(), getStockInvestments()])
      .then(([f, s]) => { setFixed(f); setStocks(s); })
      .catch(() => setError("Erro ao carregar investimentos."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const totalFixedIncome = fixed.reduce((sum, inv) => sum + inv.balance, 0);
  const totalStocks = stocks.reduce((sum, s) => sum + s.totalValue, 0);
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
              <button
                onClick={() => { setEditingFixed(undefined); setFixedDialogOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-500"
              >
                <Plus size={16} />
                Renda fixa
              </button>
              <button
                onClick={() => { setEditingStock(undefined); setStockDialogOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-900 rounded-md hover:bg-gray-50 transition-colors text-sm font-500"
              >
                <Plus size={16} />
                Ação
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Patrimônio total</p>
              <h3 className="text-2xl font-600 text-primary">{formatCurrency(totalPatrimony)}</h3>
            </div>
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Renda fixa</p>
              <h3 className="text-2xl font-600 text-gray-900">{formatCurrency(totalFixedIncome)}</h3>
            </div>
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Ações</p>
              <h3 className="text-2xl font-600 text-gray-900">{formatCurrency(totalStocks)}</h3>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-sm text-danger text-center py-8">{error}</p>
          ) : (
            <>
              {/* Fixed Income */}
              <div className="space-y-4">
                <h2 className="text-lg font-600 text-gray-900">Renda fixa</h2>
                {fixed.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {fixed.map((inv) => (
                      <InvestmentCard
                        key={inv.id}
                        investment={inv}
                        onEdit={() => { setEditingFixed(inv); setFixedDialogOpen(true); }}
                        onDelete={refresh}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nenhum investimento cadastrado.</p>
                )}
              </div>

              {/* Stocks */}
              <div className="space-y-4">
                <h2 className="text-lg font-600 text-gray-900">Ações</h2>
                {stocks.length > 0 ? (
                  <div className="bg-white border-thin border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-4 py-3 text-left text-xs font-600 text-gray-700">Ticker</th>
                          <th className="px-4 py-3 text-right text-xs font-600 text-gray-700">Quantidade</th>
                          <th className="px-4 py-3 text-right text-xs font-600 text-gray-700">Valor total</th>
                          <th className="px-4 py-3 text-right text-xs font-600 text-gray-700">Status</th>
                          <th className="w-16" />
                        </tr>
                      </thead>
                      <tbody>
                        {stocks.map((stock) => (
                          <StockRow
                            key={stock.id}
                            stock={stock}
                            onEdit={() => { setEditingStock(stock); setStockDialogOpen(true); }}
                            onDelete={refresh}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma ação cadastrada.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <InvestmentFixedDialog
        open={fixedDialogOpen}
        onOpenChange={setFixedDialogOpen}
        investment={editingFixed}
        onSuccess={refresh}
      />
      <InvestmentStockDialog
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        stock={editingStock}
        onSuccess={refresh}
      />
    </div>
  );
}
