import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, ShieldCheck, Zap } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">Understand Your Medical Reports Instantly</h1>
                        <p className="hero-subtitle">
                            Upload your medical report and get simple explanations of your test results within seconds.
                        </p>
                        <div className="hero-actions">
                            <Link to="/upload" className="btn btn-primary btn-lg">Upload Your Report</Link>
                            <Link to="/about" className="btn btn-outline btn-lg">How It Works</Link>
                        </div>
                        <div className="hero-disclaimer">
                            <ShieldCheck className="icon-small" />
                            <span>Secure, Private & Confidential</span>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="illustration-placeholder">
                            <FileSearch className="illustration-icon" />
                            <div className="pulse-circle"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section bg-light">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3 className="step-title">Upload Report</h3>
                            <p className="step-desc">Upload your medical lab report as a PDF, JPG, or PNG file securely.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3 className="step-title">AI Analysis</h3>
                            <p className="step-desc">Our advanced AI scans and extracts your complex lab test values seamlessly.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3 className="step-title">Get Insights</h3>
                            <p className="step-desc">Receive easy-to-understand explanations and insights of your health metrics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <Zap className="feature-icon" />
                            <h3 className="feature-title">Instant Explanation</h3>
                            <p>Get immediate, plain-language translations of medical jargon.</p>
                        </div>
                        <div className="feature-card">
                            <ShieldCheck className="feature-icon" />
                            <h3 className="feature-title">Privacy First</h3>
                            <p>Reports are securely processed and automatically deleted after analysis.</p>
                        </div>
                        <div className="feature-card">
                            <FileSearch className="feature-icon" />
                            <h3 className="feature-title">AI-Powered Extraction</h3>
                            <p>State-of-the-art AI accurately identifies key biomarkers and metrics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2 className="cta-title">Ready to understand your health better?</h2>
                    <p className="cta-desc">Join thousands of users who demystified their medical reports today.</p>
                    <Link to="/upload" className="btn btn-accent btn-lg">Start Analysis Now</Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
