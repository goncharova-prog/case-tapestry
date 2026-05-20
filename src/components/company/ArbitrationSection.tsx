import { useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChevronDown, Scale, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ROLE_LABELS,
  OUTCOME_LABELS,
  type ArbitrationCase,
  type ArbitrationRole,
} from "@/lib/arbitration-mock";

const moneyFmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });
const formatMoney = (v: number) => {
  if (v >= 1_000_000_000) return `${moneyFmt.format(v / 1_000_000_000)} млрд ₽`;
  if (v >= 1_000_000) return `${moneyFmt.format(v / 1_000_000)} млн ₽`;
  if (v >= 1_000) return `${moneyFmt.format(v / 1_000)} тыс ₽`;
  return `${v} ₽`;
};

const ROLE_COLORS: Record<ArbitrationRole, string> = {
  plaintiff: "hsl(142 71% 45%)",
  defendant: "hsl(0 72% 51%)",
  third_party: "hsl(217 91% 60%)",
};

interface Props {
  cases: ArbitrationCase[];
}

export function ArbitrationSection({ cases }: Props) {
  const maxYear = useMemo(
    () => cases.reduce((m, c) => Math.max(m, c.year), 0),
    [cases],
  );
  const [range, setRange] = useState<"1" | "2" | "3" | "4" | "5">("3");
  const [open, setOpen] = useState(true);

  const filtered = useMemo(() => {
    const span = Number(range);
    return cases.filter((c) => c.year > maxYear - span);
  }, [cases, range, maxYear]);

  const byRole = useMemo(() => {
    const acc: Record<ArbitrationRole, number> = {
      plaintiff: 0,
      defendant: 0,
      third_party: 0,
    };
    filtered.forEach((c) => (acc[c.role] += 1));
    return acc;
  }, [filtered]);

  const total = filtered.length;

  const wonSum = useMemo(
    () =>
      filtered
        .filter((c) => c.outcome === "won" && c.role === "plaintiff")
        .reduce((s, c) => s + c.amount, 0),
    [filtered],
  );
  const lostSum = useMemo(
    () =>
      filtered
        .filter((c) => c.outcome === "lost" && c.role === "defendant")
        .reduce((s, c) => s + c.amount, 0),
    [filtered],
  );

  const pieData = (["plaintiff", "defendant", "third_party"] as ArbitrationRole[])
    .map((r) => ({ name: ROLE_LABELS[r], value: byRole[r], role: r }))
    .filter((d) => d.value > 0);

  const recent = useMemo(
    () => [...filtered].sort((a, b) => b.year - a.year).slice(0, 5),
    [filtered],
  );

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 h-auto gap-2 px-2 py-1 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <Scale className="h-4 w-4" />
              Арбитражные дела
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <Badge variant="secondary">{total} дел</Badge>
          {open ? (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Период:</span>
              <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Последний 1 год</SelectItem>
                  <SelectItem value="2">Последние 2 года</SelectItem>
                  <SelectItem value="3">Последние 3 года</SelectItem>
                  <SelectItem value="4">Последние 4 года</SelectItem>
                  <SelectItem value="5">Последние 5 лет</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>

        <CollapsibleContent className="space-y-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <StatRow
                color={ROLE_COLORS.plaintiff}
                icon={<TrendingUp className="h-4 w-4" />}
                label="Истец"
                count={byRole.plaintiff}
                total={total}
              />
              <StatRow
                color={ROLE_COLORS.defendant}
                icon={<TrendingDown className="h-4 w-4" />}
                label="Ответчик"
                count={byRole.defendant}
                total={total}
              />
              <StatRow
                color={ROLE_COLORS.third_party}
                icon={<Users className="h-4 w-4" />}
                label="Третье лицо"
                count={byRole.third_party}
                total={total}
              />

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <div className="text-xs text-muted-foreground">Сумма выигранных</div>
                  <div className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {formatMoney(wonSum)}
                  </div>
                </div>
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <div className="text-xs text-muted-foreground">Сумма проигранных</div>
                  <div className="mt-1 text-sm font-semibold text-destructive">
                    {formatMoney(lostSum)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-1 text-xs text-muted-foreground">
                Распределение дел по роли
              </div>
              {pieData.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                  Нет данных за выбранный период
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {pieData.map((d) => (
                        <Cell key={d.role} fill={ROLE_COLORS[d.role]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => [`${v} дел`, ""]}
                      contentStyle={{
                        background: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={28}
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {recent.length > 0 ? (
            <div className="rounded-lg border border-border">
              <div className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
                Последние дела
              </div>
              <ul className="divide-y divide-border">
                {recent.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center gap-2 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-foreground">{c.caseNumber}</span>
                    <span className="text-xs text-muted-foreground">{c.court}</span>
                    <Badge variant="outline" className="ml-auto">
                      {ROLE_LABELS[c.role]}
                    </Badge>
                    <Badge
                      variant={
                        c.outcome === "won"
                          ? "default"
                          : c.outcome === "lost"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {OUTCOME_LABELS[c.outcome]}
                    </Badge>
                    <span className="w-28 text-right text-xs text-foreground">
                      {formatMoney(c.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
  );
}

function StatRow({
  color,
  icon,
  label,
  count,
  total,
}: {
  color: string;
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-md text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground">
            {count} · {pct}%
          </span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}
