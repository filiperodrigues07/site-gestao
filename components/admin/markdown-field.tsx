"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import {
  ImagePlus,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  Link2,
  Table2,
  Minus,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

async function uploadArticleImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/admin/article-images", { method: "POST", body: formData });
  const data = await response.json();

  if (!response.ok || !data.success) {
    toast.error(data?.errors?.file?.[0] ?? "Não foi possível enviar a imagem");
    return null;
  }

  return data.url as string;
}

const TABLE_TEMPLATE = `\n\n| Coluna 1 | Coluna 2 | Coluna 3 |\n| --- | --- | --- |\n| Texto | Texto | Texto |\n| Texto | Texto | Texto |\n\n`;

type ToolbarAction =
  | "bold"
  | "italic"
  | "strikethrough"
  | "h1"
  | "h2"
  | "h3"
  | "list"
  | "ordered-list"
  | "task-list"
  | "quote"
  | "code-block"
  | "link"
  | "table"
  | "hr";

const TOOLBAR_ITEMS: ({ type: "separator" } | { action: ToolbarAction; icon: typeof Bold; label: string })[] = [
  { action: "bold", icon: Bold, label: "Negrito (Ctrl+B)" },
  { action: "italic", icon: Italic, label: "Itálico (Ctrl+I)" },
  { action: "strikethrough", icon: Strikethrough, label: "Tachado" },
  { type: "separator" },
  { action: "h1", icon: Heading1, label: "Título 1" },
  { action: "h2", icon: Heading2, label: "Título 2" },
  { action: "h3", icon: Heading3, label: "Título 3" },
  { type: "separator" },
  { action: "list", icon: List, label: "Lista" },
  { action: "ordered-list", icon: ListOrdered, label: "Lista numerada" },
  { action: "task-list", icon: ListChecks, label: "Lista de tarefas" },
  { action: "quote", icon: Quote, label: "Citação" },
  { type: "separator" },
  { action: "code-block", icon: Code, label: "Bloco de código" },
  { action: "link", icon: Link2, label: "Link (Ctrl+K)" },
  { action: "table", icon: Table2, label: "Tabela" },
  { action: "hr", icon: Minus, label: "Linha divisória" },
];

