import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

const STORAGE_BUCKET = 'content-files' // Bucket name in Supabase Storage

/**
 * Upload file to Supabase Storage
 * @param file File to upload
 * @param folder Folder path in storage (e.g., 'articles', 'tasks')
 * @returns Public URL of uploaded file or null if failed
 */
export async function uploadFileToStorage(
  file: File,
  folder: string = 'general'
): Promise<string | null> {
  try {
    const supabase = createAdminClient()
    
    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || ''
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false, // Don't overwrite existing files
      })

    if (uploadError) {
      logger.error('[Storage] Upload error:', uploadError)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName)

    return urlData.publicUrl
  } catch (error) {
    logger.error('[Storage] Upload exception:', error)
    return null
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param files Array of files to upload
 * @param folder Folder path in storage
 * @returns Array of public URLs (null for failed uploads)
 */
export async function uploadFilesToStorage(
  files: File[],
  folder: string = 'general'
): Promise<(string | null)[]> {
  const uploadPromises = files.map(file => uploadFileToStorage(file, folder))
  return Promise.all(uploadPromises)
}

/**
 * Delete file from Supabase Storage
 * @param fileUrl Public URL of the file to delete
 * @returns true if deleted successfully
 */
export async function deleteFileFromStorage(fileUrl: string): Promise<boolean> {
  try {
    const supabase = createAdminClient()
    
    // Extract file path from URL
    const urlParts = fileUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const folder = urlParts[urlParts.length - 2]
    const filePath = `${folder}/${fileName}`
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) {
      logger.error('[Storage] Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    logger.error('[Storage] Delete exception:', error)
    return false
  }
}

