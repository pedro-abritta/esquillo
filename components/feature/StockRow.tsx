import { StockInvestment } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";

interface StockRowProps {
  stock: StockInvestment;
}

export function StockRow({ stock }: StockRowProps) {
  const daysAgo = differenceInDays(
    new Date(),
    parseISO(stock.updatedAt)
  );

  const isOutdated = daysAgo > 30;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-500 text-gray-900">
        {stock.ticker}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 text-right">
        {stock.quantity.toLocaleString("pt-BR")}
      </td>
      <td className="px-4 py-3 text-sm font-500 text-gray-900 text-right">
        {formatCurrency(stock.totalValue)}
      </td>
      <td className="px-4 py-3 text-sm text-right">
        <span className={`text-xs px-2 py-1 rounded-full ${
          isOutdated
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>
          {isOutdated ? `${daysAgo}d atrás` : "hoje"}
        </span>
      </td>
    </tr>
  );
}
