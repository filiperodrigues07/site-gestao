export const DOWNLOAD_FILE_TYPES = ["PDF", "XLSX", "DOCX", "ZIP", "EXE", "MSI"] as const;
export type DownloadFileType = (typeof DOWNLOAD_FILE_TYPES)[number];

export const EXTENSION_MAP: Record<string, { type: DownloadFileType; mime: string }> = {
  ".pdf": { type: "PDF", mime: "application/pdf" },
  ".xlsx": {
    type: "XLSX",
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  ".docx": {
    type: "DOCX",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  ".zip": { type: "ZIP", mime: "application/zip" },
  ".exe": { type: "EXE", mime: "application/vnd.microsoft.portable-executable" },
  ".msi": { type: "MSI", mime: "application/x-msi" },
};

export const MAX_UPLOAD_SIZE_BYTES = 200 * 1024 * 1024;
export const UPLOAD_DIR = "storage/uploads";

export const IMAGE_EXTENSION_MAP: Record<string, { mime: string }> = {
  ".png": { mime: "image/png" },
  ".jpg": { mime: "image/jpeg" },
  ".jpeg": { mime: "image/jpeg" },
  ".gif": { mime: "image/gif" },
  ".webp": { mime: "image/webp" },
};

export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
export const ARTICLE_IMAGES_DIR = "public/uploads/articles";
export const ARTICLE_IMAGES_PUBLIC_PATH = "/uploads/articles";
