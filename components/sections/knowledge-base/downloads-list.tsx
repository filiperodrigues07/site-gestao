import { Download, FileText, FileSpreadsheet, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import type { Download as KBDownload } from "@/lib/db/schema";

const FILE_TYPE_ICONS: Record<string, LucideIcon> = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: FileSpreadsheet,
  ZIP: Package,
  EXE: Package,
  MSI: Package,
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DownloadsList({ downloads }: { downloads: KBDownload[] }) {
  return (
    <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2" stagger={0.06}>
      {downloads.map((item) => {
        const Icon = FILE_TYPE_ICONS[item.fileType] ?? FileText;
        return (
          <Reveal key={item.id}>
            <a
              href={`/api/downloads/${item.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.fileType} · {formatSize(item.sizeBytes)}
                </p>
              </div>
              <Download className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </a>
          </Reveal>
        );
      })}
    </RevealGroup>
  );
}
