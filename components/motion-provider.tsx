"use client"

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion"

/** Loads only the DOM animation features (~15 kB instead of ~34 kB) and respects reduced-motion settings. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
