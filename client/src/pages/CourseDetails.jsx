import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [enrolled, setEnrolled] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`http://localhost:5000/api/courses/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setCourse(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const handleEnroll = async () => {
        if (!token) {
            navigate('/auth');
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/progress/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseId: parseInt(id) })
            });
            if (res.ok || res.status === 400) {
                setEnrolled(true);
                navigate(`/learn/${id}`);
            }
        } catch (err) {
            alert('Enrollment failed: ' + err.message);
        }
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
        return match ? match[1] : null;
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (error) return <div style={{ padding: '4rem', textAlign: 'center' }}>Error: {error}</div>;
    if (!course) return <div style={{ padding: '4rem', textAlign: 'center' }}>Course not found</div>;

    // Get first lesson for preview
    const firstLesson = course.sections?.[0]?.lessons?.[0];
    const previewVideoId = firstLesson ? getYouTubeId(firstLesson.video_url) : null;

    return (
        <div style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
            <div className="container">
                {/* Course Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <span style={{ 
                        background: 'var(--primary)', 
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                    }}>
                        {course.category}
                    </span>
                    <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{course.title}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>{course.description}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                    {/* Left Column - Video & Content */}
                    <div>
                        {/* Video Preview */}
                        {previewVideoId && (
                            <div style={{ 
                                position: 'relative',
                                paddingBottom: '56.25%',
                                background: '#000',
                                borderRadius: '0.75rem',
                                overflow: 'hidden',
                                marginBottom: '2rem'
                            }}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${previewVideoId}`}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: 'none'
                                    }}
                                    allowFullScreen
                                    title="Course Preview"
                                />
                            </div>
                        )}

                        {/* Course Stats */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '2rem',
                            padding: '1.5rem',
                            background: 'rgba(30,41,59,0.5)',
                            borderRadius: '0.75rem',
                            marginBottom: '2rem'
                        }}>
                            <span><BookOpen size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                                {course.sections?.length || 0} Sections
                            </span>
                            <span><Clock size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                                Self-paced
                            </span>
                        </div>

                        {/* What You'll Learn */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3>What you'll learn</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {['Industry standards', 'Practical projects', 'Foundational concepts', 'Advanced techniques'].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={18} color="var(--success)" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content */}
                        <div>
                            <h3>Course Content</h3>
                            {course.sections?.map((section, idx) => (
                                <div key={section.id} style={{ 
                                    border: '1px solid var(--border)',
                                    borderRadius: '0.5rem',
                                    marginBottom: '0.75rem',
                                    overflow: 'hidden'
                                }}>
                                    <div 
                                        onClick={() => toggleSection(section.id)}
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(30,41,59,0.5)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span style={{ fontWeight: 600 }}>{idx + 1}. {section.title}</span>
                                        <div>
                                            <span style={{ color: 'var(--text-muted)', marginRight: '1rem' }}>
                                                {section.lessons?.length || 0} lessons
                                            </span>
                                            {expandedSections[section.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>
                                    {expandedSections[section.id] && section.lessons?.map(lesson => (
                                        <div key={lesson.id} style={{ 
                                            padding: '0.75rem 1rem',
                                            borderTop: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem'
                                        }}>
                                            <Play size={16} color="var(--text-muted)" />
                                            <span style={{ flex: 1 }}>{lesson.title}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                {lesson.duration}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Enrollment */}
                    <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        <div style={{ 
                            padding: '2rem',
                            background: 'var(--bg-card)',
                            borderRadius: '1rem',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ 
                                width: '100%',
                                height: '180px',
                                background: `url(${course.thumbnail}) center/cover`,
                                borderRadius: '0.5rem',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'rgba(37,99,235,0.9)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Play size={28} color="white" fill="white" />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Play size={18} />
                                    <span>{course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)} video lessons</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Clock size={18} />
                                    <span>Full lifetime access</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                    <CheckCircle size={18} />
                                    <span>Certificate of completion</span>
                                </div>
                            </div>

                            {enrolled ? (
                                <button 
                                    onClick={() => navigate(`/learn/${id}`)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'var(--success)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Continue Learning
                                </button>
                            ) : (
                                <button 
                                    onClick={handleEnroll}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Enroll Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;
