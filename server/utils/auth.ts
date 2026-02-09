import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

const SALT_ROUNDS = 10

export interface User {
    id: number
    username: string
    email: string
    role: 'user' | 'admin'
    avatar?: string
}

export interface JWTPayload {
    userId: number
    username: string
    email: string
    role: 'user' | 'admin'
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

// Verify password
export const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export const generateToken = (user: User): string => {
    const config = useRuntimeConfig()
    const payload: JWTPayload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    }

    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: '7d', // Token valid for 7 days
    })
}

// Verify JWT token
export const verifyToken = (token: string): JWTPayload | null => {
    try {
        const config = useRuntimeConfig()
        return jwt.verify(token, config.jwtSecret) as JWTPayload
    } catch (error) {
        return null
    }
}

// Get user from request (middleware helper)
export const getUserFromEvent = async (event: H3Event): Promise<User | null> => {
    try {
        const authHeader = getHeader(event, 'authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }

        const token = authHeader.substring(7)
        const payload = verifyToken(token)

        if (!payload) {
            return null
        }

        return {
            id: payload.userId,
            username: payload.username,
            email: payload.email,
            role: payload.role,
        }
    } catch (error) {
        return null
    }
}

// Require authentication middleware
export const requireAuth = async (event: H3Event): Promise<User> => {
    const user = await getUserFromEvent(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized - กรุณาเข้าสู่ระบบ',
        })
    }

    return user
}

// Require admin role middleware
export const requireAdmin = async (event: H3Event): Promise<User> => {
    const user = await requireAuth(event)

    if (user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden - คุณไม่มีสิทธิ์เข้าถึง',
        })
    }

    return user
}
