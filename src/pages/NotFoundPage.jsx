import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Home } from 'lucide-react';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="not-found-page animate-fade-in">
            <div className="container">
                <div className="not-found-content">
                    <div className="not-found-icon-wrapper">
                        <AlertCircle size={64} className="text-primary animate-pulse" />
                    </div>
                    <h1 className="not-found-title">404</h1>
                    <h2 className="not-found-subtitle">{t('notfound.title') || 'Page Not Found'}</h2>
                    <p className="not-found-text">
                        {t('notfound.text') || 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}
                    </p>
                    <Link to="/" className="btn btn-primary btn-lg mt-6">
                        <Home size={18} className="mr-2" />
                        {t('notfound.button') || 'Return to Home'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
