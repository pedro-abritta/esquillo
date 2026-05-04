"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { createStockInvestment, updateStockInvestment } from "@/lib/db/investments";
import type { StockInvestment } from "@/lib/types";

interface InvestmentStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock?: StockInvestment;
  onSuccess: () => void;
}

const input = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-primary transition-colors";
const label = "text-xs text-gray-600 block mb-1";

export function InvestmentStockDialog({ open, onOpenChange, stock, onSuccess }: InvestmentStockDialogProps) {
  const isEditing = !!stock;

  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [balanceUpdatedAt, setBalanceUpdatedAt] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (stock) {
        setTicker(stock.ticker);
        setQuantity(stock.quantity.toString());
        setTotalValue(stock.totalValue.toString());
        setBalanceUpdatedAt(stock.balanceUpdatedAt);
      } else {
        setTicker("");
        setQuantity("");
        setTotalValue("");
        setBalanceUpdatedAt(new Date().toISOString().slice(0, 10));
      }
      setError(null);
    }
  }, [stock, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = {
      ticker: ticker.trim().toUpperCase(),
      quantity: parseInt(quantity),
      totalValue: parseFloat(totalValue),
      balanceUpdatedAt,
    };

    try {
      if (isEditing && stock) {
        await updateStockInvestment(stock.id, data);
      } else {
        await createStockInvestment(data);
      }
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar ação" : "Nova ação"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className={label}>Ticker</label>
            <input className={input} value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="Ex: VALE3" maxLength={10} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Quantidade</label>
              <input type="number" min="1" className={input} value={quantity} onChange={e => setQuantity(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Valor total (R$)</label>
              <input type="number" step="0.01" min="0" className={input} value={totalValue} onChange={e => setTotalValue(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className={label}>Posição atualizada em</label>
            <input type="date" className={input} value={balanceUpdatedAt} onChange={e => setBalanceUpdatedAt(e.target.value)} required />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">
              {submitting ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
