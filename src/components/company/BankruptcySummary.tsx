import { AlertTriangle, ChevronDown, ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STAGE_LABELS, type BankruptcyCase } from "@/lib/bankruptcy-mock";

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

interface Props {
  data?: BankruptcyCase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BankruptcySummary({ data, onOpenTimeline }: Props) {
  if (!data || data.status === "none") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span className="text-foreground">Признаков банкротства не выявлено</span>
      </div>
    );
  }

  const lastEvent = [...data.events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <span className="text-sm font-semibold text-foreground">Банкротство</span>
        <Badge variant="destructive">{STAGE_LABELS[data.status]}</Badge>
        <span className="text-xs text-muted-foreground">
          {data.caseNumber} · {data.court}
        </span>
      </div>

      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-start gap-2 text-muted-foreground">
          <UserCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-xs">Арбитражный управляющий</div>
            <div className="text-foreground">{data.manager.fullName}</div>
            <div className="text-xs">{data.manager.sro}</div>
          </div>
        </div>
        {lastEvent ? (
          <div className="text-muted-foreground">
            <div className="text-xs">Последнее событие</div>
            <div className="text-foreground">{lastEvent.title}</div>
            <div className="text-xs">{dateFmt.format(new Date(lastEvent.date))}</div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenTimeline}
          aria-label="Открыть подробную хронологию банкротства"
        >
          Открыть хронологию
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
