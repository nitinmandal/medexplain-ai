import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    return (
        <>
            <div className="disclaimer-banner">
                This platform provides informational insights only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
            </div>
            <header className="navbar">
                <div className="container navbar-container">
                    <Link to="/" className="navbar-logo">
                        <Stethoscope className="logo-icon" />
                        <span>MedExplain AI</span>
                    </Link>
                    <nav className="navbar-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/upload" className="btn btn-primary nav-btn">Upload Report</Link>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Navbar;
