import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export const getDbConnection = () => {
    if (!pool) {
        const config = useRuntimeConfig()

        pool = mysql.createPool({
            host: config.dbHost,
            user: config.dbUser,
            password: config.dbPassword,
            database: config.dbName,
            port: parseInt(config.dbPort),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        })
    }

    return pool
}

export const executeQuery = async <T = any>(
    query: string,
    params?: any[]
): Promise<T> => {
    try {
        const connection = getDbConnection()
        const [results] = await connection.execute(query, params)
        return results as T
    } catch (error) {
        console.error('Database error:', error)
        throw error
    }
}
