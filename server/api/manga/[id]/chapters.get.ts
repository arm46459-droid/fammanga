import { executeQuery } from '~/server/database/connection'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing manga ID',
            })
        }

        // Get chapters for this manga
        const chapters = await executeQuery<any[]>(
            `SELECT id, manga_id, chapter_number, title, views, created_at, updated_at
       FROM chapters
       WHERE manga_id = ?
       ORDER BY chapter_number ASC`,
            [id]
        )

        return {
            success: true,
            data: chapters,
        }
    } catch (error) {
        console.error('Get chapters error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการดึงข้อมูลตอน',
        })
    }
})
