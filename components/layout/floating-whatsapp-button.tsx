"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WhatsappIcon } from "@/components/shared/social-icons";
import { buildWhatsappUrl } from "@/lib/site-config";

export function FloatingWhatsappButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={buildWhatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8, y: 16 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-shadow hover:shadow-xl md:bottom-8 md:right-8"
    >
      <WhatsappIcon className="size-6" />
      <span className="sr-only">Falar no WhatsApp</span>
    </motion.a>
  );
}
