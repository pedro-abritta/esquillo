"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseItem } from "@/components/feature/ExpenseItem";
import { getExpensesByInvoice } from "@/lib/db/expenses";
import { formatCurrency, formatShortDate, cn } from "@/lib/utils";
import type { Invoice, Expense } from "@/lib/types";

interface InvoiceDetailSheetProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
}

const statusColor: Record<string, string> = {
  OPEN: "bg-info text-white",
  CLOSED: "bg-warning text-white",
  PAID: "bg-success text-white",
};

const statusLabel: Record<string, string> = {
  OPEN: "Aberta",
  CLOSED: "Fechada",
  PAID: "Paga",
};

export function InvoiceDetailSheet({ invoice, open, onClose }: InvoiceDetailSheetProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !invoice) return;
    setLoading(true);
    const competenceMonth = invoice.periodEnd.slice(0, 7) + "-01";
    getExpensesByInvoice(invoice.cardId, competenceMonth)
      .then(setExpenses)
      .finally(() => setLoading(false));
  }, [open, invoice]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl bg-white">
        {invoice && (
          <>
            <DialogHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="text-sm font-500">{invoice.cardName}</DialogTitle>
                <span className={cn("text-xs font-500 px-2 py-1 rounded-full", statusColor[invoice.status])}>
                  {statusLabel[invoice.status]}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {formatShortDate(invoice.periodStart)} até {formatShortDate(invoice.periodEnd)}
                {" · "}vence em {formatShortDate(invoice.dueDate)}
              </p>
              <p className="text-lg font-500 text-gray-900">{formatCurrency(invoice.total)}</p>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : expenses.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-12">Nenhuma despesa nesta fatura.</p>
              ) : (
                <div>
                  {expenses.map((expense) => (
                    <ExpenseItem key={expense.id} expense={expense} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
