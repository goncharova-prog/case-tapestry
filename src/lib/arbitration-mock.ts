export type ArbitrationRole = "plaintiff" | "defendant" | "third_party";
export type ArbitrationOutcome = "won" | "lost" | "settled" | "pending";

export interface ArbitrationCase {
  id: string;
  year: number;
  role: ArbitrationRole;
  outcome: ArbitrationOutcome;
  amount: number; // RUB
  caseNumber: string;
  court: string;
}

export const ROLE_LABELS: Record<ArbitrationRole, string> = {
  plaintiff: "Истец",
  defendant: "Ответчик",
  third_party: "Третье лицо",
};

export const OUTCOME_LABELS: Record<ArbitrationOutcome, string> = {
  won: "Выиграно",
  lost: "Проиграно",
  settled: "Мировое",
  pending: "В процессе",
};

// Deterministic mock generator
function gen(): ArbitrationCase[] {
  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  const roles: ArbitrationRole[] = ["plaintiff", "defendant", "third_party"];
  const outcomes: ArbitrationOutcome[] = ["won", "lost", "settled", "pending"];
  const courts = [
    "АС г. Москвы",
    "АС Московской области",
    "АС г. Санкт-Петербурга",
    "АС Свердловской области",
  ];
  const out: ArbitrationCase[] = [];
  let seed = 1;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  years.forEach((y) => {
    const count = 4 + Math.floor(rnd() * 8);
    for (let i = 0; i < count; i++) {
      const role = roles[Math.floor(rnd() * roles.length)];
      const outcome =
        role === "third_party"
          ? "pending"
          : outcomes[Math.floor(rnd() * outcomes.length)];
      out.push({
        id: `${y}-${i}`,
        year: y,
        role,
        outcome,
        amount: Math.round((rnd() * 50_000_000 + 500_000) / 1000) * 1000,
        caseNumber: `А40-${10000 + Math.floor(rnd() * 89999)}/${y}`,
        court: courts[Math.floor(rnd() * courts.length)],
      });
    }
  });
  return out;
}

export const mockArbitration: ArbitrationCase[] = gen();
