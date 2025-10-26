'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Phone, Award, Users, BookOpen, Shield, Target, Star, CheckCircle, TrendingUp, Globe, Zap } from 'lucide-react'
import AnimatedIcon from '@/components/AnimatedIcon'

const AboutPage = () => {
  const leader = {
    name: 'Zeyad Eltmsah',
    role: 'Founder & Lead Cybersecurity Expert',
    phone: '+20 155 345 0232',
    avatar: '👨‍💻',
    description: 'Founder and creator of Cyber Tmsah platform, cybersecurity expert with extensive experience in digital security, education, and innovative learning solutions. Passionate about empowering students with cutting-edge cybersecurity knowledge and practical skills.',
    achievements: [
      'Cybersecurity Expert with 5+ Years Experience',
      'Educational Technology Innovator',
      'Digital Security Consultant',
      'Student Success Advocate'
    ]
  }

  const stats = [
    { icon: Users, label: 'Active Students', value: '500+', color: 'text-cyber-neon' },
    { icon: BookOpen, label: 'Study Materials', value: '50+', color: 'text-cyber-violet' },
    { icon: Shield, label: 'Security Topics', value: '25+', color: 'text-cyber-neon' },
    { icon: Award, label: 'Success Rate', value: '95%', color: 'text-cyber-violet' }
  ]

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest standards in cybersecurity education and content quality.',
      color: 'text-cyber-neon'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive learning community where students can grow together.',
      color: 'text-cyber-violet'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Prioritizing digital security and privacy in all our educational approaches.',
      color: 'text-cyber-neon'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Embracing cutting-edge technologies and modern learning methodologies.',
      color: 'text-cyber-violet'
    }
  ]

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
    <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs mb-8">
          <Link href="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">About</span>
        </div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl sm:text-5xl md:text-7xl font-orbitron font-black mb-4 sm:mb-6 text-cyber-neon px-4"
        >
          About Us
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-lg sm:text-xl text-dark-300 max-w-4xl mx-auto mb-12 sm:mb-16 px-4"
        >
          Your Cyber Fortress for the Future - Empowering the next generation of cybersecurity professionals
        </motion.p>

        {/* Vision and Mission Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Our Vision */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card group"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '20px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s ease',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <h3 
              className="text-2xl font-orbitron font-bold mb-6"
              style={{ color: '#00FF88' }}
            >
              Our Vision
            </h3>
            <p className="text-dark-300 leading-relaxed text-lg">
              To become the leading digital sanctuary where cybersecurity knowledge flows freely, 
              empowering students with comprehensive educational resources and practical skills. 
              We envision a future where every learner has access to cutting-edge security education, 
              creating a community of skilled professionals ready to defend against evolving cyber threats.
            </p>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card group"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              borderRadius: '20px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s ease',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <h3 
              className="text-2xl font-orbitron font-bold mb-6"
              style={{ color: '#8A2BE2' }}
            >
              Our Mission
            </h3>
            <p className="text-dark-300 leading-relaxed text-lg">
              Our mission is to democratize cybersecurity education by providing comprehensive 
              study materials, interactive learning experiences, and a supportive community platform. 
              We bridge the gap between theoretical knowledge and real-world security challenges, 
              preparing students for the digital battlefield through hands-on learning and 
              practical problem-solving approaches.
            </p>
          </motion.div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-center text-3xl md:text-5xl font-orbitron font-black mb-16 holographic-text">
            Our Impact
          </h2>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="enhanced-card text-center interactive-hover"
              >
                <AnimatedIcon variant="glow" size={48} delay={index * 0.2}>
                  <stat.icon className={`${stat.color} mb-4`} size={48} />
                </AnimatedIcon>
                <div className={`text-4xl font-orbitron font-black ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-dark-300 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Our Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-center text-3xl md:text-5xl font-orbitron font-black mb-16 holographic-text">
            Our Core Values
          </h2>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="enhanced-card text-center interactive-hover"
              >
                <AnimatedIcon variant="morph" size={64} delay={index * 0.3}>
                  <value.icon className={`${value.color} mb-6`} size={64} />
                </AnimatedIcon>
                <h3 className={`text-xl font-orbitron font-bold ${value.color} mb-4`}>
                  {value.title}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Our Founder Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-3xl md:text-5xl font-orbitron font-black mb-16 holographic-text"
        >
          Meet Our Founder
        </motion.h2>

        {/* Founder Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -10 }}
            className="enhanced-card text-center group wave-effect reflection-effect interactive-hover"
          >
            {/* Avatar Section */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative mb-8"
            >
              <div className="w-64 h-64 mx-auto rounded-full flex items-center justify-center text-9xl animated-gradient glow-pulse magnetic-hover">
                👨‍💻
              </div>
              <div className="absolute -top-4 -right-4">
                <AnimatedIcon variant="bounce" size={32} delay={0}>
                  <Star className="text-yellow-400" size={32} />
                </AnimatedIcon>
              </div>
            </motion.div>

            {/* Name and Role */}
            <h4 className="text-4xl font-orbitron font-black mb-4 holographic-text">
              {leader.name}
            </h4>
            <p className="text-dark-300 mb-6 text-xl neon-glow">
              {leader.role}
            </p>

            {/* Description */}
            <p className="text-dark-400 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              {leader.description}
            </p>

            {/* Achievements */}
            <div className="mb-8">
              <h5 className="text-xl font-orbitron font-bold text-cyber-neon mb-4">
                Key Achievements
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {leader.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-cyber-glow/5 border border-cyber-glow/20"
                  >
                    <AnimatedIcon variant="pulse" size={20} delay={index * 0.2}>
                      <CheckCircle className="text-cyber-neon" size={20} />
                    </AnimatedIcon>
                    <span className="text-dark-300 text-sm">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Button */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${leader.phone.replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold transition-all duration-300 enhanced-card interactive-hover"
              style={{
                background: 'rgba(37, 211, 102, 0.1)',
                border: '2px solid #25D366',
                color: '#25D366',
                boxShadow: '0 0 20px rgba(37, 211, 102, 0.3)'
              }}
            >
              <AnimatedIcon variant="rotate" size={24} delay={0}>
                <Phone size={24} />
              </AnimatedIcon>
              {leader.phone}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl md:text-4xl font-orbitron font-bold mb-6 holographic-text">
            Ready to Start Your Cybersecurity Journey?
          </h3>
          <p className="text-dark-300 mb-8 text-lg max-w-2xl mx-auto">
            Join our community of cybersecurity professionals and unlock your potential in the digital world.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/materials"
              className="btn-primary text-lg px-12 py-6"
            >
              <AnimatedIcon variant="glow" size={24} delay={0}>
                <BookOpen size={24} />
              </AnimatedIcon>
              Explore Study Materials
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage
