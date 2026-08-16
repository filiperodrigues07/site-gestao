import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/lib/site-config";
import { solutions } from "@/data/solutions";
import { Mail, Phone } from "lucide-react";
import { InstagramIcon, LinkedinIcon, FacebookIcon } from "@/components/shared/social-icons";

export function SiteFooter() {
  const featuredSolutions = solutions.slice(0, 6);

  return (
    <footer className="section-dark border-t border-border">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white transition-transform hover:scale-110"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <LinkedinIcon className="size-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <FacebookIcon className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Soluções</h3>
            <ul className="mt-4 space-y-2.5">
              {featuredSolutions.map((solution) => (
                <li key={solution.slug}>
                  <Link
                    href={`/solucoes/${solution.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {solution.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/solucoes"
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Ver todas →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Empresa</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/institucional"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Institucional
                </Link>
              </li>
              <li>
                <Link
                  href="/base-de-conhecimento"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Base de Conhecimento
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contato</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-4" />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-4" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos
            reservados.
          </p>
          <p>Feito com tecnologia e cuidado.</p>
        </div>
      </Container>
    </footer>
  );
}
