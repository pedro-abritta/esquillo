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
import { markInvoicePaid, unmarkInvoicePaid } from "@/lib/db/invoice-payments";
import { formatCurrency, formatShortDate, cn } from "@/lib/utils";
import { INVOICE_STATUS, INVOICE_STATUS_COLOR } from "@/lib/constants";
import type { Invoice, Expense } from "@/lib/types";

interface InvoiceDetailSheetProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function InvoiceDetailSheet({ invoice, open, onClose, onRefresh }: InvoiceDetailSheetProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!open || !invoice) return;
    const controller = new AbortController();
    setLoading(true);
    const competenceMonth = invoice.periodEnd.slice(0, 7) + "-01";
    getExpensesByInvoice(invoice.cardId, competenceMonth)
      .then((data) => { if (!controller.signal.aborted) setExpenses(data); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [open, invoice]);

  async function handleTogglePaid() {
    if (!invoice) return;
    setActionLoading(true);
    try {
      if (invoice.status === "PAID") {
        await unmarkInvoicePaid(invoice.cardId, invoice.periodEnd);
      } else {
        await markInvoicePaid(invoice.cardId, invoice.periodEnd);
      }
      onRefresh();
      onClose();
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl bg-white">
        {invoice && (
          <>
            <DialogHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="text-sm font-500">{invoice.cardName}</DialogTitle>
                <span className={cn("text-xs font-500 px-2 py-1 rounded-full", INVOICE_STATUS_COLOR[invoice.status] ?? "bg-gray-200 text-gray-700")}>
                  {INVOICE_STATUS[invoice.status as keyof typeof INVOICE_STATUS] ?? invoice.status}
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

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleTogglePaid}
                disabled={actionLoading}
                className={cn(
                  "w-full py-2 text-sm rounded-md transition-colors disabled:opacity-50",
                  invoice.status === "PAID"
                    ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    : "bg-success text-white hover:bg-success/90"
                )}
              >
                {actionLoading
                  ? "Salvando..."
                  : invoice.status === "PAID"
                  ? "Desfazer pagamento"
                  : "Marcar como paga"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
