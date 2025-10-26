'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname()

  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100,
      scale: 0.95,
      rotateY: 15
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0
    },
    out: {
      opacity: 0,
      x: -100,
      scale: 0.95,
      rotateY: -15
    }
  }

  const pageTransition = {
    type: 'tween',
    ease: [0.4, 0, 0.2, 1],
    duration: 0.6
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="page-transition-enter"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
