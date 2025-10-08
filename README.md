# QuizCraft AI - Frontend

Beautiful, modern React frontend for the QuizCraft AI quiz generation and learning analytics platform.

## 🎨 Features

### Quiz Management
- **Upload PDFs** - Drag and drop or select PDF files
- **Generate Quizzes** - AI-powered question generation (MCQ, SAQ, LAQ)
- **Take Quizzes** - Interactive quiz interface with real-time feedback
- **View Results** - Detailed results with scores and explanations

### Learning Analytics Dashboard ⭐ NEW
- **📊 Overview** - Key metrics, strengths, weaknesses, recommendations
- **📈 Performance Analytics** - By question type, recent quizzes, 30-day chart
- **🎓 Learning Journey** - Overall stats, goals, detailed breakdowns, activity feed

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Backend server running on `http://localhost:8000`

### Setup (Windows, cmd.exe):

1. **Install dependencies:**
```
cd client
npm install
```

2. **Start dev server:**
```
npm start
```

3. **Open browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
client/
├── src/
│   ├── App.js                  # Main app with routing
│   ├── pages/
│   │   ├── Home.js             # Landing page
│   │   ├── Dashboard.js        # Analytics dashboard ⭐ NEW
│   │   ├── PDFs.js             # PDF list
│   │   ├── Quiz.js             # Quiz interface
│   │   ├── Upload.js           # PDF upload
│   │   └── NotFound.js         # 404 page
│   └── styles/
│       ├── App.css             # Global styles
│       └── Dashboard.css       # Dashboard styles ⭐ NEW
└── package.json
```

## 🎯 Main Pages

1. **Home (`/`)** - Landing page with features
2. **Dashboard (`/dashboard`)** ⭐ - Analytics with 3 tabs (Overview, Performance, Journey)
3. **PDFs (`/pdfs`)** - Manage uploaded PDFs
4. **Upload (`/upload`)** - Upload new PDFs
5. **Quiz (`/quiz/:id`)** - Take quizzes

## 📊 Dashboard Tabs

### Overview
- Stats cards (quizzes, questions, score, streak, strengths, weaknesses)
- Top 5 strengths and weaknesses
- Personalized recommendations

### Performance
- Performance by question type (MCQ/SAQ/LAQ)
- Recent quizzes
- 30-day progress chart

### Learning Journey
- Overall statistics
- Learning goal progress
- Detailed strengths & weaknesses
- Recent activity feed

## 🔧 API Configuration

Backend URL is set in Dashboard.js:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Change if your backend runs on a different port.

## 🎨 Design Features

- **Modern gradient background** (purple-blue)
- **Glassmorphism cards** with blur effects
- **Smooth animations** and transitions
- **Fully responsive** (desktop, tablet, mobile)
- **Accessible** with keyboard navigation
- **Beautiful charts** and progress bars

## 📱 Responsive Design

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🧪 Available Scripts

```bash
npm start        # Start development server
npm test         # Run tests
npm run build    # Build for production
npm run eject    # Eject from Create React App
```

## 🚢 Production Build

```bash
npm run build
```

Creates optimized build in `build/` folder ready for deployment.

## 🐛 Troubleshooting

**Backend Connection Issues**:
1. Ensure backend is running: `python manage.py runserver`
2. Check CORS is enabled in Django settings
3. Verify API_BASE_URL is correct

**Empty Dashboard**:
1. Take at least one quiz first
2. Ensure analytics endpoints are working
3. Check browser console for errors

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- Backend API docs in `/server` folder

---

**Built with ❤️ using React and modern CSS**

