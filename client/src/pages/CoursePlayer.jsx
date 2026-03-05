import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Play, 
    CheckCircle, 
    ChevronLeft, 
    ChevronRight,
    BookOpen,
    Clock,
    Award,
    Menu,
    X,
    Check
} from 'lucide-react';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [progress, setProgress] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const videoRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchData = async () => {
            try {
                const [courseRes, progressRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/courses/${courseId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:5000/api/progress/${courseId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const courseData = courseRes.data;
                const progressData = progressRes.data || {};

                setCourse(courseData);
                setProgress(progressData);

                const completed = new Set(
                    Object.entries(progressData)
                        .filter(([_, p]) => p.completed)
                        .map(([lessonId, _]) => lessonId)
                );
                setCompletedLessons(completed);

                const lessonIdFromUrl = searchParams.get('lesson');
                let initialLesson = null;

                if (lessonIdFromUrl) {
                    for (const section of courseData.sections || []) {
                        const lesson = section.lessons?.find(l => l.id === lessonIdFromUrl);
                        if (lesson) {
                            initialLesson = lesson;
                            break;
                        }
                    }
                }

                if (!initialLesson && courseData.sections?.length > 0) {
                    initialLesson = courseData.sections[0].lessons?.[0];
                }

                setCurrentLesson(initialLesson);
            } catch (err) {
                console.error('Error fetching course data:', err);
                if (err.response?.status === 403) {
                    navigate(`/course/${courseId}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, token, navigate, searchParams]);

    const handleLessonComplete = async () => {
        if (!currentLesson || completedLessons.has(currentLesson.id)) return;

        try {
            await axios.post('http://localhost:5000/api/progress', {
                courseId,
                lessonId: currentLesson.id,
                completed: true
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
        } catch (err) {
            console.error('Error saving progress:', err);
        }
    };

    const selectLesson = (lesson) => {
        setCurrentLesson(lesson);
        setSearchParams({ lesson: lesson.id });
    };

    const getAllLessons = () => {
        const lessons = [];
        course?.sections?.forEach(section => {
            section.lessons?.forEach(lesson => {
                lessons.push({ ...lesson, sectionTitle: section.title });
            });
        });
        return lessons;
    };

    const getCurrentLessonIndex = () => {
        const allLessons = getAllLessons();
        return allLessons.findIndex(l => l.id === currentLesson?.id);
    };

    const goToNextLesson = () => {
        const allLessons = getAllLessons();
        const currentIndex = getCurrentLessonIndex();
        if (currentIndex < allLessons.length - 1) {
            selectLesson(allLessons[currentIndex + 1]);
        }
    };

    const goToPrevLesson = () => {
        const allLessons = getAllLessons();
        const currentIndex = getCurrentLessonIndex();
        if (currentIndex > 0) {
            selectLesson(allLessons[currentIndex - 1]);
        }
    };

    const calculateProgress = () => {
        const allLessons = getAllLessons();
        if (allLessons.length === 0) return 0;
        return Math.round((completedLessons.size / allLessons.length) * 100);
    };

    if (loading) return (
        <div style={{ 
            minHeight: 'calc(100vh - 64px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
        }}>
            <div className="loader"></div>
        </div>
    );

    if (!course) return (
        <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
            <h2>Course not found</h2>
        </div>
    );

    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    const progressPercent = calculateProgress();

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-card)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '1rem', fontWeight: 600 }}>{course.title}</h1>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {currentLesson?.sectionTitle}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={18} color="var(--success)" />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{progressPercent}% Complete</span>
                        </div>
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem' }}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--bg-main)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
                        {currentLesson?.video_url ? (
                            <VideoPlayer lesson={currentLesson} />
                        ) : (
                            <div style={{
                                aspectRatio: '16/9',
                                backgroundColor: 'var(--bg-card)',
                                borderRadius: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <Play size={64} color="var(--text-muted)" />
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    {currentLesson?.title || 'Select a lesson'}
                                </h2>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    Lesson {currentIndex + 1} of {allLessons.length}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={goToPrevLesson}
                                    disabled={currentIndex <= 0}
                                    className="btn btn-secondary"
                                    style={{ opacity: currentIndex <= 0 ? 0.5 : 1 }}
                                >
                                    <ChevronLeft size={18} />
                                    Previous
                                </button>
                                <button
                                    onClick={handleLessonComplete}
                                    disabled={completedLessons.has(currentLesson?.id)}
                                    className="btn btn-primary"
                                    style={{
                                        backgroundColor: completedLessons.has(currentLesson?.id) ? 'var(--success)' : undefined
                                    }}
                                >
                                    {completedLessons.has(currentLesson?.id) ? (
                                        <><Check size={18} /> Completed</>
                                    ) : (
                                        <><CheckCircle size={18} /> Mark Complete</>
                                    )}
                                </button>
                                <button
                                    onClick={goToNextLesson}
                                    disabled={currentIndex >= allLessons.length - 1}
                                    className="btn btn-secondary"
                                    style={{ opacity: currentIndex >= allLessons.length - 1 ? 0.5 : 1 }}
                                >
                                    Next
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        {currentLesson?.description && (
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                                    About this lesson
                                </h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                    {currentLesson.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {sidebarOpen && (
                <div style={{
                    width: '320px',
                    borderLeft: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Course Content</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <BookOpen size={14} />
                            <span>{allLessons.length} lessons</span>
                            <span style={{ margin: '0 0.25rem' }}>•</span>
                            <CheckCircle size={14} />
                            <span>{completedLessons.size} completed</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto' }}>
                        {course.sections?.map((section, sectionIndex) => (
                            <div key={section.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Section {sectionIndex + 1}: {section.title}
                                    </h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        {section.lessons?.length || 0} lessons
                                    </p>
                                </div>
                                <div>
                                    {section.lessons?.map((lesson, lessonIndex) => {
                                        const isActive = currentLesson?.id === lesson.id;
                                        const isCompleted = completedLessons.has(lesson.id);
                                        
                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => selectLesson(lesson)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.875rem 1.25rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    textAlign: 'left',
                                                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                                                    border: 'none',
                                                    borderLeft: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--bg-main)',
                                                    flexShrink: 0
                                                }}>
                                                    {isCompleted ? (
                                                        <Check size={14} color="white" />
                                                    ) : (
                                                        <Play size={12} color={isActive ? 'white' : 'var(--text-muted)'} />
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{
                                                        fontSize: '0.8rem',
                                                        fontWeight: isActive ? 500 : 400,
                                                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {lessonIndex + 1}. {lesson.title}
                                                    </p>
                                                    {lesson.duration && (
                                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                                                            <Clock size={10} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                                            {lesson.duration}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const VideoPlayer = ({ lesson }) => {
    const getEmbedUrl = () => {
        const { video_url, video_type } = lesson;
        
        if (video_type === 'youtube') {
            const videoId = extractYouTubeId(video_url);
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        
        if (video_type === 'vimeo') {
            const videoId = extractVimeoId(video_url);
            return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
        }
        
        return null;
    };

    const embedUrl = getEmbedUrl();

    if (lesson.video_type === 'direct') {
        return (
            <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                backgroundColor: '#000',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                marginBottom: '1.5rem'
            }}>
                <video
                    src={lesson.video_url}
                    controls
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                />
            </div>
        );
    }

    if (embedUrl) {
        return (
            <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                backgroundColor: '#000',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                marginBottom: '1.5rem'
            }}>
                <iframe
                    src={embedUrl}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={lesson.title}
                />
            </div>
        );
    }

    return (
        <div style={{
            aspectRatio: '16/9',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <Play size={64} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-muted)' }}>Invalid video URL</p>
        </div>
    );
};

const extractYouTubeId = (url) => {
    if (!url) return null;
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
        /youtube\.com\/watch\?.*v=([^&\s]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
};

const extractVimeoId = (url) => {
    if (!url) return null;
    
    const patterns = [
        /vimeo\.com\/(\d+)/,
        /player\.vimeo\.com\/video\/(\d+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
};

export default CoursePlayer;
