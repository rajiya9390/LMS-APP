const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const [courses] = await db.execute(`
            SELECT c.*, u.name as instructor_name 
            FROM courses c
            LEFT JOIN users u ON c.instructor_id = u.id
        `);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get enrolled courses for current user
router.get('/enrolled', authenticate, async (req, res) => {
    try {
        const [enrollments] = await db.execute(`
            SELECT c.* 
            FROM courses c
            JOIN enrollments e ON c.id = e.course_id
            WHERE e.user_id = ?
        `, [req.user.id]);

        for (let course of enrollments) {
            const [sections] = await db.execute('SELECT * FROM sections WHERE course_id = ? ORDER BY order_number', [course.id]);
            for (let section of sections) {
                const [lessons] = await db.execute(
                    'SELECT id, section_id, title, video_url, video_type, duration, order_number, description FROM lessons WHERE section_id = ? ORDER BY order_number', 
                    [section.id]
                );
                section.lessons = lessons;
            }
            course.sections = sections;
        }

        res.json(enrollments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get course details with sections and lessons
router.get('/:id', async (req, res) => {
    try {
        const [courses] = await db.execute('SELECT * FROM courses WHERE id = ?', [req.params.id]);
        if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });

        const course = courses[0];
        const [sections] = await db.execute('SELECT * FROM sections WHERE course_id = ? ORDER BY order_number', [course.id]);

        for (let section of sections) {
            const [lessons] = await db.execute(
                'SELECT id, section_id, title, video_url, video_type, duration, order_number, description FROM lessons WHERE section_id = ? ORDER BY order_number', 
                [section.id]
            );
            section.lessons = lessons;
        }

        course.sections = sections;
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auto-populate courses (Utility for demonstration)
router.post('/auto-generate', authenticate, authorize(['admin']), async (req, res) => {
    // This is a simplified version of the logic to pre-populate courses
    // In a real scenario, this might call YouTube API
    const sampleCourses = [
        {
            title: 'Java Programming Masterclass',
            category: 'Java',
            description: 'Learn Java from scratch to advanced concepts.',
            sections: [
                {
                    title: 'Getting Started',
                    lessons: [
                        { title: 'Introduction to Java', videoId: 'eIrMbWjk_fA', duration: '15:00' },
                        { title: 'Setup Environment', videoId: 'RRubcjpTkks', duration: '12:00' }
                    ]
                },
                {
                    title: 'Core Concepts',
                    lessons: [
                        { title: 'Variables & Data Types', videoId: 'tOidg_AAncI', duration: '20:00' }
                    ]
                }
            ]
        },
        {
            title: 'React.js Complete Guide',
            category: 'React',
            description: 'Modern React with Hooks, Redux and more.',
            sections: [
                {
                    title: 'React Basics',
                    lessons: [
                        { title: 'What is React?', videoId: 'hQAHSlTtcmY', duration: '10:00' },
                        { title: 'Components & Props', videoId: 'Ke90Tje7VS0', duration: '18:00' }
                    ]
                }
            ]
        }
    ];

    try {
        for (let cData of sampleCourses) {
            const [cResult] = await db.execute(
                'INSERT INTO courses (title, description, category, instructor_id) VALUES (?, ?, ?, ?)',
                [cData.title, cData.description, cData.category, req.user.id]
            );
            const courseId = cResult.insertId;

            for (let [sIdx, sData] of cData.sections.entries()) {
                const [sResult] = await db.execute(
                    'INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)',
                    [courseId, sData.title, sIdx + 1]
                );
                const sectionId = sResult.insertId;

                for (let [lIdx, lData] of sData.lessons.entries()) {
                    await db.execute(
                        'INSERT INTO lessons (section_id, title, youtube_video_id, duration, order_number) VALUES (?, ?, ?, ?, ?)',
                        [sectionId, lData.title, lData.videoId, lData.duration, lIdx + 1]
                    );
                }
            }
        }
        res.json({ message: 'Courses generated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
