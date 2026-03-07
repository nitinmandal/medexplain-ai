import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './StaticPages.css';

const DisclaimerPage = () => {
    return (
        <div className="static-page animate-fade-in">
            <div className="container">
                <div className="document-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <AlertTriangle size={40} color="#eab308" />
                        <h1 className="document-title" style={{ marginBottom: 0 }}>Medical Disclaimer</h1>
                    </div>
                    <div className="document-date">Please read carefully before using this service.</div>

                    <div className="document-content">
                        <section>
                            <h2>Informational Purposes Only</h2>
                            <p>
                                <strong>The content and insights provided by MedExplain AI are for informational and educational purposes only.</strong> Our platform leverages artificial intelligence to parse and simplify medical terminology found in laboratory reports.
                            </p>
                        </section>

                        <section>
                            <h2>Not Professional Medical Advice</h2>
                            <p>
                                This platform <strong>does not replace professional medical advice, diagnosis, or treatment</strong>. The analyses and recommendations provided are generalized explanations of typical medical standards and should not be considered personalized medical guidance.
                            </p>
                        </section>

                        <section>
                            <h2>Consult Your Doctor</h2>
                            <p>
                                Always seek the advice of your physician, specialist, or other qualified health provider with any questions you may have regarding a medical condition or your lab results. Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
                            </p>
                        </section>

                        <section>
                            <h2>Emergency Situations</h2>
                            <p>
                                If you think you may have a medical emergency, call your doctor or emergency services immediately. MedExplain AI does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on the site.
                            </p>
                        </section>

                        <section style={{ backgroundColor: '#fef2f2', padding: '2rem', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
                            <h2 style={{ color: '#dc2626', marginTop: 0 }}>Acceptance of Terms</h2>
                            <p style={{ margin: 0 }}>
                                By using MedExplain AI, you acknowledge that you have read, understood, and agreed to this Medical Disclaimer, and that you will not hold MedExplain AI liable for any decisions you make based on the automated analysis provided.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerPage;
