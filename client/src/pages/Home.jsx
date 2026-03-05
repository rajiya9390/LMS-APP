import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, BookOpen, Play, ArrowRight, Star, Users, Award, CheckCircle } from 'lucide-react';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/courses');
                console.log('API FETCHED COURSES:', data);
                if (Array.isArray(data)) {
                    setCourses(data);
                } else {
                    console.error('API did not return an array for courses:', data);
                    setCourses([]);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses. Please check if the server is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return (
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
            <div className="loader" style={{ marginBottom: '1.5rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading premium courses...</p>
        </div>
    );

    if (error) return (
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Oops!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
        </div>
    );

    const handleGetStarted = () => {
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };

    const featuredCourses = courses.slice(0, 6);

    return (
        <div>
            <section style={{
                background: 'linear-gradient(135deg, var(--bg-main) 0%, var(--bg-card) 100%)',
                padding: '6rem 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '4rem',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                borderRadius: '2rem',
                                marginBottom: '1.5rem'
                            }}>
                                <Star size={16} color="var(--primary)" />
                                <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 500 }}>
                                    #1 Learning Platform
                                </span>
                            </div>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                                Master New Skills with <span className="text-gradient">Expert-Led</span> Courses
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                                Access thousands of professionally curated courses from industry experts. 
                                Learn at your own pace and earn certificates to boost your career.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                                <button onClick={handleGetStarted} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                                    {token ? 'Go to Dashboard' : 'Get Started Free'}
                                    <ArrowRight size={20} />
                                </button>
                                <Link to="/categories" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                                    Browse Courses
                                </Link>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={20} color="var(--success)" />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>10K+ Students</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BookOpen size={20} color="var(--accent)" />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{courses.length}+ Courses</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Award size={20} color="#f59e0b" />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Certificates</span>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            position: 'relative',
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '300px',
                                height: '300px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                opacity: 0.2,
                                filter: 'blur(60px)'
                            }} />
                            <div className="card" style={{
                                padding: '2rem',
                                maxWidth: '350px',
                                transform: 'rotate(-5deg)',
                                position: 'absolute',
                                left: '0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CheckCircle size={24} color="white" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600 }}>Course Completed!</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>React Fundamentals</p>
                                    </div>
                                </div>
                                <div style={{
                                    height: '8px',
                                    backgroundColor: 'var(--bg-main)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'var(--success)'
                                    }} />
                                </div>
                            </div>
                            <div className="card" style={{
                                padding: '1.5rem',
                                maxWidth: '280px',
                                transform: 'rotate(5deg)',
                                position: 'absolute',
                                right: '0',
                                bottom: '2rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Play size={32} color="var(--primary)" />
                                    <div>
                                        <p style={{ fontWeight: 600 }}>Now Playing</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Introduction to Python</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                            Featured Courses
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                            Hand-picked courses to help you start your learning journey
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        {featuredCourses.map(course => (
                            <Link key={course.id} to={`/course/${course.id}`} className="card">
                                <div style={{ height: '180px', backgroundColor: '#334155', position: 'relative' }}>
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                            <Play size={48} />
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                        <span className="badge">{course.category}</span>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {course.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {course.description}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            <BookOpen size={16} />
                                            <span>Interactive Lessons</span>
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Explore</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/categories" className="btn btn-secondary" style={{ padding: '0.875rem 2rem' }}>
                            View All Courses
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {!token && (
                <section style={{
                    padding: '5rem 0',
                    backgroundColor: 'var(--bg-card)',
                    textAlign: 'center'
                }}>
                    <div className="container">
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                            Ready to Start Learning?
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            Join thousands of students already learning on our platform. 
                            Sign up today and get unlimited access to all courses.
                        </p>
                        <button onClick={handleGetStarted} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                            Sign Up Now - It's Free
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
