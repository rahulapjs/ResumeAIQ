---
description: Lint both frontend and backend codebases
---

# Linting Workflow

This workflow checks for code style and potential errors in both the frontend (ESLint) and backend (flake8).

## Backend Linting

1. Ensure you are in the `backend` directory.
2. Install `flake8` if not present:
   ```bash
   pip install flake8
   ```
3. Run flake8:
   ```bash
   flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
   # Also run more comprehensive check
   flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
   ```

## Frontend Linting

1. Ensure you are in the `frontend` directory.
2. Install dependencies (if strictly necessary, usually `npm install` covers it):
   ```bash
   npm install
   ```
3. Run the lint script:
   ```bash
   npm run lint
   ```

## Auto-Run
To run everything at once from the root:

// turbo-all
1. Backend Lint
```bash
cd backend
pip install flake8
python -m flake8 .
```

2. Frontend Lint
```bash
cd frontend
npm run lint
```
