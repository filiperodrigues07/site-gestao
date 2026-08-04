"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { faqSchema, type FAQFormValues } from "@/lib/validations/admin/faq-schema";
import { createFAQ, updateFAQ } from "@/app/admin/(dashboard)/faq/actions";
import type { FAQ, Category } from "@/lib/db/schema";

const NO_CATEGORY = "none";

export function FAQForm({ faq, categories }: { faq?: FAQ; categories: Category[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: faq?.question ?? "",
      answer: faq?.answer ?? "",
      categoryId: faq?.categoryId ?? null,
    },
  });

  async function onSubmit(values: FAQFormValues) {
    const result = faq ? await updateFAQ(faq.id, values) : await createFAQ(values);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(faq ? "FAQ atualizada" : "FAQ criada");
    router.push("/admin/faq");
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <Label htmlFor="question">Pergunta</Label>
        <Textarea id="question" className="mt-2" {...register("question")} />
        {errors.question && <p className="mt-1.5 text-sm text-destructive">{errors.question.message}</p>}
      </div>

      <div>
        <Label htmlFor="answer">Resposta</Label>
        <Textarea id="answer" className="mt-2 min-h-32" {...register("answer")} />
        {errors.answer && <p className="mt-1.5 text-sm text-destructive">{errors.answer.message}</p>}
      </div>

      <div>
        <Label htmlFor="categoryId">Categoria (opcional)</Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : NO_CATEGORY}
              onValueChange={(value) => field.onChange(value === NO_CATEGORY ? null : Number(value))}
            >
              <SelectTrigger id="categoryId" className="mt-2 w-full">
                <SelectValue>
                  {(value: string | null) =>
                    value === NO_CATEGORY || !value
                      ? "Sem categoria"
                      : (categories.find((c) => String(c.id) === value)?.name ?? "Sem categoria")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CATEGORY}>Sem categoria</SelectItem>
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

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : faq ? "Salvar alterações" : "Criar FAQ"}
      </Button>
    </div>
  );
}
