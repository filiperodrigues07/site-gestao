import type { Transition, Variants } from "framer-motion";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
} as const;

export const transition = (duration: number = DURATION.base, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_OUT,
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0 },
};

export const staggerContainer = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});
