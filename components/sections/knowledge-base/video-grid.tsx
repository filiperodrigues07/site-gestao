"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import type { Video as KBVideo } from "@/lib/db/schema";

export function VideoGrid({ videos }: { videos: KBVideo[] }) {
  const [activeVideo, setActiveVideo] = useState<KBVideo | null>(null);

  useEffect(() => {
    if (!activeVideo) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveVideo(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  return (
    <>
      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2" stagger={0.06}>
        {videos.map((video) => (
          <Reveal key={video.id}>
            <button
              type="button"
              onClick={() => setActiveVideo(video)}
              aria-label={`Assistir: ${video.title}`}
              className="group block w-full text-left"
            >
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#0A0A0B]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-900 via-transparent to-transparent opacity-70" />
                <span className="relative flex size-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-transform group-hover:scale-105">
                  <Play className="size-5 translate-x-0.5" fill="currentColor" />
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
                  {video.durationLabel}
                </span>
              </div>
              <h3 className="mt-3 font-heading text-base font-medium">
                {video.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {video.description}
              </p>
            </button>
          </Reveal>
        ))}
      </RevealGroup>

      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Fechar vídeo"
            >
              <X className="size-4" />
            </button>
            <div className="aspect-video">
              {activeVideo.sourceType === "upload" ? (
                <video
                  src={`/api/videos/${activeVideo.id}/file`}
                  controls
                  autoPlay
                  className="size-full"
                >
                  Seu navegador não suporta reprodução de vídeo.
                </video>
              ) : (
                <iframe
                  src={activeVideo.videoUrl ?? ""}
                  title={activeVideo.title}
                  className="size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
