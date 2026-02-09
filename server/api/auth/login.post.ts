import { executeQuery } from '~/server/database/connection'
import { verifyPassword, generateToken, type User } from '~/server/utils/auth'

interface LoginBody {
    username: string
    password: string
}

interface UserRow {
    id: number
    username: string
    email: string
    password: string
    role: 'user' | 'admin'
    avatar: string | null
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<LoginBody>(event)

        // Validation
        if (!body.username || !body.password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
            })
        }

        // Get user from database
        const users = await executeQuery<UserRow[]>(
            'SELECT id, username, email, password, role, avatar FROM users WHERE username = ? OR email = ?',
            [body.username, body.username]
        )

        if (users.length === 0) {
            throw createError({
                statusCode: 401,
                statusMessage: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
            })
        }

        const user = users[0]

        // Verify password
        const isPasswordValid = await verifyPassword(body.password, user.password)

        if (!isPasswordValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
            })
        }

        // Generate token
        const userPayload: User = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar || undefined,
        }

        const token = generateToken(userPayload)

        return {
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Login error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        })
    }
})
