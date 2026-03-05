const mysql = require('mysql2/promise');
require('dotenv').config();

const sampleCourses = [
    {
        title: 'Java Programming Masterclass',
        category: 'Java',
        description: 'Learn Java from scratch to advanced concepts. Master Object-Oriented Programming, Collections, and Multi-threading.',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        sections: [
            {
                title: 'Getting Started',
                lessons: [
                    { title: 'Introduction to Java', videoId: 'eIrMbWjk_fA', duration: '15:20' },
                    { title: 'Setup & Installation', videoId: 'RRubcjpTkks', duration: '12:45' }
                ]
            },
            {
                title: 'Core Java',
                lessons: [
                    { title: 'Variables & Data Types', videoId: 'tOidg_AAncI', duration: '22:15' },
                    { title: 'Control Flow Statements', videoId: 'mAtkPQO1FcA', duration: '28:50' }
                ]
            }
        ]
    },
    {
        title: 'React.js Complete Guide 2024',
        category: 'React',
        description: 'Ultimate guide to React 18+. Hooks, State Management, and building real-world applications.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        sections: [
            {
                title: 'React Fundamentals',
                lessons: [
                    { title: 'What is React?', videoId: 'hQAHSlTtcmY', duration: '12:30' },
                    { title: 'Main Concepts & Hooks', videoId: 'Ke90Tje7VS0', duration: '24:15' }
                ]
            }
        ]
    },
    {
        title: 'Python for Data Science',
        category: 'Data Analytics',
        description: 'Master Python for data analysis. Learn NumPy, Pandas, and Matplotlib.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        sections: [
            {
                title: 'Intro to Python',
                lessons: [
                    { title: 'Python Basics', videoId: 'rfscVS0vtbw', duration: '35:00' }
                ]
            }
        ]
    }
];

async function seed() {
    let connection;
    try {
        console.log('Connecting to Aiven MySQL...');

        // Use the URI exactly as provided in .env (which worked for init-db.js)
        connection = await mysql.createConnection({
            uri: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Seeding courses...');

        // Clear existing data to avoid duplicates
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE lessons');
        await connection.execute('TRUNCATE sections');
        await connection.execute('TRUNCATE courses');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        for (let cData of sampleCourses) {
            const [cResult] = await connection.execute(
                'INSERT INTO courses (title, description, thumbnail, category) VALUES (?, ?, ?, ?)',
                [cData.title, cData.description, cData.thumbnail, cData.category]
            );
            const courseId = cResult.insertId;

            for (let [sIdx, sData] of cData.sections.entries()) {
                const [sResult] = await connection.execute(
                    'INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)',
                    [courseId, sData.title, sIdx + 1]
                );
                const sectionId = sResult.insertId;

                for (let [lIdx, lData] of sData.lessons.entries()) {
                    await connection.execute(
                        'INSERT INTO lessons (section_id, title, youtube_video_id, duration, order_number) VALUES (?, ?, ?, ?, ?)',
                        [sectionId, lData.title, lData.videoId, lData.duration, lIdx + 1]
                    );
                }
            }
        }

        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Seeding failed:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

seed();
