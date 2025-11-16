# GENquiZ - AI-Powered Learning Quiz Generator

An intelligent quiz generation platform that transforms any web article into an interactive learning experience using AI.

## 🎯 Overview

GENquiZ is a full-stack application that automatically generates personalized quizzes from web articles using Google's Gemini AI. Users can test their understanding, track their progress, and improve their learning through interactive quizzes with instant feedback.

## ✨ Features

### Core Functionality
- **AI-Powered Quiz Generation**: Automatically creates multiple-choice questions from any web article
- **Customizable Question Count**: Choose between 3 to 10 questions per quiz
- **Instant Feedback**: Get immediate explanations for correct and incorrect answers
- **Progress Tracking**: View quiz history, scores, and performance metrics
- **Timer & Analytics**: Track time spent and analyze your learning patterns

### User Experience
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop and mobile devices
- **Skeleton Loading**: Smooth loading animations during quiz generation
- **Interactive Results**: Detailed breakdown of answers with explanations
- **Quiz Retry**: Retake quizzes to improve your score

### Authentication & Data
- **Auth0 Integration**: Secure user authentication
- **Local Storage**: Save quiz results for authenticated users
- **Profile Management**: View and manage quiz history
- **Subject Categorization**: Organize quizzes by topic

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Auth0** - Authentication provider
- **Lucide React** - Icon library

### Backend
- **Node.js** with Express
- **TypeScript** - Type safety
- **Google Gemini AI** - Quiz generation
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
learning_tool/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── Quiz.tsx    # Main quiz interface
│   │   │   ├── Results.tsx # Quiz results display
│   │   │   ├── Profile.tsx # User profile & history
│   │   │   └── ...
│   │   ├── styles/         # Global styles
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── .env                # Environment variables
│   └── package.json
│
└── backend/                 # Express backend server
    ├── src/
    │   ├── server.ts       # Server entry point
    │   ├── config/         # Configuration files
    │   ├── controllers/    # Route controllers
    │   ├── services/       # Business logic (Gemini AI)
    │   ├── routes/         # API routes
    │   ├── schemas/        # Validation schemas
    │   └── types/          # TypeScript types
    ├── .env                # Environment variables
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key
- Auth0 account (for authentication)

### Environment Setup

#### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=your_auth0_audience
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tetiana-cherni/learning_tool.git
cd learning_tool
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend server**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:3000`

2. **Start the frontend development server**
```bash
cd frontend
npm run dev
```
Application will run on `http://localhost:3001`

## 🔧 API Endpoints

### POST `/api/quiz/generate`
Generate a quiz from a web article URL.

**Request Body:**
```json
{
  "url": "https://example.com/article",
  "questionAmount": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Article Title",
    "category": "Subject Category",
    "questions": [
      {
        "id": "1",
        "question": "Question text?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 0,
        "explanation": "Explanation text"
      }
    ]
  },
  "questionCount": 5
}
```

## 🎨 Key Features Explained

### Quiz Generation Flow
1. User enters a web article URL
2. Backend fetches article content
3. Gemini AI analyzes content and generates questions
4. Frontend displays interactive quiz
5. User answers questions with instant feedback
6. Results are saved to profile (if authenticated)

### Authentication Flow
1. User clicks "View Profile" or "Login"
2. Redirected to Auth0 login page
3. After successful login, returned to application
4. Quiz results are saved to localStorage
5. On logout, results are cleared

### Theme System
- Light and dark mode support
- Persistent theme preference
- Custom color schemes for both modes
- Smooth transitions between themes

## 🧪 Development

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

### Code Structure Best Practices
- TypeScript for type safety
- Component-based architecture
- Separation of concerns (services, controllers, routes)
- Environment-based configuration
- Reusable UI components

## 📝 License

This project was created for a hackathon.

## 👥 Contributing

This is a hackathon project. For contributions, please open an issue or submit a pull request.

## 🙏 Acknowledgments

- Google Gemini AI for quiz generation
- Auth0 for authentication
- Radix UI for accessible components
- Tailwind CSS for styling
- The open-source community

---

**Built with ❤️ for better learning experiences**
