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
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground uppercase">
            {columns.map((col) => (
              <th key={col.header} className={cn("px-4 py-3", col.className)}>
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              {columns.map((col) => (
                <td key={col.header} className={cn("px-4 py-3", col.className)}>
                  {col.render(row)}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
