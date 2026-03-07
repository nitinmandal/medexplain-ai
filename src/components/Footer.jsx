import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <Stethoscope className="footer-icon" />
                        <span>MedExplain AI</span>
                    </div>
                    <p className="footer-description">
                        Making medical reports easier for everyone to understand.
                    </p>
                </div>
                <div className="footer-links-container">
                    <div className="footer-section">
                        <h4 className="footer-heading">Platform</h4>
                        <Link to="/upload" className="footer-link">Upload Report</Link>
                        <Link to="/about" className="footer-link">How it Works</Link>
                    </div>
                    <div className="footer-section">
                        <h4 className="footer-heading">Legal</h4>
                        <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                        <Link to="/disclaimer" className="footer-link">Medical Disclaimer</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} MedExplain AI. All rights reserved.</p>
                    <p className="footer-disclaimer">
                        This platform provides informational insights only and does not replace professional medical advice.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
