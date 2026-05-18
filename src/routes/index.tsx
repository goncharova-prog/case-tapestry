import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyCard } from "@/components/company/CompanyCard";
import { mockCompany } from "@/lib/bankruptcy-mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Поиск юридической информации" },
      {
        name: "description",
        content:
          "Карточка компании с реквизитами, оценкой стоимости и сведениями о банкротстве.",
      },
      { property: "og:title", content: "Поиск юридической информации" },
      {
        property: "og:description",
        content: "Реквизиты, оценка и хронология банкротства компании.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("ПАО СБЕРБАНК");

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Поиск юридической информации
          </h1>
          <p className="text-sm text-muted-foreground">
            Введите ИНН, КПП, ОГРН или название компании
          </p>
        </header>

        <div className="relative mx-auto max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-10 pr-24"
            placeholder="Например, ПАО СБЕРБАНК"
          />
          {query ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery("")}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <X className="mr-1 h-4 w-4" />
              Очистить
            </Button>
          ) : null}
        </div>

        <CompanyCard company={mockCompany} />
      </div>
    </div>
  );
}
