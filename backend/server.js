import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dns from 'dns';
import User from './models/User.js';
import Report from './models/Report.js';

dotenv.config({ override: true });

// Override default broken local DNS resolution specifically for environments where 127.0.0.1 drops SRV connections
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4 // Force IPv4 to prevent Node 17+ localhost/DNS resolution errors
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
});

const app = express();

// --- 3. Strict CORS Configuration ---
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173']; // Local development frontend URL

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (server-to-server, curl in dev)
        if (!origin) {
            return callback(null, true);
        }

        // Allow localhost in development
        if (origin.startsWith('http://localhost')) {
            return callback(null, true);
        }

        // Allow any Netlify subdomain
        if (origin.endsWith('.netlify.app')) {
            return callback(null, true);
        }

        // Allow explicitly listed origins from env
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        console.warn(`Blocked by CORS: ${origin}`);
        callback(new Error('Origin not allowed by strict CORS policy.'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400 // Cache preflight requests for 24 hours
}));

app.use(helmet());
app.use(express.json({ limit: '1mb' }));

// --- 1. Rate Limiting Configurations ---
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // Default: 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Default: 100 requests per window
    keyGenerator: (req) => {
        // User-based rate limiting if authenticated, otherwise fallback to IP
        if (req.user && req.user.id) {
            return `user_${req.user.id}`;
        }
        return req.headers['x-forwarded-for'] || req.ip;
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Rate limit exceeded (100 requests/minute). Please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '300000'), // Default: 5 minutes
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '10'), // Strict: 10 failed attempts
    keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip, // IP-based for unauthenticated auth attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts from this IP, please try again after 5 minutes.' }
});

// --- 2. Authentication & Authorization Middleware ---
const protect = async (req, res, next) => {
    let token;

    if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined.");
        return res.status(500).json({ error: 'Server misconfiguration.' }); 
    }

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from DB to ensure they still exist and aren't suspended
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ error: 'User associated with this token no longer exists.' });
            }

            // Add user info to request
            req.user = user;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            return res.status(401).json({ error: 'Not authorized, invalid or expired token' });
        }
    } else {
        return res.status(401).json({ error: 'Not authorized, missing token' });
    }
};

// Role-based Authorization Guard
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role || 'user')) {
            return res.status(403).json({ error: 'Forbidden: You do not have the required access level for this route.' });
        }
        next();
    };
};

// Set up Multer for handling file uploads (using memory storage to avoid restarts and disk usage)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', protect, apiLimiter, upload.single('report'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return res.status(500).json({ error: 'Gemini API key is missing. Please configure it in backend/.env file.' });
        }

        // Read the file from memory buffer into Base64 for the API
        const base64Data = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const userLanguage = req.body.language || 'en';
        let languageInstruction = 'You MUST generate the entire analysis and all text fields in English.';
        if (userLanguage === 'hi') {
            languageInstruction = 'You MUST generate the entire analysis and all text fields (summary, highlights, recommendations, explanations) in Hindi (हिन्दी) language. Do not mix English words unless they are untranslatable medical terms.';
        }

        const prompt = `You are an expert medical analyst, but you are speaking directly to a patient with NO medical background. Analyze this medical lab test report. 
${languageInstruction}

First, find and extract the date the test was conducted (the report date). Format it as YYYY-MM-DD.
Then, provide a clear 2-3 sentence 'summary' of the patient's overall health. You MUST write this at a 6th-grade reading level. Use short sentences and everyday words. Avoid heavy medical terminology completely.
Then, provide a 'quickHighlights' array containing 3-4 very short summary points so the user understands their report in 5-10 seconds.
Then, provide a 'recommendations' array of 3-4 specific, actionable next steps.
Then, provide a 'riskScore' between 1 and 100 representing how urgent it is to see a doctor (1 = perfectly healthy/no urgency, 100 = critical emergency).
Then, provide a 'riskLevel' choosing EXACTLY ONE of: "Low", "Moderate", "High", or "Critical".
Then, extract all the blood test and lab test results you can find. 
For each parameter, extract the test name, reported value, unit, and the normal reference range.
Then, provide a VERY short, simple 'explanation' of what this parameter means designed for a small info tooltip.
You MUST classify the status as EXACTLY ONE of these: "Normal", "Low", "High", or "Critical".

Please Output ONLY a valid JSON object without any markdown formatting wrappers (like \`\`\`json).
Example structure:
{
  "reportDate": "2023-10-25",
  "summary": "Your overall health looks good. However, your cholesterol is slightly high and your thyroid is a bit underactive.",
  "quickHighlights": [
    "Cholesterol slightly high",
    "Thyroid slightly underactive",
    "Other values are normal"
  ],
  "recommendations": [
    "Eat more leafy greens and balanced diet",
    "Exercise regularly",
    "Speak with your doctor to discuss your cholesterol and thyroid levels"
  ],
  "riskScore": 45,
  "riskLevel": "Moderate",
  "results": [
    {
      "testName": "Hemoglobin",
      "value": "13.5",
      "unit": "g/dL",
      "normalRange": "12.0 - 15.5 g/dL",
      "status": "Normal",
      "explanation": "Hemoglobin is a protein in your blood that carries oxygen throughout the body."
    }
  ]
}`;

        // Process the file using Gemini 1.5 Flash
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]);

        // No file cleanup needed since it's in memory

        let outputText = result.response.text();
        // Sometimes the AI wraps it in markdown, we should clean it.
        outputText = outputText.replace(/```json/gi, '').replace(/```/g, '').trim();

        try {
            const parsedData = JSON.parse(outputText);
            
            // Save report to database
            const reportId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            const newReport = new Report({
                user: req.user.id,
                reportId: reportId,
                date: parsedData.reportDate || new Date().toISOString().split('T')[0],
                results: parsedData.results || [],
                fullData: parsedData
            });
            await newReport.save();
            
            parsedData._id = newReport.reportId;
            res.json(parsedData);
        } catch (parseError) {
            console.error('Failed to parse AI output:', outputText);
            res.status(500).json({ error: 'AI output could not be formatted properly. Please try again.' });
        }

    } catch (error) {
        console.error('Error in /api/analyze:', error);
        res.status(500).json({ error: error.message || 'An error occurred during analysis.' });
    }
});

