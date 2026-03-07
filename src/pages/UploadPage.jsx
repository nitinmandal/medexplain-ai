import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import './UploadPage.css';

const MOCK_EXTRACTED_DATA = [
    { testName: 'Hemoglobin', value: 10, unit: 'g/dL', normalRange: '12 - 16 g/dL', status: 'Low', explanation: 'Hemoglobin is lower than the normal range and may indicate anemia.', recommendation: 'Consult a healthcare professional if symptoms such as fatigue or weakness are present.' },
    { testName: 'Glucose (Fasting)', value: 85, unit: 'mg/dL', normalRange: '70 - 100 mg/dL', status: 'Normal', explanation: 'Your fasting glucose level is within the healthy range.', recommendation: 'Maintain a balanced diet and regular exercise routine.' },
    { testName: 'Creatinine', value: 0.9, unit: 'mg/dL', normalRange: '0.6 - 1.2 mg/dL', status: 'Normal', explanation: 'Creatinine is normal, indicating healthy kidney function.', recommendation: 'Stay hydrated and maintain a healthy lifestyle.' },
    { testName: 'Cholesterol', value: 240, unit: 'mg/dL', normalRange: 'Less than 200 mg/dL', status: 'High', explanation: 'Total cholesterol is elevated above the recommended healthy limit.', recommendation: 'Consider dietary changes, reducing saturated fats, and regular cardiovascular exercise. Speak with your doctor.' },
    { testName: 'Platelets', value: 250000, unit: 'per microliter', normalRange: '150000 - 450000 per mcL', status: 'Normal', explanation: 'Platelet count is normal, suggesting healthy blood clotting capability.', recommendation: 'Continue routine check-ups.' },
    { testName: 'TSH', value: 6.5, unit: 'mIU/L', normalRange: '0.4 - 4.0 mIU/L', status: 'High', explanation: 'Thyroid Stimulating Hormone is elevated, which may suggest an underactive thyroid (hypothyroidism).', recommendation: 'Schedule an appointment with an endocrinologist or primary care physician for further thyroid function testing.' },
];

const UploadPage = () => {
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

            const response = await fetch('http://localhost:5001/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze report.');
            }

            setIsAnalyzing(false);
            navigate('/dashboard', { state: { results: data } });
        } catch (err) {
            setIsAnalyzing(false);
            setError(err.message || 'Error connecting to the AI server.');
        }
    };

    return (
        <div className="upload-page animate-fade-in">
            <div className="container">
                <div className="upload-container">
                    <div className="upload-header">
                        <h1 className="upload-title">Analysis Center</h1>
                        <p className="upload-subtitle">Upload your medical report for instant AI analysis.</p>
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
                                <h3>Drag & drop your report here</h3>
                                <p>or click to browse from your device</p>
                                <div className="upload-formats">Supported formats: PDF, JPG, PNG (Max 10MB)</div>
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
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Report'}
                        </button>
                    </div>

                    {isAnalyzing && (
                        <div className="analysis-loading">
                            <div className="spinner"></div>
                            <p>Analyzing your medical report...</p>
                            <p className="loading-subtext">Our AI securely extracts and interprets your lab values.</p>
                        </div>
                    )}

                    <div className="security-notice">
                        <AlertCircle size={14} />
                        <span>Your files are securely processed and automatically deleted immediately after analysis. We ensure complete privacy.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
