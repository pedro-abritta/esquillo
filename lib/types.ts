export type ExpenseCategory =
  | "ALIMENTACAO" | "TRANSPORTE" | "SAUDE" | "EDUCACAO" | "LAZER"
  | "MORADIA" | "UTILIDADES" | "TELEFONE" | "SEGUROS" | "DIVERSOS";

export type IRCategory =
  | "ALUGUEL" | "MATERIAL" | "EDUCACAO" | "SAUDE" | "DESPESAS_VIAGEM"
  | "PROFISSIONAL" | "OUTROS";

export type DocumentStatus = "PENDING" | "ORGANIZED" | "USED";
export type CardStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type InvoiceStatus = "OPEN" | "CLOSED" | "PAID";

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  cardId?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  limit: number;
  used: number;
  status: CardStatus;
  dueDay: number;
}

export interface Invoice {
  id: string;
  cardId: string;
  cardName: string;
  periodStart: string;
  periodEnd: string;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  installments?: number;
}

export interface Document {
  id: string;
  name: string;
  category: IRCategory;
  uploadedAt: string;
  size: number;
  status: DocumentStatus;
}

export interface User {
  id: string;
  email: string;
  name: string;
  cpf: string;
}
