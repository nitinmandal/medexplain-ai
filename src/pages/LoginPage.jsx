import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';
import './Auth.css';

const LoginPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            localStorage.setItem('medexplain_token', data.token);
            localStorage.setItem('medexplain_user', JSON.stringify(data.user));

            window.dispatchEvent(new Event('user-auth-change'));

            setIsLoading(false);
            navigate('/upload');
        } catch (err) {
            setIsLoading(false);
            setError(err.message || t('auth.login.error') || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-page animate-fade-in">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Logo size="large" />
                    </div>
                    <h1 className="auth-title">{t('auth.login.title')}</h1>
                    <p className="auth-subtitle">{t('auth.login.subtitle')}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>{t('auth.login.email')}</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('auth.login.password')}</label>
                        <div className="input-with-icon">
                            <KeyRound className="input-icon" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-options">
                            <Link to="#" className="forgot-password">{t('auth.login.forgot')}</Link>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? t('auth.login.signing_in') : t('auth.login.button')}
                        {!isLoading && <ArrowRight size={18} className="ml-2" />}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>{t('auth.login.no_account')} <Link to="/signup" className="auth-link">{t('auth.login.signup_link')}</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
