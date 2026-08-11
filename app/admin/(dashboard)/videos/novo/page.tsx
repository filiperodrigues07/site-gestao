import { VideoSourceTabs } from "@/components/admin/video-source-tabs";
import { requirePermission } from "@/lib/auth/dal";

export default async function NovoVideoPage() {
  await requirePermission("videos");
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Novo vídeo</h1>
      <div className="mt-6">
        <VideoSourceTabs />
      </div>
    </div>
  );
}
