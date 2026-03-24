import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Users, FileText } from 'lucide-react';
import heroImg from '../assets/hero-dashboard.png';
import './LandingPage.css';

const LandingPage = () => {
    const { t } = useTranslation();

    return (
        <div className="landing-page animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="badge-dot-wrapper">
                                <span className="badge-dot-ping"></span>
                                <span className="badge-dot"></span>
                            </span>
                            <span className="badge-text">{t('landing.badge') || 'AI-Powered Medical Insights'}</span>
                        </div>
                        <h1 className="hero-title">
                            {t('landing.hero.title_part1') || 'Simplifying Medical'} <span className="text-accent">{t('landing.hero.title_accent') || 'Insights'}</span> {t('landing.hero.title_part2') || 'with AI'}
                        </h1>
                        <p className="hero-subtitle">
                            {t('landing.hero.subtitle') || 'Empowering healthcare professionals and patients with instant, accurate, and actionable AI-driven medical analysis. Bridge the gap between data and care.'}
                        </p>
                        <div className="hero-actions">
                            <Link to="/upload" className="btn btn-primary btn-lg">
                                {t('landing.hero.cta') || 'Upload Report'}
                            </Link>
                            <Link to="/about" className="btn btn-outline btn-lg">
                                {t('landing.hero.demo') || 'View Demo'}
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-glow-1"></div>
                        <div className="hero-glow-2"></div>
                        <div className="hero-image-card">
                            <img src={heroImg} alt="AI Medical Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </section>



            {/* Core Features Section */}
            <section className="features-section" id="features">
                <div className="container">
                    <div className="features-header">
                        <span className="section-label">{t('landing.features.label') || 'Core Capabilities'}</span>
                        <h3 className="section-heading">{t('landing.features.title') || 'Advanced AI solutions for the modern healthcare landscape.'}</h3>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Zap size={28} color="white" />
                            </div>
                            <h4 className="feature-title">{t('landing.features.analysis.title') || 'AI Analysis'}</h4>
                            <p className="feature-desc">
                                {t('landing.features.analysis.desc') || 'Deep learning models process medical imagery and data with unprecedented speed and precision.'}
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Users size={28} color="white" />
                            </div>
                            <h4 className="feature-title">{t('landing.features.collab.title') || 'Health Trends'}</h4>
                            <p className="feature-desc">
                                {t('landing.features.collab.desc') || 'Track your medical history over time and visualize progress with interactive health timelines.'}
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <FileText size={28} color="white" />
                            </div>
                            <h4 className="feature-title">{t('landing.features.summary.title') || 'Patient Summaries'}</h4>
                            <p className="feature-desc">
                                {t('landing.features.summary.desc') || 'Convert complex clinical jargon into clear, simplified reports that help patients understand their health.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="container">
                    <div className="hiw-header">
                        <span className="section-label section-label-light">{t('landing.hiw.label') || 'The Process'}</span>
                        <h2 className="section-heading-light">{t('landing.hiw.title') || 'How MedExplain Works'}</h2>
                    </div>
                    <div className="hiw-timeline">
                        <div className="hiw-progress-line"></div>
                        <div className="hiw-steps">
                            <div className="hiw-step">
                                <div className="hiw-number">1</div>
                                <h3 className="hiw-step-title">{t('landing.hiw.step1.title') || 'Upload Report'}</h3>
                                <p className="hiw-step-desc">{t('landing.hiw.step1.desc') || 'Securely upload your lab results or medical documents.'}</p>
                            </div>
                            <div className="hiw-step">
                                <div className="hiw-number">2</div>
                                <h3 className="hiw-step-title">{t('landing.hiw.step2.title') || 'AI Processing'}</h3>
                                <p className="hiw-step-desc">{t('landing.hiw.step2.desc') || 'Our proprietary neural engine analyzes every data point.'}</p>
                            </div>
                            <div className="hiw-step">
                                <div className="hiw-number">3</div>
                                <h3 className="hiw-step-title">{t('landing.hiw.step3.title') || 'Verification'}</h3>
                                <p className="hiw-step-desc">{t('landing.hiw.step3.desc') || 'Results are cross-referenced with medical terminology.'}</p>
                            </div>
                            <div className="hiw-step">
                                <div className="hiw-number">4</div>
                                <h3 className="hiw-step-title">{t('landing.hiw.step4.title') || 'Get Insights'}</h3>
                                <p className="hiw-step-desc">{t('landing.hiw.step4.desc') || 'Receive detailed, easy-to-understand health insights.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-glow-1"></div>
                        <div className="cta-glow-2"></div>
                        <h2 className="cta-title">{t('landing.cta.title') || 'Ready to understand your results?'}</h2>
                        <p className="cta-desc">{t('landing.cta.subtitle') || 'Join thousands of users who use MedExplain to simplify their healthcare journey.'}</p>
                        <Link to="/upload" className="btn btn-accent btn-lg cta-btn">
                            {t('landing.cta.button') || 'Get Started Now'}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
