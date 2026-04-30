import { Invoice } from "@/lib/types";
import { formatCurrency, formatShortDate, cn } from "@/lib/utils";

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CLOSED":
        return "bg-warning text-white";
      case "OPEN":
        return "bg-info text-white";
      case "PAID":
        return "bg-success text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CLOSED":
        return "Fechada";
      case "OPEN":
        return "Aberta";
      case "PAID":
        return "Paga";
      default:
        return status;
    }
  };

  return (
    <div className="p-4 bg-white border-thin border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-600 text-gray-900">{invoice.cardName}</h3>
          <p className="text-xs text-gray-500">
            {formatShortDate(invoice.periodStart)} até{" "}
            {formatShortDate(invoice.periodEnd)}
          </p>
        </div>
        <span
          className={cn(
            "text-xs font-500 px-2 py-1 rounded-full",
            getStatusColor(invoice.status)
          )}
        >
          {getStatusLabel(invoice.status)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Valor total</span>
          <span className="text-sm font-600 text-gray-900">
            {formatCurrency(invoice.total)}
          </span>
        </div>

        {invoice.installments && (
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Parcelas</span>
            <span className="text-sm font-600 text-gray-900">
              {invoice.installments}x
            </span>
          </div>
        )}

        <div className="flex justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-600">Vencimento</span>
          <span className="text-xs font-500 text-gray-900">
            {formatShortDate(invoice.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
