"use client";

import { Document, DocumentStatus } from "@/lib/types";
import { formatShortDate, cn } from "@/lib/utils";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteDocument, updateDocumentStatus } from "@/lib/db/documents";
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

interface DocumentCardProps {
  document: Document;
  onDelete?: () => void;
  onStatusChange?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  ORGANIZED: "bg-success/10 text-success",
  USED: "bg-info/10 text-info",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  ORGANIZED: "Organizado",
  USED: "Utilizado",
};

const nextStatus: Record<DocumentStatus, DocumentStatus> = {
  PENDING: "ORGANIZED",
  ORGANIZED: "USED",
  USED: "PENDING",
};

export function DocumentCard({ document, onDelete, onStatusChange }: DocumentCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDocument(document.id, document.storagePath);
      onDelete?.();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  async function handleStatusCycle() {
    setUpdatingStatus(true);
    try {
      await updateDocumentStatus(document.id, nextStatus[document.status]);
      onStatusChange?.();
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <>
      <div className="group p-4 bg-white border-thin border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <FileText size={24} className="text-primary opacity-60" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-sm font-600 text-gray-900 line-clamp-2 flex-1">{document.name}</h3>
              {onDelete && (
                <button onClick={() => setConfirmOpen(true)} className="flex-shrink-0 p-1 text-gray-400 hover:text-danger rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Excluir">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatShortDate(document.uploadedAt)} • {formatFileSize(document.size)}
            </p>

            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={handleStatusCycle}
                disabled={updatingStatus || !onStatusChange}
                className={cn(
                  "text-xs font-500 px-2 py-1 rounded-full transition-opacity",
                  statusColors[document.status] ?? "bg-gray-100 text-gray-600",
                  onStatusChange ? "cursor-pointer hover:opacity-80" : "cursor-default"
                )}
                title={onStatusChange ? "Clique para avançar o status" : undefined}
              >
                <Pencil size={10} className="inline mr-1 opacity-60" />
                {statusLabels[document.status] ?? document.status}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
            <AlertDialogDescription>
              {`"${document.name}"`} será removido permanentemente, incluindo o arquivo no Storage.
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
