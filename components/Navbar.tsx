'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/materials', label: 'Materials' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/about', label: 'About' },
    { href: '/admin', label: 'Admin', admin: true },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-md border-b border-green-500 h-16 sm:h-20 flex items-center shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 sm:h-20 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-orbitron font-black text-lg sm:text-xl md:text-2xl"
              style={{
                background: 'linear-gradient(135deg, #00FF88, #8A2BE2, #00FF88)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px',
                animation: 'gradientShift 4s ease infinite'
              }}
            >
              <span className="hidden sm:inline">CYBER TMSAH</span>
              <span className="sm:hidden">CT</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => {
              // Hide admin link for now (you can add authentication later)
              if (item.admin) return null
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 font-semibold transition-all duration-300 text-sm lg:text-base ${
                    pathname === item.href
                      ? 'text-green-400 bg-green-400/10 rounded-lg'
                      : 'text-white hover:text-green-400 hover:bg-green-400/10 rounded-lg'
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-purple-500 rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-400 transition-colors duration-300 p-2 rounded-lg hover:bg-green-400/10"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation - Full Screen Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-lg border-t border-green-500 shadow-2xl"
            >
              <div className="px-4 py-6 space-y-3">
                {navItems.map((item, index) => {
                  // Hide admin link for now
                  if (item.admin) return null
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-6 py-4 font-semibold transition-all duration-300 text-lg rounded-xl ${
                          pathname === item.href
                            ? 'text-green-400 bg-green-400/20 border border-green-400/30'
                            : 'text-white hover:text-green-400 hover:bg-green-400/10 border border-transparent'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
