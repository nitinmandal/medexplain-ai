import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Users, FileText, PlayCircle, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const { t } = useTranslation();
    return (
        <div className="landing-page animate-fade-in">
            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="badge-dot-wrapper">
                                <span className="badge-dot-ping"></span>
                                <span className="badge-dot"></span>
                            </span>
                            <span className="badge-text">{t('landing.badge') || 'Startup-Level AI Insight'}</span>
                        </div>
                        <h1 className="hero-title">
                            Understand your medical reports in seconds
                            <span className="text-accent"> — powered by AI</span>
                        </h1>
                        <p className="hero-subtitle">
                            Upload reports or describe symptoms and get simple, human-readable explanations instantly.
                        </p>
                        <div className="hero-actions">
                            <Link to="/upload" className="btn btn-primary btn-lg">
                                <PlayCircle size={20} className="mr-2" /> Try it now
                            </Link>
                        </div>
                        <p className="hero-trust-line">
                            ⚠️ Not a substitute for professional medical advice
                        </p>
                    </div>
                </div>
                <div className="hero-glow-1"></div>
                <div className="hero-glow-2"></div>
            </section>


            {/* 3. Key Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-label">Why MedExplain?</span>
                        <h2 className="section-heading">Medical clarity for everyone</h2>
                    </div>
                    <div className="benefits-grid">
                        <div className="benefit-card glass-card">
                            <FileText size={40} className="text-accent mb-4" />
                            <h3>Simple Summaries</h3>
                            <p>Get a human-readable overview of your report without the confusing jargon.</p>
                        </div>
                        <div className="benefit-card glass-card">
                            <AlertTriangle size={40} className="text-warning mb-4" />
                            <h3>Key Findings</h3>
                            <p>We automatically highlight high or low values so you know what to ask your doctor.</p>
                        </div>
                        <div className="benefit-card glass-card">
                            <ShieldCheck size={40} className="text-accent mb-4" />
                            <h3>Private & Secure</h3>
                            <p>Your medical data isn&apos;t stored. We analyze it in real-time and delete it immediately.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. How It Works Section */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="container">
                    <div className="hiw-header text-center">
                        <span className="section-label section-label-light">The Process</span>
                        <h2 className="section-heading-light">How MedExplain Works</h2>
                    </div>
                    <div className="hiw-steps-v2">
                        <div className="hiw-card">
                            <div className="hiw-icon-box"><FileText size={32} /></div>
                            <h3>1. Upload or Enter</h3>
                            <p>Upload a PDF/Image of your report or simply paste the text result.</p>
                        </div>
                        <div className="hiw-card">
                            <div className="hiw-icon-box"><Zap size={32} /></div>
                            <h3>2. AI Analysis</h3>
                            <p>Our AI processes the medical jargon and correlates values with health benchmarks.</p>
                        </div>
                        <div className="hiw-card">
                            <div className="hiw-icon-box"><Users size={32} /></div>
                            <h3>3. Get Clarity</h3>
                            <p>Receive a structured, human-readable report you can actually understand.</p>
                        </div>
                    </div>
                </div>
            </section>





            {/* 7. Wow Feature Section */}
            <section className="wow-feature-section">
                <div className="container">
                    <div className="wow-card">
                        <div className="wow-content">
                            <span className="badge-new">NEW</span>
                            <h2>PDF Upload & Highlighting</h2>
                            <p>Simply upload your lab&apos;s PDF. Our AI automatically scans it, highlights abnormal values in red, and provides interactive tooltips explaining each one.</p>
                            <Link to="/upload" className="btn btn-accent">Try PDF Analysis <ArrowRight size={18} /></Link>
                        </div>
                        <div className="wow-visual">
                            {/* Visual representation of highlighting */}
                            <div className="document-mock">
                                <div className="doc-line"></div>
                                <div className="doc-line doc-highlight-bad">Glucose: 140 mg/dL</div>
                                <div className="doc-line"></div>
                                <div className="doc-line doc-highlight-good">Hemoglobin: 14.2</div>
                                <div className="doc-line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2 className="cta-title">Ready to understand your results?</h2>
                        <p className="cta-desc">Join thousands of users who use MedExplain to simplify their healthcare journey safely.</p>
                        <Link to="/upload" className="btn btn-accent btn-lg cta-btn">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
