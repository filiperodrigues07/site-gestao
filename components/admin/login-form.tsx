"use client";

import { useActionState } from "react";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="username">Usuário</Label>
        <div className="relative mt-2">
          <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            name="username"
            className="h-10 pl-9"
            autoComplete="username"
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