app.post('/api/analyze-trend', protect, apiLimiter, async (req, res) => {
    try {
        const { testName, history } = req.body;

        if (!testName || !history || !Array.isArray(history)) {
            return res.status(400).json({ error: 'Valid testName and history array are required.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert medical AI analyst, speaking to a user with NO medical background. I am providing you with a user's health history for a specific lab test.
Test Name: ${testName}
Historical Data:
${history.map(entry => `- Date: ${entry.date}, Value: ${entry.value} ${entry.unit || ''} (Normal Range: ${entry.normalRange || 'N/A'})`).join('\n')}

Based on this trend over time, analyze the data. Provide exactly one JSON object as output with no markdown wrappers.
Include:
1. "insight": A very simple, friendly 1-2 sentence explanation of the trend written at a 6th-grade reading level. Do not use medical jargon. (e.g., "Your blood sugar levels have been slowly going up over the past 6 months.").
2. "prediction": If the trend indicates a potential health risk, gently generate a prediction/warning in simple terms. If healthy, provide a simple positive affirmation here. Keep it short and easy to understand.
3. "status": Exactly one of ["Healthy", "Warning", "Risk"].

Output format:
{
  "insight": "...",
  "prediction": "...",
  "status": "Healthy"
}`;

        const result = await model.generateContent(prompt);
        let outputText = result.response.text();
        outputText = outputText.replace(/```json/gi, '').replace(/```/g, '').trim();

        try {
            const parsedData = JSON.parse(outputText);
            res.json(parsedData);
        } catch (parseError) {
            console.error('Failed to parse trend AI output:', outputText);
            res.status(500).json({ error: 'AI output could not be formatted properly.' });
        }

    } catch (error) {
        console.error('Error in /api/analyze-trend:', error);
        res.status(500).json({ error: 'An error occurred during trend analysis.' });
    }
});

app.post('/api/chat', protect, apiLimiter, async (req, res) => {
    try {
        const { question, context } = req.body;

        if (!question || !context) {
            return res.status(400).json({ error: 'Question and context are required.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a friendly, empathetic AI Health Assistant. You are chatting with a patient about their recent medical report.
Context from the user's report:
${JSON.stringify(context, null, 2)}

User's Question: "${question}"

Please answer the user's question based strictly on their report context provided above and general medical knowledge. 
Keep your answer very simple (6th-grade reading level), short (2-4 sentences max), and easy to understand. Do not use complex medical jargon.
Always remind the user to consult a doctor for a definitive diagnosis if they seem worried.`;

        const result = await model.generateContent(prompt);
        let answer = result.response.text().trim();

        res.json({ answer });
    } catch (error) {
        console.error('Error in /api/chat:', error);
        res.status(500).json({ error: 'Failed to generate an answer. Please try again.' });
    }
});

// --- Reports Endpoint ---
app.get('/api/reports', protect, apiLimiter, async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
        const historyData = reports.map(r => ({
            id: r.reportId,
            date: r.date,
            results: r.results,
            fullData: r.fullData
        }));
        res.json(historyData);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Auth Routes

app.post('/api/auth/signup', authLimiter, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Create token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create account.' });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to log in.' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Backend server is running at http://localhost:${PORT}`);
});
