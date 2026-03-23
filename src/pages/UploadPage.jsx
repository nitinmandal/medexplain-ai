import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './UploadPage.css';

const UploadPage = () => {
    const { t, i18n } = useTranslation();
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;

        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Invalid file format. Please upload PDF, JPG, or PNG.');
            setFile(null);
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size exceeds the 10MB maximum limit.');
            setFile(null);
            return;
        }

        setError('');
        setFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please upload a file first.');
            return;
        }

        setIsAnalyzing(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('report', file);
            formData.append('language', i18n.language);

            const token = localStorage.getItem('medexplain_token');
            if (!token) {
                setError('You must be logged in to analyze reports.');
                setTimeout(() => navigate('/login'), 2000);
                setIsAnalyzing(false);
                return;
            }

            const response = await fetch('http://localhost:5001/api/analyze', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem('medexplain_token');
                localStorage.removeItem('medexplain_user');
                window.dispatchEvent(new Event('user-auth-change'));
                throw new Error('Session expired or unauthorized. Please log in again.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze report.');
            }

            setIsAnalyzing(false);
            navigate('/dashboard', { state: { results: data, id: data._id || new Date().toISOString() } });
        } catch (err) {
            setIsAnalyzing(false);
            setError(err.message || 'Error connecting to the AI server.');
            if (err.message.includes('Session')) {
                setTimeout(() => navigate('/login'), 2000);
            }
        }
    };

    return (
        <div className="upload-page animate-fade-in">
            <div className="container">
                <div className="upload-container">
                    <div className="upload-header">
                        <h1 className="upload-title">{t('upload.title')}</h1>
                        <p className="upload-subtitle">{t('upload.subtitle')}</p>
                    </div>

                    <div
                        className={`upload-box ${file ? 'has-file' : ''} ${error ? 'has-error' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden-input"
                        />

                        {file ? (
                            <div className="file-selected">
                                <File className="file-icon" />
                                <div className="file-details">
                                    <p className="file-name">{file.name}</p>
                                    <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <CheckCircle2 className="success-icon" />
                            </div>
                        ) : (
                            <div className="upload-prompt">
                                <UploadCloud className="upload-icon" />
                                <h3>{t('upload.drag_drop')}</h3>
                                <p>{t('upload.browse')}</p>
                                <div className="upload-formats">{t('upload.supported')}</div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="upload-actions">
                        <button
                            className="btn btn-primary btn-analyze"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAnalyze();
                            }}
                            disabled={!file || isAnalyzing}
                        >
                            {isAnalyzing ? t('upload.analyzing') : t('upload.analyze_btn')}
                        </button>
                    </div>

                    {isAnalyzing && (
                        <div className="analysis-loading">
                            <div className="scanner-container">
                                <div className="scanner-document">
                                    <div className="scanner-line"></div>
                                </div>
                            </div>
                            <p className="loading-title">{t('upload.ai_analyzing')}</p>
                            <div className="loading-steps">
                                <span className="typing-text">{t('upload.extracting')}</span>
                            </div>
                        </div>
                    )}

                    <div className="security-notice">
                        <AlertCircle size={14} />
                        <span>{t('upload.security')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
