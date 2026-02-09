import { executeQuery } from '~/server/database/connection'
import { requireAdmin } from '~/server/utils/auth'

interface CreateChapterBody {
    mangaId: number
    chapterNumber: number
    title?: string
    pages: string[]
}

export default defineEventHandler(async (event) => {
    try {
        // Require admin role
        await requireAdmin(event)

        const body = await readBody<CreateChapterBody>(event)

        // Validation
        if (!body.mangaId || !body.chapterNumber || !body.pages || body.pages.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'กรุณาระบุข้อมูลให้ครบถ้วน',
            })
        }

        // Convert pages to JSON
        const pagesJson = JSON.stringify(body.pages)

        // Insert chapter
        await executeQuery(
            `INSERT INTO chapters (manga_id, chapter_number, title, pages)
       VALUES (?, ?, ?, ?)`,
            [body.mangaId, body.chapterNumber, body.title || null, pagesJson]
        )

        // Update total chapters count in manga table
        await executeQuery(
            `UPDATE manga 
       SET total_chapters = (SELECT COUNT(*) FROM chapters WHERE manga_id = ?)
       WHERE id = ?`,
            [body.mangaId, body.mangaId]
        )

        return {
            success: true,
            message: 'เพิ่มตอนสำเร็จ',
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Create chapter error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการเพิ่มตอน',
        })
    }
})
