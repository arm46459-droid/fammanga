import bcrypt from 'bcrypt';

const saltRounds = 10;
const adminPass = 'admin123';
const userPass = 'test123';

async function main() {
    const adminHash = await bcrypt.hash(adminPass, saltRounds);
    const userHash = await bcrypt.hash(userPass, saltRounds);

    console.log('Admin Hash:', adminHash);
    console.log('User Hash:', userHash);
}

main();
