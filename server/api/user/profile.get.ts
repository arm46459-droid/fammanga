import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)

        return {
            success: true,
            data: user,
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
        })
    }
})
