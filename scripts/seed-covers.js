import mysql from 'mysql2/promise';

const mangaData = [
    {
        title: 'Solo Leveling',
        title_en: 'Solo Leveling',
        author: 'Chugong',
        description: '10 ปีก่อนหลังจาก “เกท” ที่เชื่อมต่อโลกจริงและโลกมอนสเตอร์ได้เปิดออก...',
        cover_image: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Solo_Leveling_Webtoon_cover.png',
        genres: JSON.stringify(['Action', 'Adventure', 'Fantasy']),
        status: 'completed'
    },
    {
        title: 'Jujutsu Kaisen',
        title_en: 'Jujutsu Kaisen',
        author: 'Gege Akutami',
        description: 'อิตาโดริ ยูจิ นักเรียนมัธยมปลายที่มีสมรรถภาพร่างกายสูงอย่างน่าเชื่อ...',
        cover_image: 'https://upload.wikimedia.org/wikipedia/en/4/46/Jujutsu_kaisen_cover.jpg',
        genres: JSON.stringify(['Action', 'Supernatural', 'School Life']),
        status: 'ongoing'
    },
    {
        title: 'วันพีซ',
        title_en: 'One Piece',
        author: 'Eiichiro Oda',
        description: 'เรื่องราวของการผจญภัยเพื่อตามหา "วันพีซ" สมบัติล้ำค่าที่สุดในโลก...',
        cover_image: 'https://upload.wikimedia.org/wikipedia/en/a/a3/One_Piece%2C_Volume_1.jpg',
        genres: JSON.stringify(['Action', 'Adventure', 'Comedy']),
        status: 'ongoing'
    },
    {
        title: 'Attack on Titan',
        title_en: 'Attack on Titan',
        author: 'Hajime Isayama',
        description: 'มนุษยชาติต้องอาศัยอยู่ในกำแพงเพื่อปกป้องตัวเองจากไททัน...',
        cover_image: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Shingeki_no_Kyojin_manga_volume_1.jpg',
        genres: JSON.stringify(['Action', 'Drama', 'Horror']),
        status: 'completed'
    },
    {
        title: 'Demon Slayer',
        title_en: 'Demon Slayer: Kimetsu no Yaiba',
        author: 'Koyoharu Gotouge',
        description: 'ทันจิโร่ เด็กหนุ่มขายถ่านที่ครอบครัวถูกอสูรฆ่าตาย...',
        cover_image: 'https://upload.wikimedia.org/wikipedia/en/0/09/Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg',
        genres: JSON.stringify(['Action', 'Historical', 'Supernatural']),
        status: 'completed'
    },
    {
        title: 'Spy x Family',
        title_en: 'Spy x Family',
        author: 'Tatsuya Endo',
        description: 'สายลับผู้เก่งกาจต้องสร้างครอบครัวปลอมๆ เพื่อปฏิบัติภารกิจลับ...',
        cover_image: 'https://upload.wikimedia.org/wikipedia/en/5/53/Spy_x_Family_volume_1_cover.jpg',
        genres: JSON.stringify(['Action', 'Comedy', 'Spy']),
        status: 'ongoing'
    },
    {
        title: 'Chainsaw Man',
        title_en: 'Chainsaw Man',
        author: 'Tatsuki Fujimoto',
        description: 'เด็นจิ เด็กหนุ่มตกอับที่ทำสัญญากับปีศาจเลื่อยยนต์...',
        cover_image: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Chainsaw_Man_volume_1_cover.jpg',
        genres: JSON.stringify(['Action', 'Comedy', 'Horror']),
        status: 'ongoing'
    }
];

async function seedCovers() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'fammanga'
    });

    console.log('Connected to database.');

    for (const manga of mangaData) {
        // Check if manga exists by title (Thai or English)
        const [rows] = await connection.execute(
            'SELECT id FROM manga WHERE title = ? OR title_en = ?',
            [manga.title, manga.title_en]
        );

        if (rows.length > 0) {
            // Update existing
            console.log(`Updating ${manga.title}...`);
            await connection.execute(
                'UPDATE manga SET cover_image = ?, description = ?, author = ?, genres = ?, status = ? WHERE id = ?',
                [manga.cover_image, manga.description, manga.author, manga.genres, manga.status, rows[0].id]
            );
        } else {
            // Insert new
            console.log(`Inserting ${manga.title}...`);
            await connection.execute(
                'INSERT INTO manga (title, title_en, author, description, cover_image, genres, status, total_chapters, views) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)',
                [manga.title, manga.title_en, manga.author, manga.description, manga.cover_image, manga.genres, manga.status]
            );
        }
    }

    console.log('Seed completed.');
    await connection.end();
}

seedCovers().catch(console.error);
