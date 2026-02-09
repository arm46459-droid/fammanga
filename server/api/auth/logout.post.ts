import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        // Verify user is authenticated
        await requireAuth(event)

        // In a real application, you might want to invalidate the token
        // For now, we'll just return a success message
        // The client will remove the token from storage

        return {
            success: true,
            message: 'ออกจากระบบสำเร็จ',
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการออกจากระบบ',
        })
    }
})
