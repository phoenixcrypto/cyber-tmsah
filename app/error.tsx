'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, AlertTriangle, Bug } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Error Icon */}
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-red-400 mb-6">
            System Error
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-4">
            An Unexpected Error Occurred
          </h2>
          
          <p className="text-lg text-dark-300 mb-8 leading-relaxed">
            Sorry, an unexpected error occurred in the system. 
            Please try again or return to the home page.
          </p>
          
          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="glass-card p-6 mb-8 text-right">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <Bug className="w-5 h-5 text-cyber-neon" />
                Error Details (Development Mode)
              </h3>
              <div className="bg-cyber-dark/50 p-4 rounded-lg border border-red-500/20">
                <p className="text-red-400 font-mono text-sm break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-dark-400 text-xs mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={reset}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="btn-secondary flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home Page
            </Link>
          </div>
          
          {/* Help Section */}
          <div className="glass-card p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
              Need Help?
            </h3>
            <p className="text-dark-300 mb-4">
              If the error persists, please contact the support team
            </p>
            <Link
              href="/contact"
              className="btn-tertiary inline-flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}