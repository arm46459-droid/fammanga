import mysql from 'mysql2/promise';

async function restoreAdmin() {
    console.log('--- Restoring Admin User ---');

    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fammanga'
    };

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Hash for 'admin123'
        const passwordHash = '$2b$10$Gr1PDqHNK1/VhGiqFdp7gOndSz/HUgM1ykdfddUDvX/J8OQzZEl4e';

        // Check if admin exists
        const [rows] = await connection.execute('SELECT id FROM users WHERE username = ?', ['admin']);

        if (rows.length === 0) {
            await connection.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@fammanga.com', passwordHash, 'admin']
            );
            console.log('✅ Admin user created successfully!');
        } else {
            console.log('⚠️ Admin user already exists, updating password...');
            await connection.execute(
                'UPDATE users SET password = ? WHERE username = ?',
                [passwordHash, 'admin']
            );
            console.log('✅ Admin password updated!');
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Error restoring admin:', error);
    }
}

restoreAdmin();
