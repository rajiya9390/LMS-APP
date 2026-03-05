import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    BookOpen, 
    Clock, 
    Trophy, 
    TrendingUp, 
    Play, 
    CheckCircle, 
    Award,
    Calendar,
    ArrowRight
} from 'lucide-react';

const Dashboard = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [progress, setProgress] = useState({});
    const [stats, setStats] = useState({
        totalCourses: 0,
        completedLessons: 0,
        totalLessons: 0,
        hoursLearned: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let user = {};
    try {
        if (userString && userString !== 'undefined') {
            user = JSON.parse(userString);
        }
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
    }

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [coursesRes, progressRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/courses/enrolled', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/progress', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const courses = coursesRes.data || [];
                const progressData = progressRes.data || {};

                setEnrolledCourses(courses);
                setProgress(progressData);

                const totalLessons = courses.reduce((acc, course) => 
                    acc + (course.sections?.reduce((s, section) => s + (section.lessons?.length || 0), 0) || 0), 0);
                
                const completedLessons = Object.values(progressData).filter(p => p.completed).length;

                setStats({
                    totalCourses: courses.length,
                    completedLessons,
                    totalLessons,
                    hoursLearned: Math.round(completedLessons * 0.5)
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, navigate]);

    const getCourseProgress = (courseId) => {
        const courseProgress = progress[courseId];
        if (!courseProgress) return 0;
        return courseProgress.percentage || 0;
    };

    const getContinueLesson = (course) => {
        const courseProgress = progress[course.id];
        if (!courseProgress || !courseProgress.lastLessonId) {
            return course.sections?.[0]?.lessons?.[0];
        }
        
        for (const section of course.sections || []) {
            const lesson = section.lessons?.find(l => l.id === courseProgress.lastLessonId);
            if (lesson) return lesson;
        }
        return course.sections?.[0]?.lessons?.[0];
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
            <div className="loader" style={{ marginBottom: '1.5rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0] || 'Student'}</span>!
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                    Here's your learning progress and enrolled courses.
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '1rem',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <BookOpen size={28} color="var(--primary)" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Enrolled Courses</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.totalCourses}</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '1rem',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CheckCircle size={28} color="var(--success)" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Completed Lessons</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.completedLessons}</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '1rem',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Clock size={28} color="var(--accent)" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Hours Learned</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.hoursLearned}</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '1rem',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Trophy size={28} color="#f59e0b" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Achievements</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.completedLessons > 0 ? Math.floor(stats.completedLessons / 5) : 0}</p>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <TrendingUp size={24} color="var(--primary)" />
                    Continue Learning
                </h2>

                {enrolledCourses.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No enrolled courses yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Start your learning journey by exploring our courses.
                        </p>
                        <Link to="/categories" className="btn btn-primary">
                            Browse Courses <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {enrolledCourses.map(course => {
                            const progressPercent = getCourseProgress(course.id);
                            const continueLesson = getContinueLesson(course);
                            
                            return (
                                <div key={course.id} className="card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '0.5rem',
                                            backgroundColor: '#334155',
                                            overflow: 'hidden',
                                            flexShrink: 0
                                        }}>
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Play size={24} color="var(--text-muted)" />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {course.title}
                                            </h3>
                                            <span className="badge" style={{ fontSize: '0.7rem' }}>{course.category}</span>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                                            <span style={{ fontWeight: 600 }}>{progressPercent}%</span>
                                        </div>
                                        <div style={{
                                            height: '6px',
                                            backgroundColor: 'var(--bg-main)',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${progressPercent}%`,
                                                backgroundColor: 'var(--primary)',
                                                borderRadius: '3px',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div>

                                    <Link 
                                        to={`/learn/${course.id}${continueLesson ? `?lesson=${continueLesson.id}` : ''}`}
                                        className="btn btn-primary"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        <Play size={18} />
                                        {progressPercent === 0 ? 'Start Course' : 'Continue Learning'}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
