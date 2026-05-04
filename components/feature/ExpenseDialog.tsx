"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { createExpense, createInstallmentGroup, updateExpense } from "@/lib/db/expenses";
import { getCreditCards } from "@/lib/db/credit-cards";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import type { Expense, CreditCard, ExpenseCategory, PaymentMethod } from "@/lib/types";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense;
  onSuccess: () => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "PIX", label: "PIX" },
  { value: "DEBITO", label: "Débito" },
  { value: "CREDITO", label: "Crédito" },
  { value: "BOLETO", label: "Boleto" },
];

const input = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-primary transition-colors";
const label = "text-xs text-gray-600 block mb-1";

export function ExpenseDialog({ open, onOpenChange, expense, onSuccess }: ExpenseDialogProps) {
  const isEditing = !!expense;

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("ALIMENTACAO");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [isDeductible, setIsDeductible] = useState(false);
  const [cardId, setCardId] = useState("");
  const [isInstallment, setIsInstallment] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState("2");
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCreditCards().then(setCards).catch(() => {});
  }, []);

  useEffect(() => {
    if (open) {
      if (expense) {
        setDescription(expense.description);
        setCategory(expense.category);
        setAmount(expense.amount.toString());
        setDate(expense.date);
        setPaymentMethod(expense.paymentMethod);
        setIsDeductible(expense.isDeductible);
        setCardId(expense.cardId ?? "");
        setIsInstallment(expense.isInstallment);
        setTotalInstallments(expense.totalInstallments?.toString() ?? "2");
      } else {
        setDescription("");
        setCategory("ALIMENTACAO");
        setAmount("");
        setDate(new Date().toISOString().slice(0, 10));
        setPaymentMethod("PIX");
        setIsDeductible(false);
        setCardId("");
        setIsInstallment(false);
        setTotalInstallments("2");
      }
      setError(null);
    }
  }, [expense, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const base = {
      description: description.trim(),
      category,
      amount: parseFloat(amount),
      date,
      paymentMethod,
      isDeductible,
      cardId: cardId || undefined,
    };

    try {
      if (isEditing && expense) {
        await updateExpense(expense.id, base);
      } else if (isInstallment) {
        await createInstallmentGroup(base, parseInt(totalInstallments));
      } else {
        await createExpense({ ...base, isInstallment: false });
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
          <DialogTitle>{isEditing ? "Editar despesa" : "Nova despesa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className={label}>Descrição</label>
            <input className={input} value={description} onChange={e => setDescription(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Categoria</label>
              <select className={input} value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)}>
                {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Pagamento</label>
              <select
                className={input}
                value={paymentMethod}
                onChange={e => {
                  const pm = e.target.value as PaymentMethod;
                  setPaymentMethod(pm);
                  if (pm !== "CREDITO") setCardId("");
                }}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Valor (R$)</label>
              <input type="number" step="0.01" min="0.01" className={input} value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Data</label>
              <input type="date" className={input} value={date} onChange={e => setDate(e.target.value)} required />
            </div>
          </div>

          {paymentMethod === "CREDITO" && cards.length > 0 && (
            <div>
              <label className={label}>Cartão</label>
              <select className={input} value={cardId} onChange={e => setCardId(e.target.value)}>
                <option value="">Sem cartão</option>
                {cards.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ••{c.lastFourDigits}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={isDeductible} onChange={e => setIsDeductible(e.target.checked)} className="accent-primary" />
              Dedutível no IR
            </label>
            {!isEditing && (
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={isInstallment} onChange={e => setIsInstallment(e.target.checked)} className="accent-primary" />
                Parcelado
              </label>
            )}
          </div>

          {isInstallment && !isEditing && (
            <div>
              <label className={label}>Número de parcelas</label>
              <input type="number" min="2" max="48" className={input} value={totalInstallments} onChange={e => setTotalInstallments(e.target.value)} />
            </div>
          )}

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
