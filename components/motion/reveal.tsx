"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, fadeUp, transition } from "./motion-tokens";

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  span: motion.span,
  article: motion.article,
} as const;

type RevealProps = {
  children: ReactNode;
  variant?: Variants;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof typeof tags;
  once?: boolean;
  id?: string;
};

export function Reveal({
  children,
  variant = fadeUp,
  delay = 0,
  duration = DURATION.base,
  className,
  as = "div",
  once = true,
  id,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  const MotionTag = tags[as];

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={variant}
      transition={transition(duration, delay)}
    >
      {children}
    </MotionTag>
  );
}
