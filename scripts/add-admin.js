import mysql from 'mysql2/promise';

async function addAdmin() {
    console.log('--- Adding New Admin ---');

    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fammanga'
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL');

        // Hash for 'admin123'
        const passwordHash = '$2b$10$Gr1PDqHNK1/VhGiqFdp7gOndSz/HUgM1ykdfddUDvX/J8OQzZEl4e';

        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin2', 'admin2@fammanga.com', passwordHash, 'admin']
        );

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Username: admin2');
        console.log('Password: admin123');
        console.log('-----------------------------------');

        await connection.end();
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('❌ Error: User "admin2" already exists.');
        } else {
            console.error('❌ Error adding admin:', error);
        }
    }
}

addAdmin();
