"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type AdminFilterOption = { value: string; label: string };
export type AdminSelectFilter = {
  param: string;
  label: string;
  allLabel?: string;
  options: AdminFilterOption[];
};

const SEARCH_PARAM = "q";
const DEBOUNCE_MS = 350;

export function AdminFilters({
  searchPlaceholder = "Buscar...",
  filters = [],
}: {
  searchPlaceholder?: string;
  filters?: AdminSelectFilter[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get(SEARCH_PARAM) ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    // Mudou um filtro, volta pra página 1 — senão o usuário pode ficar numa
    // página que não existe mais pra um resultado filtrado menor.
    params.delete("page");
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ [SEARCH_PARAM]: value || null }), DEBOUNCE_MS);
  }

  const activeFilterCount =
    (searchParams.get(SEARCH_PARAM) ? 1 : 0) +
    filters.filter((f) => searchParams.get(f.param) && searchParams.get(f.param) !== "all").length;

  function clearFilters() {
    setQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-9 pl-9"
        />
      </div>

      {filters.map((filter) => {
        const value = searchParams.get(filter.param) ?? "all";
        return (
          <Select key={filter.param} value={value} onValueChange={(v) => updateParams({ [filter.param]: v })}>
            <SelectTrigger className="h-9 w-full sm:w-auto sm:min-w-40">
              <SelectValue>
                {(v: string) =>
                  v === "all" ? (filter.allLabel ?? `${filter.label}: todos`) : filter.options.find((o) => o.value === v)?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{filter.allLabel ?? `${filter.label}: todos`}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
          Limpar filtros
        </button>
      )}
    </div>
  );
}
