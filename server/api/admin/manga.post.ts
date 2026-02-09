import { executeQuery } from '~/server/database/connection'
import { requireAdmin } from '~/server/utils/auth'

interface CreateMangaBody {
    title: string
    title_en?: string
    author?: string
    artist?: string
    description?: string
    cover_image?: string
    status: 'ongoing' | 'completed' | 'hiatus'
    genres?: string[]
}

export default defineEventHandler(async (event) => {
    try {
        // Require admin role
        await requireAdmin(event)

        const body = await readBody<CreateMangaBody>(event)

        // Validation
        if (!body.title) {
            throw createError({
                statusCode: 400,
                statusMessage: 'กรุณาระบุชื่อมังงะ',
            })
        }

        // Convert genres array to JSON
        const genres = body.genres ? JSON.stringify(body.genres) : null

        // Insert manga
        const result = await executeQuery<any>(
            `INSERT INTO manga (title, title_en, author, artist, description, cover_image, status, genres)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                body.title,
                body.title_en || null,
                body.author || null,
                body.artist || null,
                body.description || null,
                body.cover_image || null,
                body.status || 'ongoing',
                genres,
            ]
        )

        return {
            success: true,
            message: 'เพิ่มมังงะสำเร็จ',
            data: {
                id: result.insertId,
            },
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Create manga error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการเพิ่มมังงะ',
        })
    }
})
