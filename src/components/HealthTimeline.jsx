import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import './HealthTimeline.css';

const HealthTimeline = ({ triggerUpdate }) => {
    const [history, setHistory] = useState([]);
    const [availableMetrics, setAvailableMetrics] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState('');
    const [metricData, setMetricData] = useState([]);
    const [aiInsight, setAiInsight] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('medexplain_reports_history') || '[]');
        setHistory(storedHistory);

        // Find all unique test names across all reports
        const metricsSet = new Set();
        storedHistory.forEach(report => {
            report.results.forEach(result => {
                metricsSet.add(result.testName);
            });
        });

        const metricsList = Array.from(metricsSet).sort();
        setAvailableMetrics(metricsList);

        // Auto-select first metric if available
        if (metricsList.length > 0 && !selectedMetric) {
            setSelectedMetric(metricsList[0]);
        }
    }, [triggerUpdate]);

    useEffect(() => {
        if (!selectedMetric || history.length === 0) return;

        // Filter and map data for the selected metric
        const chartData = [];

        // Ensure chronological order
        const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedHistory.forEach(report => {
            const resultMatch = report.results.find(r => r.testName === selectedMetric);
            if (resultMatch) {
                // Try to parse the value as a float
                const numValue = parseFloat(resultMatch.value);
                if (!isNaN(numValue)) {
                    chartData.push({
                        date: new Date(report.date).toLocaleDateString(),
                        fullDate: report.date,
                        value: numValue,
                        originalResult: resultMatch
                    });
                }
            }
        });

        setMetricData(chartData);

        // Wait before analyzing so we don't spam the API on every click immediately 
        // if user is clicking around quickly.
        const timeoutId = setTimeout(() => {
            if (chartData.length > 1) {
                analyzeTrend(selectedMetric, chartData);
            } else {
                setAiInsight(null);
            }
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [selectedMetric, history]);

    const analyzeTrend = async (testName, data) => {
        setIsAnalyzing(true);
        setError('');

        try {
            const formattedHistory = data.map(item => ({
                date: item.date,
                value: item.value,
                unit: item.originalResult.unit,
                normalRange: item.originalResult.normalRange
            }));

            const token = localStorage.getItem('medexplain_token');
            if (!token) {
                throw new Error('Not authorized. Please log in to view insights.');
            }

            const response = await fetch('http://localhost:5001/api/analyze-trend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ testName, history: formattedHistory }),
            });

            if (response.status === 401) {
                localStorage.removeItem('medexplain_token');
                localStorage.removeItem('medexplain_user');
                window.dispatchEvent(new Event('user-auth-change'));
                throw new Error('Session expired. Please log in again.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (!response.ok) {
                throw new Error('Failed to analyze trend.');
            }

            const insightData = await response.json();
            setAiInsight(insightData);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Could not generate AI insights for this trend at the moment.');
            setAiInsight(null);

            // Auto reload to login roughly 2 seconds after throwing session expired
            if (err.message.includes('Session')) {
                setTimeout(() => window.location.href = '/login', 2000);
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Healthy': return 'bg-green-50 border-green-200 text-green-700';
            case 'Warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
            case 'Risk': return 'bg-red-50 border-red-200 text-red-700';
            default: return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Healthy': return <CheckCircle className="text-green-600" size={24} />;
            case 'Warning': return <AlertTriangle className="text-yellow-600" size={24} />;
            case 'Risk': return <AlertTriangle className="text-red-600" size={24} />;
            default: return <Info className="text-gray-600" size={24} />;
        }
    };

    if (history.length === 0) {
        return (
            <div className="health-timeline-empty">
                <TrendingUp size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">No Health History Yet</h3>
                <p className="text-gray-500">Upload your reports to start tracking your health timeline over time.</p>
            </div>
        );
    }

    return (
        <div className="health-timeline-container animate-fade-in">
            <div className="timeline-header flex-col sm:flex-row flex justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                        <TrendingUp />
                        AI Health Timeline & Prediction
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Track your health metrics and get AI-driven insights over time.</p>
                </div>

                {availableMetrics.length > 0 && (
                    <div className="metric-selector w-full sm:w-auto">
                        <label htmlFor="metric-select" className="block text-sm font-medium text-gray-700 mb-1">Select Metric to Track:</label>
                        <select
                            id="metric-select"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                        >
                            {availableMetrics.map(metric => (
                                <option key={metric} value={metric}>{metric}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {metricData.length < 2 && metricData.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 flex gap-3 text-blue-800 text-sm">
                    <Info size={20} className="flex-shrink-0" />
                    <span>Upload more reports over time with this test to see a trend chart and AI insights! Currently only 1 data point is available.</span>
                </div>
            )}

            {metricData.length >= 2 && (
                <div className="timeline-content gap-6 grid grid-cols-1 lg:grid-cols-3">
                    <div className="chart-panel bg-white p-4 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                        <h3 className="font-semibold text-gray-800 mb-4 text-lg">{selectedMetric} Trend</h3>
                        <div className="chart-wrapper h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metricData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#d1d5db' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => [value, selectedMetric]}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        name={selectedMetric}
                                        stroke="#0d47a1"
                                        strokeWidth={3}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                        dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="ai-insights-panel flex flex-col gap-4">
                        {isAnalyzing ? (
                            <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                                <Loader2 size={32} className="animate-spin text-primary-color mb-3" />
                                <p className="font-medium text-gray-700">AI is analyzing your historical data...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                                <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : aiInsight ? (
                            <>
                                <div className={`trend-status-card p-5 rounded-xl border shadow-sm ${getStatusColor(aiInsight.status)}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        {getStatusIcon(aiInsight.status)}
                                        <h3 className="font-bold text-lg">{aiInsight.status} Trend</h3>
                                    </div>
                                    <p className="text-sm leading-relaxed font-medium">
                                        {aiInsight.insight}
                                    </p>
                                </div>

                                <div className="prediction-card bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex-1">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                                        Future Prediction
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {aiInsight.prediction}
                                    </p>
                                </div>
                            </>
                        ) : null}

                        <div className="disclaimer-note mt-auto bg-gray-50 border border-gray-200 rounded-lg p-3 flex gap-2">
                            <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500">
                                This feature provides informational health insights and does not replace professional medical advice. Always consult a healthcare provider.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthTimeline;
