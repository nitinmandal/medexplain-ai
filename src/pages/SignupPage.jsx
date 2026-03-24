import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';
import './Auth.css';

const SignupPage = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Signup failed');

            localStorage.setItem('medexplain_token', data.token);
            localStorage.setItem('medexplain_user', JSON.stringify(data.user));

            window.dispatchEvent(new Event('user-auth-change'));

            setIsLoading(false);
            navigate('/upload');
        } catch (err) {
            setIsLoading(false);
            setError(err.message || t('auth.signup.error') || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="auth-page animate-fade-in">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Logo size="large" />
                    </div>
                    <h1 className="auth-title">{t('auth.signup.title')}</h1>
                    <p className="auth-subtitle">{t('auth.signup.subtitle')}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>{t('auth.signup.name')}</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('auth.signup.email')}</label>
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
                        <label>{t('auth.signup.password')}</label>
                        <div className="input-with-icon">
                            <KeyRound className="input-icon" size={18} />
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? t('auth.signup.creating') : t('auth.signup.button')}
                        {!isLoading && <ArrowRight size={18} className="ml-2" />}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>{t('auth.signup.has_account')} <Link to="/login" className="auth-link">{t('auth.signup.login_link')}</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
