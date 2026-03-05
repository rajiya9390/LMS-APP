const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// Get all courses (admin/instructor view)
router.get('/courses', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    try {
        const [courses] = await db.execute(`
            SELECT c.*, u.name as instructor_name,
            (SELECT COUNT(*) FROM sections WHERE course_id = c.id) as section_count,
            (SELECT COUNT(*) FROM lessons l JOIN sections s ON l.section_id = s.id WHERE s.course_id = c.id) as lesson_count
            FROM courses c
            LEFT JOIN users u ON c.instructor_id = u.id
            WHERE c.instructor_id = ? OR ? = 'admin'
        `, [req.user.id, req.user.role]);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new course
router.post('/courses', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const { title, description, category, thumbnail } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO courses (title, description, category, thumbnail, instructor_id) VALUES (?, ?, ?, ?, ?)',
            [title, description, category, thumbnail, req.user.id]
        );
        res.status(201).json({ id: result.insertId, message: 'Course created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update course
router.put('/courses/:id', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const { title, description, category, thumbnail } = req.body;
    try {
        await db.execute(
            'UPDATE courses SET title = ?, description = ?, category = ?, thumbnail = ? WHERE id = ? AND (instructor_id = ? OR ? = "admin")',
            [title, description, category, thumbnail, req.params.id, req.user.id, req.user.role]
        );
        res.json({ message: 'Course updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete course
router.delete('/courses/:id', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    try {
        await db.execute(
            'DELETE FROM courses WHERE id = ? AND (instructor_id = ? OR ? = "admin")',
            [req.params.id, req.user.id, req.user.role]
        );
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get sections for a course
router.get('/courses/:id/sections', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    try {
        const [sections] = await db.execute(`
            SELECT s.*, COUNT(l.id) as lesson_count 
            FROM sections s 
            LEFT JOIN lessons l ON s.id = l.section_id
            WHERE s.course_id = ?
            GROUP BY s.id
            ORDER BY s.order_number
        `, [req.params.id]);
        res.json(sections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create section
router.post('/courses/:id/sections', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const { title, order_number } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)',
            [req.params.id, title, order_number]
        );
        res.status(201).json({ id: result.insertId, message: 'Section created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update section
router.put('/sections/:sectionId', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const { title, order_number } = req.body;
    try {
        await db.execute(
            `UPDATE sections s 
             JOIN courses c ON s.course_id = c.id
             SET s.title = ?, s.order_number = ?
             WHERE s.id = ? AND (c.instructor_id = ? OR ? = "admin")`,
            [title, order_number, req.params.sectionId, req.user.id, req.user.role]
        );
        res.json({ message: 'Section updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete section
router.delete('/sections/:sectionId', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    try {
        await db.execute(
            `DELETE s FROM sections s
             JOIN courses c ON s.course_id = c.id
             WHERE s.id = ? AND (c.instructor_id = ? OR ? = "admin")`,
            [req.params.sectionId, req.user.id, req.user.role]
        );
        res.json({ message: 'Section deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get lessons for a section
router.get('/sections/:sectionId/lessons', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    try {
        const [lessons] = await db.execute(
            'SELECT * FROM lessons WHERE section_id = ? ORDER BY order_number',
            [req.params.sectionId]
        );
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create lesson
router.post('/sections/:sectionId/lessons', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const { title, video_url, video_type, duration, order_number, description } = req.body;
    try {
        const [result] = await db.execute(
            `INSERT INTO lessons (section_id, title, video_url, video_type, duration, order_number, description) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.params.sectionId, title, video_url, video_type || 'youtube', duration, order_number, description]
        );
        res.status(201).json({ id: result.insertId, message: 'Lesson created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update lesson
router.put('/lessons/:lessonId', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const { title, video_url, video_type, duration, order_number, description } = req.body;
    try {
        await db.execute(
            `UPDATE lessons l
             JOIN sections s ON l.section_id = s.id
             JOIN courses c ON s.course_id = c.id
             SET l.title = ?, l.video_url = ?, l.video_type = ?, l.duration = ?, l.order_number = ?, l.description = ?
             WHERE l.id = ? AND (c.instructor_id = ? OR ? = "admin")`,
            [title, video_url, video_type, duration, order_number, description, req.params.lessonId, req.user.id, req.user.role]
        );
        res.json({ message: 'Lesson updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete lesson
router.delete('/lessons/:lessonId', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    try {
        await db.execute(
            `DELETE l FROM lessons l
             JOIN sections s ON l.section_id = s.id
             JOIN courses c ON s.course_id = c.id
             WHERE l.id = ? AND (c.instructor_id = ? OR ? = "admin")`,
            [req.params.lessonId, req.user.id, req.user.role]
        );
        res.json({ message: 'Lesson deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
