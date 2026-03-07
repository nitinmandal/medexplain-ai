import React from 'react';
import { Target, Users, BookOpen } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page animate-fade-in">
            <div className="container">
                <div className="about-header text-center">
                    <h1 className="page-title">About MedExplain AI</h1>
                    <p className="page-subtitle">Demystifying healthcare, one report at a time.</p>
                </div>

                <div className="mission-card">
                    <Target className="mission-icon" />
                    <h2>Our Mission</h2>
                    <p className="mission-text">
                        "Our mission is to make medical reports easier for everyone to understand by using AI to translate complex medical data into simple language."
                    </p>
                </div>

                <div className="about-content">
                    <div className="about-text-section">
                        <h3 className="section-heading">Why We Started</h3>
                        <p>
                            Many people receive medical lab reports full of complex terminology and numerical values they don't understand, leading to anxiety and confusion. MedExplain AI was built to empower patients with instant, easy-to-read insights about their health metrics.
                        </p>

                        <h3 className="section-heading mt-4">Looking Forward</h3>
                        <p>
                            We are continuously improving our AI models to support more tests and provide deeper insights. Soon, we will be introducing features like personalized health trend tracking, doctor consultation booking, and medical history management.
                        </p>
                    </div>
                    <div className="about-features-section">
                        <div className="mini-feature">
                            <Users className="mini-icon" />
                            <div>
                                <h4>Patient-Centric</h4>
                                <p>Designed for everyday people, not just doctors.</p>
                            </div>
                        </div>
                        <div className="mini-feature">
                            <BookOpen className="mini-icon" />
                            <div>
                                <h4>Educational</h4>
                                <p>Learn what your biomarkers mean for your overall health.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
