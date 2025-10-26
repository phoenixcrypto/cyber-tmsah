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
    <footer className="relative bg-cyber-dark/50 backdrop-blur-md border-t border-cyber-glow wave-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 animated-gradient rounded-xl flex items-center justify-center glow-pulse magnetic-hover"
              >
                <Shield className="text-white" size={32} />
              </motion.div>
              <span className="font-orbitron font-black text-3xl text-cyber-neon">
                CYBER TMSAH
              </span>
            </div>
            <p className="text-dark-300 mb-8 leading-relaxed max-w-lg text-lg">
              Your Cyber Fortress for the Future. We provide comprehensive cybersecurity education 
              and resources to help you build a secure digital future.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-12 h-12 bg-cyber-neon/10 border border-cyber-neon/30 rounded-full flex items-center justify-center cursor-pointer interactive-hover"
              >
                <Globe className="text-cyber-neon" size={20} />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-12 h-12 bg-cyber-violet/10 border border-cyber-violet/30 rounded-full flex items-center justify-center cursor-pointer interactive-hover"
              >
                <Heart className="text-cyber-violet" size={20} />
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-orbitron font-bold text-xl text-cyber-neon mb-8">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { href: '/', label: 'Home', icon: Users },
                { href: '/materials', label: 'Materials', icon: BookOpen },
                { href: '/schedule', label: 'Schedule', icon: Calendar },
                { href: '/tasks', label: 'Tasks', icon: Target },
                { href: '/about', label: 'About', icon: Shield },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-dark-300 hover:text-cyber-neon transition-all duration-300 flex items-center group enhanced-card p-3 rounded-lg interactive-hover"
                  >
                    <link.icon className="text-cyber-neon mr-3" size={16} />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="font-orbitron font-bold text-xl text-cyber-neon mb-8">
              Contact Info
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center text-dark-300 enhanced-card p-4 rounded-lg interactive-hover">
                <Phone className="text-cyber-neon mr-4" size={20} />
                <span className="text-sm">+20 155 345 0232</span>
              </li>
              <li className="flex items-center text-dark-300 enhanced-card p-4 rounded-lg interactive-hover">
                <MapPin className="text-cyber-violet mr-4" size={20} />
                <span className="text-sm">Egypt</span>
              </li>
              <li className="flex items-center text-dark-300 enhanced-card p-4 rounded-lg interactive-hover">
                <Zap className="text-cyber-neon mr-4" size={20} />
                <span className="text-sm">24/7 Support</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="border-t border-cyber-glow/30 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Heart className="text-cyber-neon" size={16} />
            <p className="text-dark-400 text-sm">
              Made with passion for cybersecurity education
            </p>
          </div>
          <p className="text-dark-400 text-sm">
            &copy; 2025 Cyber Tmsah. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
