import { executeQuery } from '~/server/database/connection'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const method = event.method

    try {
        const user = await requireAuth(event)

        if (method === 'GET') {
            // Get user's wishlist
            const wishlist = await executeQuery<any[]>(
                `SELECT m.*, w.added_at
         FROM user_wishlist w
         JOIN manga m ON w.manga_id = m.id
         WHERE w.user_id = ?
         ORDER BY w.added_at DESC`,
                [user.id]
            )

            return {
                success: true,
                data: wishlist,
            }
        } else if (method === 'POST') {
            // Add to wishlist
            const body = await readBody<{ mangaId: number }>(event)

            if (!body.mangaId) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing manga ID',
                })
            }

            // Check if already in wishlist
            const existing = await executeQuery<any[]>(
                'SELECT id FROM user_wishlist WHERE user_id = ? AND manga_id = ?',
                [user.id, body.mangaId]
            )

            if (existing.length > 0) {
                throw createError({
                    statusCode: 409,
                    statusMessage: 'มังงะนี้อยู่ในรายการที่อยากได้แล้ว',
                })
            }

            await executeQuery(
                'INSERT INTO user_wishlist (user_id, manga_id) VALUES (?, ?)',
                [user.id, body.mangaId]
            )

            return {
                success: true,
                message: 'เพิ่มลงรายการที่อยากได้สำเร็จ',
            }
        } else if (method === 'DELETE') {
            // Remove from wishlist
            const body = await readBody<{ mangaId: number }>(event)

            if (!body.mangaId) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing manga ID',
                })
            }

            await executeQuery(
                'DELETE FROM user_wishlist WHERE user_id = ? AND manga_id = ?',
                [user.id, body.mangaId]
            )

            return {
                success: true,
                message: 'ลบออกจากรายการที่อยากได้สำเร็จ',
            }
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Wishlist error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการจัดการรายการที่อยากได้',
        })
    }
})
