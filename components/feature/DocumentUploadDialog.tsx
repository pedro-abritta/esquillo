"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { uploadDocument } from "@/lib/db/documents";
import { IR_CATEGORIES } from "@/lib/constants";
import type { IRCategory } from "@/lib/types";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const input = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-primary transition-colors";
const label = "text-xs text-gray-600 block mb-1";

export function DocumentUploadDialog({ open, onOpenChange, onSuccess }: DocumentUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<IRCategory>("ALUGUEL");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!name) setName(f.name.replace(/\.pdf$/i, ""));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError("Selecione um arquivo PDF."); return; }
    setSubmitting(true);
    setError(null);

    try {
      await uploadDocument(file, { name: name.trim() || file.name, category });
      onOpenChange(false);
      setFile(null);
      setName("");
      setCategory("ALUGUEL");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload de documento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className={label}>Arquivo PDF</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-gray-200 file:text-xs file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className={label}>Nome do documento</label>
            <input className={input} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Recibo aluguel março 2026" />
          </div>

          <div>
            <label className={label}>Categoria</label>
            <select className={input} value={category} onChange={e => setCategory(e.target.value as IRCategory)}>
              {Object.entries(IR_CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={submitting || !file} className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">
              {submitting ? "Enviando..." : "Upload"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
