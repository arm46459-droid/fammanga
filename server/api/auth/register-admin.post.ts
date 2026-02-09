import { executeQuery } from '~/server/database/connection'
import { hashPassword } from '~/server/utils/auth'

interface RegisterAdminBody {
    username: string
    email: string
    password: string
    adminKey: string
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<RegisterAdminBody>(event)

        // Validate Secret Key
        if (body.adminKey !== 'fammanga') {
            throw createError({
                statusCode: 403,
                statusMessage: 'รหัสยืนยันผู้ดูแลระบบไม่ถูกต้อง',
            })
        }

        // Validation
        if (!body.username || !body.email || !body.password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            })
        }

        // Check username format
        if (body.username.length < 3 || body.username.length > 50) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ชื่อผู้ใช้ต้องมีความยาว 3-50 ตัวอักษร',
            })
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'รูปแบบอีเมลไม่ถูกต้อง',
            })
        }

        // Check password strength
        if (body.password.length < 6) {
            throw createError({
                statusCode: 400,
                statusMessage: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
            })
        }

        // Check if username already exists
        const existingUser = await executeQuery<any[]>(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [body.username, body.email]
        )

        if (existingUser.length > 0) {
            throw createError({
                statusCode: 409,
                statusMessage: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว',
            })
        }

        // Hash password
        const hashedPassword = await hashPassword(body.password)

        // Insert new ADMIN user
        await executeQuery(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [body.username, body.email, hashedPassword, 'admin']
        )

        return {
            success: true,
            message: 'สมัครสมาชิกผู้ดูแลระบบสำเร็จ! กรุณาเข้าสู่ระบบ',
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Admin Register error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
        })
    }
})
