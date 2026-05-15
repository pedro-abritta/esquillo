"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { createRecurringTemplate, updateRecurringTemplate } from "@/lib/db/recurring-templates";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import type { RecurringTemplate, RecurringType, CreditCard, ExpenseCategory, IncomeCategory, PaymentMethod } from "@/lib/types";

interface RecurringTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: RecurringTemplate;
  defaultType: RecurringType;
  cards: CreditCard[];
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

export function RecurringTemplateDialog({
  open,
  onOpenChange,
  template,
  defaultType,
  cards,
  onSuccess,
}: RecurringTemplateDialogProps) {
  const isEditing = !!template;
  const type = template?.type ?? defaultType;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [cardId, setCardId] = useState("");
  const [isDeductible, setIsDeductible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultCategory = type === "expense"
    ? (Object.keys(EXPENSE_CATEGORIES)[0] as ExpenseCategory)
    : (Object.keys(INCOME_CATEGORIES)[0] as IncomeCategory);

  useEffect(() => {
    if (open) {
      if (template) {
        setDescription(template.description);
        setAmount(template.amount.toString());
        setDayOfMonth(template.dayOfMonth.toString());
        setCategory(template.category);
        setPaymentMethod(template.paymentMethod ?? "PIX");
        setCardId(template.cardId ?? "");
        setIsDeductible(template.isDeductible);
      } else {
        setDescription("");
        setAmount("");
        setDayOfMonth("1");
        setCategory(defaultCategory);
        setPaymentMethod("PIX");
        setCardId("");
        setIsDeductible(false);
      }
      setError(null);
    }
  }, [template, open, defaultCategory]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    const parsedDay = parseInt(dayOfMonth);

    if (!description.trim()) {
      setError("Descrição é obrigatória.");
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Valor deve ser maior que zero.");
      return;
    }
    if (!parsedDay || parsedDay < 1 || parsedDay > 31) {
      setError("Dia deve estar entre 1 e 31.");
      return;
    }
    if (!category) {
      setError("Selecione uma categoria.");
      return;
    }
    if (type === "expense" && paymentMethod === "CREDITO" && !cardId) {
      setError("Selecione um cartão para despesas no crédito.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type,
        description: description.trim(),
        category,
        amount: parsedAmount,
        dayOfMonth: parsedDay,
        ...(type === "expense" && {
          paymentMethod,
          cardId: paymentMethod === "CREDITO" ? cardId : undefined,
          isDeductible,
        }),
      };

      if (isEditing && template) {
        await updateRecurringTemplate(template.id, payload);
      } else {
        await createRecurringTemplate(payload);
      }
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  const categoryOptions = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const typeLabel = type === "expense" ? "despesa" : "renda";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar template" : `Novo template de ${typeLabel}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className={label}>Descrição</label>
            <input
              className={input}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={type === "expense" ? "Ex: Aluguel" : "Ex: Salário"}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className={input}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={label}>Dia do mês</label>
              <input
                type="number"
                min="1"
                max="31"
                className={input}
                value={dayOfMonth}
                onChange={e => setDayOfMonth(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className={label}>Categoria</label>
            <select
              className={input}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {Object.entries(categoryOptions).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {type === "expense" && (
            <>
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

              {paymentMethod === "CREDITO" && cards.length > 0 && (
                <div>
                  <label className={label}>Cartão</label>
                  <select
                    className={input}
                    value={cardId}
                    onChange={e => setCardId(e.target.value)}
                  >
                    <option value="">Selecione um cartão</option>
                    {cards.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ••{c.lastFourDigits}</option>
                    ))}
                  </select>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeductible}
                  onChange={e => setIsDeductible(e.target.checked)}
                  className="accent-primary"
                />
                Dedutível no IR
              </label>
            </>
          )}

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
