import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetailsSimple = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Course ID from URL:', id);
        
        const fetchCourse = async () => {
            try {
                const url = `http://localhost:5000/api/courses/${id}`;
                console.log('Fetching from:', url);
                const response = await axios.get(url);
                console.log('Response:', response.data);
                setCourse(response.data);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchCourse();
        }
    }, [id]);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading course {id}...</div>;
    if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
    if (!course) return <div style={{ padding: '4rem', textAlign: 'center' }}>Course {id} not found</div>;

    return (
        <div style={{ padding: '4rem' }}>
            <h1>{course.title}</h1>
            <p>Category: {course.category}</p>
            <p>{course.description}</p>
            <button onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>
                Back to Home
            </button>
        </div>
    );
};

export default CourseDetailsSimple;
