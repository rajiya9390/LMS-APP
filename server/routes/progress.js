const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

// Get all user progress
router.get('/', authenticate, async (req, res) => {
    try {
        const [progress] = await db.execute(`
            SELECT p.*, l.id as lesson_id, s.course_id
            FROM progress p
            JOIN lessons l ON p.lesson_id = l.id
            JOIN sections s ON l.section_id = s.id
            WHERE p.user_id = ?
        `, [req.user.id]);

        const progressMap = {};
        progress.forEach(p => {
            if (!progressMap[p.course_id]) {
                progressMap[p.course_id] = { lessons: {}, completed: 0, total: 0, percentage: 0 };
            }
            progressMap[p.course_id].lessons[p.lesson_id] = p;
            if (p.status === 'completed') {
                progressMap[p.course_id].completed++;
            }
        });

        res.json(progressMap);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll in a course
router.post('/enroll', authenticate, async (req, res) => {
    const { courseId } = req.body;
    try {
        const [existing] = await db.execute(
            'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
            [req.user.id, courseId]
        );
        if (existing.length > 0) return res.status(400).json({ message: 'Already enrolled' });

        await db.execute(
            'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
            [req.user.id, courseId]
        );
        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save/update progress
router.post('/', authenticate, async (req, res) => {
    const { courseId, lessonId, completed } = req.body;
    try {
        const status = completed ? 'completed' : 'in_progress';
        await db.execute(
            `INSERT INTO progress (user_id, lesson_id, status, updated_at) 
             VALUES (?, ?, ?, NOW()) 
             ON DUPLICATE KEY UPDATE status = ?, updated_at = NOW()`,
            [req.user.id, lessonId, status, status]
        );
        res.json({ message: 'Progress saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update progress (legacy endpoint)
router.post('/complete', authenticate, async (req, res) => {
    const { lessonId, courseId } = req.body;
    try {
        await db.execute(
            'INSERT INTO progress (user_id, lesson_id, status) VALUES (?, ?, "completed") ON DUPLICATE KEY UPDATE status="completed"',
            [req.user.id, lessonId]
        );

        // Progress tracking logic: find next lesson if needed
        res.json({ message: 'Progress updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user progress for a course
router.get('/:courseId', authenticate, async (req, res) => {
    try {
        const [progress] = await db.execute(`
            SELECT p.* 
            FROM progress p
            JOIN lessons l ON p.lesson_id = l.id
            JOIN sections s ON l.section_id = s.id
            WHERE p.user_id = ? AND s.course_id = ?
        `, [req.user.id, req.params.courseId]);

        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
