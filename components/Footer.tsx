'use client'

import { MessageCircle, User, Code, Award } from 'lucide-react'

export default function Footer() {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Hello! I would like to contact you about the Cyber TMSAH platform')
    const whatsappUrl = `https://wa.me/201553450232?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <footer className="bg-cyber-dark border-t border-cyber-neon/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Developer Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="enhanced-card p-6 text-center">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-cyber-neon via-cyber-violet to-cyber-green rounded-full flex items-center justify-center shadow-lg shadow-cyber-neon/30">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h2 className="text-2xl font-orbitron font-bold text-dark-100 mb-2">
                  ZEYAD MOHAMED
                </h2>
                <p className="text-lg text-cyber-neon mb-3">Creative Developer & Designer</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-end mb-4">
                  <div className="flex items-center gap-2 text-dark-300">
                    <div className="w-5 h-5 bg-gradient-to-br from-cyber-green via-cyber-neon to-cyber-green rounded-full flex items-center justify-center shadow-lg shadow-cyber-green/30">
                      <Code className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">Full Stack Developer</span>
                  </div>
                  <div className="flex items-center gap-2 text-dark-300">
                    <div className="w-5 h-5 bg-gradient-to-br from-cyber-violet via-cyber-blue to-cyber-violet rounded-full flex items-center justify-center shadow-lg shadow-cyber-violet/30">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">UI/UX Designer</span>
                  </div>
                </div>
                <p className="text-dark-300 text-sm leading-relaxed mb-4 max-w-2xl mx-auto">
                  A university student and innovative developer focused on making education easier and more interactive 
                  through modern technology. I love building smart solutions that help fellow students succeed. 
                  An independent developer passionate about creating educational platforms that empower learners 
                  to achieve their goals through user-friendly digital experiences.
                </p>
                <button
                  onClick={handleWhatsAppContact}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <div className="text-dark-300 text-sm">
            © 2024 Cyber TMSAH. All rights reserved.
          </div>
          <div className="text-cyber-neon text-sm mt-2 font-medium">
            Created by ZEYAD MOHAMED
          </div>
        </div>
      </div>
    </footer>
  )
}