"use client";

import { FixedIncomeInvestment } from "@/lib/types";
import { formatCurrency, calculateFixedIncomeProjection } from "@/lib/utils";
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

interface InvestmentCardProps {
  investment: FixedIncomeInvestment;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function InvestmentCard({ investment, onEdit, onDelete }: InvestmentCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const projections = calculateFixedIncomeProjection(
    investment.balance,
    investment.contractedRate,
    ["eoy", "1y", "2y"]
  );

  const daysAgo = differenceInDays(new Date(), parseISO(investment.balanceUpdatedAt));
  const isOutdated = daysAgo > 30;
  const statusLabel = isOutdated ? `desatualizado há ${daysAgo}d` : `atualizado há ${daysAgo}d`;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteInvestment("investments_fixed", investment.id);
      onDelete?.();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="group relative border border-gray-200 rounded-lg p-4 bg-white">
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

        <div className="flex justify-between items-start mb-3 pr-14">
          <div>
            <h3 className="font-500 text-sm text-gray-900">{investment.name}</h3>
            <p className="text-xs text-gray-500">{investment.type}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${isOutdated ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {statusLabel}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-600 text-primary">{formatCurrency(investment.balance)}</p>
          <p className="text-xs text-gray-500">Taxa: {investment.contractedRate.toFixed(2)}% a.a.</p>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-500 text-gray-700 mb-2">Projeções</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500">Até dez/26</p>
              <p className="text-sm font-500 text-gray-900">{formatCurrency(projections.eoy)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">+1 ano</p>
              <p className="text-sm font-500 text-gray-900">{formatCurrency(projections["1y"])}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">+2 anos</p>
              <p className="text-sm font-500 text-gray-900">{formatCurrency(projections["2y"])}</p>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir investimento?</AlertDialogTitle>
            <AlertDialogDescription>
              {`"${investment.name}"`} será removido permanentemente.
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
