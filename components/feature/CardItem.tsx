import { CreditCard } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

interface CardItemProps {
  card: CreditCard;
}

export function CardItem({ card }: CardItemProps) {
  const percentage = (card.used / card.limit) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success text-white";
      case "INACTIVE":
        return "bg-gray-200 text-gray-700";
      case "BLOCKED":
        return "bg-danger text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Ativo";
      case "INACTIVE":
        return "Inativo";
      case "BLOCKED":
        return "Bloqueado";
      default:
        return status;
    }
  };

  return (
    <div className="p-4 bg-white border-thin border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-600 text-gray-900">{card.name}</h3>
          <p className="text-xs text-gray-500">•••• {card.lastFourDigits}</p>
        </div>
        <span
          className={cn(
            "text-xs font-500 px-2 py-1 rounded-full",
            getStatusColor(card.status)
          )}
        >
          {getStatusLabel(card.status)}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600">Limite utilizado</span>
            <span className="text-xs font-600 text-gray-900">
              {percentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-600">Usado</p>
            <p className="text-sm font-600 text-gray-900">
              {formatCurrency(card.used)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Limite</p>
            <p className="text-sm font-600 text-gray-900">
              {formatCurrency(card.limit)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
