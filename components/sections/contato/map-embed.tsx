import { siteConfig } from "@/lib/site-config";

export function MapEmbed() {
  return (
    <div className="aspect-4/3 w-full overflow-hidden rounded-2xl border border-border sm:aspect-video">
      <iframe
        src={siteConfig.contact.address.mapEmbedUrl}
        title="Localização no mapa"
        className="size-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
