"use client";

import { useActionState } from "react";
import { Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { portalLoginAction, type PortalLoginState } from "@/app/area-cliente/login/actions";

export function PortalLoginForm() {
  const [state, formAction, isPending] = useActionState<PortalLoginState, FormData>(
    portalLoginAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="cnpj">CNPJ</Label>
        <div className="relative mt-2">
          <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="cnpj"
            name="cnpj"
            className="h-10 pl-9"
            inputMode="numeric"
            autoComplete="off"
            placeholder="00.000.000/0000-00"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            className="h-10 pl-9"
            autoComplete="current-password"
            required
          />
        </div>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
