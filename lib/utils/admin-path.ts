/**
 * Admin path configuration
 * Get admin path from environment variable or use default
 * This allows customizing the admin panel URL for security
 * 
 * To customize the admin path, set ADMIN_PATH in your .env file:
 * ADMIN_PATH="your-custom-path"
 * 
 * Example: ADMIN_PATH="dashboard" will make the admin panel accessible at /dashboard
 * Default: "admin" (if ADMIN_PATH is not set)
 */

export function getAdminPath(): string {
  // Get from environment variable, default to 'admin' if not set
  return process.env['ADMIN_PATH'] || 'admin'
}

export function getAdminLoginPath(): string {
  return `/${getAdminPath()}/login`
}

export function getAdminBasePath(): string {
  return `/${getAdminPath()}`
}

