'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
}

interface AnimatedLayoutProps {
  children: React.ReactNode
}

const AnimatedLayout = ({ children }: AnimatedLayoutProps) => {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}

export default AnimatedLayout
