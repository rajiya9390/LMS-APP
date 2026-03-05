import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, LogOut, LayoutDashboard, Grid, Home, Settings } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: isActive(path) ? 'var(--primary)' : 'var(--text-muted)',
        backgroundColor: isActive(path) ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
        transition: 'all 0.2s'
    });

    return (
        <nav className="navbar" style={{
            height: '64px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem',
            backgroundColor: 'var(--bg-main)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <BookOpen size={28} color="var(--primary)" />
                <span>LMS<span style={{ color: 'var(--primary)' }}>Hub</span></span>
            </Link>

            <div style={{ marginLeft: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/" style={navLinkStyle('/')}>
                    <Home size={18} />
                    Home
                </Link>
                <Link to="/categories" style={navLinkStyle('/categories')}>
                    <Grid size={18} />
                    Categories
                </Link>
                {token && (
                    <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                )}
                {token && (
                    <Link to="/admin/courses" style={navLinkStyle('/admin/courses')}>
                        <Settings size={18} />
                        Manage
                    </Link>
                )}
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {token ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <User size={18} />
                            <span>{user?.name || 'User'}</span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                            <LogOut size={18} />
                        </button>
                    </>
                ) : (
                    <Link to="/auth" className="btn btn-primary">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
