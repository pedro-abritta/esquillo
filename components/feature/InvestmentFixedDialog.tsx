"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { createFixedInvestment, updateFixedInvestment } from "@/lib/db/investments";
import type { FixedIncomeInvestment, FixedIncomeType } from "@/lib/types";

interface InvestmentFixedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment?: FixedIncomeInvestment;
  onSuccess: () => void;
}

const TYPES: { value: FixedIncomeType; label: string }[] = [
  { value: "CDB", label: "CDB" },
  { value: "TESOURO", label: "Tesouro Direto" },
  { value: "LCI", label: "LCI" },
  { value: "LCA", label: "LCA" },
  { value: "CAIXINHA", label: "Caixinha" },
];

const input = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-primary transition-colors";
const label = "text-xs text-gray-600 block mb-1";

export function InvestmentFixedDialog({ open, onOpenChange, investment, onSuccess }: InvestmentFixedDialogProps) {
  const isEditing = !!investment;

  const [name, setName] = useState("");
  const [type, setType] = useState<FixedIncomeType>("CDB");
  const [balance, setBalance] = useState("");
  const [contractedRate, setContractedRate] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [balanceUpdatedAt, setBalanceUpdatedAt] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (investment) {
        setName(investment.name);
        setType(investment.type);
        setBalance(investment.balance.toString());
        setContractedRate(investment.contractedRate.toString());
        setMaturityDate(investment.maturityDate);
        setBalanceUpdatedAt(investment.balanceUpdatedAt);
      } else {
        setName("");
        setType("CDB");
        setBalance("");
        setContractedRate("");
        setMaturityDate("");
        setBalanceUpdatedAt(new Date().toISOString().slice(0, 10));
      }
      setError(null);
    }
  }, [investment, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = {
      name: name.trim(),
      type,
      balance: parseFloat(balance),
      contractedRate: parseFloat(contractedRate),
      maturityDate,
      balanceUpdatedAt,
    };

    try {
      if (isEditing && investment) {
        await updateFixedInvestment(investment.id, data);
      } else {
        await createFixedInvestment(data);
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
          <DialogTitle>{isEditing ? "Editar renda fixa" : "Nova renda fixa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className={label}>Nome</label>
            <input className={input} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: CDB Banco Inter" required />
          </div>

          <div>
            <label className={label}>Tipo</label>
            <select className={input} value={type} onChange={e => setType(e.target.value as FixedIncomeType)}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Saldo atual (R$)</label>
              <input type="number" step="0.01" min="0" className={input} value={balance} onChange={e => setBalance(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Taxa contratada (% a.a.)</label>
              <input type="number" step="0.01" min="0" className={input} value={contractedRate} onChange={e => setContractedRate(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Vencimento</label>
              <input type="date" className={input} value={maturityDate} onChange={e => setMaturityDate(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Saldo atualizado em</label>
              <input type="date" className={input} value={balanceUpdatedAt} onChange={e => setBalanceUpdatedAt(e.target.value)} required />
            </div>
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
