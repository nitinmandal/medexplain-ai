import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './UploadPage.css';

const UploadPage = () => {
    const { t, i18n } = useTranslation();
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isSlowServer, setIsSlowServer] = useState(false);
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
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
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
        setUploadProgress(0);
        setIsSlowServer(false);

        const slowTimeout = setTimeout(() => setIsSlowServer(true), 4000);

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                const current = Number(prev);
                if (current >= 95) return current + (Math.random() * 0.2); // Extremely slow crawl at 95%
                if (current >= 80) return current + (Math.random() * 0.8); // Very slow from 80% to 95%
                if (current >= 50) return current + (Math.random() * 2);   // Moderate from 50% to 80%
                return current + Math.floor(Math.random() * 6) + 3;      // Fast from 0% to 50%
            });
        }, 400);

        try {
            const formData = new FormData();
            formData.append('report', file);
            formData.append('language', i18n.language);

            const token = localStorage.getItem('medexplain_token');
            if (!token) {
                clearInterval(progressInterval);
                setError('You must be logged in to analyze reports.');
                setTimeout(() => navigate('/login'), 2000);
                setIsAnalyzing(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/analyze`, {
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

            clearInterval(progressInterval);
            clearTimeout(slowTimeout);
            setIsSlowServer(false);
            setUploadProgress(100);

            setTimeout(() => {
                setIsAnalyzing(false);
                navigate('/dashboard', { state: { results: data, id: data._id || new Date().toISOString() } });
            }, 600);
        } catch (err) {
            clearInterval(progressInterval);
            clearTimeout(slowTimeout);
            setIsSlowServer(false);
            setUploadProgress(0);
            setIsAnalyzing(false);
            setError(err.message || 'Error connecting to the AI server.');
            if (err.message.includes('Session')) {
                setTimeout(() => navigate('/login'), 2000);
            }
        }
    };

    const handleSampleReport = () => {
        setIsAnalyzing(true);
        setError('');
        setUploadProgress(0);

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                const current = Number(prev);
                if (current >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return current + 10;
            });
        }, 150);

        const sampleData = {
            reportDate: "2026-03-20",
            summary: "Your overall results look good. Most values are in the normal range, but your Vitamin D level is slightly low and your LDL Cholesterol is at the upper limit.",
            quickHighlights: [
                "Vitamin D Deficiency",
                "LDL Cholesterol Borderline High",
                "Kidney & Liver function: Normal"
            ],
            recommendations: [
                "Sun exposure and Vitamin D supplements",
                "Increase fiber intake and reduce saturated fats",
                "Re-test in 3 months"
            ],
            riskScore: 25,
            riskLevel: "Low",
            results: [
                {
                    testName: "Hemoglobin",
                    value: "14.2",
                    unit: "g/dL",
                    normalRange: "13.0 - 17.0",
                    status: "Normal",
                    explanation: "Hemoglobin is the protein in your red blood cells that carries oxygen."
                },
                {
                    testName: "LDL Cholesterol",
                    value: "128",
                    unit: "mg/dL",
                    normalRange: "< 100",
                    status: "High",
                    explanation: "LDL is the 'bad' cholesterol; a lower number is better for heart health."
                },
                {
                    testName: "Vitamin D, 25-Hydroxy",
                    value: "18",
                    unit: "ng/mL",
                    normalRange: "30 - 100",
                    status: "Low",
                    explanation: "Vitamin D is essential for bone health and immune system function."
                },
                {
                    testName: "HbA1c",
                    value: "5.2",
                    unit: "%",
                    normalRange: "4.0 - 5.6",
                    status: "Normal",
                    explanation: "HbA1c shows your average blood sugar levels over the past 3 months."
                }
            ]
        };

        setTimeout(() => {
            setIsAnalyzing(false);
            navigate('/dashboard', { state: { results: sampleData, id: 'SAMPLE-' + Math.random().toString(36).substr(2, 6).toUpperCase() } });
        }, 1500);
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
                        className={`upload-box ${file ? 'has-file' : ''} ${error ? 'has-error' : ''} ${isDragging ? 'is-dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
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
                                <div className="upload-examples">
                                    <span>{t('upload.placeholder_example')}</span>
                                </div>
                                <div className="upload-formats">{t('upload.supported')}</div>
                            </div>
                        )}
                    </div>

                    <div className="upload-samples">
                        <button className="btn btn-outline btn-sm" onClick={(e) => {
                            e.stopPropagation();
                            handleSampleReport();
                        }}>
                            {t('upload.try_sample')}
                        </button>
                    </div>

                    {error && (
                        <div className="error-message animate-shake">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {isSlowServer && !error && (
                        <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #bae6fd' }}>
                            <Info size={20} className="flex-shrink-0" />
                            <span>Our free server is waking up! This initial analysis might take up to a minute. Thank you for your patience.</span>
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
                            {isAnalyzing ? (
                                <>
                                    <Loader2 size={18} className="spin-icon mr-2" />
                                    {t('upload.analyzing')}
                                </>
                            ) : t('upload.analyze_btn')}
                        </button>
                    </div>

                    {isAnalyzing && (
                        <div className="analysis-loading">
                            <div className="scanner-container">
                                <div className="scanner-document">
                                    <div className="scanner-line"></div>
                                </div>
                            </div>
                            <p className="loading-title">{t('upload.ai_analyzing') || 'AI is Analyzing...'}</p>
                            
                            <div className="progress-bar-wrapper">
                                <div className="progress-bar-bg">
                                    <div 
                                        className="progress-bar-fill" 
                                        style={{ width: `${Math.min(100, uploadProgress)}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">
                                    {Math.min(100, Math.floor(uploadProgress))}%
                                </span>
                            </div>

                            <div className="loading-steps">
                                <span className="typing-text">
                                    {uploadProgress < 20 ? t('upload.extracting') :
                                     uploadProgress < 50 ? "Translating medical terminology..." :
                                     uploadProgress < 85 ? "Evaluating health risks..." :
                                                           "Finalizing AI Insights..."}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="security-notice-v2">
                        <div className="security-item">
                            <CheckCircle2 size={14} />
                            <span>{t('upload.data_privacy')}</span>
                        </div>
                        <div className="security-item">
                            <AlertCircle size={14} />
                            <span>{t('upload.ai_powered')}</span>
                        </div>
                    </div>

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
