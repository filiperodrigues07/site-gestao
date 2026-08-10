"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ADMIN_SECTIONS, type AdminSection } from "@/lib/auth/permissions";
import { updateUserPermissions } from "@/lib/actions/usuarios";
import type { User } from "@/lib/db/schema";

export function UserPermissionsForm({ user }: { user: User }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [permissions, setPermissions] = useState<AdminSection[]>(
    user.permissions as AdminSection[]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function togglePermission(section: AdminSection) {
    setPermissions((current) =>
      current.includes(section) ? current.filter((s) => s !== section) : [...current, section]
    );
  }

  async function onSubmit() {
    setIsSubmitting(true);
    const result = await updateUserPermissions(user.id, { isAdmin, permissions });
    setIsSubmitting(false);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Permissões atualizadas");
    router.push("/admin/usuarios");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>

      <div className="rounded-xl border border-border p-4">
        <label className="flex items-center gap-2.5 text-sm font-medium">
          <Checkbox checked={isAdmin} onCheckedChange={(checked) => setIsAdmin(checked === true)} />
          É administrador (acessa todas as telas, inclusive Usuários)
        </label>

        {!isAdmin && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm font-medium">Telas que este usuário pode acessar</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {ADMIN_SECTIONS.map((section) => (
                <label key={section.key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={permissions.includes(section.key)}
                    onCheckedChange={() => togglePermission(section.key)}
                  />
                  {section.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar permissões"}
      </Button>
    </div>
  );
}
