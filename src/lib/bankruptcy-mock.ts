export type BankruptcyStage =
  | "none"
  | "monitoring"
  | "financial_recovery"
  | "external_management"
  | "bankruptcy_proceedings"
  | "completed"
  | "terminated";

export interface BankruptcyEvent {
  id: string;
  date: string; // ISO
  stage: BankruptcyStage;
  title: string;
  description?: string;
  document?: string;
}

export interface BankruptcyManager {
  fullName: string;
  sro: string;
  contact?: string;
}

export interface BankruptcyCase {
  status: BankruptcyStage;
  caseNumber: string;
  court: string;
  filedAt: string;
  stageStartedAt: string;
  manager: BankruptcyManager;
  creditors?: {
    count: number;
    totalClaims: number;
    registryClosedAt?: string;
  };
  events: BankruptcyEvent[];
}

export interface Company {
  shortName: string;
  fullName: string;
  city: string;
  inn: string;
  kpp: string;
  ogrn: string;
  okved: string;
  address: string;
  ceo: string;
  active: boolean;
  bankruptcy?: BankruptcyCase;
  valuation: {
    comparative: string;
    income: string;
    cost: string;
  };
}

export const STAGE_LABELS: Record<BankruptcyStage, string> = {
  none: "Без признаков банкротства",
  monitoring: "Наблюдение",
  financial_recovery: "Финансовое оздоровление",
  external_management: "Внешнее управление",
  bankruptcy_proceedings: "Конкурсное производство",
  completed: "Завершено",
  terminated: "Прекращено",
};

export const mockCompany: Company = {
  shortName: "ПАО СБЕРБАНК",
  fullName: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "СБЕРБАНК РОССИИ"',
  city: "Москва",
  inn: "7707083893",
  kpp: "773601001",
  ogrn: "1027700132195",
  okved: "64.19",
  address: "117312, г Москва, Академический р-н, ул Вавилова, д 19",
  ceo: "Греф Герман Оскарович",
  active: true,
  valuation: {
    comparative: "8 166 255,9 млн ₽",
    income: "8 166 255,9 млн ₽",
    cost: "8 166 255,9 млн ₽",
  },
  bankruptcy: {
    status: "bankruptcy_proceedings",
    caseNumber: "А40-123456/2024",
    court: "Арбитражный суд г. Москвы",
    filedAt: "2024-06-14",
    stageStartedAt: "2025-09-22",
    manager: {
      fullName: "Иванов Иван Иванович",
      sro: 'Ассоциация СРО "Меркурий"',
      contact: "ivanov@example.ru",
    },
    creditors: {
      count: 47,
      totalClaims: 1_240_500_000,
      registryClosedAt: "2025-11-22",
    },
    events: [
      {
        id: "e1",
        date: "2024-06-14",
        stage: "monitoring",
        title: "Принято заявление о признании должника банкротом",
        description: "Заявление подано кредитором ООО «АльфаТрейд».",
        document: "Определение от 14.06.2024",
      },
      {
        id: "e2",
        date: "2024-07-30",
        stage: "monitoring",
        title: "Введена процедура наблюдения",
        description: "Временный управляющий — Петров П.П.",
        document: "Определение от 30.07.2024",
      },
      {
        id: "e3",
        date: "2025-02-10",
        stage: "monitoring",
        title: "Первое собрание кредиторов",
        description: "Принято решение о переходе к конкурсному производству.",
      },
      {
        id: "e4",
        date: "2025-09-22",
        stage: "bankruptcy_proceedings",
        title: "Открыто конкурсное производство",
        description: "Утверждён конкурсный управляющий Иванов И.И.",
        document: "Решение от 22.09.2025",
      },
      {
        id: "e5",
        date: "2026-03-12",
        stage: "bankruptcy_proceedings",
        title: "Определение о включении требований в реестр",
        description: "Включены требования на сумму 312,4 млн ₽.",
        document: "Определение от 12.03.2026",
      },
    ],
  },
};
