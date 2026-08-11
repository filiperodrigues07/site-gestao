"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSchema, type UpdateFormValues } from "@/lib/validations/admin/update-schema";
import { updateUpdate } from "@/app/admin/(dashboard)/novidades/actions";
import type { Update } from "@/lib/db/schema";

export function UpdateForm({ update }: { update: Update }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: update.title,
      description: update.description,
    },
  });

  async function onSubmit(values: UpdateFormValues) {
    const result = await updateUpdate(update.id, values);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Novidade atualizada");
    router.push("/admin/novidades");
  }

  return (
    <div className="max-w-2xl space-y-5">
      {update.storedFileName && (
        <div>
          <Label>Imagem anexada</Label>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/updates/${update.id}/image`}
            alt=""
            className="mt-2 max-h-60 w-auto rounded-lg border border-border object-contain"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            A imagem não pode ser trocada por aqui — exclua e crie uma nova novidade para trocar a imagem.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" className="mt-2" placeholder="ex: Novo módulo de relatórios" {...register("title")} />
        {errors.title && <p className="mt-1.5 text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" className="mt-2 min-h-32" {...register("description")} />
        {errors.description && (
          <p className="mt-1.5 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
}
