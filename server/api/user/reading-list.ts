import { executeQuery } from '~/server/database/connection'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const method = event.method

    try {
        const user = await requireAuth(event)

        if (method === 'GET') {
            // Get user's reading list
            const readingList = await executeQuery<any[]>(
                `SELECT m.*, rl.added_at
         FROM user_reading_list rl
         JOIN manga m ON rl.manga_id = m.id
         WHERE rl.user_id = ?
         ORDER BY rl.added_at DESC`,
                [user.id]
            )

            return {
                success: true,
                data: readingList,
            }
        } else if (method === 'POST') {
            // Add to reading list
            const body = await readBody<{ mangaId: number }>(event)

            if (!body.mangaId) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing manga ID',
                })
            }

            // Check if already in list
            const existing = await executeQuery<any[]>(
                'SELECT id FROM user_reading_list WHERE user_id = ? AND manga_id = ?',
                [user.id, body.mangaId]
            )

            if (existing.length > 0) {
                throw createError({
                    statusCode: 409,
                    statusMessage: 'มังงะนี้อยู่ในรายการอ่านแล้ว',
                })
            }

            await executeQuery(
                'INSERT INTO user_reading_list (user_id, manga_id) VALUES (?, ?)',
                [user.id, body.mangaId]
            )

            return {
                success: true,
                message: 'เพิ่มลงรายการอ่านสำเร็จ',
            }
        } else if (method === 'DELETE') {
            // Remove from reading list
            const body = await readBody<{ mangaId: number }>(event)

            if (!body.mangaId) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing manga ID',
                })
            }

            await executeQuery(
                'DELETE FROM user_reading_list WHERE user_id = ? AND manga_id = ?',
                [user.id, body.mangaId]
            )

            return {
                success: true,
                message: 'ลบออกจากรายการอ่านสำเร็จ',
            }
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Reading list error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการจัดการรายการอ่าน',
        })
    }
})
