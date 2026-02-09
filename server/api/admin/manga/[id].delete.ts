import { executeQuery } from '~/server/database/connection'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        // Require admin role
        await requireAdmin(event)

        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing manga ID',
            })
        }

        // Delete manga (cascades to chapters, reading lists, etc.)
        await executeQuery('DELETE FROM manga WHERE id = ?', [id])

        return {
            success: true,
            message: 'ลบมังงะสำเร็จ',
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Delete manga error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการลบมังงะ',
        })
    }
})
