'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export const smoothEasing = [0.25, 0.46, 0.45, 0.94] as const
export const springEasing = [0.34, 1.56, 0.64, 1] as const

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Page Transition
export function PageTransition({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="initial"
      transition={{
        duration: 0.6,
        ease: smoothEasing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 🔥 Fade In (child element for stagger)
export function FadeIn({
  children,
  delay = 0,
  className
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
      transition={{
        duration: 0.5,
        ease: smoothEasing,
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 🔥 Hover Card
export function HoverCard({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
        boxShadow:
          '0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)'
      }}
      transition={{
        duration: 0.3,
        ease: smoothEasing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}