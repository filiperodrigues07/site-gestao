"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer } from "./motion-tokens";

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: "div" | "ul";
};

export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
  as = "div",
}: RevealGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "ul" ? motion.ul : motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer(stagger, delayChildren)}
    >
      {children}
    </MotionTag>
  );
}
