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

        // Get manga details
        const manga = await executeQuery<any[]>(
            `SELECT id, title, title_en, author, artist, description, cover_image, status, genres, rating, total_chapters, views, created_at, updated_at
       FROM manga
       WHERE id = ?`,
            [id]
        )

        if (manga.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'ไม่พบมังงะที่ต้องการ',
            })
        }

        // Update view count
        await executeQuery(
            'UPDATE manga SET views = views + 1 WHERE id = ?',
            [id]
        )

        return {
            success: true,
            data: manga[0],
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Get manga detail error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการดึงข้อมูลมังงะ',
        })
    }
})
