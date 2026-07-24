# Resume.AI — Smart Career Analysis


> An AI-powered Resume Analyzer SaaS that helps job seekers optimize their resumes for specific job descriptions using deterministic ATS scoring and LLM-powered feedback.

---
https://resume-analyzer-teal-omega.vercel.app
## ✨ Features

- 🔐 Secure Email Authentication
- 📄 Resume Upload (PDF, DOCX, TXT)
- 📊 ATS Resume Scoring
- 🔍 Keyword Matching
- ❌ Missing Keyword Detection
- 🤖 AI-Powered Resume Feedback
- 💡 Resume Improvement Suggestions
- 📈 Dashboard with Analysis History
- 🌐 English & Bangla Language Support
- 📱 Responsive Modern User Interface
- 🗄️ Secure Cloud Database with Supabase

---

## 📸 Screenshots

> Add screenshots here after deployment.

| Landing Page | Dashboard |
|--------------|-----------|
| *Coming Soon* | *Coming Soon* |

| Analyze Resume | Analysis Report |
|----------------|-----------------|
| *Coming Soon* | *Coming Soon* |

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- TanStack Query
- Recharts

## Backend

- Node.js
- Express.js 5
- Multer
- Zod

## Database

- Supabase PostgreSQL
- Supabase Authentication

## Artificial Intelligence

- OpenRouter API
- Hugging Face (Fallback)

## Deployment

- Docker
- Render (Backend)
- Vercel (Frontend)

---

# 📂 Project Structure

```text
resume-analyzer/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── api/
│   ├── ai/
│   ├── ats/
│   ├── auth/
│   ├── database/
│   ├── middleware/
│   ├── parsers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── index.mjs
│
├── shared/
│
├── package.json
└── README.md
```

---

# 🏗️ System Architecture

```text
                User

                  │
                  ▼

        React + TypeScript Frontend

                  │
                  ▼

          Express.js REST API

                  │
      ┌───────────┴───────────┐
      ▼                       ▼

 Resume Parser           ATS Engine

      │                       │
      └───────────┬───────────┘
                  ▼

         OpenRouter AI Analysis

                  │
                  ▼

      Supabase PostgreSQL Database

                  │
                  ▼

          Dashboard & Analytics
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/NiLima-H/resume-analyzer.git
```

Navigate into the project

```bash
cd resume-analyzer
```

Install dependencies

```bash
npm install
```

Run the frontend

```bash
npm run dev
```

Run the backend

```bash
npm run dev:api
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env
VITE_SUPABASE_URL=

VITE_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

OPENROUTER_API_KEY=

HUGGINGFACE_API_KEY=
```

---

# ⚙️ Workflow

```text
Resume Upload
      │
      ▼
Resume Parsing
      │
      ▼
ATS Analysis
      │
      ▼
Keyword Matching
      │
      ▼
AI Feedback Generation
      │
      ▼
Store Analysis
      │
      ▼
Dashboard
```

---

# 🎯 Current Features

- User Authentication
- Resume Upload
- Resume Parsing
- ATS Score Calculation
- Keyword Analysis
- AI Resume Feedback
- Resume Recommendations
- Analysis History
- Dashboard
- Multi-language Support
- Responsive Design

---

# 🚧 Planned Features

- OCR Support for Image Resumes (PNG/JPG)
- OCR Support for Scanned PDFs
- Resume Version Comparison
- AI Cover Letter Generation
- AI Interview Preparation
- Resume Templates
- Recruiter Dashboard
- Advanced Analytics

---

# 📈 Project Status

**Current Version:** `MVP v1.0`

### ✅ Completed

- Authentication
- Dashboard
- Resume Analysis
- ATS Engine
- AI Feedback
- Supabase Integration
- Responsive UI
- Docker Configuration

### 🚧 In Progress

- OCR Integration
- Image Resume Support

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👩‍💻 Author

**Maheya Jannat Nilima**

Electrical & Computer Engineering  
Rajshahi University of Engineering & Technology (RUET)

- GitHub: https://github.com/NiLima-H
- Email: maheyajannatnilima@gmail.com

---

⭐ If you found this project helpful, consider giving it a star on GitHub!
