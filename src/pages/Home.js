import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">QuizCraft AI</h1>
        <p className="hero-subtitle">
          Transform your PDF documents into interactive quizzes powered by artificial intelligence. 
          Upload, learn, and test your knowledge with AI-generated questions.
        </p>
        <div className="hero-cta">
          <Link to="/upload" className="btn btn-primary">
            📄 Upload PDF
          </Link>
          <Link to="/dashboard" className="btn btn-success">
            📊 View Dashboard
          </Link>
          <Link to="/pdfs" className="btn btn-secondary">
            📚 Browse PDFs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI-Powered Questions</h3>
            <p className="feature-description">
              Advanced AI generates MCQs, Short Answer, and Long Answer questions 
              tailored to your PDF content with detailed explanations.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Learning Analytics</h3>
            <p className="feature-description">
              Track your strengths and weaknesses across topics with personalized 
              insights and recommendations for improvement.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Smart Tracking</h3>
            <p className="feature-description">
              Monitor your learning journey with streaks, goals, and progress 
              charts to stay motivated and focused.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Instant Processing</h3>
            <p className="feature-description">
              Upload your PDF and get your quiz ready in seconds. 
              No waiting, no hassle - just immediate learning.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">�</div>
            <h3 className="feature-title">Regenerate Quizzes</h3>
            <p className="feature-description">
              Create multiple unique quizzes from the same content to reinforce 
              your learning with varied questions.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">Personalized Recommendations</h3>
            <p className="feature-description">
              Get AI-powered suggestions on which topics to practice based on 
              your performance and learning goals.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="card">
        <div className="card-header text-center">
          <h2 className="card-title">How It Works</h2>
          <p className="card-subtitle">Get started in just three simple steps</p>
        </div>
        
        <div className="grid grid-3">
          <div className="text-center">
            <div className="feature-icon">📤</div>
            <h4 className="feature-title">1. Upload</h4>
            <p>Upload your PDF document to extract the learning content.</p>
          </div>
          
          <div className="text-center">
            <div className="feature-icon">🔄</div>
            <h4 className="feature-title">2. Generate Quiz</h4>
            <p>AI creates MCQs, SAQs, and LAQs with explanations instantly.</p>
          </div>
          
          <div className="text-center">
            <div className="feature-icon">🎯</div>
            <h4 className="feature-title">3. Learn & Track</h4>
            <p>Answer questions and track your progress on the dashboard.</p>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/upload" className="btn btn-primary">
            🚀 Get Started Now
          </Link>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="grid grid-3">
        <div className="card text-center">
          <div className="feature-icon">🧠</div>
          <h3 className="card-title">Question Types</h3>
          <p>Multiple Choice, Short Answer, and Long Answer questions</p>
        </div>
        
        <div className="card text-center">
          <div className="feature-icon">📈</div>
          <h3 className="card-title">Analytics Dashboard</h3>
          <p>Comprehensive insights into your learning journey</p>
        </div>
        
        <div className="card text-center">
          <div className="feature-icon">🎓</div>
          <h3 className="card-title">Topic Tracking</h3>
          <p>Auto-categorized topics with performance metrics</p>
        </div>
      </section>
    </div>
  );
}
