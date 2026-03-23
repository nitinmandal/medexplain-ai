import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Logo />
                        </div>
                        <p className="footer-description">
                            Advancing the future of medical diagnostics through ethical, explainable artificial intelligence. Bridge the gap between data and patient care.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-title">Platform</h4>
                        <ul className="footer-list">
                            <li><Link to="/upload" className="footer-link">Medical Analysis</Link></li>
                            <li><Link to="/#features" className="footer-link">Features</Link></li>
                            <li><Link to="/about" className="footer-link">How it Works</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-title">Company</h4>
                        <ul className="footer-list">
                            <li><Link to="/about" className="footer-link">About MedExplain</Link></li>
                            <li><Link to="/disclaimer" className="footer-link">Medical Disclaimer</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-title">Legal</h4>
                        <ul className="footer-list">
                            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                            <li><Link to="/disclaimer" className="footer-link">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} MedExplain AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
