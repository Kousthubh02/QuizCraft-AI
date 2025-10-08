import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PDFs() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/pdfs/')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch PDFs');
        return r.json();
      })
      .then(data => {
        setPdfs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load PDFs. Please try again.');
        setPdfs([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        Loading your PDFs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card fade-in">
        <div className="text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 className="card-title">Error Loading PDFs</h2>
          <p className="card-subtitle">{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📚 My PDF Library</h2>
          <p className="card-subtitle">
            {pdfs.length === 0 
              ? "No PDFs uploaded yet. Upload your first document to get started!"
              : `You have ${pdfs.length} PDF${pdfs.length !== 1 ? 's' : ''} ready for quizzing.`
            }
          </p>
        </div>

        {pdfs.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
            <h3 style={{ marginBottom: '1rem', color: '#666' }}>No PDFs Yet</h3>
            <p style={{ marginBottom: '2rem', color: '#888' }}>
              Upload your first PDF document to start creating AI-powered quizzes
            </p>
            <Link to="/upload" className="btn btn-primary">
              📤 Upload Your First PDF
            </Link>
          </div>
        ) : (
          <ul className="pdf-list">
            {pdfs.map((pdf, index) => (
              <li key={pdf.id} className="pdf-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div>
                  <div className="pdf-title">📄 {pdf.title}</div>
                  <div className="pdf-meta">
                    📅 Uploaded {new Date(pdf.created_at || Date.now()).toLocaleDateString()}
                    {pdf.questions_count && (
                      <span> • 🎯 {pdf.questions_count} questions</span>
                    )}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Link 
                    to={`/quiz/${pdf.id}`} 
                    className="btn btn-primary"
                  >
                    🎯 Start Quiz
                  </Link>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      // Add PDF preview functionality
                      console.log('Preview PDF:', pdf.id);
                    }}
                  >
                    👁️ Preview
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pdfs.length > 0 && (
        <div className="card">
          <div className="card-header text-center">
            <h3 className="card-title">📊 Your Learning Stats</h3>
          </div>
          <div className="grid grid-3">
            <div className="text-center">
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                {pdfs.length}
              </div>
              <div style={{ color: '#666' }}>Documents</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {pdfs.reduce((total, pdf) => total + (pdf.questions_count || 5), 0)}
              </div>
              <div style={{ color: '#666' }}>Questions</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#764ba2' }}>
                {pdfs.reduce((total, pdf) => total + (pdf.completed_quizzes || 0), 0)}
              </div>
              <div style={{ color: '#666' }}>Quizzes Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
