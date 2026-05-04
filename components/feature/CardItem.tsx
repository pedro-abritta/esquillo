"use client";

import { CreditCard } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCreditCard } from "@/lib/db/credit-cards";
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

interface CardItemProps {
  card: CreditCard;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColor: Record<string, string> = {
  ACTIVE: "bg-success text-white",
  INACTIVE: "bg-gray-200 text-gray-700",
  BLOCKED: "bg-danger text-white",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  BLOCKED: "Bloqueado",
};

export function CardItem({ card, onEdit, onDelete }: CardItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const percentage = (card.used / card.limit) * 100;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCreditCard(card.id);
      onDelete?.();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="group relative p-4 bg-white border-thin border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        {(onEdit || onDelete) && (
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        )}

        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-600 text-gray-900">{card.name}</h3>
            <p className="text-xs text-gray-500">•••• {card.lastFourDigits}</p>
          </div>
          <span className={cn("text-xs font-500 px-2 py-1 rounded-full", statusColor[card.status] ?? "bg-gray-200 text-gray-700")}>
            {statusLabel[card.status] ?? card.status}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">Limite utilizado</span>
              <span className="text-xs font-600 text-gray-900">{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(percentage, 100)}%` }} />
            </div>
          </div>

          <div className="flex justify-between pt-2 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-600">Usado</p>
              <p className="text-sm font-600 text-gray-900">{formatCurrency(card.used)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Limite</p>
              <p className="text-sm font-600 text-gray-900">{formatCurrency(card.limit)}</p>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cartão?</AlertDialogTitle>
            <AlertDialogDescription>
              {`O cartão "${card.name}" e todas as despesas vinculadas serão afetados.`}
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
