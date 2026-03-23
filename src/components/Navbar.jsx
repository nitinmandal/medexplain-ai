import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Globe, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const langRef = useRef(null);

    const checkAuth = () => {
        const storedUser = localStorage.getItem('medexplain_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener('user-auth-change', checkAuth);
        
        const handleClickOutside = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            window.removeEventListener('user-auth-change', checkAuth);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('medexplain_token');
        localStorage.removeItem('medexplain_user');
        setUser(null);
        window.dispatchEvent(new Event('user-auth-change'));
        navigate('/login');
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        setIsLangOpen(false);
    };

    return (
        <header className="navbar">
            <div className="container">
                <div className="navbar-container">
                    <div className="navbar-mobile-header">
                        <Link to="/" className="navbar-logo">
                            <Logo />
                        </Link>
                        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <nav className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                        <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('navbar.home')}</Link>
                        <Link to="/upload" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('navbar.upload')}</Link>
                        <a href="/#how-it-works" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('navbar.how_it_works')}</a>
                        <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('navbar.about')}</Link>
                        
                        <div className="nav-actions-container">
                            <div className="language-dropdown-container" ref={langRef}>
                                <button 
                                    className="language-dropdown-trigger" 
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                >
                                    <Globe size={16} className="globe-icon" />
                                    <span>{i18n.language === 'hi' ? 'हिन्दी' : 'English'}</span>
                                </button>
                                
                                {isLangOpen && (
                                    <div className="language-dropdown-menu">
                                        <button 
                                            className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}
                                            onClick={() => handleLanguageChange('en')}
                                        >
                                            English
                                        </button>
                                        <button 
                                            className={`language-option ${i18n.language === 'hi' ? 'active' : ''}`}
                                            onClick={() => handleLanguageChange('hi')}
                                        >
                                            हिन्दी
                                        </button>
                                    </div>
                                )}
                            </div>

                            {user ? (
                                <div className="user-profile-section">
                                    <Link to="/profile" className="user-badge" onClick={() => setIsMenuOpen(false)}>
                                        <div className="user-avatar-circle">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="user-name-text">{user.name}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="logout-btn">
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                        {t('navbar.signin')}
                                    </Link>
                                    <Link to="/signup" className="btn btn-primary nav-btn" onClick={() => setIsMenuOpen(false)}>
                                        {t('navbar.get_started') || 'Get Started'}
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
