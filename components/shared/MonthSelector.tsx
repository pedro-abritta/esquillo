"use client";

import { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth } from "@/lib/utils";

interface MonthSelectorProps {
  onChange?: (date: Date) => void;
}

export function MonthSelector({ onChange }: MonthSelectorProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevious = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    onChange?.(newDate);
  };

  const handleNext = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onChange?.(newDate);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePrevious}
        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Mês anterior"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>

      <span className="text-sm font-500 text-gray-900 w-32 text-center capitalize">
        {formatMonth(currentDate)}
      </span>

      <button
        onClick={handleNext}
        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Próximo mês"
      >
        <ChevronRight size={20} className="text-gray-700" />
      </button>
    </div>
  );
}
