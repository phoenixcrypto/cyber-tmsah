'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Users } from 'lucide-react'
import { contentManager } from '@/lib/content-manager'

const MaterialsPage = () => {

  // Get materials from centralized content manager
  const subjects = contentManager.getSubjects()
  const materials = Object.entries(subjects).map(([id, subject]) => ({
    id,
    title: subject.name,
    icon: subject.icon,
    description: subject.description,
    hasSessions: subject.hasSessions,
    instructor: subject.instructor,
    assistantsCount: subject.assistants.length
  }))

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <div className="min-h-screen pt-20 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-orbitron font-black text-cyber-neon mb-4 sm:mb-6 px-4">
            Study Materials
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed px-4">
            Comprehensive cybersecurity learning resources and study materials
          </p>
        </motion.div>


        {/* Materials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {materials.map((material, index) => (
            <motion.div key={material.id} variants={itemVariants}>
              <Link href={`/materials/${material.id}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="enhanced-card h-full group cursor-pointer flex flex-col wave-effect reflection-effect interactive-hover"
                >
                  {/* Material Icon */}
                  <div className="text-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-20 h-20 mx-auto animated-gradient rounded-full flex items-center justify-center glow-pulse magnetic-hover mb-4"
                    >
                      <span className="text-4xl neon-glow">{material.icon}</span>
                    </motion.div>
                    <h3 className="text-2xl font-orbitron font-bold text-cyber-neon mb-2">
                      {material.title}
                    </h3>
                    <p className="text-dark-300 text-sm">
                      {material.description}
                    </p>
                  </div>

                  {/* Session Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-dark-300">
                          
                            <BookOpen size={16} />
                          
                          {material.hasSessions ? 'Has Lab Sessions' : 'No Lab Sessions'}
                        </div>
                        <div className="flex items-center gap-2 text-dark-300">
                          
                            <Users size={16} />
                          
                          {material.hasSessions ? 'Practical Work' : 'Theory Only'}
                        </div>
                      </div>
                      
                      {/* Instructor Info */}
                      <div className="text-xs text-dark-400">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-cyber-neon">👨‍🏫</span>
                          <span>{material.instructor}</span>
                        </div>
                        {material.hasSessions && material.assistantsCount > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-cyber-violet">👥</span>
                            <span>{material.assistantsCount} Teaching Assistant{material.assistantsCount > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button pinned to bottom */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mt-auto p-3 bg-cyber-glow/10 border border-cyber-glow rounded-lg text-center group-hover:bg-cyber-glow/20 transition-all duration-300"
                  >
                    <span className="text-cyber-neon font-semibold">
                      View Materials →
                    </span>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {materials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-orbitron font-bold text-cyber-neon mb-2">
              No materials found
            </h3>
            <p className="text-dark-300">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MaterialsPage
