"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function NotebookMockup() {
  const shouldReduceMotion = useReducedMotion();

  const screenVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <motion.div {...screenVariants} className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 aspect-square -translate-y-1/2 rounded-full bg-brand-blue-600/25 blur-[100px]"
      />
      <Image
        src="/notebook.png"
        alt="Sistema de gestão CHERP em um notebook e celular, exibindo dashboard financeiro e comercial"
        width={740}
        height={530}
        priority
        className="h-auto w-full"
      />
    </motion.div>
  );
}
