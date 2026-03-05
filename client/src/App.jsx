import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import LearningPage from './pages/LearningPage';
import Auth from './pages/Auth';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import CourseManager from './pages/CourseManager';
import './index.css';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/auth" />;
};

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/course/:id" element={<CourseDetails />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/learn/:courseId"
                            element={
                                <ProtectedRoute>
                                    <CoursePlayer />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/learning/:courseId"
                            element={
                                <ProtectedRoute>
                                    <LearningPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/courses"
                            element={
                                <ProtectedRoute>
                                    <CourseManager />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
