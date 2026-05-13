import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Invoice } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatMonth(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "MMMM yyyy", { locale: ptBR })
}

export function formatShortDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR })
}

export function formatDayMonth(isoDate: string): string {
  return `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`
}

export function buildUsedByCardId(invoices: Invoice[]): Map<string, number> {
  return invoices
    .filter((inv) => inv.status === "OPEN")
    .reduce((map, inv) => {
      map.set(inv.cardId, (map.get(inv.cardId) ?? 0) + inv.total)
      return map
    }, new Map<string, number>())
}

export function calculateFixedIncomeProjection(
  balance: number,
  rate: number,
  periods: ("eoy" | "1y" | "2y")[]
): Record<string, number> {
  const results: Record<string, number> = {}

  periods.forEach((period) => {
    const years = period === "eoy" ? 0.6667 : period === "1y" ? 1 : 2
    results[period] = balance * Math.pow(1 + rate / 100, years)
  })

  return results
}
