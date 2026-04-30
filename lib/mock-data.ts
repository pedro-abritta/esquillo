import { Expense, CreditCard, Invoice, Document, User, FixedIncomeInvestment, StockInvestment } from "./types";

export const mockUser: User = {
  id: "1",
  email: "reisapedro@gmail.com",
  name: "Pedro Abritta",
  cpf: "123.456.789-00",
};

export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    description: "Supermercado",
    category: "ALIMENTACAO",
    amount: 245.50,
    date: "2026-04-28",
  },
  {
    id: "exp-2",
    description: "Combustível",
    category: "TRANSPORTE",
    amount: 120.00,
    date: "2026-04-27",
    cardId: "card-1",
  },
  {
    id: "exp-3",
    description: "Consulta médica",
    category: "SAUDE",
    amount: 350.00,
    date: "2026-04-25",
  },
  {
    id: "exp-4",
    description: "Livro de TypeScript",
    category: "EDUCACAO",
    amount: 89.90,
    date: "2026-04-24",
    cardId: "card-2",
  },
  {
    id: "exp-5",
    description: "Cinema",
    category: "LAZER",
    amount: 50.00,
    date: "2026-04-23",
    cardId: "card-1",
  },
  {
    id: "exp-6",
    description: "Conta de luz",
    category: "UTILIDADES",
    amount: 280.00,
    date: "2026-04-20",
  },
  {
    id: "exp-7",
    description: "Plano celular",
    category: "TELEFONE",
    amount: 79.90,
    date: "2026-04-15",
  },
  {
    id: "exp-8",
    description: "Seguros residencial",
    category: "SEGUROS",
    amount: 450.00,
    date: "2026-04-10",
  },
];

export const mockCreditCards: CreditCard[] = [
  {
    id: "card-1",
    name: "Nubank",
    lastFourDigits: "1234",
    limit: 5000,
    used: 2450.50,
    status: "ACTIVE",
    dueDay: 15,
  },
  {
    id: "card-2",
    name: "Itaú",
    lastFourDigits: "5678",
    limit: 8000,
    used: 3890.90,
    status: "ACTIVE",
    dueDay: 20,
  },
  {
    id: "card-3",
    name: "Bradesco",
    lastFourDigits: "9012",
    limit: 3000,
    used: 0,
    status: "INACTIVE",
    dueDay: 10,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    cardId: "card-1",
    cardName: "Nubank",
    periodStart: "2026-03-15",
    periodEnd: "2026-04-14",
    total: 2450.50,
    status: "CLOSED",
    dueDate: "2026-04-20",
    installments: 1,
  },
  {
    id: "inv-2",
    cardId: "card-2",
    cardName: "Itaú",
    periodStart: "2026-03-20",
    periodEnd: "2026-04-19",
    total: 3890.90,
    status: "CLOSED",
    dueDate: "2026-04-25",
    installments: 1,
  },
  {
    id: "inv-3",
    cardId: "card-1",
    cardName: "Nubank",
    periodStart: "2026-04-15",
    periodEnd: "2026-05-14",
    total: 0,
    status: "OPEN",
    dueDate: "2026-05-20",
  },
];

export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Recibo aluguel - Março 2026",
    category: "ALUGUEL",
    uploadedAt: "2026-04-01",
    size: 1024 * 256,
    status: "ORGANIZED",
  },
  {
    id: "doc-2",
    name: "Nota fiscal - Material escritório",
    category: "MATERIAL",
    uploadedAt: "2026-04-10",
    size: 1024 * 512,
    status: "ORGANIZED",
  },
  {
    id: "doc-3",
    name: "Recibo curso online",
    category: "EDUCACAO",
    uploadedAt: "2026-04-15",
    size: 1024 * 128,
    status: "PENDING",
  },
  {
    id: "doc-4",
    name: "Recibos médicos - Abril",
    category: "SAUDE",
    uploadedAt: "2026-04-20",
    size: 1024 * 384,
    status: "ORGANIZED",
  },
  {
    id: "doc-5",
    name: "Passagens aéreas - São Paulo",
    category: "DESPESAS_VIAGEM",
    uploadedAt: "2026-04-22",
    size: 1024 * 640,
    status: "PENDING",
  },
];

export const mockFixedIncomeInvestments: FixedIncomeInvestment[] = [
  {
    id: "inv-fixed-1",
    name: "CDB Banco Inter",
    type: "CDB",
    balance: 25000.00,
    contractedRate: 11.0,
    maturityDate: "2027-04-29",
    updatedAt: "2026-04-28",
  },
  {
    id: "inv-fixed-2",
    name: "Tesouro Selic 2027",
    type: "TESOURO",
    balance: 15000.00,
    contractedRate: 10.5,
    maturityDate: "2027-12-31",
    updatedAt: "2026-04-27",
  },
  {
    id: "inv-fixed-3",
    name: "LCI Itaú",
    type: "LCI",
    balance: 10000.00,
    contractedRate: 10.0,
    maturityDate: "2028-04-29",
    updatedAt: "2026-03-15",
  },
];

export const mockStockInvestments: StockInvestment[] = [
  {
    id: "inv-stock-1",
    ticker: "VALE3",
    quantity: 100,
    totalValue: 4850.00,
    updatedAt: "2026-04-29",
  },
  {
    id: "inv-stock-2",
    ticker: "PETR4",
    quantity: 150,
    totalValue: 7650.00,
    updatedAt: "2026-04-28",
  },
  {
    id: "inv-stock-3",
    ticker: "ITUB4",
    quantity: 50,
    totalValue: 3200.00,
    updatedAt: "2026-04-25",
  },
];
