'use client'

import { useEffect, useRef } from 'react'

const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation variables
    let animationId: number
    let time = 0

    // Draw animated background
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      time += 0.01

      // Draw animated grid
      ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 + Math.sin(time) * 0.05})`
      ctx.lineWidth = 1

      const gridSize = 50
      const offsetX = (time * 20) % gridSize
      const offsetY = (time * 15) % gridSize

      // Vertical lines
      for (let x = -offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = -offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw floating orbs
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + Math.sin(time + i) * 50
        const y = canvas.height / 2 + Math.cos(time + i) * 100
        const radius = 30 + Math.sin(time * 2 + i) * 10

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(0, 255, 136, ${0.3 + Math.sin(time + i) * 0.1})`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw connection lines
      ctx.strokeStyle = `rgba(138, 43, 226, ${0.2 + Math.sin(time * 1.5) * 0.1})`
      ctx.lineWidth = 2

      for (let i = 0; i < 3; i++) {
        const startX = Math.sin(time + i) * canvas.width * 0.3 + canvas.width * 0.5
        const startY = Math.cos(time + i) * canvas.height * 0.3 + canvas.height * 0.5
        const endX = Math.sin(time + i + 1) * canvas.width * 0.4 + canvas.width * 0.5
        const endY = Math.cos(time + i + 1) * canvas.height * 0.4 + canvas.height * 0.5

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}

export default DynamicBackground
