'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Mail, Phone, MapPin, Users, BookOpen, Calendar, Target, Zap, Globe, Heart } from 'lucide-react'


const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <footer className="relative bg-cyber-dark/50 backdrop-blur-md border-t border-cyber-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 animated-gradient rounded-xl flex items-center justify-center"
              >
                <Shield className="text-white" size={32} />
              </motion.div>
              <span className="font-orbitron font-black text-3xl sm:text-4xl text-cyber-neon">
                CYBER TMSAH
              </span>
            </div>
            <p className="text-dark-300 mb-8 leading-relaxed max-w-2xl mx-auto text-lg">
              Your Cyber Fortress for the Future. We provide comprehensive cybersecurity education 
              and resources to help you build a secure digital future.
            </p>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="border-t border-cyber-glow/30 pt-8"
          >
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="text-cyber-neon" size={16} />
                <p className="text-dark-400 text-sm">
                  Made with passion for cybersecurity education
                </p>
              </div>
              <div className="hidden sm:block w-px h-4 bg-cyber-glow/30"></div>
              <p className="text-dark-400 text-sm">
                &copy; 2025 Cyber Tmsah. All rights reserved.
              </p>
              <div className="hidden sm:block w-px h-4 bg-cyber-glow/30"></div>
              <p className="text-cyber-neon text-sm font-semibold">
                Created by ZEYAD MOHAMED
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
