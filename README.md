# AirResume 🚀

A web app to generate, match, and roast resumes with a cosmic twist! Built with a Next.js frontend and FastAPI backend, it includes a feedback form with client-side rate limiting and stores feedback in a SQLite database.

## ✨ Features

- Generate, match, and roast resumes.
- Feedback form with client-side rate limiting (5 submissions per minute).
- Space-themed UI with animations.
- SQLite database for feedback storage.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- DB Browser for SQLite (optional, to view feedback)

### Installation

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Rathii007/AirResume
   cd AirResume
   ```

2. **Set Up Backend**:
   - Go to the backend folder:
     ```bash
     cd backend
     ```
   - Set up a virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the FastAPI server:
     ```bash
     uvicorn main:app --reload
     ```

3. **Set Up Frontend**:
   - Go to the frontend folder:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the Next.js server:
     ```bash
     npm run dev
     ```

### Usage

- Open `http://localhost:3000` in your browser.
- Use the tabs to generate, match, or roast a resume.
- Submit feedback via the Feedback tab (limited to 5 submissions per minute).
- To view feedback, open `backend/feedback.db` in DB Browser for SQLite and check the `feedback` table.

## 🛡️ Rate Limiting

- The feedback form uses client-side rate limiting (5 submissions per minute).
- If exceeded, a countdown timer shows when you can submit again.
- Timestamps are stored in `localStorage` under `feedbackSubmissions`.

## 📄 License

MIT License.
