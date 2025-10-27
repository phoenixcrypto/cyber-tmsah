'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, User, FileText, Download, Share2, BookOpen } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function LecturePage() {
  const params = useParams()
  const subjectId = params.id as string
  const lectureId = params.lectureId as string

  // Sample lecture content - this would come from a database in a real app
  const lectureContent = {
    id: lectureId,
    title: 'Introduction to Applied Physics',
    subject: 'Applied Physics',
    instructor: 'Dr. Ahmed Bakr',
    duration: '90 minutes',
    date: '2024-01-15',
    content: `
# Introduction to Applied Physics

## Overview
Applied physics is the application of physics principles to solve real-world problems and develop new technologies. This field bridges the gap between theoretical physics and practical engineering applications.

## Key Concepts

### 1. Fundamental Principles
- **Newton's Laws of Motion**: The foundation of classical mechanics
- **Conservation of Energy**: Energy cannot be created or destroyed, only transformed
- **Wave-Particle Duality**: Matter exhibits both wave and particle properties

### 2. Applications in Technology
- **Semiconductor Physics**: Essential for electronics and computing
- **Optics**: Used in lasers, fiber optics, and imaging systems
- **Thermodynamics**: Applied in engines, refrigeration, and power generation

## Mathematical Foundations

### Basic Equations
The fundamental equation of motion:
\`\`\`
F = ma
\`\`\`

Where:
- F = Force (N)
- m = Mass (kg)
- a = Acceleration (m/s²)

### Energy Conservation
\`\`\`
E_total = E_kinetic + E_potential
\`\`\`

## Real-World Examples

### 1. Smartphone Technology
Modern smartphones rely heavily on applied physics:
- **Touchscreen**: Capacitive sensing based on electric fields
- **Camera**: Lens optics and image sensor physics
- **Battery**: Electrochemical energy storage

### 2. Medical Imaging
- **MRI**: Uses magnetic resonance principles
- **X-rays**: Electromagnetic radiation for imaging
- **Ultrasound**: Sound wave propagation and reflection

## Laboratory Applications

### Safety Protocols
1. Always wear appropriate protective equipment
2. Follow experimental procedures carefully
3. Report any accidents immediately
4. Keep laboratory areas clean and organized

### Common Equipment
- **Oscilloscope**: For measuring electrical signals
- **Multimeter**: For measuring voltage, current, and resistance
- **Power Supply**: For providing controlled electrical power

## Problem-Solving Approach

### Step-by-Step Method
1. **Identify the Problem**: Clearly define what needs to be solved
2. **Gather Information**: Collect relevant data and principles
3. **Apply Physics Principles**: Use appropriate equations and concepts
4. **Calculate**: Perform mathematical operations
5. **Verify Results**: Check if the answer makes physical sense

## Practice Problems

### Problem 1
A car with mass 1500 kg accelerates from rest to 20 m/s in 10 seconds. Calculate the force required.

**Solution:**
Given: m = 1500 kg, v = 20 m/s, t = 10 s
First, find acceleration: a = v/t = 20/10 = 2 m/s²
Then, F = ma = 1500 × 2 = 3000 N

### Problem 2
A ball is dropped from a height of 20 meters. Calculate its velocity when it hits the ground.

**Solution:**
Using conservation of energy:
mgh = ½mv²
v = √(2gh) = √(2 × 9.8 × 20) = √392 = 19.8 m/s

## Summary

Applied physics provides the foundation for understanding and developing modern technology. By combining theoretical knowledge with practical applications, we can solve complex problems and create innovative solutions.

## Next Steps

In the next lecture, we will explore:
- Advanced mechanics and motion
- Rotational dynamics
- Applications in robotics and automation

## Additional Resources

- Textbook: "Applied Physics" by Dr. Smith
- Online simulations: PhET Interactive Simulations
- Laboratory manual: Available in the course materials
    `,
    attachments: [
      {
        name: 'Lecture Slides',
        type: 'PDF',
        size: '2.4 MB',
        url: '#'
      },
      {
        name: 'Practice Problems',
        type: 'PDF',
        size: '1.8 MB',
        url: '#'
      },
      {
        name: 'Lab Manual',
        type: 'PDF',
        size: '3.2 MB',
        url: '#'
      }
    ],
    relatedLectures: [
      {
        id: '2',
        title: 'Mechanics and Motion',
        date: '2024-01-22'
      },
      {
        id: '3',
        title: 'Thermodynamics',
        date: '2024-01-29'
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/materials/${subjectId}`} 
            className="inline-flex items-center gap-2 text-cyber-neon hover:text-cyber-green transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {lectureContent.subject}
          </Link>
          
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-4">
              {lectureContent.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-dark-400 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{lectureContent.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{lectureContent.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{lectureContent.date}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Lecture Content */}
        <div className="enhanced-card p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-dark-200 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: lectureContent.content
                  .replace(/\n/g, '<br>')
                  .replace(/#{3}\s(.+)/g, '<h3 class="text-xl font-semibold text-dark-100 mt-6 mb-3">$1</h3>')
                  .replace(/#{2}\s(.+)/g, '<h2 class="text-2xl font-semibold text-dark-100 mt-8 mb-4">$1</h2>')
                  .replace(/#{1}\s(.+)/g, '<h1 class="text-3xl font-bold text-dark-100 mt-8 mb-6">$1</h1>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-cyber-neon">$1</strong>')
                  .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre class="bg-cyber-dark/50 p-4 rounded-lg overflow-x-auto my-4"><code class="text-cyber-green">$1</code></pre>')
                  .replace(/\`(.+?)\`/g, '<code class="bg-cyber-dark/50 px-2 py-1 rounded text-cyber-green">$1</code>')
                  .replace(/^\d+\.\s(.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
                  .replace(/^-\s(.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
              }}
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="enhanced-card p-6 mb-8">
          <h3 className="text-xl font-semibold text-dark-100 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyber-neon" />
            Attachments
          </h3>
          <div className="space-y-3">
            {lectureContent.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-cyber-dark/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-cyber-violet" />
                  <div>
                    <span className="text-dark-100 font-medium">{attachment.name}</span>
                    <span className="text-dark-400 text-sm ml-2">({attachment.type}, {attachment.size})</span>
                  </div>
                </div>
                <button className="btn-tertiary text-sm">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Related Lectures */}
        <div className="enhanced-card p-6">
          <h3 className="text-xl font-semibold text-dark-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyber-neon" />
            Related Lectures
          </h3>
          <div className="space-y-3">
            {lectureContent.relatedLectures.map((lecture, index) => (
              <Link
                key={index}
                href={`/materials/${subjectId}/${lecture.id}`}
                className="block p-3 bg-cyber-dark/30 rounded-lg hover:bg-cyber-dark/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-dark-100 font-medium">{lecture.title}</span>
                  <span className="text-dark-400 text-sm">{lecture.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
