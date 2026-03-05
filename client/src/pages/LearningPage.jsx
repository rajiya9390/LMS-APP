import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Circle, Play, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const LearningPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, progressRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/courses/${courseId}`),
                    axios.get(`http://localhost:5000/api/progress/${courseId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setCourse(courseRes.data);
                setCompletedLessons(progressRes.data.map(p => p.lesson_id));

                // Auto-select first lesson
                if (courseRes.data.sections?.[0]?.lessons?.[0]) {
                    setActiveLesson(courseRes.data.sections[0].lessons[0]);
                }
            } catch (err) {
                console.error('Error fetching learning data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, token]);

    const handleLessonComplete = async (lessonId) => {
        try {
            await axios.post('http://localhost:5000/api/progress/complete',
                { lessonId, courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!completedLessons.includes(lessonId)) {
                setCompletedLessons([...completedLessons, lessonId]);
            }
        } catch (err) {
            console.error('Error updating progress:', err);
        }
    };

    const progressPercent = course?.sections?.reduce((acc, s) => acc + s.lessons.length, 0)
        ? Math.round((completedLessons.length / course.sections.reduce((acc, s) => acc + s.lessons.length, 0)) * 100)
        : 0;

    if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading course...</div>;
    if (!course) return <div style={{ color: 'white', padding: '2rem' }}>Course not found</div>;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside style={{
                width: '350px',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--bg-sidebar)'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Course Content</h3>
                    <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{progressPercent}% Complete</p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {course.sections?.map(section => (
                        <div key={section.id} style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {section.title}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {section.lessons?.map(lesson => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => setActiveLesson(lesson)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            textAlign: 'left',
                                            width: '100%',
                                            backgroundColor: activeLesson?.id === lesson.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                                            color: activeLesson?.id === lesson.id ? 'var(--primary)' : 'var(--text-main)'
                                        }}
                                    >
                                        {completedLessons.includes(lesson.id) ? (
                                            <CheckCircle size={18} color="var(--success)" />
                                        ) : (
                                            <Circle size={18} color="var(--text-muted)" />
                                        )}
                                        <span style={{ fontSize: '0.875rem', flex: 1 }}>{lesson.title}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lesson.duration}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    {activeLesson ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${activeLesson.youtube_video_id}?autoplay=1&rel=0`}
                            title={activeLesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            Select a lesson to start learning
                        </div>
                    )}
                </div>

                {/* Footer controls */}
                <div style={{ padding: '1.5rem 2rem', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Now Playing</span>
                        <span style={{ fontWeight: 600 }}>{activeLesson?.title}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleLessonComplete(activeLesson.id)}
                            disabled={completedLessons.includes(activeLesson?.id)}
                        >
                            {completedLessons.includes(activeLesson?.id) ? 'Completed' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LearningPage;
