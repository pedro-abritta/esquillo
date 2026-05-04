export type ExpenseCategory =
  | "ALIMENTACAO" | "TRANSPORTE" | "SAUDE" | "EDUCACAO" | "LAZER"
  | "MORADIA" | "UTILIDADES" | "TELEFONE" | "SEGUROS" | "DIVERSOS";

export type IRCategory =
  | "ALUGUEL" | "MATERIAL" | "EDUCACAO" | "SAUDE" | "DESPESAS_VIAGEM"
  | "PROFISSIONAL" | "OUTROS";

export type DocumentStatus = "PENDING" | "ORGANIZED" | "USED";
export type CardStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type InvoiceStatus = "OPEN" | "CLOSED" | "PAID";
export type FixedIncomeType = "CDB" | "TESOURO" | "LCI" | "LCA" | "CAIXINHA";
export type PaymentMethod = "PIX" | "DEBITO" | "CREDITO" | "BOLETO";

export interface Category {
  id: string;
  key: string;
  label: string;
  color: string;
  icon: string;
  irCategory?: string;
}

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  isDeductible: boolean;
  cardId?: string;
  isInstallment: boolean;
  installmentNumber?: number;
  totalInstallments?: number;
  installmentGroupId?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  limit: number;
  used: number;
  status: CardStatus;
  closingDay: number;
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
}

export interface Document {
  id: string;
  name: string;
  category: IRCategory;
  uploadedAt: string;
  size: number;
  status: DocumentStatus;
  storagePath?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  cpf: string;
}

export interface FixedIncomeInvestment {
  id: string;
  name: string;
  type: FixedIncomeType;
  balance: number;
  contractedRate: number;
  maturityDate: string;
  balanceUpdatedAt: string;
}

export interface StockInvestment {
  id: string;
  ticker: string;
  quantity: number;
  totalValue: number;
  balanceUpdatedAt: string;
}

export interface RecurringTemplate {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  cardId?: string;
  isDeductible: boolean;
  dayOfMonth: number;
  active: boolean;
}

export interface DbError {
  message: string;
}
