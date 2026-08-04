"use client";

import ReactMarkdown from "react-markdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function MarkdownField({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  return (
    <Tabs defaultValue="editar">
      <TabsList>
        <TabsTrigger value="editar">Editar</TabsTrigger>
        <TabsTrigger value="preview">Pré-visualizar</TabsTrigger>
      </TabsList>
      <TabsContent value="editar">
        <Textarea
          id={id}
          className="min-h-80 font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-80 rounded-lg border border-border p-4">
          <div className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:font-medium prose-a:text-primary">
            <ReactMarkdown>{value || "*Nada para pré-visualizar ainda.*"}</ReactMarkdown>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
