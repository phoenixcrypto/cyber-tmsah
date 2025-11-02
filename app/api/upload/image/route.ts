import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Convert image to WebP using browser Canvas API (client-side conversion)
// For server-side: npm install sharp, then uncomment sharp code below

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // For now, return base64 - WebP conversion will be done client-side
    // In production, use sharp or cloud service (Cloudinary, etc.)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
      size: buffer.length,
      message: 'Image uploaded. Use client-side WebP conversion for optimization.'
    })

    /* 
    // Server-side WebP conversion (requires: npm install sharp)
    import sharp from 'sharp'
    
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85, effort: 6 })
      .resize(1200, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .toBuffer()

    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
    const base64 = webpBuffer.toString('base64')
    const dataUrl = `data:image/webp;base64,${base64}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename,
      size: webpBuffer.length,
      originalSize: buffer.length,
      compression: Math.round((1 - webpBuffer.length / buffer.length) * 100)
    })
    */
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    )
  }
}
