import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  // 1. Admin Authentication
  // Using verifyToken directly since we might not have middleware setting event.context.user
  const authHeader = getRequestHeader(event, 'Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const token = authHeader.substring(7)
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // 2. Handle File Upload
  try {
    console.log('Starting upload handling...') // DEBUG
    const files = await readMultipartFormData(event)
    console.log('Files received:', files?.length) // DEBUG

    if (!files || files.length === 0) {
      console.error('No files found in request')
      throw createError({ statusCode: 400, message: 'No files uploaded' })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'manga')
    console.log('Upload directory:', uploadDir) // DEBUG

    if (!fs.existsSync(uploadDir)) {
      console.log('Creating directory...')
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const uploadedFiles: { originalName: string, url: string }[] = []
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    for (const file of files) {
      console.log('Processing file:', file.name, file.filename, file.type) // DEBUG
      if (file.name === 'images') {
        // Validate type
        if (!allowedTypes.includes(file.type || '')) {
          continue
        }

        const ext = path.extname(file.filename || '') || '.jpg'
        const filename = `${Date.now()}_${randomUUID()}${ext}`
        const filepath = path.join(uploadDir, filename)

        fs.writeFileSync(filepath, file.data)

        uploadedFiles.push({
          originalName: file.filename || '',
          url: `/uploads/manga/${filename}`
        })
      }
    }

    // Sort by original filename to maintain page order
    uploadedFiles.sort((a, b) => a.originalName.localeCompare(b.originalName, undefined, { numeric: true }))

    const urls = uploadedFiles.map(f => f.url)

    return {
      success: true,
      urls,
      count: urls.length,
      message: `Uploaded ${urls.length} images successfully`
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal Server Error'
    })
  }
})

