import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Activity, ChevronRight, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './ProfilePage.css';

const ProfilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('medexplain_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('medexplain_token');
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reports`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                    localStorage.setItem('medexplain_reports_history', JSON.stringify(data));
                }
            } catch (err) {
                console.error("Failed to fetch history from server", err);
                const storedHistory = localStorage.getItem('medexplain_reports_history');
                if (storedHistory) setHistory(JSON.parse(storedHistory));
            }
        };

        fetchHistory();
    }, []);

    const handleViewReport = (report) => {
        navigate('/dashboard', { state: { results: report.results, id: report.id, reportDate: report.date } });
    };

    if (!user) return null;

    return (
        <div className="profile-page animate-fade-in">
            <div className="container">
                <div className="profile-header">
                    <h1 className="profile-title">{t('profile.title') || 'My Profile'}</h1>
                    <p className="profile-subtitle">{t('profile.subtitle') || 'Manage your account and view your health history.'}</p>
                </div>

                <div className="profile-grid">
                    <div className="profile-card user-details-card">
                        <div className="user-avatar-large">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <h2>{user.name}</h2>
                        
                        <div className="user-info-list">
                            <div className="user-info-item">
                                <Mail size={18} />
                                <span>{user.email}</span>
                            </div>
                            <div className="user-info-item">
                                <Activity size={18} />
                                <span>{history.length} {t('profile.reports_analyzed') || 'Reports Analyzed'}</span>
                            </div>
                        </div>

                        <button className="btn btn-outline btn-block mt-4" onClick={() => navigate('/upload')}>
                            {t('profile.new_analysis') || 'Perform New Analysis'}
                        </button>
                    </div>

                    <div className="profile-history-section">
                        <h2>{t('profile.history_title') || 'Past Health Reports'}</h2>
                        
                        {history.length > 0 ? (
                            <div className="history-list">
                                {history.map((record, index) => (
                                    <div key={index} className="history-item" onClick={() => handleViewReport(record)}>
                                        <div className="history-icon">
                                            <FileText size={24} className="text-primary" />
                                        </div>
                                        <div className="history-details">
                                            <h3>{t('profile.report_id') || 'Report'} #{record.id?.slice(-6).toUpperCase() || index + 1}</h3>
                                            <div className="history-meta">
                                                <Calendar size={14} />
                                                <span>{record.date}</span>
                                            </div>
                                        </div>
                                        <div className="history-action">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-history">
                                <Activity size={48} className="empty-icon" />
                                <h3>{t('profile.no_history') || 'No reports yet'}</h3>
                                <p>{t('profile.upload_first') || 'Upload your first medical report to start tracking your health trends.'}</p>
                                <Link to="/upload" className="btn btn-primary mt-4">
                                    {t('landing.hero.cta') || 'Upload Report'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
