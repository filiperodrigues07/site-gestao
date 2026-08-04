import type { SVGProps } from "react";

/** lucide-react dropped brand/logo icons — minimal inline glyphs kept instead. */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="8" y1="10.5" x2="8" y2="16.5" />
      <circle cx="8" cy="7" r="0.6" fill="currentColor" stroke="none" />
      <path d="M12 16.5v-3.6c0-1.5 0.9-2.4 2.2-2.4 1.2 0 1.8 0.9 1.8 2.4v3.6" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path d="M15 4h-2.2A3.8 3.8 0 0 0 9 7.8V10H7v3h2v7h3v-7h2.2l0.8-3H12V8.2c0-0.66 0.54-1.2 1.2-1.2H15z" />
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M17.47 14.38c-.29-.15-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.15-.2.29-.75.93-.92 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.08-.15-.65-1.57-.89-2.15-.24-.57-.48-.5-.65-.5-.17-.01-.37-.01-.56-.01-.2 0-.51.07-.78.37-.26.29-1.02 1-1.02 2.42 0 1.43 1.04 2.81 1.19 3 .15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.12-.26-.2-.55-.34z" />
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.08-1.33A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2zm0 18.2c-1.6 0-3.09-.44-4.36-1.2l-.31-.19-3.02.79.8-2.95-.2-.3A8.18 8.18 0 0 1 3.82 12c0-4.53 3.68-8.2 8.2-8.2 4.52 0 8.2 3.67 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2z" />
    </svg>
  );
}
