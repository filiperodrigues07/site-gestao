import { Phone, Mail, MapPin } from "lucide-react";
import { siteConfig, buildWhatsappUrl } from "@/lib/site-config";
import { WhatsappIcon } from "@/components/shared/social-icons";

export function ContactInfoCard() {
  const { contact } = siteConfig;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Phone className="size-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Telefone</p>
          <a href={contact.phoneHref} className="font-medium hover:text-primary">
            {contact.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <WhatsappIcon className="size-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">WhatsApp</p>
          <a
            href={buildWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-primary"
          >
            {contact.whatsappDisplay}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="size-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">E-mail</p>
          <a href={`mailto:${contact.email}`} className="font-medium hover:text-primary">
            {contact.email}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Endereço</p>
          <p className="font-medium">
            {contact.address.street}
            <br />
            {contact.address.city} - {contact.address.state}
            {contact.address.zip && (
              <>
                <br />
                {contact.address.zip}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
