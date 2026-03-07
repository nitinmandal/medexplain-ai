import React from 'react';
import './StaticPages.css';

const PrivacyPolicy = () => {
    return (
        <div className="static-page animate-fade-in">
            <div className="container">
                <div className="document-container">
                    <h1 className="document-title">Privacy Policy</h1>
                    <div className="document-date">Last Updated: October 2023</div>

                    <div className="document-content">
                        <section>
                            <h2>1. Introduction</h2>
                            <p>At MedExplain AI, we take your privacy and the security of your health information seriously. This Privacy Policy explains how we handle your data when you use our medical report analysis platform.</p>
                        </section>

                        <section>
                            <h2>2. Information We Collect</h2>
                            <p>We only collect the medical lab reports you explicitly upload to our platform. We do not require you to create an account or provide personally identifiable information to use the core analysis feature.</p>
                        </section>

                        <section>
                            <h2>3. How We Process Your Data</h2>
                            <p>When you upload a report, our AI strictly scans for typical lab test values (e.g., Hemoglobin, Glucose, Cholesterol). This data is processed in memory to generate your analysis dashboard.</p>
                        </section>

                        <section>
                            <h2>4. Data Retention and Deletion</h2>
                            <p><strong>Immediate Deletion:</strong> Your files are securely processed and automatically deleted from our servers immediately after the analysis is complete. We do not store your medical reports, nor do we use them to train our AI models.</p>
                        </section>

                        <section>
                            <h2>5. Security</h2>
                            <p>We use industry-standard encryption for data transmission to ensure your uploaded files cannot be intercepted. Our servers are secured and restricted to necessary automated processes only.</p>
                        </section>

                        <section>
                            <h2>6. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at privacy@medexplain.ai.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
