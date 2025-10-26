'use client'

export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Calendar, Users, Target, CheckCircle, Zap, Shield, BookOpen } from 'lucide-react'

const TasksPage = () => {
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

  const features = [
    {
      icon: CheckCircle,
      title: 'Interactive Labs',
      description: 'Hands-on cybersecurity exercises',
      color: 'text-cyber-neon',
      variant: 'pulse' as const
    },
    {
      icon: Users,
      title: 'Team Challenges',
      description: 'Collaborative security projects',
      color: 'text-cyber-violet',
      variant: 'bounce' as const
    },
    {
      icon: Target,
      title: 'Skill Assessments',
      description: 'Test your cybersecurity knowledge',
      color: 'text-cyber-neon',
      variant: 'glow' as const
    },
    {
      icon: Calendar,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey',
      color: 'text-cyber-violet',
      variant: 'rotate' as const
    }
  ]

  return (
    <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs mb-8">
          <Link href="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Tasks</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-orbitron font-black mb-4 sm:mb-6 text-cyber-neon px-4">
            Tasks
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed px-4">
            Interactive tasks and assignments to enhance your cybersecurity learning journey
          </p>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="enhanced-card text-center wave-effect reflection-effect interactive-hover">
            {/* Animated Icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-24 h-24 mx-auto mb-8 animated-gradient rounded-full flex items-center justify-center glow-pulse magnetic-hover"
            >
              
                <Target className="text-white" size={48} />
              
            </motion.div>

            <h2 className="text-4xl font-orbitron font-bold mb-6 text-cyber-neon">
              Coming Soon
            </h2>
            
            <p className="text-lg text-dark-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              We're working hard to bring you an amazing tasks and assignments system. 
              This feature will include interactive cybersecurity challenges, hands-on labs, 
              and practical exercises to test your skills.
            </p>

            {/* Features Preview */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="enhanced-card p-6 interactive-hover"
                >
                  <div className="text-center">
                    
                      <feature.icon className={`${feature.color} mb-4`} size={40} />
                    
                    <h3 className={`text-lg font-orbitron font-bold ${feature.color} mb-3`}>
                      {feature.title}
                    </h3>
                    <p className="text-dark-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link 
                href="/schedule"
                className="btn-primary text-lg px-10 py-5"
              >
                
                  <Clock size={20} />
                
                Check Our Schedule
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TasksPage
