'use client'

import Hero from '@/components/Hero'
import TodaySchedule from '@/components/TodaySchedule'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Target } from 'lucide-react'

export default function HomePage() {
  // State for selected group and section
  const [selectedGroup, setSelectedGroup] = useState<string>('1')
  const [selectedSection, setSelectedSection] = useState<string>('1')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-16">
        {/* Today's Schedule section on Home page */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-orbitron font-black mb-4 sm:mb-6 text-cyber-neon px-4">
            Today's Overview
          </h2>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto px-4">
            Stay updated with your daily cybersecurity learning journey
          </p>
        </motion.div>
        
        {/* Section Selection for Home Page */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="enhanced-card mb-8 sm:mb-12 wave-effect reflection-effect interactive-hover mx-4"
        >
          <div className="text-center mb-6 sm:mb-8 px-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 animated-gradient rounded-full flex items-center justify-center glow-pulse magnetic-hover"
            >
              <Users className="text-white" size={32} />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-cyber-neon mb-3 sm:mb-4">
              Select Your Section
            </h3>
            <p className="text-dark-300 text-base sm:text-lg">
              Choose your section to view today's personalized schedule
            </p>
          </div>

          {/* Section Selection */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((section) => {
              const group = parseInt(section.toString()) <= 7 ? '1' : '2'
              return (
                <motion.button
                  key={section}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedSection(section.toString())
                    setSelectedGroup(group)
                  }}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 enhanced-card interactive-hover ${
                    selectedSection === section.toString()
                      ? 'bg-cyber-violet/20 text-cyber-violet border-2 border-cyber-violet/50 glow-pulse' 
                      : 'bg-cyber-dark/30 text-dark-300 border border-cyber-glow/30 hover:border-cyber-violet/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Target size={16} />
                    <span>{section}</span>
                    <span className="text-xs opacity-70">(G{group})</span>
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <TodaySchedule selectedGroup={selectedGroup} selectedSection={selectedSection} />
        </motion.div>
      </div>
    </div>
  )
}