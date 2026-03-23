# MedExplain AI 🩺

MedExplain AI is a complete, feature-rich web application designed to help patients understand complex medical lab reports quickly and accurately using the power of Generative AI. 

By simply uploading a photo or PDF of a medical report, users receive an instant, easy-to-understand breakdown of their health markers in English, Hindi, or Hinglish.

## ✨ Key Features
- **AI-Powered Diagnostics**: Utilizes **Google Gemini 1.5 Flash** to securely process and extract numerical metrics from messy hospital receipts or lab PDFs.
- **Smart Patient Dashboard**: Visualizes the AI results via an interactive dashboard displaying abnormal values, overall risk score, and recommended next steps.
- **Health History & Timelines**: Saves all processed reports to a secure MongoDB database. Includes an AI-generated timeline chart to track individual markers (like Hemoglobin or Blood Sugar) over months or years.
- **Multi-language Support (i18n)**: Fully translated UI and AI prompts allowing results to be delivered in **English, Hindi, and Hinglish**.
- **User Authentication**: Secure JWT-based login and registration system. Users only see their private medical histories on their personalized accounts.
- **Conversational Health Chat**: Built-in chat bubble on the dashboard to allow patients to ask open-ended questions directly related to their report context.

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite, React Router, Recharts, Lucide Icons
- **Styling**: Contextual Modern CSS (Glassmorphism, Hover Effects, Keyframe Animations)
- **Backend API**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **File Upload & Parsing**: Multer middleware coupled with Gemini's multi-modal processing.
- **Security**: JWT tokens, bcrypt hash, express-rate-limit, built-in route guarding (`<ProtectedRoute>`).

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Local MongoDB instance or a MongoDB Atlas Cloud URI
- Valid Google Gemini API Key

### 1. Backend Setup
1. CD into the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` inside the `backend/` directory:
   ```env
   PORT=5001
   GEMINI_API_KEY=your_google_gemini_api_key_here
   MONGO_URI=mongodb://127.0.0.1:27017/medexplain (or valid Atlas URI)
   JWT_SECRET=your_super_secret_jwt_key
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```
4. Start the Express server: `npm start` *(Runs on http://localhost:5001)*

### 2. Frontend Setup
1. CD into the main directoy: `cd .`
2. Install frontend dependencies: `npm install`
3. Start the Vite React app: `npm run dev`
4. Visit `http://localhost:5173` to explore the App!

---
## 📄 License
This MVP codebase was created for educational open-source health-tech tooling.
All data processed by the AI features is scrubbed locally immediately after analysis (`fs.unlinkSync()`) to preserve data privacy.
