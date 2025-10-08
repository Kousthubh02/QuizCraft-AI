import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  useEffect(() => {
    fetch(`/api/quizzes/${id}/`)
      .then(r => {
        if (!r.ok) throw new Error('Quiz not found');
        return r.json();
      })
      .then(data => {
        setQuiz(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setQuiz(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        Loading quiz...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="card fade-in text-center">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h2 className="card-title">Quiz Not Found</h2>
        <p className="card-subtitle">
          The quiz you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/pdfs" className="btn btn-primary mt-3">
          📚 Back to PDFs
        </Link>
      </div>
    );
  }

  function selectAnswer(questionId, choiceId) {
    setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
  }

  function submitAnswers() {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    const payload = { 
      answers: Object.keys(answers).map(qid => ({ 
        question: parseInt(qid, 10), 
        answer: answers[qid] 
      })) 
    };
    
    fetch(`/api/quizzes/${id}/submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(r => {
        if (!r.ok) throw new Error('Submission failed');
        return r.json();
      })
      .then(data => {
        setResult(data);
        setSubmitting(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to submit quiz. Please try again.');
        setSubmitting(false);
      });
  }

  function nextQuestion() {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  function prevQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  const progress = ((Object.keys(answers).length / quiz.questions.length) * 100).toFixed(0);
  const currentQ = quiz.questions[currentQuestion];

  if (result) {
    const percentage = Math.round((result.correct / result.total) * 100);
    const getGrade = (pct) => {
      if (pct >= 90) return { grade: 'A+', emoji: '🏆', message: 'Outstanding!' };
      if (pct >= 80) return { grade: 'A', emoji: '🎉', message: 'Excellent work!' };
      if (pct >= 70) return { grade: 'B', emoji: '👏', message: 'Good job!' };
      if (pct >= 60) return { grade: 'C', emoji: '👍', message: 'Keep practicing!' };
      return { grade: 'D', emoji: '📚', message: 'Room for improvement!' };
    };
    
    const gradeInfo = getGrade(percentage);

    return (
      <div className="quiz-container fade-in">
        <div className="result-card">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{gradeInfo.emoji}</div>
          <div className="result-score">{percentage}%</div>
          <div className="result-text">
            Grade: {gradeInfo.grade} - {gradeInfo.message}
          </div>
          <div style={{ marginTop: '1rem', opacity: 0.9 }}>
            {result.correct} out of {result.total} questions correct
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <h3 className="card-title">🎯 Quiz Complete!</h3>
            <p className="card-subtitle">What would you like to do next?</p>
            <div className="d-flex justify-center gap-2 mt-3">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentQuestion(0);
                }}
              >
                🔄 Retake Quiz
              </button>
              <Link to="/pdfs" className="btn btn-primary">
                📚 Back to PDFs
              </Link>
              <Link to="/upload" className="btn btn-success">
                📤 Upload New PDF
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container fade-in">
      {/* Quiz Header */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🎯 {quiz.title}</h2>
          <p className="card-subtitle">{quiz.description}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="upload-progress">
          <div className="d-flex justify-center align-center mb-2">
            <span>Progress: {progress}% ({Object.keys(answers).length}/{quiz.questions.length} answered)</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* View Options */}
        <div className="d-flex justify-center gap-2 mt-3">
          <button 
            className={`btn ${!showAllQuestions ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowAllQuestions(false)}
          >
            📖 One by One
          </button>
          <button 
            className={`btn ${showAllQuestions ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowAllQuestions(true)}
          >
            📋 All Questions
          </button>
        </div>
      </div>

      {/* Quiz Content */}
      {showAllQuestions ? (
        /* All Questions View */
        <div>
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <div className="d-flex align-center mb-3">
                <div className="question-number">{index + 1}</div>
                <div className="question-text">{question.text}</div>
              </div>
              
              <ul className="choices-list">
                {question.choices.map(choice => (
                  <li key={choice.id} className="choice-item">
                    <label 
                      className={`choice-label ${answers[question.id] === choice.id ? 'selected' : ''}`}
                    >
                      <input 
                        type="radio" 
                        name={`q_${question.id}`}
                        className="choice-input"
                        onChange={() => selectAnswer(question.id, choice.id)} 
                        checked={answers[question.id] === choice.id} 
                      />
                      {choice.text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        /* Single Question View */
        <div className="question-card">
          <div className="d-flex justify-center align-center mb-3">
            <div className="question-number">{currentQuestion + 1}</div>
            <span style={{ color: '#666', marginLeft: '1rem' }}>
              of {quiz.questions.length}
            </span>
          </div>
          
          <div className="question-text text-center mb-4">
            {currentQ.text}
          </div>
          
          <ul className="choices-list">
            {currentQ.choices.map(choice => (
              <li key={choice.id} className="choice-item">
                <label 
                  className={`choice-label ${answers[currentQ.id] === choice.id ? 'selected' : ''}`}
                >
                  <input 
                    type="radio" 
                    name={`q_${currentQ.id}`}
                    className="choice-input"
                    onChange={() => selectAnswer(currentQ.id, choice.id)} 
                    checked={answers[currentQ.id] === choice.id} 
                  />
                  {choice.text}
                </label>
              </li>
            ))}
          </ul>

          {/* Navigation */}
          <div className="d-flex justify-center gap-2 mt-4">
            <button 
              className="btn btn-secondary"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
            >
              ← Previous
            </button>
            <button 
              className="btn btn-secondary"
              onClick={nextQuestion}
              disabled={currentQuestion === quiz.questions.length - 1}
              style={{ opacity: currentQuestion === quiz.questions.length - 1 ? 0.5 : 1 }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="card text-center">
        <button 
          className="btn btn-success"
          onClick={submitAnswers}
          disabled={Object.keys(answers).length < quiz.questions.length || submitting}
          style={{ 
            width: '100%',
            opacity: (Object.keys(answers).length < quiz.questions.length || submitting) ? 0.6 : 1 
          }}
        >
          {submitting ? (
            <>
              <div className="spinner" style={{ width: '1rem', height: '1rem', margin: 0, marginRight: '0.5rem' }}></div>
              Submitting...
            </>
          ) : (
            <>🚀 Submit Quiz ({Object.keys(answers).length}/{quiz.questions.length})</>
          )}
        </button>
        
        {Object.keys(answers).length < quiz.questions.length && (
          <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Please answer all questions before submitting
          </p>
        )}
      </div>
    </div>
  );
}
