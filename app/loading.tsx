export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="w-20 h-20 border-4 border-cyber-neon/20 border-t-cyber-neon rounded-full animate-spin mx-auto mb-8"></div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-semibold text-dark-100 mb-4">
          جاري التحميل...
        </h2>
        
        <p className="text-dark-300">
          يرجى الانتظار قليلاً
        </p>
        
        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-cyber-neon rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-cyber-neon rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-cyber-neon rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}