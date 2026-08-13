import { eq, sql } from "drizzle-orm";
import { Trophy, FileText, Video as VideoIcon, Download as DownloadIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { articles, videos, downloads } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const MEDAL_STYLES = [
  "bg-yellow-400/15 text-yellow-400 ring-yellow-400/30",
  "bg-zinc-300/15 text-zinc-300 ring-zinc-300/30",
  "bg-amber-600/15 text-amber-600 ring-amber-600/30",
] as const;

export default async function AdminRankingPage() {
  await getCurrentUser();

  const [userRows, articleCounts, videoCounts, downloadCounts] = await Promise.all([
    db.query.users.findMany(),
    db
      .select({ authorId: articles.authorId, count: sql<number>`count(*)` })
      .from(articles)
      .where(eq(articles.status, "published"))
      .groupBy(articles.authorId),
    db
      .select({ authorId: videos.authorId, count: sql<number>`count(*)` })
      .from(videos)
      .groupBy(videos.authorId),
    db
      .select({ authorId: downloads.authorId, count: sql<number>`count(*)` })
      .from(downloads)
      .groupBy(downloads.authorId),
  ]);

  const articleMap = new Map(articleCounts.map((r) => [r.authorId, r.count]));
  const videoMap = new Map(videoCounts.map((r) => [r.authorId, r.count]));
  const downloadMap = new Map(downloadCounts.map((r) => [r.authorId, r.count]));

  const ranking = userRows
    .map((user) => {
      const articleCount = articleMap.get(user.id) ?? 0;
      const videoCount = videoMap.get(user.id) ?? 0;
      const downloadCount = downloadMap.get(user.id) ?? 0;
      return {
        user,
        articleCount,
        videoCount,
        downloadCount,
        total: articleCount + videoCount + downloadCount,
      };
    })
    .sort((a, b) => b.total - a.total || a.user.name.localeCompare(b.user.name));

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Ranking de Publicações</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Quem mais publicou artigos, vídeos e downloads na Base de Conhecimento — usado para a
        disputa de premiação do suporte.
      </p>

      <div className="mt-6 space-y-3">
        {ranking.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
        )}

        {ranking.map((entry, i) => (
          <div
            key={entry.user.id}
            className={cn(
              "flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4",
              i === 0 && "border-yellow-400/30"
            )}
          >
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1",
                i < 3 ? MEDAL_STYLES[i] : "bg-muted text-muted-foreground ring-border"
              )}
            >
              {i < 3 ? <Trophy className="size-4.5" /> : i + 1}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-base font-medium">{entry.user.name}</p>
              <p className="text-xs text-muted-foreground">@{entry.user.username}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileText className="size-3.5" />
                {entry.articleCount} {entry.articleCount === 1 ? "artigo" : "artigos"}
              </span>
              <span className="flex items-center gap-1.5">
                <VideoIcon className="size-3.5" />
                {entry.videoCount} {entry.videoCount === 1 ? "vídeo" : "vídeos"}
              </span>
              <span className="flex items-center gap-1.5">
                <DownloadIcon className="size-3.5" />
                {entry.downloadCount} {entry.downloadCount === 1 ? "download" : "downloads"}
              </span>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-heading text-2xl font-medium text-primary">{entry.total}</p>
              <p className="text-xs text-muted-foreground">total</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
