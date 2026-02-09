import { executeQuery } from '~/server/database/connection'

interface QueryParams {
    page?: string
    limit?: string
    search?: string
    genre?: string
    status?: string
    sort?: string
}

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event) as QueryParams

        // Pagination
        const page = parseInt(query.page || '1')
        const limit = parseInt(query.limit || '12')
        const offset = (page - 1) * limit

        // Build WHERE clause
        const whereClauses: string[] = []
        const params: any[] = []

        if (query.search) {
            whereClauses.push('(title LIKE ? OR title_en LIKE ? OR author LIKE ?)')
            const searchTerm = `%${query.search}%`
            params.push(searchTerm, searchTerm, searchTerm)
        }

        if (query.status) {
            whereClauses.push('status = ?')
            params.push(query.status)
        }

        if (query.genre) {
            whereClauses.push('JSON_CONTAINS(genres, ?)')
            params.push(JSON.stringify(query.genre))
        }

        const whereClause = whereClauses.length > 0
            ? `WHERE ${whereClauses.join(' AND ')}`
            : ''

        // Sort
        let orderBy = 'ORDER BY created_at DESC'
        if (query.sort === 'popular') {
            orderBy = 'ORDER BY views DESC'
        } else if (query.sort === 'rating') {
            orderBy = 'ORDER BY rating DESC'
        } else if (query.sort === 'title') {
            orderBy = 'ORDER BY title ASC'
        }

        // Get total count
        const countResult = await executeQuery<any[]>(
            `SELECT COUNT(*) as total FROM manga ${whereClause}`,
            params
        )
        const total = countResult[0].total

        // Get manga list
        const manga = await executeQuery<any[]>(
            `SELECT id, title, title_en, author, artist, description, cover_image, status, genres, rating, total_chapters, views, created_at
       FROM manga
       ${whereClause}
       ${orderBy}
       LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        )

        return {
            success: true,
            data: manga,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    } catch (error) {
        console.error('Get manga list error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการดึงข้อมูลมังงะ',
        })
    }
})
