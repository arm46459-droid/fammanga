import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function testRegistration() {
    console.log('--- Starting Diagnostic Test ---');

    // 1. Test Bcrypt
    console.log('1. Testing Bcrypt...');
    try {
        const password = 'testpassword';
        const hash = await bcrypt.hash(password, 10);
        console.log('✅ Bcrypt hashing successful');
    } catch (error) {
        console.error('❌ Bcrypt hashing failed:', error);
        return;
    }

    // 2. Load .env config
    console.log('2. Loading configuration...');
    let config = {};
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts[1].trim();
                    config[key] = value;
                }
            });
        } else {
            console.log('⚠️ .env file not found, using defaults');
        }
    } catch (e) {
        console.error('Error reading .env', e);
    }

    const dbConfig = {
        host: config.DB_HOST || 'localhost',
        user: config.DB_USER || 'root',
        password: config.DB_PASSWORD || '',
        database: config.DB_NAME || 'fammanga',
        port: parseInt(config.DB_PORT || '3306')
    };

    console.log('   DB Config:', { ...dbConfig, password: '****' });

    // 3. Test Database Connection
    console.log('3. Testing Database Connection...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return;
    }

    // 4. Test Table Existence
    console.log('4. Checking users table...');
    try {
        const [rows] = await connection.execute('SHOW TABLES LIKE "users"');
        if (rows.length > 0) {
            console.log('✅ Users table exists');
        } else {
            console.error('❌ Users table MISSING');
            await connection.end();
            return;
        }
    } catch (error) {
        console.error('❌ Failed to check tables:', error.message);
        await connection.end();
        return;
    }

    // 5. Test Insert (Rollback)
    console.log('5. Testing User Insertion...');
    try {
        await connection.beginTransaction();
        const testUser = 'test_diag_' + Date.now();
        const testEmail = `test_${Date.now()}@example.com`;
        const hash = await bcrypt.hash('password', 10);

        await connection.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [testUser, testEmail, hash, 'user']
        );
        console.log('✅ Insert successful');

        await connection.rollback();
        console.log('   (Transaction rolled back, no data changed)');
    } catch (error) {
        console.error('❌ Insert failed:', error.message);
        try { await connection.rollback(); } catch (e) { }
    } finally {
        await connection.end();
    }

    console.log('--- Diagnostic Test Complete ---');
}

testRegistration().catch(err => console.error('Unhandled error:', err));
