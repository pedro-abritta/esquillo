"use client";

import { StockInvestment } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteInvestment } from "@/lib/db/investments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StockRowProps {
  stock: StockInvestment;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function StockRow({ stock, onEdit, onDelete }: StockRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const daysAgo = differenceInDays(new Date(), parseISO(stock.balanceUpdatedAt));
  const isOutdated = daysAgo > 30;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteInvestment("investments_stock", stock.id);
      onDelete?.();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <tr className="group border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm font-500 text-gray-900">{stock.ticker}</td>
        <td className="px-4 py-3 text-sm text-gray-700 text-right">{stock.quantity.toLocaleString("pt-BR")}</td>
        <td className="px-4 py-3 text-sm font-500 text-gray-900 text-right">{formatCurrency(stock.totalValue)}</td>
        <td className="px-4 py-3 text-sm text-right">
          <span className={`text-xs px-2 py-1 rounded-full ${isOutdated ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {isOutdated ? `${daysAgo}d atrás` : "hoje"}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-primary rounded transition-colors" title="Editar">
                <Pencil size={13} />
              </button>
            )}
            {onDelete && (
              <button onClick={() => setConfirmOpen(true)} className="p-1.5 text-gray-400 hover:text-danger rounded transition-colors" title="Excluir">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </td>
      </tr>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir ação?</AlertDialogTitle>
            <AlertDialogDescription>
              A posição em {stock.ticker} será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-danger hover:bg-danger/90">
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
