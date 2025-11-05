'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  onLoad?: () => void
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  onLoad,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(priority)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority || isLoaded) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.01 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isLoaded])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  if (fill) {
    return (
      <div ref={imgRef} className={`relative ${className}`}>
        {isInView && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleLoad}
            loading={priority ? 'eager' : 'lazy'}
          />
        )}
      </div>
    )
  }

  return (
    <div ref={imgRef} className={className}>
      {isInView && width && height && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
        />
      )}
    </div>
  )
}
