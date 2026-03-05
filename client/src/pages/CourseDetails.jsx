import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Play, ArrowRight, BookOpen, Clock } from 'lucide-react';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setCourse(data);
            } catch (err) {
                console.error('Error fetching course:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        if (!token) return navigate('/auth');
        try {
            await axios.post('http://localhost:5000/api/progress/enroll', { courseId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/learn/${id}`);
        } catch (err) {
            if (err.response?.status === 400) navigate(`/learn/${id}`);
            else alert('Enrollment failed: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (!course) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Course not found</div>;

    return (
        <div style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
                    <div>
                        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>{course.category}</span>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>{course.title}</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>{course.description}</p>

                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>What you'll learn</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {['Industry standards', 'Practical projects', 'Foundational concepts', 'Advanced techniques'].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                        <CheckCircle size={20} color="var(--success)" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Course Content</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {course.sections?.map(section => (
                                    <div key={section.id} className="card" style={{ padding: '1.25rem' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {section.title}
                                            <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                                                {section.lessons?.length} lessons
                                            </span>
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        <div className="card" style={{ padding: '2rem' }}>
                            <div style={{ width: '100%', height: '200px', backgroundColor: '#334155', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Play size={48} color="rgba(255,255,255,0.5)" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Clock size={20} />
                                    <span>Self-paced learning</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                    <BookOpen size={20} />
                                    <span>Full lifetime access</span>
                                </div>
                            </div>

                            <button
                                onClick={handleEnroll}
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
                            >
                                Enroll Now <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
