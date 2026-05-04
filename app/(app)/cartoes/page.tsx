"use client";

import { Header } from "@/components/shared/Header";
import { CardItem } from "@/components/feature/CardItem";
import { InvoiceCard } from "@/components/feature/InvoiceCard";
import { CreditCardDialog } from "@/components/feature/CreditCardDialog";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getCreditCards } from "@/lib/db/credit-cards";
import { getInvoices } from "@/lib/db/invoices";
import type { CreditCard, Invoice } from "@/lib/types";

export default function Cartoes() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>();

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getCreditCards(), getInvoices()])
      .then(([c, i]) => { setCards(c); setInvoices(i); })
      .catch(() => setError("Erro ao carregar dados."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const totalLimit = cards.reduce((sum, card) => sum + card.limit, 0);
  const totalUsed = cards.reduce((sum, card) => sum + card.used, 0);
  const activeCards = cards.filter((card) => card.status === "ACTIVE");

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Cartões de Crédito" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Cartões de Crédito" />
        <p className="text-sm text-danger text-center mt-16">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Cartões de Crédito" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Limite total</p>
              <h3 className="text-2xl font-600 text-gray-900">{formatCurrency(totalLimit)}</h3>
            </div>
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Utilizado</p>
              <h3 className="text-2xl font-600 text-gray-900">{formatCurrency(totalUsed)}</h3>
            </div>
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Disponível</p>
              <h3 className="text-2xl font-600 text-gray-900">{formatCurrency(totalLimit - totalUsed)}</h3>
            </div>
          </div>

          {/* Cards Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-600 text-gray-900">Seus cartões</h2>
              <button
                onClick={() => { setEditingCard(undefined); setDialogOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-500"
              >
                <Plus size={16} />
                Novo cartão
              </button>
            </div>

            {cards.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {cards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    onEdit={() => { setEditingCard(card); setDialogOpen(true); }}
                    onDelete={refresh}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum cartão cadastrado.</p>
            )}
          </div>

          {/* Invoices */}
          {invoices.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-600 text-gray-900">Faturas</h2>
              <div className="grid grid-cols-2 gap-4">
                {invoices.map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
              </div>
            </div>
          )}

          {/* Active Cards Detail */}
          {activeCards.length > 0 && (
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <h2 className="text-sm font-600 text-gray-900 mb-4">Detalhes dos cartões ativos</h2>
              <div className="space-y-4">
                {activeCards.map((card) => (
                  <div key={card.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-600 text-gray-900">{card.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Fechamento: dia {card.closingDay} · Vencimento: dia {card.dueDay}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-600 text-gray-900">{formatCurrency(card.limit - card.used)}</p>
                      <p className="text-xs text-gray-500">disponível</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <CreditCardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        card={editingCard}
        onSuccess={refresh}
      />
    </div>
  );
}
