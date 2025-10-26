'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, BookOpen, Users, Zap, Target } from 'lucide-react'
import AnimatedIcon from '@/components/AnimatedIcon'

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
              className="font-orbitron font-black text-3xl sm:text-5xl md:text-7xl text-cyber-neon px-4"
              style={{
                letterSpacing: '2px'
              }}
            >
              CYBER TMSAH
            </motion.h1>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl lg:text-3xl text-cyber-neon neon-text mb-12 font-light tracking-wide"
          style={{
            color: '#00FF88',
            textShadow: '0 0 20px rgba(0, 255, 136, 0.6)',
            fontWeight: '300',
            letterSpacing: '2px'
          }}
        >
          Your Cyber Fortress for the Future
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16"
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
              className="btn-primary text-lg px-12 py-6"
            >
              <AnimatedIcon variant="glow" size={24} delay={0}>
                <BookOpen size={24} />
              </AnimatedIcon>
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
              className="btn-secondary text-lg px-12 py-6"
            >
              <AnimatedIcon variant="rotate" size={24} delay={0}>
                <Users size={24} />
              </AnimatedIcon>
              Learn About Us
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
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
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyber-neon to-cyber-violet rounded-full flex items-center justify-center cyber-glow"
              >
                <feature.icon size={32} className="text-cyber-dark" />
              </motion.div>
              <h3 className="text-xl font-orbitron font-bold text-cyber-neon mb-3">
                {feature.title}
              </h3>
              <p className="text-dark-200 leading-relaxed">
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