function countWords(markdown: string): number {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_~\-`|]/g, " ")
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ");
  const matches = stripped.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export function MarkdownField({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const wordCount = useMemo(() => countWords(value), [value]);
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  const insertAtCursor = useCallback(
    (text: string, cursorOffset?: number) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        onChange(`${value}${text}`);
        return;
      }

      const start = textarea.selectionStart ?? value.length;
      const end = textarea.selectionEnd ?? value.length;
      const next = `${value.slice(0, start)}${text}${value.slice(end)}`;
      onChange(next);

      requestAnimationFrame(() => {
        textarea.focus();
        const cursor = start + (cursorOffset ?? text.length);
        textarea.setSelectionRange(cursor, cursor);
      });
    },
    [value, onChange]
  );

  const wrapSelection = useCallback(
    (before: string, after: string, placeholder: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        insertAtCursor(`${before}${placeholder}${after}`);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.slice(start, end) || placeholder;
      const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
      onChange(next);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
      });
    },
    [value, onChange, insertAtCursor]
  );

  const prefixLines = useCallback(
    (prefix: string | ((index: number) => string)) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      let lineEnd = value.indexOf("\n", end);
      if (lineEnd === -1) lineEnd = value.length;

      const block = value.slice(lineStart, lineEnd);
      const lines = block.split("\n");
      const nextBlock = lines
        .map((line, i) => `${typeof prefix === "function" ? prefix(i) : prefix}${line}`)
        .join("\n");

      const next = `${value.slice(0, lineStart)}${nextBlock}${value.slice(lineEnd)}`;
      onChange(next);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(lineStart, lineStart + nextBlock.length);
      });
    },
    [value, onChange]
  );

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }
    setIsUploading(true);
    const url = await uploadArticleImage(file);
    setIsUploading(false);
    if (!url) return;

    const alt = file.name.replace(/\.[^.]+$/, "");
    insertAtCursor(`\n\n![${alt}](${url})\n\n`);
    toast.success("Imagem inserida no artigo");
  }

  function handlePaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(event.clipboardData.items).find((entry) =>
      entry.type.startsWith("image/")
    );
    if (!item) return;
    const file = item.getAsFile();
    if (!file) return;
    event.preventDefault();
    handleImageFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = Array.from(event.dataTransfer.files).find((f) => f.type.startsWith("image/"));
    if (file) handleImageFile(file);
  }

  function runToolbarAction(action: ToolbarAction) {
    switch (action) {
      case "bold":
        wrapSelection("**", "**", "negrito");
        break;
      case "italic":
        wrapSelection("*", "*", "itálico");
        break;
      case "strikethrough":
        wrapSelection("~~", "~~", "texto");
        break;
      case "h1":
        prefixLines("# ");
        break;
      case "h2":
        prefixLines("## ");
        break;
      case "h3":
        prefixLines("### ");
        break;
      case "list":
        prefixLines("- ");
        break;
      case "ordered-list":
        prefixLines((i) => `${i + 1}. `);
        break;
      case "task-list":
        prefixLines("- [ ] ");
        break;
      case "quote":
        prefixLines("> ");
        break;
      case "code-block":
        wrapSelection("\n\n```\n", "\n```\n\n", "código");
        break;
      case "link":
        wrapSelection("[", "](https://)", "texto do link");
        break;
      case "table":
        insertAtCursor(TABLE_TEMPLATE);
        break;
      case "hr":
        insertAtCursor("\n\n---\n\n");
        break;
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const isMod = event.metaKey || event.ctrlKey;
    if (!isMod) return;

    if (event.key === "b") {
      event.preventDefault();
      runToolbarAction("bold");
    } else if (event.key === "i") {
      event.preventDefault();
      runToolbarAction("italic");
    } else if (event.key === "k") {
      event.preventDefault();
      runToolbarAction("link");
    }
  }

  return (
    <Tabs defaultValue="editar">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-lg border border-b-0 border-border bg-muted/40 p-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          {TOOLBAR_ITEMS.map((item, i) =>
            "type" in item ? (
              <span key={`sep-${i}`} className="mx-1 h-5 w-px bg-border" />
            ) : (
              <Tooltip key={item.action}>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => runToolbarAction(item.action)}
                      aria-label={item.label}
                    />
                  }
                >
                  <item.icon className="size-4" />
                </TooltipTrigger>
                <TooltipContent>{item.label}</TooltipContent>
              </Tooltip>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <TabsList>
            <TabsTrigger value="editar">Editar</TabsTrigger>
            <TabsTrigger value="dividido">Dividido</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualizar</TabsTrigger>
          </TabsList>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="size-4" />
            {isUploading ? "Enviando..." : "Anexar imagem"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleImageFile(file);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      <TabsContent value="editar">
        <Textarea
          ref={textareaRef}
          id={id}
          className={cn(
            "min-h-96 rounded-t-none font-mono text-sm",
            isDragging && "ring-2 ring-primary"
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        />
      </TabsContent>

      <TabsContent value="dividido">
        <div className="grid grid-cols-2 gap-3">
          <Textarea
            ref={textareaRef}
            className="min-h-96 rounded-t-none font-mono text-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          />
          <div className="min-h-96 overflow-auto rounded-lg border border-border p-4">
            <div className="prose dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-medium prose-a:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value || "*Nada para pré-visualizar ainda.*"}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="preview">
        <div className="min-h-96 rounded-lg border border-border p-4">
          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-medium prose-a:text-primary">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || "*Nada para pré-visualizar ainda.*"}
            </ReactMarkdown>
          </div>
        </div>
      </TabsContent>

      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Cole (Ctrl+V) ou arraste uma imagem pro editor. Aceita PNG, JPG, GIF (inclusive
          animado) e WEBP, até 50MB. Suporta tabelas, listas de tarefas e atalhos de teclado
          (Ctrl+B, Ctrl+I, Ctrl+K).
        </p>
        <p className="shrink-0 text-xs text-muted-foreground">
          {wordCount} {wordCount === 1 ? "palavra" : "palavras"} · ~{readingMinutes} min de leitura
        </p>
      </div>
    </Tabs>
  );
}
