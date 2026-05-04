"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { createCreditCard, updateCreditCard } from "@/lib/db/credit-cards";
import type { CreditCard, CardStatus } from "@/lib/types";

interface CreditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: CreditCard;
  onSuccess: () => void;
}

const input = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-primary transition-colors";
const label = "text-xs text-gray-600 block mb-1";

export function CreditCardDialog({ open, onOpenChange, card, onSuccess }: CreditCardDialogProps) {
  const isEditing = !!card;

  const [name, setName] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [limit, setLimit] = useState("");
  const [closingDay, setClosingDay] = useState("10");
  const [dueDay, setDueDay] = useState("17");
  const [status, setStatus] = useState<CardStatus>("ACTIVE");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (card) {
        setName(card.name);
        setLastFourDigits(card.lastFourDigits);
        setLimit(card.limit.toString());
        setClosingDay(card.closingDay.toString());
        setDueDay(card.dueDay.toString());
        setStatus(card.status);
      } else {
        setName("");
        setLastFourDigits("");
        setLimit("");
        setClosingDay("10");
        setDueDay("17");
        setStatus("ACTIVE");
      }
      setError(null);
    }
  }, [card, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const input_data = {
      name: name.trim(),
      lastFourDigits: lastFourDigits.trim(),
      limit: parseFloat(limit),
      used: card?.used ?? 0,
      closingDay: parseInt(closingDay),
      dueDay: parseInt(dueDay),
      status,
    };

    try {
      if (isEditing && card) {
        await updateCreditCard(card.id, input_data);
      } else {
        await createCreditCard(input_data);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar cartão" : "Novo cartão"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className={label}>Nome do cartão</label>
            <input className={input} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Nubank, Itaú..." required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Últimos 4 dígitos</label>
              <input
                className={input}
                value={lastFourDigits}
                onChange={e => setLastFourDigits(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                placeholder="0000"
              />
            </div>
            <div>
              <label className={label}>Limite (R$)</label>
              <input type="number" step="0.01" min="0" className={input} value={limit} onChange={e => setLimit(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Fechamento (dia)</label>
              <input type="number" min="1" max="31" className={input} value={closingDay} onChange={e => setClosingDay(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Vencimento (dia)</label>
              <input type="number" min="1" max="31" className={input} value={dueDay} onChange={e => setDueDay(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className={label}>Status</label>
            <select className={input} value={status} onChange={e => setStatus(e.target.value as CardStatus)}>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
              <option value="BLOCKED">Bloqueado</option>
            </select>
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
