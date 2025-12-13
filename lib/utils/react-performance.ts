/**
 * React Performance Utilities
 * Professional-grade performance optimization utilities for React components
 */

import { memo, ComponentType, lazy } from 'react'

/**
 * Memoize component with custom comparison
 * @template P - Component props type
 */
export function memoizeComponent<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
): ComponentType<P> {
  return memo(Component, areEqual) as unknown as ComponentType<P>
}

/**
 * Lazy load component with loading fallback
 * @template P - Component props type
 */
export function lazyLoad<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>
  // fallback parameter reserved for future use with Suspense
): React.LazyExoticComponent<ComponentType<P>> {
  return lazy(importFn)
}

/**
 * Check if props are equal (shallow comparison)
 * Type-safe shallow equality check for objects
 */
export function shallowEqual<T extends Record<string, unknown>>(
  obj1: T,
  obj2: T
): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

