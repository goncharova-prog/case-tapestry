import { useState } from "react";
import {
  Building2,
  Calculator,
  Calendar,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Hash,
  IdCard,
  MapPin,
  TrendingUp,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Company } from "@/lib/bankruptcy-mock";
import { mockArbitration } from "@/lib/arbitration-mock";
import { ArbitrationSection } from "./ArbitrationSection";
import { BankruptcyDetails } from "./BankruptcyDetails";
import { BankruptcySummary } from "./BankruptcySummary";

interface Props {
  company: Company;
}

export function CompanyCard({ company }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-border p-6 shadow-sm">
      <header className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-foreground">{company.shortName}</span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {company.city}
        </span>
        {company.active ? (
          <Badge
            variant="outline"
            className="ml-auto border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            Компания активна
          </Badge>
        ) : (
          <Badge variant="destructive" className="ml-auto">
            Компания неактивна
          </Badge>
        )}
      </header>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <Button variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Скопировать данные
        </Button>
        <Button variant="outline" size="sm" className="text-primary">
          Формат экспорта
          <ChevronDown className="ml-2 h-4 w-4" />
          <Download className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FieldCard icon={<IdCard className="h-4 w-4" />} label="Краткое название:" value={company.shortName} />
        <FieldCard
          icon={<Building2 className="h-4 w-4" />}
          label="Полное название:"
          value={company.fullName}
        />
        <FieldCard icon={<IdCard className="h-4 w-4" />} label="ИНН:" value={company.inn} />
        <FieldCard icon={<Hash className="h-4 w-4" />} label="КПП:" value={company.kpp} />
        <FieldCard icon={<Building2 className="h-4 w-4" />} label="ОГРН:" value={company.ogrn} />
        <FieldCard icon={<FileText className="h-4 w-4" />} label="ОКВЭД:" value={company.okved} />
        <FieldCard icon={<MapPin className="h-4 w-4" />} label="Юр.адрес:" value={company.address} />
        <FieldCard
          icon={<User className="h-4 w-4" />}
          label="ПРЕЗИДЕНТ, ПРЕДСЕДАТЕЛЬ ПРАВЛЕНИЯ:"
          value={company.ceo}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button className="bg-violet-600 text-white hover:bg-violet-700">
          Главное о компании за 1 минуту
        </Button>
        <Button className="ml-auto bg-violet-600 text-white hover:bg-violet-700">
          Ключевые метрики и рейтинг
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant="default">
          Юридическая информация
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <div className="ml-auto flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-foreground">Финансовая информация</span>
          <Separator orientation="vertical" className="h-5" />
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Даты для выбора фин. информации</span>
        </div>
      </div>

      <Separator className="my-5" />

      <BankruptcySummary data={company.bankruptcy} onOpenTimeline={() => setOpen(true)} />

      <Separator className="my-5" />

      <ArbitrationSection cases={mockArbitration} />

      <Separator className="my-5" />


      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <TrendingUp className="h-4 w-4" />
          Оценка стоимости бизнеса
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <ValuationCard label="Сравнительный подход" value={company.valuation.comparative} />
          <ValuationCard label="Доходный подход" value={company.valuation.income} />
          <ValuationCard label="Затратный подход" value={company.valuation.cost} />
        </div>
        <Button>
          <Calculator className="mr-2 h-4 w-4" />
          Открыть калькулятор
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {company.bankruptcy ? (
        <BankruptcySheet
          open={open}
          onOpenChange={setOpen}
          data={company.bankruptcy}
          companyName={company.shortName}
        />
      ) : null}
    </Card>
  );
}

function FieldCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group relative rounded-lg border border-border bg-card p-3">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-muted-foreground">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-0.5 break-words text-sm font-medium text-foreground">{value}</div>
        </div>
        <button
          type="button"
          aria-label="Скопировать"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigator.clipboard?.writeText(value)}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ValuationCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
