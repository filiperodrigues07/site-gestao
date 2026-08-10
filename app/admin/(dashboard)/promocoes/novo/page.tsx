import { PromotionUploadForm } from "@/components/admin/promotion-upload-form";
import { requirePermission } from "@/lib/auth/dal";

export default async function NovaPromocaoPage() {
  await requirePermission("promocoes");
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Nova promoção</h1>
      <div className="mt-6">
        <PromotionUploadForm />
      </div>
    </div>
  );
}
