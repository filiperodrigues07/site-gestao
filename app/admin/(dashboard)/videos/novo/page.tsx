import { VideoForm } from "@/components/admin/video-form";

export default function NovoVideoPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Novo vídeo</h1>
      <div className="mt-6">
        <VideoForm />
      </div>
    </div>
  );
}
