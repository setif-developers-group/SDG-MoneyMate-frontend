# 💰 SDG MoneyMate

SDG MoneyMate is an intelligent financial assistant that helps you manage your budget, track expenses, and make smarter financial decisions.

![SDG MoneyMate](https://img.shields.io/badge/AI--Coded-100%25-00D9A3?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-1E90FF?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)

## 🌟 Features

### 🤖 AI-Powered Financial Assistant
- **Smart Chatbot**: Natural language interface for managing your finances
- **AI Budget Generation**: Automatically creates personalized budgets based on your income and spending patterns
- **Expense Extraction**: Upload receipts or describe expenses in plain text - AI extracts the details
- **Financial Reports**: AI-generated monthly reports with insights and recommendations

### 💼 Core Functionality
- **Budget Management**: Create, view, and track budgets with AI assistance
- **Expense Tracking**: Log expenses via text, file upload, or chat
- **Real-time Notifications**: Stay informed about budget alerts and financial events
- **Interactive Dashboard**: Beautiful, responsive UI with real-time data visualization

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Premium, modern interface with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes with SDG's brand colors
- **Markdown Support**: Rich text formatting for reports and descriptions

## 🚀 Tech Stack

### Frontend
- **React 18.3** - Modern UI library
- **Vite 5.4** - Lightning-fast build tool
- **React Markdown** - Rich text rendering with GitHub Flavored Markdown support
- **CSS3** - Custom styling with CSS variables and animations

### Backend Integration
- **Django REST Framework** - Backend API
- **JWT Authentication** - Secure token-based auth
- **Google Gemini AI** - Powers all AI features (chatbot, budget generation, expense extraction)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Backend Server** running on `http://127.0.0.1:8000`

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-on-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
The app uses Vite's proxy to connect to the backend. The configuration is already set in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    }
  }
}
```

Make sure your backend is running on `http://127.0.0.1:8000` before starting the frontend.

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
ai-on-frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Budget.jsx       # Budget management component
│   │   ├── Chat.jsx         # AI chatbot interface
│   │   ├── Expenses.jsx     # Expense tracking component
│   │   └── Notifications.jsx # Notification bell & dropdown
│   ├── pages/               # Page components
│   │   ├── LoginSignup.jsx  # Authentication page
│   │   ├── Onboarding.jsx   # AI-driven onboarding flow
│   │   └── MainPage.jsx     # Main application dashboard
│   ├── services/
│   │   └── api.js           # API service layer & JWT management
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles & CSS variables
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies & scripts
```

## 🎨 Brand Colors

SDG MoneyMate uses a custom color palette defined in `src/index.css`:

```css
--primary-blue: #1E90FF;      /* Primary actions & buttons */
--primary-blue-dark: #0D7FE8; /* Gradients */
--accent-green: #00D9A3;      /* Highlights & active states */
--dark-navy: #0A1929;         /* Backgrounds */
--dark-bg: #0F1419;           /* Darker backgrounds */
```

## 🔐 Authentication Flow

1. **Login/Signup** → User creates account or logs in
2. **JWT Tokens** → Access & refresh tokens stored in localStorage
3. **Onboarding** → AI-driven questionnaire to gather financial profile
4. **Main Dashboard** → Full access to all features

## 🤖 AI Features Explained

### 1. AI Chatbot
- Natural language interface for all financial operations
- Can add expenses, create budgets, and answer questions
- Maintains conversation history
- Powered by Google Gemini 2.0 Flash

### 2. Budget Generation
- Analyzes your income and spending patterns
- Creates personalized budget categories
- Provides detailed descriptions and advice for each category
- Supports Markdown formatting

### 3. Expense Extraction
- **Text Input**: "Spent $50 on groceries at Walmart"
- **File Upload**: Upload receipt images (JPG, PNG, PDF)
- AI extracts amount, description, category, and date
- Automatically categorizes expenses

### 4. Financial Reports
- Monthly expense analysis
- Budget vs. actual spending comparison
- AI-generated insights and recommendations
- Beautiful table formatting with Markdown

## 📡 API Endpoints

The frontend communicates with these backend endpoints:

### Authentication
- `POST /api/users/create/` - Create new user
- `POST /api/token/` - Login & get JWT tokens
- `GET /api/users/me/` - Get current user profile

### Onboarding
- `GET /api/onboarding/` - Get current question
- `POST /api/onboarding/` - Submit answer
- `POST /api/onboarding/reset/` - Reset onboarding

### Chat
- `POST /api/chat/` - Send message to AI
- `GET /api/chat/history/` - Get conversation history
- `POST /api/chat/reset/` - Clear chat history

### Budget
- `GET /api/budget/` - List all budgets
- `GET /api/budget/{id}/` - Get budget details
- `POST /api/budget/generate/` - Generate AI budget

### Expenses
- `GET /api/expenses/` - List all expenses
- `POST /api/expenses/` - Add expense (text or file)
- `POST /api/expenses/report/` - Generate expense report

### Notifications
- `GET /api/notify/` - List notifications
- `GET /api/notify/unread-count/` - Get unread count
- `POST /api/notify/mark-all-read/` - Mark all as read

## 🧪 Development Notes

### Key Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-markdown": "^9.0.1",
  "remark-gfm": "^4.0.0"
}
```

### Code Quality
- **ESLint** configured for React best practices
- **Vite HMR** for instant hot module replacement
- **CSS Variables** for consistent theming
- **Modular Architecture** for maintainability

## 🤝 About This Frontend

This **frontend application** was developed to work with the SDG MoneyMate backend API. The backend handles all AI processing, business logic, and data management using Django REST Framework and Google Gemini AI.

## 📝 License

This project is part of the SDG (Software Development Group) portfolio.

## 🙏 Acknowledgments

- **Backend**: Django REST Framework with Google Gemini AI integration
- **Design Inspiration**: Modern fintech applications
- **Brand Design**: SDG team color palette

## 📞 Support

For issues or questions, please refer to the backend repository documentation or contact the development team.

---

## 🤖 Development Note

**This frontend application was 100% coded by AI** (Google Gemini via Antigravity CLI) with human guidance.

### Human's Role:
- Provided feature requirements and specifications
- Gave design direction and brand guidelines
- Tested the application and reported bugs
- Made strategic decisions and set priorities

### AI's Role:
- Implemented all code (React components, styling, API integration)
- Designed component architecture and file structure
- Created all CSS animations and responsive layouts
- Fixed bugs and optimized performance
- Wrote this documentation

This demonstrates the power of AI-assisted development when combined with clear human direction and requirements.

---

**Built with ❤️ by AI, guided by humans**
