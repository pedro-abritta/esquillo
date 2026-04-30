"use client";

import { ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-thin border-b border-gray-200 flex items-center justify-between px-8">
      <h2 className="text-lg font-600 text-gray-900">{title}</h2>

      <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
        <span className="text-sm text-gray-700">Pedro Abritta</span>
        <ChevronDown size={16} className="text-gray-700" />
      </button>
    </header>
  );
}
