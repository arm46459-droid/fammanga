import mysql from 'mysql2/promise';

async function listManga() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'fammanga'
    });

    const [rows] = await connection.execute('SELECT id, title, cover_image FROM manga');
    console.log(JSON.stringify(rows, null, 2));
    await connection.end();
}

listManga().catch(console.error);
