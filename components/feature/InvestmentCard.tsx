import { FixedIncomeInvestment } from "@/lib/types";
import { formatCurrency, calculateFixedIncomeProjection } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";

interface InvestmentCardProps {
  investment: FixedIncomeInvestment;
}

export function InvestmentCard({ investment }: InvestmentCardProps) {
  const projections = calculateFixedIncomeProjection(
    investment.balance,
    investment.contractedRate,
    ["eoy", "1y", "2y"]
  );

  const daysAgo = differenceInDays(
    new Date(),
    parseISO(investment.updatedAt)
  );

  const isOutdated = daysAgo > 30;
  const statusLabel = isOutdated
    ? `desatualizado há ${daysAgo}d`
    : `atualizado há ${daysAgo}d`;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-500 text-sm text-gray-900">{investment.name}</h3>
          <p className="text-xs text-gray-500">{investment.type}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isOutdated
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>
          {statusLabel}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-600 text-primary">
          {formatCurrency(investment.balance)}
        </p>
        <p className="text-xs text-gray-500">
          Taxa: {investment.contractedRate.toFixed(2)}% a.a.
        </p>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-500 text-gray-700 mb-2">Projeções</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-500">Até dez/26</p>
            <p className="text-sm font-500 text-gray-900">
              {formatCurrency(projections.eoy)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">+1 ano</p>
            <p className="text-sm font-500 text-gray-900">
              {formatCurrency(projections["1y"])}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">+2 anos</p>
            <p className="text-sm font-500 text-gray-900">
              {formatCurrency(projections["2y"])}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
