"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkdownField } from "@/components/admin/markdown-field";
import { ImportArticleFromUrlDialog } from "@/components/admin/import-article-from-url-dialog";
import { articleSchema, type ArticleFormValues } from "@/lib/validations/admin/article-schema";
import { createArticle, updateArticle } from "@/app/admin/(dashboard)/artigos/actions";
import type { Article, Category } from "@/lib/db/schema";

export function ArticleForm({
  article,
  categories,
}: {
  article?: Article;
  categories: Category[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      slug: article?.slug ?? "",
      title: article?.title ?? "",
      excerpt: article?.excerpt ?? "",
      content: article?.content ?? "",
      categoryId: article?.categoryId ?? categories[0]?.id ?? 0,
      tags: article?.tags?.join(", ") ?? "",
      status: article?.status ?? "draft",
    },
  });

  async function onSubmit(values: ArticleFormValues) {
    const result = article
      ? await updateArticle(article.id, article.slug, values)
      : await createArticle(values);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(article ? "Artigo atualizado" : "Artigo criado");
    router.push("/admin/artigos");
  }

  function handleImported(data: { title: string; slug: string; excerpt: string; content: string }) {
    setValue("title", data.title, { shouldValidate: true, shouldDirty: true });
    setValue("slug", data.slug, { shouldValidate: true, shouldDirty: true });
    setValue("excerpt", data.excerpt, { shouldValidate: true, shouldDirty: true });
    setValue("content", data.content, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex justify-end">
        <ImportArticleFromUrlDialog onImported={handleImported} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" className="mt-2" {...register("title")} />
          {errors.title && <p className="mt-1.5 text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" className="mt-2" placeholder="ex: como-emitir-nota-fiscal" {...register("slug")} />
          {errors.slug && <p className="mt-1.5 text-sm text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Resumo</Label>
        <Textarea id="excerpt" className="mt-2" {...register("excerpt")} />
        {errors.excerpt && <p className="mt-1.5 text-sm text-destructive">{errors.excerpt.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="categoryId">Categoria</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger id="categoryId" className="mt-2 w-full">
                  <SelectValue>
                    {(value: string | null) =>
                      categories.find((c) => String(c.id) === value)?.name ?? "Selecione"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="mt-2 w-full">
                  <SelectValue>
                    {(value: string | null) => (value === "published" ? "Publicado" : "Rascunho")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input id="tags" className="mt-2" placeholder="ex: fiscal, nfe" {...register("tags")} />
        </div>
      </div>

      <div>
        <Label htmlFor="content">Conteúdo (markdown)</Label>
        <div className="mt-2">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <MarkdownField id="content" value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        {errors.content && <p className="mt-1.5 text-sm text-destructive">{errors.content.message}</p>}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : article ? "Salvar alterações" : "Criar artigo"}
      </Button>
    </div>
  );
}
