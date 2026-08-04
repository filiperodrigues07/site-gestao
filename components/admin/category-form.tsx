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
import { categorySchema, type CategoryFormValues } from "@/lib/validations/admin/category-schema";
import { KB_ICON_KEYS, getKbIcon } from "@/components/sections/knowledge-base/kb-icons";
import { createCategory, updateCategory } from "@/lib/actions/categorias";
import type { Category } from "@/lib/db/schema";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      slug: category?.slug ?? "",
      name: category?.name ?? "",
      description: category?.description ?? "",
      iconKey: (category?.iconKey as CategoryFormValues["iconKey"]) ?? "Package",
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    const result = category
      ? await updateCategory(category.id, values)
      : await createCategory(values);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(category ? "Categoria atualizada" : "Categoria criada");
    router.push("/admin/categorias");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" className="mt-2" {...register("name")} />
        {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" className="mt-2" placeholder="ex: primeiros-passos" {...register("slug")} />
        {errors.slug && <p className="mt-1.5 text-sm text-destructive">{errors.slug.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" className="mt-2" {...register("description")} />
        {errors.description && (
          <p className="mt-1.5 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="iconKey">Ícone</Label>
        <Controller
          name="iconKey"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="iconKey" className="mt-2 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KB_ICON_KEYS.map((key) => {
                  const Icon = getKbIcon(key);
                  return (
                    <SelectItem key={key} value={key}>
                      <Icon className="size-4" />
                      {key}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : category ? "Salvar alterações" : "Criar categoria"}
      </Button>
    </div>
  );
}
