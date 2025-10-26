'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Home, Calendar, Info, CheckSquare, BookOpen } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home, iconColor: 'text-cyber-neon' },
    { href: '/schedule', label: 'الجدول', icon: Calendar, iconColor: 'text-cyber-violet' },
    { href: '/tasks', label: 'المهام', icon: CheckSquare, iconColor: 'text-cyber-green' },
    { href: '/materials', label: 'المواد', icon: BookOpen, iconColor: 'text-cyber-blue' },
    { href: '/about', label: 'حول', icon: Info, iconColor: 'text-cyber-neon' },
  ]

  return (
    <nav className="bg-cyber-dark/90 backdrop-blur-md border-b border-cyber-neon/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 text-cyber-neon hover:text-cyber-violet transition-colors group">
            <div className="flex flex-col">
              <span className="font-orbitron font-bold text-2xl bg-gradient-to-r from-cyber-neon via-cyber-violet to-cyber-green bg-clip-text text-transparent group-hover:from-cyber-violet group-hover:via-cyber-green group-hover:to-cyber-neon transition-all duration-300">
                Cyber TMSAH
              </span>
              <span className="text-sm text-cyber-neon/70 font-medium">منصة تعليمية متطورة</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-dark-200 hover:text-cyber-neon hover:bg-cyber-neon/10 transition-all duration-300 group"
                >
                  <Icon className={`w-4 h-4 ${item.iconColor} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-dark-200 hover:text-cyber-neon hover:bg-cyber-neon/10 transition-all duration-300"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-cyber-dark/95 backdrop-blur-md border-t border-cyber-neon/20">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center space-x-4 px-3 py-3 rounded-lg text-dark-200 hover:text-cyber-neon hover:bg-cyber-neon/10 transition-all duration-300 group"
                  >
                    <Icon className={`w-5 h-5 ${item.iconColor} group-hover:scale-110 transition-transform`} />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}