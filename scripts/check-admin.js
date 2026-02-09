import mysql from 'mysql2/promise';

async function checkAdmin() {
    console.log('--- Checking Admin User ---');

    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fammanga'
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, username, password, role FROM users WHERE username = ?', ['admin']);

        if (rows.length > 0) {
            console.log('User found:', rows[0]);
        } else {
            console.log('User "admin" not found!');
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkAdmin();
