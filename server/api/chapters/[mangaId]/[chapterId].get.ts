import { executeQuery } from '~/server/database/connection'

export default defineEventHandler(async (event) => {
    try {
        const mangaId = getRouterParam(event, 'mangaId')
        const chapterId = getRouterParam(event, 'chapterId')

        if (!mangaId || !chapterId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing manga ID or chapter ID',
            })
        }

        // Get chapter details with pages
        const chapters = await executeQuery<any[]>(
            `SELECT id, manga_id, chapter_number, title, pages, views, created_at
       FROM chapters
       WHERE id = ? AND manga_id = ?`,
            [chapterId, mangaId]
        )

        if (chapters.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'ไม่พบตอนที่ต้องการ',
            })
        }

        // Update view count
        await executeQuery(
            'UPDATE chapters SET views = views + 1 WHERE id = ?',
            [chapterId]
        )

        const chapter = chapters[0]

        // Parse JSON pages if it's a string
        if (typeof chapter.pages === 'string') {
            chapter.pages = JSON.parse(chapter.pages)
        }

        return {
            success: true,
            data: chapter,
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Get chapter error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการดึงข้อมูลตอน',
        })
    }
})
