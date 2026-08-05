"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

  function insertAtCursor(text: string) {
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
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  async function handleImageFile(file: File) {
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

  return (
    <Tabs defaultValue="editar">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="editar">Editar</TabsTrigger>
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
      <TabsContent value="editar">
        <Textarea
          ref={textareaRef}
          id={id}
          className="min-h-80 font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Cole uma imagem (Ctrl+V) ou use &quot;Anexar imagem&quot; para inserir no texto na posição do cursor.
        </p>
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-80 rounded-lg border border-border p-4">
          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-medium prose-a:text-primary">
            <ReactMarkdown>{value || "*Nada para pré-visualizar ainda.*"}</ReactMarkdown>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
