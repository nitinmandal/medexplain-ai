import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up Multer for handling file uploads (temporarily stores them in 'uploads' folder)
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: 'uploads/' });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', upload.single('report'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ error: 'Gemini API key is missing. Please configure it in backend/.env file.' });
        }

        // Read the file into Base64 for the API
        const fileData = fs.readFileSync(req.file.path);
        const base64Data = Buffer.from(fileData).toString('base64');
        const mimeType = req.file.mimetype;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert medical analyst. Analyze this medical lab test report (it could be an image or a PDF).
Extract all the blood test and lab test results you can find. 
For each parameter, extract the test name, reported value, unit, and the normal reference range (either from the text or from your medical knowledge).
Then, provide a simple 'explanation' of what this parameter means for a non-medical person.
Then, provide a simple 'recommendation'.
You MUST classify the status as EXACTLY ONE of these: "Normal", "Low", "High", or "Critical".

Please Output ONLY a valid JSON array of objects without any markdown formatting wrappers (like \`\`\`json).
Example structure:
[
  {
    "testName": "Hemoglobin",
    "value": "13.5",
    "unit": "g/dL",
    "normalRange": "12.0 - 15.5 g/dL",
    "status": "Normal",
    "explanation": "Hemoglobin is the protein in red blood cells that carries oxygen.",
    "recommendation": "Maintain a healthy iron-rich diet."
  }
]`;

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

        // Clean up uploaded file immediately after processing
        fs.unlinkSync(req.file.path);

        let outputText = result.response.text();
        // Sometimes the AI wraps it in markdown, we should clean it.
        outputText = outputText.replace(/```json/gi, '').replace(/```/g, '').trim();

        try {
            const parsedData = JSON.parse(outputText);
            res.json(parsedData);
        } catch (parseError) {
            console.error('Failed to parse AI output:', outputText);
            res.status(500).json({ error: 'AI output could not be formatted properly. Please try again.' });
        }

    } catch (error) {
        console.error('Error in /api/analyze:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message || 'An error occurred during analysis.' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Backend server is running at http://localhost:${PORT}`);
});
