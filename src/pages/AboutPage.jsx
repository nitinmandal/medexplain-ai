import React from 'react';
import { Target, Users, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AboutPage.css';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="about-page animate-fade-in">
            <div className="container">
                <div className="about-header text-center">
                    <h1 className="page-title">{t('about.title')}</h1>
                    <p className="page-subtitle">{t('about.subtitle')}</p>
                </div>

                <div className="mission-card">
                    <Target className="mission-icon" />
                    <h2>{t('about.mission.title')}</h2>
                    <p className="mission-text">
                        "{t('about.mission.text')}"
                    </p>
                </div>

                <div className="about-content">
                    <div className="about-text-section">
                        <h3 className="section-heading">{t('about.why.title')}</h3>
                        <p>{t('about.why.text')}</p>

                        <h3 className="section-heading mt-4">{t('about.future.title')}</h3>
                        <p>{t('about.future.text')}</p>
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
