import { InstagramUploadForm } from "@/components/admin/instagram-upload-form";
import { requirePermission } from "@/lib/auth/dal";

export default async function NovaPublicacaoInstagramPage() {
  await requirePermission("instagram");
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Nova publicação</h1>
      <div className="mt-6">
        <InstagramUploadForm />
      </div>
    </div>
  );
}
