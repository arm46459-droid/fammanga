// Generate bcrypt hashes for passwords
import bcrypt from 'bcrypt'

async function generateHashes() {
    const saltRounds = 10

    const admin123Hash = await bcrypt.hash('admin123', saltRounds)
    const test123Hash = await bcrypt.hash('test123', saltRounds)

    console.log('Password hashes generated:')
    console.log('---')
    console.log(`admin123: ${admin123Hash}`)
    console.log(`test123:  ${test123Hash}`)
    console.log('---')
    console.log('\nSQL Query:')
    console.log(`INSERT INTO users (username, email, password, role) VALUES`)
    console.log(`('admin', 'admin@fammanga.com', '${admin123Hash}', 'admin'),`)
    console.log(`('testuser', 'user@fammanga.com', '${test123Hash}', 'user')`)
    console.log(`ON DUPLICATE KEY UPDATE password=VALUES(password);`)
}

generateHashes().catch(console.error)
