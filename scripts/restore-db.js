import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function restoreDatabase() {
    console.log('--- Database Restoration ---');

    // Config
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        multipleStatements: true // Important for running schema.sql
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL');

        // Read schema.sql
        const schemaPath = path.resolve('server/database/schema.sql');
        let schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        // Fix schema SQL to force correct DB name
        // Replace "CREATE DATABASE ... fammanga" to ensure it matches .env
        schemaSQL = schemaSQL.replace(/CREATE DATABASE IF NOT EXISTS \w+/g, 'CREATE DATABASE IF NOT EXISTS fammanga');
        schemaSQL = schemaSQL.replace(/USE \w+/g, 'USE fammanga');

        console.log('🔄 Executing schema.sql...');
        await connection.query(schemaSQL);

        console.log('✅ Schema executed successfully!');
        console.log('✅ Tables created: users, manga, chapters, etc.');
        console.log('✅ Default users created: admin, testuser');

        await connection.end();
        console.log('--- Restoration Complete ---');
    } catch (error) {
        console.error('❌ Restoration failed:', error);
    }
}

restoreDatabase();
