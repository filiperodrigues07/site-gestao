"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DuplicateButton({
  action,
}: {
  action: () => Promise<{ error?: string } | undefined>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={handleClick}
      aria-label="Duplicar"
      title="Duplicar"
    >
      <Copy className="size-4" />
    </Button>
  );
}
