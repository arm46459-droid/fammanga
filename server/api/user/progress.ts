import { executeQuery } from '~/server/database/connection'
import { requireAuth } from '~/server/utils/auth'

interface ProgressBody {
    mangaId: number
    chapterId: number
    pageNumber: number
}

export default defineEventHandler(async (event) => {
    const method = event.method

    try {
        const user = await requireAuth(event)

        if (method === 'GET') {
            // Get reading progress for a specific manga or all manga
            const query = getQuery(event)
            const mangaId = query.mangaId

            let progress
            if (mangaId) {
                progress = await executeQuery<any[]>(
                    `SELECT rp.*, m.title, c.chapter_number, c.title as chapter_title
           FROM reading_progress rp
           JOIN manga m ON rp.manga_id = m.id
           JOIN chapters c ON rp.chapter_id = c.id
           WHERE rp.user_id = ? AND rp.manga_id = ?`,
                    [user.id, mangaId]
                )
            } else {
                progress = await executeQuery<any[]>(
                    `SELECT rp.*, m.title, m.cover_image, c.chapter_number, c.title as chapter_title
           FROM reading_progress rp
           JOIN manga m ON rp.manga_id = m.id
           JOIN chapters c ON rp.chapter_id = c.id
           WHERE rp.user_id = ?
           ORDER BY rp.last_read_at DESC`,
                    [user.id]
                )
            }

            return {
                success: true,
                data: progress,
            }
        } else if (method === 'POST') {
            // Update reading progress
            const body = await readBody<ProgressBody>(event)

            if (!body.mangaId || !body.chapterId) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing required fields',
                })
            }

            // Check if progress exists
            const existing = await executeQuery<any[]>(
                'SELECT id FROM reading_progress WHERE user_id = ? AND manga_id = ?',
                [user.id, body.mangaId]
            )

            if (existing.length > 0) {
                // Update existing progress
                await executeQuery(
                    `UPDATE reading_progress 
           SET chapter_id = ?, page_number = ?, last_read_at = CURRENT_TIMESTAMP
           WHERE user_id = ? AND manga_id = ?`,
                    [body.chapterId, body.pageNumber || 1, user.id, body.mangaId]
                )
            } else {
                // Insert new progress
                await executeQuery(
                    `INSERT INTO reading_progress (user_id, manga_id, chapter_id, page_number)
           VALUES (?, ?, ?, ?)`,
                    [user.id, body.mangaId, body.chapterId, body.pageNumber || 1]
                )
            }

            return {
                success: true,
                message: 'บันทึกความคืบหน้าสำเร็จ',
            }
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Progress error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการบันทึกความคืบหน้า',
        })
    }
})
