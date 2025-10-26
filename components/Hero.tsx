'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, BookOpen, Users, Zap, Target } from 'lucide-react'


const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyber-neon/10 to-cyber-violet/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyber-violet/10 to-cyber-neon/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-6xl mx-auto relative z-10"
      >
        {/* Logo Container */}
        <motion.div variants={logoVariants} className="mb-8">
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-32 h-32 relative"
              animate={{ 
                filter: [
                  'drop-shadow(0 0 20px rgba(0,255,136,0.6))',
                  'drop-shadow(0 0 40px rgba(0,255,136,0.9))',
                  'drop-shadow(0 0 20px rgba(0,255,136,0.6))'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            >
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
            >
              {/* Shield Base */}
              <path
                d="M100 20 L180 60 L180 120 L100 180 L20 120 L20 60 Z"
                fill="none"
                stroke="#00FF88"
                strokeWidth="4"
                opacity="0.9"
              />
              {/* Inner Shield */}
              <path
                d="M100 35 L160 65 L160 115 L100 165 L40 115 L40 65 Z"
                fill="none"
                stroke="#8A2BE2"
                strokeWidth="3"
                opacity="0.7"
              />
              {/* Security Lock */}
              <rect
                x="85"
                y="100"
                width="30"
                height="25"
                rx="4"
                fill="none"
                stroke="#00FF88"
                strokeWidth="3"
                opacity="0.8"
              />
              <path
                d="M95 100 Q95 90 100 90 Q105 90 105 100"
                fill="none"
                stroke="#00FF88"
                strokeWidth="3"
                opacity="0.8"
              />
              {/* Circuit Pattern */}
              <circle cx="60" cy="80" r="3" fill="#00FF88" opacity="0.9" />
              <circle cx="140" cy="80" r="3" fill="#8A2BE2" opacity="0.9" />
              <circle cx="100" cy="50" r="3" fill="#00FF88" opacity="0.9" />
              <circle cx="100" cy="150" r="3" fill="#8A2BE2" opacity="0.9" />
              
              {/* Connection Lines */}
              <line x1="60" y1="80" x2="100" y2="50" stroke="#00FF88" strokeWidth="2" opacity="0.6" />
              <line x1="140" y1="80" x2="100" y2="50" stroke="#8A2BE2" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="50" x2="100" y2="90" stroke="#00FF88" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="125" x2="100" y2="150" stroke="#8A2BE2" strokeWidth="2" opacity="0.6" />
            </svg>
            </motion.div>
            
            {/* Logo Text */}
            <motion.h1
              className="font-orbitron font-black text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-cyber-neon px-2"
              style={{
                letterSpacing: '1px'
              }}
            >
              CYBER TMSAH
            </motion.h1>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyber-neon neon-text mb-6 sm:mb-8 font-light tracking-wide px-2"
          style={{
            color: '#00FF88',
            textShadow: '0 0 20px rgba(0, 255, 136, 0.6)',
            fontWeight: '300',
            letterSpacing: '1px'
          }}
        >
          Your Cyber Fortress for the Future
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-2"
        >
          <motion.div 
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 50px rgba(0, 255, 136, 0.6)',
              y: -3
            }} 
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link 
              href="/materials" 
              className="btn-primary text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4"
            >
              <BookOpen size={20} />
              Explore Materials
            </Link>
          </motion.div>
          <motion.div 
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 50px rgba(138, 43, 226, 0.6)',
              y: -3
            }} 
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link 
              href="/about" 
              className="btn-secondary text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4"
            >
              <Users size={20} />
              Learn About Us
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2"
        >
          {[
            {
              icon: Shield,
              title: 'Secure Learning',
              description: 'Advanced cybersecurity education with real-world applications',
            },
            {
              icon: BookOpen,
              title: 'Comprehensive Materials',
              description: 'Extensive collection of study materials and resources',
            },
            {
              icon: Users,
              title: 'Expert Community',
              description: 'Connect with cybersecurity professionals and learners',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="glass-card text-center group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-cyber-neon to-cyber-violet rounded-full flex items-center justify-center cyber-glow"
              >
                <feature.icon size={24} className="text-cyber-dark" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-orbitron font-bold text-cyber-neon mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-dark-200 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
