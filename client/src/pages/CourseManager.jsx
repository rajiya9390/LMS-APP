import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    ChevronDown, 
    ChevronRight,
    Video,
    BookOpen,
    Save,
    X,
    Play,
    Link as LinkIcon,
    Upload,
    Youtube
} from 'lucide-react';

const VIDEO_TYPES = [
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'direct', label: 'Direct URL', icon: LinkIcon },
    { value: 'vimeo', label: 'Vimeo', icon: Play },
];

const CATEGORIES = [
    'Programming',
    'Web Development',
    'Data Science',
    'Design',
    'Business',
    'AI & ML',
    'Mobile Development',
    'DevOps'
];

const CourseManager = () => {
    const [courses, setCourses] = useState([]);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [sections, setSections] = useState({});
    const [lessons, setLessons] = useState({});
    const [loading, setLoading] = useState(true);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }
        fetchCourses();
    }, [token, navigate]);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/courses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(data);
        } catch (err) {
            console.error('Error fetching courses:', err);
            if (err.response?.status === 403) {
                alert('You do not have permission to access this page');
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async (courseId) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/admin/courses/${courseId}/sections`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSections(prev => ({ ...prev, [courseId]: data }));
            
            data.forEach(section => {
                fetchLessons(section.id);
            });
        } catch (err) {
            console.error('Error fetching sections:', err);
        }
    };

    const fetchLessons = async (sectionId) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/admin/sections/${sectionId}/lessons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLessons(prev => ({ ...prev, [sectionId]: data }));
        } catch (err) {
            console.error('Error fetching lessons:', err);
        }
    };

    const toggleCourse = (courseId) => {
        if (expandedCourse === courseId) {
            setExpandedCourse(null);
        } else {
            setExpandedCourse(courseId);
            if (!sections[courseId]) {
                fetchSections(courseId);
            }
        }
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const courseData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            thumbnail: formData.get('thumbnail')
        };

        try {
            if (editingCourse) {
                await axios.put(`http://localhost:5000/api/admin/courses/${editingCourse.id}`, courseData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/admin/courses', courseData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowCourseModal(false);
            setEditingCourse(null);
            fetchCourses();
        } catch (err) {
            alert('Error saving course: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleSaveSection = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const sectionData = {
            title: formData.get('title'),
            order_number: parseInt(formData.get('order_number'))
        };

        try {
            if (editingSection) {
                await axios.put(`http://localhost:5000/api/admin/sections/${editingSection.id}`, sectionData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`http://localhost:5000/api/admin/courses/${selectedCourseId}/sections`, sectionData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowSectionModal(false);
            setEditingSection(null);
            fetchSections(selectedCourseId);
        } catch (err) {
            alert('Error saving section: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleSaveLesson = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const lessonData = {
            title: formData.get('title'),
            video_url: formData.get('video_url'),
            video_type: formData.get('video_type'),
            duration: formData.get('duration'),
            order_number: parseInt(formData.get('order_number')),
            description: formData.get('description')
        };

        try {
            if (editingLesson) {
                await axios.put(`http://localhost:5000/api/admin/lessons/${editingLesson.id}`, lessonData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`http://localhost:5000/api/admin/sections/${selectedSectionId}/lessons`, lessonData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowLessonModal(false);
            setEditingLesson(null);
            fetchLessons(selectedSectionId);
        } catch (err) {
            alert('Error saving lesson: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCourses();
        } catch (err) {
            alert('Error deleting course: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteSection = async (sectionId, courseId) => {
        if (!confirm('Are you sure you want to delete this section?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/sections/${sectionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSections(courseId);
        } catch (err) {
            alert('Error deleting section: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteLesson = async (lessonId, sectionId) => {
        if (!confirm('Are you sure you want to delete this lesson?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/lessons/${lessonId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLessons(sectionId);
        } catch (err) {
            alert('Error deleting lesson: ' + (err.response?.data?.message || err.message));
        }
    };

    const openCourseModal = (course = null) => {
        setEditingCourse(course);
        setShowCourseModal(true);
    };

    const openSectionModal = (courseId, section = null) => {
        setSelectedCourseId(courseId);
        setEditingSection(section);
        setShowSectionModal(true);
    };

    const openLessonModal = (sectionId, lesson = null) => {
        setSelectedSectionId(sectionId);
        setEditingLesson(lesson);
        setShowLessonModal(true);
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
            <div className="loader" style={{ marginBottom: '1.5rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Course Management
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Create and manage your courses, sections, and video lessons
                    </p>
                </div>
                <button onClick={() => openCourseModal()} className="btn btn-primary">
                    <Plus size={20} />
                    New Course
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {courses.map(course => (
                    <div key={course.id} className="card" style={{ overflow: 'hidden' }}>
                        <div 
                            style={{ 
                                padding: '1.5rem', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem',
                                cursor: 'pointer',
                                backgroundColor: expandedCourse === course.id ? 'rgba(37, 99, 235, 0.05)' : 'transparent'
                            }}
                            onClick={() => toggleCourse(course.id)}
                        >
                            {expandedCourse === course.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            <div style={{ width: '60px', height: '60px', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0 }}>
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BookOpen size={24} color="var(--text-muted)" />
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{course.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <span className="badge">{course.category}</span>
                                    <span>{course.section_count || 0} sections</span>
                                    <span>{course.lesson_count || 0} lessons</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                                <button onClick={() => openCourseModal(course)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-secondary" style={{ padding: '0.5rem', color: '#ef4444' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {expandedCourse === course.id && (
                            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h4 style={{ fontWeight: 600 }}>Sections</h4>
                                        <button 
                                            onClick={() => openSectionModal(course.id)}
                                            className="btn btn-primary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                        >
                                            <Plus size={16} />
                                            Add Section
                                        </button>
                                    </div>

                                    {sections[course.id]?.map((section, sIndex) => (
                                        <div key={section.id} style={{ marginBottom: '1rem' }}>
                                            <div 
                                                style={{ 
                                                    padding: '1rem', 
                                                    backgroundColor: 'var(--bg-main)', 
                                                    borderRadius: '0.5rem',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <div>
                                                    <h5 style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                                                        {sIndex + 1}. {section.title}
                                                    </h5>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        {section.lesson_count || 0} lessons
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button 
                                                        onClick={() => openLessonModal(section.id)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                                                    >
                                                        <Video size={16} />
                                                        Add Lesson
                                                    </button>
                                                    <button 
                                                        onClick={() => openSectionModal(course.id, section)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.5rem' }}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteSection(section.id, course.id)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.5rem', color: '#ef4444' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {lessons[section.id]?.length > 0 && (
                                                <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                                                    {lessons[section.id].map((lesson, lIndex) => (
                                                        <div 
                                                            key={lesson.id}
                                                            style={{
                                                                padding: '0.75rem 1rem',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                borderBottom: '1px solid var(--border)'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <Play size={14} color="var(--text-muted)" />
                                                                <span style={{ fontSize: '0.875rem' }}>
                                                                    {sIndex + 1}.{lIndex + 1} {lesson.title}
                                                                </span>
                                                                {lesson.duration && (
                                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                        ({lesson.duration})
                                                                    </span>
                                                                )}
                                                                <span className="badge" style={{ fontSize: '0.65rem' }}>
                                                                    {lesson.video_type}
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button 
                                                                    onClick={() => openLessonModal(section.id, lesson)}
                                                                    className="btn btn-secondary"
                                                                    style={{ padding: '0.375rem' }}
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteLesson(lesson.id, section.id)}
                                                                    className="btn btn-secondary"
                                                                    style={{ padding: '0.375rem', color: '#ef4444' }}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {(!sections[course.id] || sections[course.id].length === 0) && (
                                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                            No sections yet. Click "Add Section" to get started.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No courses yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Create your first course to start teaching
                        </p>
                        <button onClick={() => openCourseModal()} className="btn btn-primary">
                            <Plus size={20} />
                            Create Course
                        </button>
                    </div>
                )}
            </div>

            {/* Course Modal */}
            {showCourseModal && (
                <Modal onClose={() => { setShowCourseModal(false); setEditingCourse(null); }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>
                        {editingCourse ? 'Edit Course' : 'New Course'}
                    </h2>
                    <form onSubmit={handleSaveCourse}>
                        <FormField label="Title" name="title" defaultValue={editingCourse?.title} required />
                        <FormField label="Description" name="description" type="textarea" defaultValue={editingCourse?.description} />
                        <FormField label="Category" name="category" type="select" options={CATEGORIES} defaultValue={editingCourse?.category} required />
                        <FormField label="Thumbnail URL" name="thumbnail" defaultValue={editingCourse?.thumbnail} placeholder="https://example.com/image.jpg" />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                <Save size={18} />
                                Save Course
                            </button>
                            <button type="button" onClick={() => { setShowCourseModal(false); setEditingCourse(null); }} className="btn btn-secondary">
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Section Modal */}
            {showSectionModal && (
                <Modal onClose={() => { setShowSectionModal(false); setEditingSection(null); }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>
                        {editingSection ? 'Edit Section' : 'New Section'}
                    </h2>
                    <form onSubmit={handleSaveSection}>
                        <FormField label="Title" name="title" defaultValue={editingSection?.title} required />
                        <FormField label="Order Number" name="order_number" type="number" defaultValue={editingSection?.order_number || 1} required />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                <Save size={18} />
                                Save Section
                            </button>
                            <button type="button" onClick={() => { setShowSectionModal(false); setEditingSection(null); }} className="btn btn-secondary">
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Lesson Modal */}
            {showLessonModal && (
                <Modal onClose={() => { setShowLessonModal(false); setEditingLesson(null); }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>
                        {editingLesson ? 'Edit Lesson' : 'New Lesson'}
                    </h2>
                    <form onSubmit={handleSaveLesson}>
                        <FormField label="Title" name="title" defaultValue={editingLesson?.title} required />
                        <FormField 
                            label="Video URL" 
                            name="video_url" 
                            defaultValue={editingLesson?.video_url} 
                            placeholder="https://youtube.com/watch?v=... or https://your-domain.com/video.mp4"
                            required 
                        />
                        <FormField 
                            label="Video Type" 
                            name="video_type" 
                            type="select" 
                            options={VIDEO_TYPES.map(t => t.value)}
                            optionLabels={VIDEO_TYPES.reduce((acc, t) => ({ ...acc, [t.value]: t.label }), {})}
                            defaultValue={editingLesson?.video_type || 'youtube'} 
                            required 
                        />
                        <FormField label="Duration" name="duration" defaultValue={editingLesson?.duration} placeholder="e.g., 15:30" />
                        <FormField label="Order Number" name="order_number" type="number" defaultValue={editingLesson?.order_number || 1} required />
                        <FormField label="Description" name="description" type="textarea" defaultValue={editingLesson?.description} />
                        
                        <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                <strong>Video URL Examples:</strong>
                            </p>
                            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '1.25rem' }}>
                                <li><strong>YouTube:</strong> https://youtube.com/watch?v=VIDEO_ID</li>
                                <li><strong>Direct URL:</strong> https://your-cdn.com/video.mp4</li>
                                <li><strong>Vimeo:</strong> https://vimeo.com/VIDEO_ID</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                <Save size={18} />
                                Save Lesson
                            </button>
                            <button type="button" onClick={() => { setShowLessonModal(false); setEditingLesson(null); }} className="btn btn-secondary">
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const Modal = ({ children, onClose }) => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
    }} onClick={onClose}>
        <div 
            className="card" 
            style={{ 
                width: '100%', 
                maxWidth: '500px', 
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '2rem'
            }}
            onClick={e => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
);

const FormField = ({ label, name, type = 'text', options, optionLabels = {}, defaultValue, placeholder, required }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            {label}
            {required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
        {type === 'textarea' ? (
            <textarea
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.75rem', minHeight: '100px', cursor: 'text', resize: 'vertical' }}
            />
        ) : type === 'select' ? (
            <select
                name={name}
                defaultValue={defaultValue}
                required={required}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.75rem', cursor: 'pointer' }}
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>{optionLabels[opt] || opt}</option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.75rem', cursor: 'text' }}
            />
        )}
    </div>
);

export default CourseManager;
