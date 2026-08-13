import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminListColumn<T> = {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function AdminList<T extends { id: number }>({
  rows,
  columns,
  actions,
  emptyMessage = "Nenhum registro encontrado.",
}: {
  rows: T[];
  columns: AdminListColumn<T>[];
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="scrollbar-hide overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground uppercase">
            {columns.map((col) => (
              <th key={col.header} className={cn("px-4 py-3.5", col.className)}>
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3.5" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border/70 transition-colors last:border-0 hover:bg-muted/30"
            >
              {columns.map((col) => (
                <td key={col.header} className={cn("px-4 py-3.5", col.className)}>
                  {col.render(row)}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
