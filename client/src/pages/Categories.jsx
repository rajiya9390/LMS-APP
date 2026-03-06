import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Play, Grid, Code, Database, Palette, BarChart, Globe, Cpu, Smartphone } from 'lucide-react';

const categoryIcons = {
    'Programming': Code,
    'Data Science': Database,
    'Design': Palette,
    'Business': BarChart,
    'Web Development': Globe,
    'AI & ML': Cpu,
    'Mobile Development': Smartphone,
};

const Categories = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/courses');
                if (Array.isArray(data)) {
                    setCourses(data);
                    const uniqueCategories = ['All', ...new Set(data.map(c => c.category))];
                    setCategories(uniqueCategories);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = selectedCategory === 'All' 
        ? courses 
        : courses.filter(c => c.category === selectedCategory);

    const getCourseCount = (category) => {
        if (category === 'All') return courses.length;
        return courses.filter(c => c.category === category).length;
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
            <div className="loader" style={{ marginBottom: '1.5rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading categories...</p>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Browse <span style={{ color: 'var(--primary)' }}>Categories</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                    Explore courses across various fields and find the perfect learning path for you.
                </p>
            </header>

            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.75rem', 
                justifyContent: 'center',
                marginBottom: '3rem' 
            }}>
                {categories.map(category => {
                    const Icon = categoryIcons[category] || Grid;
                    const isActive = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border)',
                                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-card)',
                                color: isActive ? 'white' : 'var(--text-main)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}
                        >
                            <Icon size={18} />
                            <span>{category}</span>
                            <span style={{
                                padding: '0.125rem 0.5rem',
                                borderRadius: '1rem',
                                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-main)',
                                fontSize: '0.75rem'
                            }}>
                                {getCourseCount(category)}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {filteredCourses.map(course => (
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
                                    <span>{course.sections?.length || 0} sections</span>
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>View Course</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                    <Grid size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No courses found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Categories;
