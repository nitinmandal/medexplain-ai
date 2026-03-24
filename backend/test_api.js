import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
    console.log("1. Signing up dummy user...");
    const email = `testuser_${Date.now()}@example.com`;
    // Node 18+ has native fetch
    const signupRes = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test API User', email: email, password: 'password123' })
    });
    
    // Check for success
    if (!signupRes.ok) {
        console.error("Signup HTTP Error:", signupRes.status, await signupRes.text());
        return;
    }
    const signupData = await signupRes.json();
    if (!signupData.token) {
        console.error("Signup failed:", signupData);
        return;
    }
    const token = signupData.token;
    console.log("Signup success! Token received.");

    console.log("2. Uploading test report...");
    
    const fileContent = fs.readFileSync(path.join(__dirname, 'test_report.txt'));
    const blob = new Blob([fileContent], { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('report', blob, 'test_report.txt');
    formData.append('language', 'en');

    const analyzeRes = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    
    const resultText = await analyzeRes.text();
    try {
        const analyzeData = JSON.parse(resultText);
        console.log("Analysis Output:", JSON.stringify(analyzeData, null, 2));
    } catch(e) {
        console.error("Failed to parse analysis output text:", resultText);
    }
}

runTest();
