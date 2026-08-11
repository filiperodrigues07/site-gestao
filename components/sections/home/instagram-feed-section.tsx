import Image from "next/image";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { InstagramIcon } from "@/components/shared/social-icons";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import { siteConfig, instagramHandle } from "@/lib/site-config";
import type { InstagramPost } from "@/lib/db/schema";

const IG_GRADIENT = "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]";

export function InstagramFeedSection({ posts }: { posts: InstagramPost[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Instagram"
            title="Acompanhe a gente por lá também"
            description="Bastidores, novidades e conteúdo sobre gestão empresarial no nosso Instagram."
          />
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105 ${IG_GRADIENT}`}
          >
            <InstagramIcon className="size-4" />
            Seguir {instagramHandle()}
          </a>
        </div>

        <RevealGroup
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
          stagger={0.05}
        >
          {posts.map((post) => (
            <Reveal
              key={post.id}
              className="w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card sm:w-[320px]"
            >
              <div className="flex items-center gap-2.5 p-3">
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-full p-[2px] ${IG_GRADIENT}`}>
                  <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-card">
                    <Image src="/brand/icon.png" alt="" width={298} height={244} className="size-5 w-auto" />
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{instagramHandle()}</p>
                </div>
                <MoreHorizontal className="size-4 shrink-0 text-muted-foreground" />
              </div>

              <a
                href={post.postUrl ?? siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/instagram/${post.id}/image`}
                  alt={post.caption}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </a>

              <div className="flex items-center justify-between px-3 pt-3">
                <div className="flex items-center gap-3.5">
                  <Heart className="size-[22px] text-foreground/80" strokeWidth={1.75} />
                  <MessageCircle className="size-[22px] -scale-x-100 text-foreground/80" strokeWidth={1.75} />
                  <Send className="size-[22px] text-foreground/80" strokeWidth={1.75} />
                </div>
                <Bookmark className="size-[22px] text-foreground/80" strokeWidth={1.75} />
              </div>

              <div className="px-3 pt-2 pb-4 text-sm">
                <p className="line-clamp-2 text-pretty">
                  <span className="font-semibold">{instagramHandle().replace("@", "")}</span>{" "}
                  <span className="text-foreground/90">{post.caption}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
