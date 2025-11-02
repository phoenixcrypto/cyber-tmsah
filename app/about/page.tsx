'use client'

import { Users, BookOpen, Award, Target, Heart, Lightbulb, Info, Star } from 'lucide-react'

export default function AboutPage() {

  const features = [
    {
      icon: Users,
      title: 'Academic Community',
      description: 'We believe in the power of collaborative learning and knowledge sharing',
      color: 'from-cyber-neon to-cyber-green',
      bgGradient: 'from-cyber-green/20 to-cyber-neon/20',
      cardBg: 'bg-gradient-to-br from-cyber-green/10 to-cyber-neon/10'
    },
    {
      icon: BookOpen,
      title: 'High-Quality Content',
      description: 'We provide exceptional and continuously updated educational materials',
      color: 'from-cyber-violet to-cyber-blue',
      bgGradient: 'from-cyber-violet/20 to-cyber-blue/20',
      cardBg: 'bg-gradient-to-br from-cyber-violet/10 to-cyber-blue/10'
    },
    {
      icon: Award,
      title: 'Distinguished Expertise',
      description: 'A team of experts and specialists in the field of education',
      color: 'from-cyber-green to-cyber-neon',
      bgGradient: 'from-cyber-green/20 to-cyber-neon/20',
      cardBg: 'bg-gradient-to-br from-cyber-green/15 to-cyber-neon/15'
    },
    {
      icon: Target,
      title: 'Clear Objectives',
      description: 'We strive to achieve the best educational outcomes',
      color: 'from-cyber-blue to-cyber-violet',
      bgGradient: 'from-cyber-blue/20 to-cyber-violet/20',
      cardBg: 'bg-gradient-to-br from-cyber-blue/15 to-cyber-violet/15'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion for Learning',
      description: 'We believe that learning is a lifelong journey'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We use cutting-edge technologies to enhance the learning experience'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work together to achieve our shared goals'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we offer'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Info className="w-8 h-8 text-cyber-neon" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              About Cyber TMSAH Platform
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            An advanced educational platform integrating cutting-edge technology with academic excellence for superior learning experiences
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 animate-slide-up">
          <div className="enhanced-card p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Target className="w-6 h-6 text-cyber-neon" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
                Our Mission
              </h2>
            </div>
            <p className="text-lg text-dark-300 leading-relaxed max-w-4xl mx-auto">
              We strive to provide an advanced and stimulating educational environment that helps students maximize their learning potential. 
              We believe that education should be interactive, engaging, and accessible to everyone, which is why we use cutting-edge technologies 
              to create a unique and exceptional learning experience.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Star className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              Our Features
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`glass-card ${feature.cardBg} p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up-delayed`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyber-neon/30`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Heart className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="glass-card p-6 hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/30">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-dark-100 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-dark-300">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Faculty Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Users className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              Our Team
            </h2>
          </div>
          
          {/* Professors Section */}
          <div className="mb-8">
            <div className="enhanced-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-dark-100">Professors</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-dark-300">Dr. Simon Ezzat - Mathematics</div>
                <div className="text-dark-300">Dr. Ahmed Bakr - Applied Physics</div>
                <div className="text-dark-300">Dr. Abeer Hassan - Database Systems & Entrepreneurship</div>
                <div className="text-dark-300">Dr. Shaima Ahmed - Information Technology</div>
                <div className="text-dark-300">Dr. Nashwa - English Language</div>
                <div className="text-dark-300">Dr. Hind Ziada - Information Systems</div>
              </div>
            </div>
          </div>

          {/* Teaching Assistants Section */}
          <div className="mb-8">
            <div className="enhanced-card p-6 bg-gradient-to-br from-cyber-violet/10 to-cyber-blue/10 border border-cyber-violet/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-xl flex items-center justify-center shadow-lg shadow-cyber-violet/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-dark-100">Teaching Assistants</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-dark-300 font-medium">Mohamed Mostafa</div>
                <div className="text-dark-300 font-medium">Ehab Mohamed</div>
                <div className="text-dark-300 font-medium">Kareem Adel</div>
                <div className="text-dark-300 font-medium">Mahmoud Mohamed</div>
                <div className="text-dark-300 font-medium">Mariam Ashraf</div>
                <div className="text-dark-300 font-medium">Nagla Saeed</div>
                <div className="text-dark-300 font-medium">Omnia Ibrahim</div>
                <div className="text-dark-300 font-medium">Yasmin Ibrahim</div>
                <div className="text-dark-300 font-medium">Ahmed Nashaat</div>
                <div className="text-dark-300 font-medium">Mohamed Ammar</div>
                <div className="text-dark-300 font-medium">Dina Ali</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-8 text-center">
            About Me
          </h2>
          <div className="enhanced-card p-8 text-center">
            <h3 className="text-xl font-semibold text-dark-100 mb-4">
              Platform Developer & Designer
            </h3>
            <p className="text-dark-300 leading-relaxed max-w-3xl mx-auto">
              I am a developer and designer specializing in the field of education and technology, 
              working on developing advanced educational platforms and designing exceptional user experiences. 
              I have extensive experience in developing educational platforms and designing interactive educational content.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}