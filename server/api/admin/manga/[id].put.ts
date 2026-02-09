import { executeQuery } from '~/server/database/connection'
import { requireAdmin } from '~/server/utils/auth'

interface UpdateMangaBody {
    title?: string
    title_en?: string
    author?: string
    artist?: string
    description?: string
    cover_image?: string
    status?: 'ongoing' | 'completed' | 'hiatus'
    genres?: string[]
}

export default defineEventHandler(async (event) => {
    try {
        // Require admin role
        await requireAdmin(event)

        const id = getRouterParam(event, 'id')
        const body = await readBody<UpdateMangaBody>(event)

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing manga ID',
            })
        }

        // Build update query
        const updates: string[] = []
        const params: any[] = []

        if (body.title) {
            updates.push('title = ?')
            params.push(body.title)
        }
        if (body.title_en !== undefined) {
            updates.push('title_en = ?')
            params.push(body.title_en)
        }
        if (body.author !== undefined) {
            updates.push('author = ?')
            params.push(body.author)
        }
        if (body.artist !== undefined) {
            updates.push('artist = ?')
            params.push(body.artist)
        }
        if (body.description !== undefined) {
            updates.push('description = ?')
            params.push(body.description)
        }
        if (body.cover_image !== undefined) {
            updates.push('cover_image = ?')
            params.push(body.cover_image)
        }
        if (body.status) {
            updates.push('status = ?')
            params.push(body.status)
        }
        if (body.genres) {
            updates.push('genres = ?')
            params.push(JSON.stringify(body.genres))
        }

        if (updates.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ไม่มีข้อมูลที่จะอัปเดต',
            })
        }

        params.push(id)

        await executeQuery(
            `UPDATE manga SET ${updates.join(', ')} WHERE id = ?`,
            params
        )

        return {
            success: true,
            message: 'อัปเดตมังงะสำเร็จ',
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Update manga error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการอัปเดตมังงะ',
        })
    }
})
