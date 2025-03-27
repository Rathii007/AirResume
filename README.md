# AirResume 🚀

A web app to generate, match, and roast resumes. Built with a Next.js frontend and FastAPI backend, it includes a feedback form that stores responses in a SQLite database.

## ✨ Features

- Generate, match, and roast resumes.
- Feedback form to share your thoughts.
- Space-themed UI with animations.

## 🛠️ Technologies Used

- **Frontend**:
  - Next.js (React framework)
  - Tailwind CSS (styling)
  - Framer Motion (animations)
- **Backend**:
  - FastAPI (Python web framework)
  - SQLite (database for feedback)
- **Tools**:
  - DB Browser for SQLite (to view feedback)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- DB Browser for SQLite (optional, to view feedback)

### Installation

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Rathii007/AirResume.git
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
- Submit feedback via the Feedback tab.
- To view feedback, open `backend/feedback.db` in DB Browser for SQLite and check the `feedback` table.

## 📄 License

MIT License.
