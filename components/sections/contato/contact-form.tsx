"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact-schema";
import { cn } from "@/lib/utils";

export function ContactForm({
  defaultType = "contato",
  defaultSolutionInterest,
}: {
  defaultType?: "contato" | "demo";
  defaultSolutionInterest?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      type: defaultType,
      solutionInterest: defaultSolutionInterest ?? "",
      message: defaultType === "demo" ? "Gostaria de solicitar uma demonstração." : "",
      website: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("request_failed");
      }

      toast.success("Mensagem enviada com sucesso!", {
        description: "Nosso time entrará em contato em breve.",
      });
      reset();
    } catch {
      toast.error("Não foi possível enviar sua mensagem", {
        description: "Tente novamente em instantes ou fale conosco pelo WhatsApp.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot — invisível para humanos, ignorado no envio se vazio */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" className="mt-2" placeholder="Seu nome" {...register("name")} />
          {errors.name && (
            <p className="mt-1.5 text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Telefone / WhatsApp</Label>
          <Input id="phone" className="mt-2" placeholder="(00) 00000-0000" {...register("phone")} />
          {errors.phone && (
            <p className="mt-1.5 text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" className="mt-2" placeholder="voce@empresa.com.br" {...register("email")} />
          {errors.email && (
            <p className="mt-1.5 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="company">Empresa (opcional)</Label>
          <Input id="company" className="mt-2" placeholder="Nome da sua empresa" {...register("company")} />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          className="mt-2 min-h-32"
          placeholder="Conte um pouco sobre o que sua empresa precisa..."
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className={cn("w-full sm:w-auto")}
      >
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
        <Send className="size-4" />
      </Button>
    </form>
  );
}
