# 🎯 AI-Powered Job Application Tracker

A full stack web application to track your job applications smartly with AI-powered career advice.

## 🌐 Live Demo
👉 [Click here to view the app](https://job-tracker-zeta-blush.vercel.app/)

## 🖼️ Screenshots
<!-- Add screenshots after deployment -->

## ✨ Features
- 📝 Track all your job applications in one place
- 🔄 Update application status (Applied → Interview → Offer → Rejected)
- 🤖 AI-powered job description analyzer using Groq LLaMA
- 📊 Real-time dashboard with application statistics
- 🔐 Secure user authentication with JWT
- 📱 Clean and responsive UI

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

**AI:**
- Groq API (LLaMA 3.3 70B)

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Groq API key

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/codewithishu/job_tracker.git
cd job_tracker
\`\`\`

2. Install backend dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

3. Create `.env` file in backend folder
\`\`\`
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
\`\`\`

4. Run the backend
\`\`\`bash
node server.js
\`\`\`

5. Open `frontend/index.html` in your browser

## 📁 Project Structure
\`\`\`
job-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── ai.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── style.css
│   └── app.js
└── README.md
\`\`\`

## 🔮 Future Improvements
- Add email notifications for application deadlines
- Resume upload and AI resume analyzer
- Interview preparation notes
- Data export to Excel

## 👨‍💻 Author
Menka kumari — [GitHub](https://github.com/codewithishu) 
## 📄 License
MIT License