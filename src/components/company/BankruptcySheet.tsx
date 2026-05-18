import { Gavel, UserCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { STAGE_LABELS, type BankruptcyCase } from "@/lib/bankruptcy-mock";
import { BankruptcyTimeline } from "./BankruptcyTimeline";

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const moneyFmt = new Intl.NumberFormat("ru-RU");

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: BankruptcyCase;
  companyName: string;
}

export function BankruptcySheet({ open, onOpenChange, data, companyName }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden p-0 sm:max-w-[560px]">
        <SheetHeader className="space-y-2 border-b border-border px-6 py-5">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-destructive" />
            <SheetTitle>Банкротное дело</SheetTitle>
            <Badge variant="destructive" className="ml-auto">
              {STAGE_LABELS[data.status]}
            </Badge>
          </div>
          <SheetDescription>{companyName}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-92px)]">
          <div className="space-y-6 px-6 py-6">
            <section className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Номер дела" value={data.caseNumber} />
              <Field label="Суд" value={data.court} />
              <Field label="Дата возбуждения" value={dateFmt.format(new Date(data.filedAt))} />
              <Field
                label="Текущая стадия с"
                value={dateFmt.format(new Date(data.stageStartedAt))}
              />
            </section>

            <Separator />

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                Арбитражный управляющий
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                <div className="font-medium text-foreground">{data.manager.fullName}</div>
                <div className="text-muted-foreground">{data.manager.sro}</div>
                {data.manager.contact ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {data.manager.contact}
                  </div>
                ) : null}
              </div>
            </section>

            {data.creditors ? (
              <section className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Кредиторы
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <Stat label="Кредиторов" value={String(data.creditors.count)} />
                  <Stat
                    label="Сумма требований"
                    value={`${moneyFmt.format(data.creditors.totalClaims)} ₽`}
                  />
                  <Stat
                    label="Реестр закрыт"
                    value={
                      data.creditors.registryClosedAt
                        ? dateFmt.format(new Date(data.creditors.registryClosedAt))
                        : "—"
                    }
                  />
                </div>
              </section>
            ) : null}

            <Separator />

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Хронология событий</h3>
              <BankruptcyTimeline events={data.events} />
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
