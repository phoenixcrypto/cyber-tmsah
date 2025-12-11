/**
 * Result Pattern for Type-Safe Error Handling
 * Modern functional programming pattern for error handling (2026 standard)
 * 
 * This pattern eliminates the need for try-catch blocks and provides
 * type-safe error handling throughout the application.
 */

/**
 * Result type - represents either success or failure
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

/**
 * Create a successful result
 */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data }
}

/**
 * Create a failed result
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error }
}

/**
 * Wrap an async function that may throw into a Result
 */
export async function toResult<T, E = Error>(
  fn: () => Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await fn()
    return ok(data)
  } catch (error) {
    return err(error as E)
  }
}

/**
 * Wrap a synchronous function that may throw into a Result
 */
export function toResultSync<T, E = Error>(
  fn: () => T
): Result<T, E> {
  try {
    const data = fn()
    return ok(data)
  } catch (error) {
    return err(error as E)
  }
}

/**
 * Map over a Result (transform success value)
 */
export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> {
  if (result.success) {
    return ok(fn(result.data))
  }
  return result
}

/**
 * Map over error (transform error value)
 */
export function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> {
  if (!result.success) {
    return err(fn(result.error))
  }
  return result
}

/**
 * Chain Results (flatMap)
 */
export function chainResult<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> {
  if (result.success) {
    return fn(result.data)
  }
  return result
}

/**
 * Unwrap Result or throw error
 * Use with caution - prefer pattern matching
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.data
  }
  throw result.error
}

/**
 * Unwrap Result or return default value
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (result.success) {
    return result.data
  }
  return defaultValue
}

/**
 * Unwrap Result or execute fallback function
 */
export function unwrapOrElse<T, E>(
  result: Result<T, E>,
  fallback: (error: E) => T
): T {
  if (result.success) {
    return result.data
  }
  return fallback(result.error)
}

