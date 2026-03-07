import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, Info, Download, ArrowLeft, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './DashboardPage.css';

const DashboardPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results || [];
    const [isExporting, setIsExporting] = React.useState(false);

    useEffect(() => {
        if (!results || results.length === 0) {
            navigate('/upload');
        }
    }, [results, navigate]);

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
            case 'Normal': return <CheckCircle size={20} />;
            case 'High':
            case 'Low': return <AlertTriangle size={20} />;
            case 'Critical': return <Info size={20} />;
            default: return null;
        }
    };

    if (!results || results.length === 0) {
        return null;
    }

    // Calculate summary counts
    const normalCount = results.filter(r => r.status === 'Normal').length;
    const abnormalCount = results.length - normalCount;

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            // Find the dashboard element we want to capture
            const dashboardElement = document.querySelector('.dashboard-page .container');
            if (!dashboardElement) return;

            // Temporarily hide the buttons that shouldn't be in the PDF
            const headerActions = document.querySelector('.header-actions');
            const exportBtn = document.querySelector('.btn-download');

            if (headerActions) headerActions.style.display = 'none';
            if (exportBtn) exportBtn.style.display = 'none';

            // Capture canvas
            const canvas = await html2canvas(dashboardElement, {
                scale: 2, // Better resolution
                useCORS: true,
                backgroundColor: '#f5f7fa',
                windowWidth: 1200 // Force standard desktop width for rendering
            });

            // Restore buttons
            if (headerActions) headerActions.style.display = 'block';
            if (exportBtn) exportBtn.style.display = 'inline-flex';

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate A4 dimensions
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
        <div className="dashboard-page animate-fade-in">
            <div className="container">

                <div className="dashboard-header">
                    <div className="header-actions">
                        <Link to="/upload" className="back-link">
                            <ArrowLeft size={16} />
                            <span>Back to Upload</span>
                        </Link>
                    </div>
                    <div className="header-title-row">
                        <h1 className="dashboard-title">Analysis Result Dashboard</h1>
                        <button
                            className="btn btn-outline btn-download"
                            onClick={handleExportPDF}
                            disabled={isExporting}
                        >
                            {isExporting ? <Loader2 size={18} className="spin-icon" /> : <Download size={18} />}
                            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                        </button>
                    </div>
                </div>

                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-icon bg-blue-100">
                            <Activity className="text-blue-600" />
                        </div>
                        <div className="summary-info">
                            <h3>Total Tests Found</h3>
                            <p className="summary-value">{results.length}</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon bg-green-100">
                            <CheckCircle className="text-green-600" />
                        </div>
                        <div className="summary-info">
                            <h3>Normal Results</h3>
                            <p className="summary-value text-green">{normalCount}</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon bg-yellow-100">
                            <AlertTriangle className="text-yellow-600" />
                        </div>
                        <div className="summary-info">
                            <h3>Abnormal Results</h3>
                            <p className="summary-value text-yellow">{abnormalCount}</p>
                        </div>
                    </div>
                </div>

                <div className="results-container">
                    <h2 className="section-subtitle">Detailed Breakdown</h2>

                    <div className="results-grid">
                        {results.map((result, index) => (
                            <div key={index} className="result-card">
                                <div className={`result-status-bar ${getStatusColor(result.status)}`}></div>

                                <div className="result-header">
                                    <h3 className="test-name">{result.testName}</h3>
                                    <div className={`status-badge ${getStatusColor(result.status)}`}>
                                        {getStatusIcon(result.status)}
                                        <span>{result.status}</span>
                                    </div>
                                </div>

                                <div className="result-metric">
                                    <span className="value">{result.value} {result.unit}</span>
                                </div>

                                <div className="normal-range">
                                    <span>Normal Range:</span> {result.normalRange}
                                </div>

                                <div className="result-explanation">
                                    <h4>Explanation</h4>
                                    <p>{result.explanation}</p>
                                </div>

                                <div className="result-recommendation">
                                    <h4>Recommendation</h4>
                                    <p>{result.recommendation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
