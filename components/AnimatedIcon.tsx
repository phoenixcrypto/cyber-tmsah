'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedIconProps {
  children: ReactNode
  className?: string
  size?: number
  variant?: 'pulse' | 'rotate' | 'bounce' | 'glow' | 'morph' | 'liquid'
  delay?: number
}

const AnimatedIcon = ({ 
  children, 
  className = '', 
  size = 24, 
  variant = 'pulse',
  delay = 0 
}: AnimatedIconProps) => {
  const variants = {
    pulse: {
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 2,
          repeat: Infinity,
          delay
        }
      }
    },
    rotate: {
      animate: {
        rotate: [0, 360],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
          delay
        }
      }
    },
    bounce: {
      animate: {
        y: [0, -10, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          delay
        }
      }
    },
    glow: {
      animate: {
        boxShadow: [
          '0 0 10px rgba(0, 255, 136, 0.3)',
          '0 0 20px rgba(0, 255, 136, 0.6)',
          '0 0 10px rgba(0, 255, 136, 0.3)'
        ],
        transition: {
          duration: 2,
          repeat: Infinity,
          delay
        }
      }
    },
    morph: {
      animate: {
        borderRadius: ['50%', '20%', '0%', '20%', '50%'],
        rotate: [0, 90, 180, 270, 360],
        transition: {
          duration: 4,
          repeat: Infinity,
          delay
        }
      }
    },
    liquid: {
      animate: {
        scaleX: [1, 1.2, 0.8, 1],
        scaleY: [1, 0.8, 1.2, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          delay
        }
      }
    }
  }

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      variants={variants[variant]}
      animate="animate"
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.9,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedIcon
