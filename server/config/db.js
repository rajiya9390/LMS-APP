const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

// Simple JSON database implementation mimicking a subset of mysql2 promise pool
class JsonDb {
    constructor() {
        this.data = this._load();
    }

    _load() {
        try {
            if (!fs.existsSync(DB_PATH)) {
                return { users: [], courses: [], sections: [], lessons: [], enrollments: [], progress: [] };
            }
            return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        } catch (e) {
            console.error('Error loading db.json', e);
            return { users: [], courses: [], sections: [], lessons: [], enrollments: [], progress: [] };
        }
    }

    _save() {
        fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
    }

    async execute(query, params = []) {
        query = query.trim().toLowerCase();
        
        // Reload data from file on each select to get latest changes
        if (query.startsWith('select')) {
            this.data = this._load();
        }

        // Very basic query simulation for the specific needs of this app
        if (query.startsWith('select')) {
            return this._handleSelect(query, params);
        } else if (query.startsWith('insert')) {
            return this._handleInsert(query, params);
        } else if (query.startsWith('update')) {
            return this._handleUpdate(query, params);
        } else if (query.startsWith('delete')) {
            return this._handleDelete(query, params);
        }

        throw new Error('Unsupported JSON DB query: ' + query);
    }

    _handleSelect(query, params) {
        if (query.includes('from users where email = ?')) {
            const user = this.data.users.find(u => u.email === params[0]);
            return [user ? [user] : []];
        }
        if (query.includes('from users where id = ?')) {
            const user = this.data.users.find(u => u.id == params[0]);
            return [user ? [user] : []];
        }
        if (query.includes('from courses where id = ?')) {
            const course = this.data.courses.find(c => c.id == params[0]);
            return [course ? [course] : []];
        }
        if (query.includes('from courses')) {
            return [this.data.courses];
        }
        if (query.includes('from sections where course_id = ?')) {
            return [this.data.sections.filter(s => s.course_id == params[0])];
        }
        if (query.includes('from lessons where section_id = ?')) {
            return [this.data.lessons.filter(l => l.section_id == params[0])];
        }
        if (query.includes('from progress')) {
            return [this.data.progress.filter(p => p.user_id == params[0] && this.data.lessons.find(l => l.id == p.lesson_id && this.data.sections.find(s => s.id == l.section_id && s.course_id == params[1])))];
        }
        if (query.includes('from enrollments')) {
            return [this.data.enrollments.filter(e => e.user_id == params[0] && e.course_id == params[1])];
        }
        return [[]];
    }

    _handleInsert(query, params) {
        if (query.includes('into users')) {
            const id = this.data.users.length + 1;
            const newUser = { id, name: params[0], email: params[1], password: params[2], role: params[3] || 'student' };
            this.data.users.push(newUser);
            this._save();
            return [{ insertId: id }];
        }
        if (query.includes('into courses')) {
            const id = this.data.courses.length + 1;
            const newCourse = { 
                id, 
                title: params[0], 
                description: params[1], 
                category: params[2], 
                thumbnail: params[3], 
                instructor_id: params[4],
                created_at: new Date()
            };
            this.data.courses.push(newCourse);
            this._save();
            return [{ insertId: id }];
        }
        if (query.includes('into sections')) {
            const id = this.data.sections.length + 1;
            const newSection = { 
                id, 
                course_id: params[0], 
                title: params[1], 
                order_number: params[2]
            };
            this.data.sections.push(newSection);
            this._save();
            return [{ insertId: id }];
        }
        if (query.includes('into lessons')) {
            const id = this.data.lessons.length + 1;
            const newLesson = { 
                id, 
                section_id: params[0], 
                title: params[1], 
                video_url: params[2], 
                video_type: params[3] || 'youtube',
                duration: params[4],
                order_number: params[5],
                description: params[6],
                created_at: new Date()
            };
            this.data.lessons.push(newLesson);
            this._save();
            return [{ insertId: id }];
        }
        if (query.includes('into enrollments')) {
            const id = this.data.enrollments.length + 1;
            this.data.enrollments.push({ id, user_id: params[0], course_id: params[1], enrolled_at: new Date() });
            this._save();
            return [{ insertId: id }];
        }
        if (query.includes('into progress')) {
            const id = this.data.progress.length + 1;
            this.data.progress.push({ id, user_id: params[0], lesson_id: params[1], status: params[2], last_watched_at: new Date() });
            this._save();
            return [{ insertId: id }];
        }
        return [{}];
    }

    _handleUpdate(query, params) {
        if (query.includes('update progress')) {
            const item = this.data.progress.find(p => p.user_id == params[1] && p.lesson_id == params[2]);
            if (item) {
                item.status = params[0];
                item.last_watched_at = new Date();
                this._save();
            }
            return [{}];
        }
        if (query.includes('update courses')) {
            const course = this.data.courses.find(c => c.id == params[4]);
            if (course) {
                course.title = params[0];
                course.description = params[1];
                course.category = params[2];
                course.thumbnail = params[3];
                this._save();
            }
            return [{}];
        }
        return [{}];
    }

    _handleDelete(query, params) {
        if (query.includes('from courses')) {
            const idx = this.data.courses.findIndex(c => c.id == params[0]);
            if (idx > -1) {
                this.data.courses.splice(idx, 1);
                this._save();
            }
            return [{}];
        }
        if (query.includes('from sections')) {
            const idx = this.data.sections.findIndex(s => s.id == params[0]);
            if (idx > -1) {
                this.data.sections.splice(idx, 1);
                this._save();
            }
            return [{}];
        }
        if (query.includes('from lessons')) {
            const idx = this.data.lessons.findIndex(l => l.id == params[0]);
            if (idx > -1) {
                this.data.lessons.splice(idx, 1);
                this._save();
            }
            return [{}];
        }
        return [{}];
    }

    promise() {
        return this;
    }
}

module.exports = new JsonDb();
