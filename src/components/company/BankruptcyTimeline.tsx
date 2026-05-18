import { FileText } from "lucide-react";
import { STAGE_LABELS, type BankruptcyEvent } from "@/lib/bankruptcy-mock";

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function BankruptcyTimeline({ events }: { events: BankruptcyEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {sorted.map((event, idx) => (
        <li key={event.id} className="relative">
          <span
            className={`absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-background ${
              idx === 0 ? "bg-destructive" : "bg-muted-foreground"
            }`}
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={event.date}>{dateFmt.format(new Date(event.date))}</time>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {STAGE_LABELS[event.stage]}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
            {event.description ? (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            ) : null}
            {event.document ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>{event.document}</span>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
