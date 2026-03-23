import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, Info, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import HealthTimeline from '../components/HealthTimeline';
import HealthChat from '../components/HealthChat';
import './DashboardPage.css';

const DashboardPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const dataObj = location.state?.results || null;
    const reportId = location.state?.id || null;
    const [triggerUpdate, setTriggerUpdate] = React.useState(0);

    let results = [];
    let summary = null;
    let quickHighlights = null;
    let recommendations = null;
    let conclusion = null;
    let riskScore = null;
    let riskLevel = null;

    if (Array.isArray(dataObj)) {
        results = dataObj;
    } else if (dataObj && Array.isArray(dataObj.results)) {
        results = dataObj.results;
        summary = dataObj.summary;
        quickHighlights = dataObj.quickHighlights;
        recommendations = dataObj.recommendations;
        conclusion = dataObj.conclusion;
        riskScore = dataObj.riskScore;
        riskLevel = dataObj.riskLevel;
    }

    const [isExporting, setIsExporting] = React.useState(false);

    const calculatePosition = (val, rangeStr, status) => {
        if (!rangeStr) return null;
        const v = parseFloat(val);
        if (isNaN(v)) return null;
        const matchRange = String(rangeStr).match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
        if (matchRange) {
            const min = parseFloat(matchRange[1]);
            const max = parseFloat(matchRange[2]);
            const range = max - min;
            if (range === 0) return 50;
            const paddedMin = min - (range * 0.5);
            const paddedMax = max + (range * 0.5);
            const fullRange = paddedMax - paddedMin;
            let percent = ((v - paddedMin) / fullRange) * 100;
            return Math.max(5, Math.min(95, percent));
        }
        const matchLess = String(rangeStr).match(/<[\s]*(\d+\.?\d*)/);
        if (matchLess) {
            const max = parseFloat(matchLess[1]);
            const fullRange = max * 1.5;
            let percent = (v / fullRange) * 100;
            return Math.max(5, Math.min(95, percent));
        }
        const matchGreater = String(rangeStr).match(/>[\s]*(\d+\.?\d*)/);
        if (matchGreater) {
            const min = parseFloat(matchGreater[1]);
            const max = min * 2;
            const fullRange = max - (min * 0.5);
            let percent = ((v - (min * 0.5)) / fullRange) * 100;
            return Math.max(5, Math.min(95, percent));
        }
        if (status === 'Normal') return 50;
        if (status === 'Low') return 15;
        if (status === 'High' || status === 'Critical') return 85;
        return 50;
    };

    useEffect(() => {
        if (!results || results.length === 0) {
            navigate('/upload');
            return;
        }
        if (reportId && results.length > 0) {
            const fetchHistory = async () => {
                try {
                    const token = localStorage.getItem('medexplain_token');
                    if (token) {
                        const res = await fetch('http://localhost:5001/api/reports', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (res.ok) {
                            const data = await res.json();
                            localStorage.setItem('medexplain_reports_history', JSON.stringify(data));
                            setTriggerUpdate(prev => prev + 1);
                        }
                    }
                } catch (err) {
                    const existingHistory = JSON.parse(localStorage.getItem('medexplain_reports_history') || '[]');
                    const exists = existingHistory.find(r => r.id === reportId);
                    if (!exists) {
                        const newReport = {
                            id: reportId,
                            date: dataObj?.reportDate || reportId,
                            results: results
                        };
                        localStorage.setItem('medexplain_reports_history', JSON.stringify([...existingHistory, newReport]));
                        setTriggerUpdate(prev => prev + 1);
                    }
                }
            };
            fetchHistory();
        }
    }, [results, navigate, reportId, dataObj]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Normal': return 'status-normal';
            case 'High': return 'status-high';
            case 'Low': return 'status-low';
            case 'Critical': return 'status-critical';
            default: return '';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Normal':
            case 'Low':
                return <CheckCircle size={20} />;
            case 'High':
            case 'Moderate':
                return <AlertTriangle size={20} />;
            case 'Critical': return <Info size={20} />;
            default: return null;
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'Low': return '#10b981';
            case 'Moderate': return '#f59e0b';
            case 'High': return '#ef4444';
            case 'Critical': return '#991b1b';
            default: return '#3b82f6';
        }
    };

    if (!results || results.length === 0) return null;

    const normalCount = results.filter(r => r.status === 'Normal').length;
    const abnormalCount = results.length - normalCount;

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const dashboardElement = document.querySelector('.dashboard-page .container');
            if (!dashboardElement) return;
            const headerActions = document.querySelector('.header-actions');
            const exportBtn = document.querySelector('.btn-download');
            if (headerActions) headerActions.style.display = 'none';
            if (exportBtn) exportBtn.style.display = 'none';
            const canvas = await html2canvas(dashboardElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f5f7fa',
                windowWidth: 1200
            });
            if (headerActions) headerActions.style.display = 'block';
            if (exportBtn) exportBtn.style.display = 'inline-flex';
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 0, 10, pdfWidth, pdfHeight);
            pdf.save('MedExplain-Report.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            <div className="dashboard-page animate-fade-in">
                <div className="container">
                    <div className="dashboard-header">
                        <div className="header-actions">
                            <Link to="/upload" className="back-link">
                                <ArrowLeft size={16} />
                                <span>{t('dashboard.back')}</span>
                            </Link>
                        </div>
                        <div className="header-title-row">
                            <div>
                                <h1 className="dashboard-title">{t('dashboard.title')}</h1>
                                <div className="dashboard-subtitle-row">
                                    <span className="patient-id-badge">{t('dashboard.patient_id')}: #ME-{reportId?.slice(-6).toUpperCase() || 'NEW'}</span>
                                    {dataObj?.reportDate && (
                                        <span className="report-date-badge">
                                            {t('dashboard.report_date')}: {dataObj.reportDate}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button className="btn btn-outline btn-download" onClick={handleExportPDF} disabled={isExporting}>
                                {isExporting ? <Loader2 size={18} className="spin-icon" /> : <Download size={18} />}
                                <span>{isExporting ? t('dashboard.exporting') : t('dashboard.export')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="summary-cards">
                        <div className="summary-card">
                            <div className="summary-icon bg-blue-100"><Activity className="text-blue-600" /></div>
                            <div className="summary-info">
                                <h3>{t('dashboard.total_tests')}</h3>
                                <p className="summary-value">{results.length}</p>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon bg-green-100"><CheckCircle className="text-green-600" /></div>
                            <div className="summary-info">
                                <h3>{t('dashboard.normal')}</h3>
                                <p className="summary-value text-green">{normalCount}</p>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon bg-yellow-100"><AlertTriangle className="text-yellow-600" /></div>
                            <div className="summary-info">
                                <h3>{t('dashboard.abnormal')}</h3>
                                <p className="summary-value text-yellow">{abnormalCount}</p>
                            </div>
                        </div>
                    </div>

                    {(quickHighlights?.length > 0 || summary) && (
                        <div className="summary-overview-card">
                            <div className="summary-overview-header">
                                <Info className="text-primary" size={20} />
                                <h2>{t('dashboard.summary_title')}</h2>
                            </div>
                            <div className="quick-highlights">
                                {quickHighlights?.length > 0 ? (
                                    <ul>{quickHighlights.map((highlight, i) => <li key={i}>{highlight}</li>)}</ul>
                                ) : <p className="summary-overview-text">{summary}</p>}
                            </div>
                        </div>
                    )}

                    {(recommendations?.length > 0 || conclusion) && (
                        <div className="summary-overview-card next-steps-card">
                            <div className="summary-overview-header">
                                <CheckCircle size={20} />
                                <h2>{t('dashboard.next_steps')}</h2>
                            </div>
                            <div className="recommendations-list">
                                {recommendations?.length > 0 ? (
                                    <ul>{recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                                ) : <p className="summary-overview-text">{conclusion}</p>}
                            </div>
                        </div>
                    )}

                    {riskScore !== null && riskLevel && (
                        <div className="risk-meter-card">
                            <div className="risk-meter-header">
                                <div className="risk-title-wrapper">
                                    <Activity size={24} style={{ color: getRiskColor(riskLevel) }} />
                                    <h2>{t('dashboard.urgency_title')}</h2>
                                </div>
                                <span className="risk-badge" style={{ backgroundColor: getRiskColor(riskLevel) }}>
                                    {riskLevel} Risk
                                </span>
                            </div>
                            <div className="risk-bar-container">
                                <div className="risk-bar-bg">
                                    <div className="risk-bar-fill animate-risk" style={{ width: `${riskScore}%`, backgroundColor: getRiskColor(riskLevel) }}></div>
                                </div>
                                <div className="risk-labels"><span>0</span><span>No Urgency</span><span>50</span><span>Critical Urgency</span><span>100</span></div>
                            </div>
                            <p className="risk-description">
                                {t('dashboard.risk_description.base')} <strong>{riskScore}/100</strong>.
                                {' '}{t(`dashboard.risk_description.${riskLevel.toLowerCase()}`)}
                            </p>
                        </div>
                    )}

                    <div className="results-container">
                        <h2 className="section-subtitle">{t('dashboard.breakdown')}</h2>
                        <div className="results-grid">
                            {results.map((result, index) => (
                                <div key={index} className="result-card">
                                    <div className={`result-status-bar ${getStatusColor(result.status)}`}></div>
                                    <div className="result-header">
                                        <div className="test-name-wrapper"><h3 className="test-name">{result.testName}</h3></div>
                                        <div className={`status-badge ${getStatusColor(result.status)}`}>
                                            {getStatusIcon(result.status)}
                                            <span>{result.status}</span>
                                        </div>
                                    </div>
                                    {result.explanation && <p className="result-explanation">{result.explanation}</p>}
                                    <div className="result-metric"><span className="value">{result.value} {result.unit}</span></div>
                                    <div className="normal-range"><span>Normal Range:</span> {result.normalRange}</div>
                                    {calculatePosition(result.value, result.normalRange, result.status) !== null && (
                                        <div className="range-indicator-container">
                                            <div className="range-track">
                                                <div className="range-safe-zone"></div>
                                                <div className="range-marker animate-pop" style={{ left: `${calculatePosition(result.value, result.normalRange, result.status)}%` }}>
                                                    <div className={`marker-pin ${getStatusColor(result.status)}`}></div>
                                                </div>
                                            </div>
                                            <div className="range-labels"><span>Low</span><span>Normal</span><span>High</span></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <HealthTimeline triggerUpdate={triggerUpdate} />
                </div>
            </div>
            <HealthChat contextData={dataObj || results} />
        </>
    );
};

export default DashboardPage;
