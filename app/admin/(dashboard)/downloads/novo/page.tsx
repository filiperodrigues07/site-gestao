import { DownloadUploadForm } from "@/components/admin/download-upload-form";

export default function NovoDownloadPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Novo download</h1>
      <div className="mt-6">
        <DownloadUploadForm />
      </div>
    </div>
  );
}
