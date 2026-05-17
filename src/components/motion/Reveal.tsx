"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("animate-in fade-in slide-in-from-bottom-4", className)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={false}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={cn("animate-in fade-in slide-in-from-bottom-4", className)}
    >
      {children}
    </motion.div>
  );
}
