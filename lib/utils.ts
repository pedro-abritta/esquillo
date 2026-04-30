import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

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
