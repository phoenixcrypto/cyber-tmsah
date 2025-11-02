/**
 * Utility functions for time formatting
 * Converts 24-hour format to 12-hour format with AM/PM
 */

/**
 * Convert 24-hour time format to 12-hour format with AM/PM
 * @param time24 - Time in 24-hour format (e.g., "09:00", "14:30", "23:45")
 * @returns Time in 12-hour format with AM/PM (e.g., "09:00 AM", "02:30 PM", "11:45 PM")
 */
export function convertTo12Hour(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24
  
  // Handle time range (e.g., "09:00 - 10:00")
  if (time24.includes(' - ')) {
    const parts = time24.split(' - ')
    const start = parts[0] || ''
    const end = parts[1] || ''
    if (start && end) {
      return `${convertTo12Hour(start)} - ${convertTo12Hour(end)}`
    }
  }
  
  // Handle single time (e.g., "09:00")
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours, 10)
  const minute = minutes || '00'
  
  if (hour === 0) {
    return `12:${minute} AM`
  } else if (hour < 12) {
    return `${hours}:${minute} AM`
  } else if (hour === 12) {
    return `12:${minute} PM`
  } else {
    const hour12 = hour - 12
    const hour12Str = hour12.toString().padStart(2, '0')
    return `${hour12Str}:${minute} PM`
  }
}

