# ResumeAIQ: AI-Powered Resume Analysis

ResumeAIQ is a full-stack application that leverages Google's Gemini AI to analyze resumes, provide ATS scoring, answer questions about the candidate, and perform job matching.

## Features

- **Resume Parsing:** Supports PDF and DOCX formats.
- **ATS Scoring:** Evaluates resume structure, keywords, experience impact, and readability.
- **AI Summary:** Generates concise, HR-friendly summaries using Gemini AI.
- **Q&A Chat:** RAG-based chat interface to ask questions about the uploaded resume.
- **Job Matching:** Compares the resume against a provided job description and offers improvement recommendations.
- **Modern UI:** Glassmorphism-themed frontend built with React, Vite, and Tailwind-free custom CSS.

## Tech Stack

- **Backend:** FastAPI, Python, LangChain (Concepts), FAISS, Google Generative AI SDK.
- **Frontend:** React, TypeScript, Vite, Redux Toolkit, Framer Motion, Axios.
- **Containerization:** Docker, Docker Compose, Nginx.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (for local frontend dev)
- [Python 3.11+](https://www.python.org/) (for local backend dev)
- **Google Gemini API Key** (Get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

## Getting Started

### 1. using Docker (Recommended)

Run the entire stack with a single command:

```bash
docker-compose up --build
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

### 2. Running Locally

#### Backend

1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\Activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend

1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Workflow & Linting

We have defined workflows for maintaining code quality.

**To Lint the Project:**
Use the agent workflow command or manually run:

- **Backend:** `flake8 .`
- **Frontend:** `npm run lint`

See `.agent/workflows/lint.md` for details.
