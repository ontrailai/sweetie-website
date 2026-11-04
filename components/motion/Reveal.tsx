"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "li" | "section" | "article" };

const EASE = [0.2, 0.9, 0.3, 1] as const;

/** Scroll-triggered fade-and-rise. Transforms only, runs once. */
export function Reveal({ delay = 0, y = 28, as = "div", children, ...rest }: Props) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Stagger container + item pair for lists/grids. */
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
export const staggerChild = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};
