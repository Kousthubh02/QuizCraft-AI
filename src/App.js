import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PDFs from './pages/PDFs';
import Quiz from './pages/Quiz';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import './styles/App.css';

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            🧠 QuizCraft AI
          </Link>
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/pdfs" 
                className={`nav-link ${location.pathname === '/pdfs' ? 'active' : ''}`}
              >
                My PDFs
              </Link>
            </li>
            <li>
              <Link 
                to="/upload" 
                className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
              >
                Upload
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pdfs" element={<PDFs />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
