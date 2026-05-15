"use client";

import { RecurringTemplate } from "@/lib/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";
import { Pencil, Trash2, Power } from "lucide-react";
import { useState } from "react";
import { deleteRecurringTemplate, toggleRecurringTemplate } from "@/lib/db/recurring-templates";
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

interface RecurringTemplateItemProps {
  template: RecurringTemplate;
  onEdit?: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const categoryColors: Record<string, string> = {
  ALIMENTACAO: "bg-blue-500",
  TRANSPORTE: "bg-green-500",
  SAUDE: "bg-red-500",
  EDUCACAO: "bg-yellow-500",
  LAZER: "bg-purple-500",
  MORADIA: "bg-orange-500",
  UTILIDADES: "bg-cyan-500",
  TELEFONE: "bg-pink-500",
  SEGUROS: "bg-indigo-500",
  DIVERSOS: "bg-gray-500",
  SALARIO: "bg-emerald-500",
  FREELANCE: "bg-teal-500",
  BONUS: "bg-amber-500",
  ALUGUEL: "bg-lime-500",
  INVESTIMENTO: "bg-sky-500",
  OUTROS: "bg-gray-400",
};

export function RecurringTemplateItem({ template, onEdit, onDelete, onToggle }: RecurringTemplateItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const categories = template.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const categoryLabel = categories[template.category as keyof typeof categories] ?? template.category;
  const dotColor = categoryColors[template.category] ?? "bg-gray-400";

  async function handleToggle() {
    setToggling(true);
    try {
      await toggleRecurringTemplate(template.id, !template.active);
      onToggle();
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteRecurringTemplate(template.id);
      onDelete();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="group flex items-center justify-between px-4 py-3 border-thin border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 flex-1">
          <div className={cn("w-2 h-2 rounded-full flex-shrink-0", dotColor, !template.active && "opacity-40")} />
          <div className={cn("flex-1", !template.active && "opacity-50")}>
            <p className="text-sm font-500 text-gray-900">{template.description}</p>
            <p className="text-xs text-gray-500">
              {categoryLabel}
              <span className="text-gray-400"> · Todo dia {template.dayOfMonth}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("text-right", !template.active && "opacity-50")}>
            <p className="text-sm font-600 text-gray-900">{formatCurrency(template.amount)}</p>
            <p className="text-xs text-gray-400">{template.active ? "Ativo" : "Inativo"}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={cn(
                "p-1.5 rounded transition-colors",
                template.active ? "text-gray-400 hover:text-warning" : "text-gray-300 hover:text-success"
              )}
              title={template.active ? "Desativar" : "Ativar"}
            >
              <Power size={13} />
            </button>
            {onEdit && (
              <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-primary rounded transition-colors" title="Editar">
                <Pencil size={13} />
              </button>
            )}
            <button onClick={() => setConfirmOpen(true)} className="p-1.5 text-gray-400 hover:text-danger rounded transition-colors" title="Excluir">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir template?</AlertDialogTitle>
            <AlertDialogDescription>
              {`"${template.description}"`} será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-danger hover:bg-danger/90"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
