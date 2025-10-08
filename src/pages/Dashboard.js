import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const API_BASE_URL = 'http://localhost:8000/api';
const USER_ID = 1; // Default user ID - can be replaced with auth

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [journey, setJourney] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, performance, journey

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all dashboard data in parallel
      const [statsRes, journeyRes, recsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/stats/?user_id=${USER_ID}`),
        fetch(`${API_BASE_URL}/dashboard/learning_journey/?user_id=${USER_ID}`),
        fetch(`${API_BASE_URL}/dashboard/recommendations/?user_id=${USER_ID}&limit=5`)
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (journeyRes.ok) {
        const journeyData = await journeyRes.json();
        setJourney(journeyData);
      }

      if (recsRes.ok) {
        const recsData = await recsRes.json();
        setRecommendations(recsData.recommendations || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats && !journey) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>No Analytics Data Yet</h2>
          <p>Start taking quizzes to see your learning analytics!</p>
          <Link to="/pdfs" className="btn btn-primary">
            Browse PDFs →
          </Link>
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const performanceByType = stats?.performance_by_type || {};
  const strengths = stats?.strengths || [];
  const weaknesses = stats?.weaknesses || [];
  const recentQuizzes = stats?.recent_quizzes || [];
  const progressData = stats?.progress_over_time || [];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">📊 Learning Dashboard</h1>
          <p className="dashboard-subtitle">Track your progress and master your topics</p>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="btn btn-secondary"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button 
          className={`tab ${activeTab === 'journey' ? 'active' : ''}`}
          onClick={() => setActiveTab('journey')}
        >
          Learning Journey
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content fade-in">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">{overview.total_quizzes || 0}</div>
                <div className="stat-label">Quizzes Taken</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-value">{overview.total_questions || 0}</div>
                <div className="stat-label">Questions Answered</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">{overview.average_score?.toFixed(1) || 0}%</div>
                <div className="stat-label">Average Score</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <div className="stat-value">{overview.current_streak || 0}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💪</div>
              <div className="stat-content">
                <div className="stat-value">{overview.strengths_count || 0}</div>
                <div className="stat-label">Strengths</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">{overview.weaknesses_count || 0}</div>
                <div className="stat-label">Areas to Improve</div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="sw-container">
            {/* Strengths */}
            <div className="card strength-card">
              <h3 className="card-title">💪 Your Strengths</h3>
              {strengths.length > 0 ? (
                <div className="topic-list">
                  {strengths.slice(0, 5).map((item, index) => (
                    <div key={index} className="topic-item strength">
                      <div className="topic-info">
                        <div className="topic-name">{item.topic}</div>
                        <div className="topic-stats">
                          {item.attempts} attempts • {item.accuracy?.toFixed(0)}% accuracy
                        </div>
                      </div>
                      <div className="topic-score strength-score">
                        {item.average_score?.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">
                  Complete more quizzes to identify your strengths!
                </div>
              )}
            </div>

            {/* Weaknesses */}
            <div className="card weakness-card">
              <h3 className="card-title">📚 Areas to Improve</h3>
              {weaknesses.length > 0 ? (
                <div className="topic-list">
                  {weaknesses.slice(0, 5).map((item, index) => (
                    <div key={index} className="topic-item weakness">
                      <div className="topic-info">
                        <div className="topic-name">{item.topic}</div>
                        <div className="topic-stats">
                          {item.attempts} attempts • {item.accuracy?.toFixed(0)}% accuracy
                        </div>
                      </div>
                      <div className="topic-score weakness-score">
                        {item.average_score?.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">
                  No weaknesses identified yet. Keep learning!
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="card recommendations-card">
              <h3 className="card-title">💡 Recommended Practice</h3>
              <div className="recommendations-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation-item priority-${rec.priority}`}>
                    <div className="rec-icon">
                      {rec.priority === 'high' && '🔴'}
                      {rec.priority === 'medium' && '🟡'}
                      {rec.priority === 'low' && '🟢'}
                    </div>
                    <div className="rec-content">
                      <div className="rec-topic">{rec.topic?.name}</div>
                      <div className="rec-reason">
                        {rec.reason === 'weakness' && 'Needs improvement'}
                        {rec.reason === 'few_attempts' && 'Practice more'}
                        {rec.reason === 'neutral' && 'Room for growth'}
                      </div>
                    </div>
                    <div className="rec-score">
                      {rec.current_score?.toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="tab-content fade-in">
          {/* Performance by Question Type */}
          <div className="card">
            <h3 className="card-title">📊 Performance by Question Type</h3>
            <div className="performance-grid">
              {['mcq', 'saq', 'laq'].map((type) => {
                const data = performanceByType[type] || {total: 0, correct: 0, accuracy: 0, average_score: 0};
                return (
                  <div key={type} className="performance-card">
                    <div className="perf-header">
                      <span className="perf-type">{type.toUpperCase()}</span>
                      <span className="perf-accuracy">{data.accuracy?.toFixed(1)}%</span>
                    </div>
                    <div className="perf-stats">
                      <div className="perf-stat">
                        <span className="perf-label">Total:</span>
                        <span className="perf-value">{data.total}</span>
                      </div>
                      <div className="perf-stat">
                        <span className="perf-label">Correct:</span>
                        <span className="perf-value">{data.correct}</span>
                      </div>
                      <div className="perf-stat">
                        <span className="perf-label">Avg Score:</span>
                        <span className="perf-value">{data.average_score?.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${data.accuracy || 0}%`}}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="card">
            <h3 className="card-title">📋 Recent Quizzes</h3>
            {recentQuizzes.length > 0 ? (
              <div className="recent-quizzes">
                {recentQuizzes.map((quiz, index) => (
                  <div key={index} className="recent-quiz-item">
                    <div className="quiz-icon">🎯</div>
                    <div className="quiz-details">
                      <div className="quiz-title">{quiz.title || `Quiz ${quiz.id}`}</div>
                      <div className="quiz-meta">
                        {quiz.total_questions} questions • {new Date(quiz.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`quiz-score ${quiz.score >= 80 ? 'high' : quiz.score >= 60 ? 'medium' : 'low'}`}>
                      {quiz.score?.toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message">
                No quizzes taken yet. <Link to="/pdfs">Start learning!</Link>
              </div>
            )}
          </div>

          {/* Progress Over Time */}
          {progressData.length > 0 && (
            <div className="card">
              <h3 className="card-title">📈 30-Day Progress</h3>
              <div className="progress-chart">
                {progressData.slice(-30).map((day, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{
                        height: `${Math.max(day.average_score || 0, 5)}%`,
                        opacity: day.quizzes_count > 0 ? 1 : 0.3
                      }}
                      title={`${day.date}: ${day.average_score?.toFixed(0)}%`}
                    ></div>
                    <div className="chart-label">
                      {new Date(day.date).getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Learning Journey Tab */}
      {activeTab === 'journey' && journey && (
        <div className="tab-content fade-in">
          {/* Journey Overview */}
          <div className="card journey-overview">
            <h3 className="card-title">🎓 Your Learning Journey</h3>
            <div className="journey-stats">
              <div className="journey-stat">
                <div className="journey-stat-icon">🏆</div>
                <div>
                  <div className="journey-stat-value">{journey.total_quizzes_taken}</div>
                  <div className="journey-stat-label">Quizzes Completed</div>
                </div>
              </div>
              <div className="journey-stat">
                <div className="journey-stat-icon">❓</div>
                <div>
                  <div className="journey-stat-value">{journey.total_questions_answered}</div>
                  <div className="journey-stat-label">Questions Answered</div>
                </div>
              </div>
              <div className="journey-stat">
                <div className="journey-stat-icon">⭐</div>
                <div>
                  <div className="journey-stat-value">{journey.overall_average_score?.toFixed(1)}%</div>
                  <div className="journey-stat-label">Overall Score</div>
                </div>
              </div>
              <div className="journey-stat">
                <div className="journey-stat-icon">🔥</div>
                <div>
                  <div className="journey-stat-value">{journey.current_streak}</div>
                  <div className="journey-stat-label">Current Streak</div>
                </div>
              </div>
              <div className="journey-stat">
                <div className="journey-stat-icon">🏅</div>
                <div>
                  <div className="journey-stat-value">{journey.longest_streak}</div>
                  <div className="journey-stat-label">Longest Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Progress */}
          {journey.learning_goal && (
            <div className="card goal-card">
              <h3 className="card-title">🎯 Learning Goal</h3>
              <p className="goal-text">{journey.learning_goal}</p>
              <div className="goal-progress">
                <div className="goal-progress-bar">
                  <div 
                    className="goal-progress-fill"
                    style={{width: `${journey.goal_progress || 0}%`}}
                  ></div>
                </div>
                <div className="goal-progress-text">{journey.goal_progress?.toFixed(0)}% Complete</div>
              </div>
            </div>
          )}

          {/* Detailed Strengths */}
          <div className="card">
            <h3 className="card-title">💪 Detailed Strengths</h3>
            {journey.strengths && journey.strengths.length > 0 ? (
              <div className="detailed-topics">
                {journey.strengths.map((item, index) => (
                  <div key={index} className="detailed-topic-item strength-border">
                    <div className="dt-header">
                      <span className="dt-name">{item.topic?.name}</span>
                      <span className="dt-score strength-score">{item.average_score?.toFixed(0)}%</span>
                    </div>
                    <div className="dt-stats">
                      <span>📊 {item.total_attempts} attempts</span>
                      <span>✅ {item.correct_answers} correct</span>
                      <span>❌ {item.incorrect_answers} incorrect</span>
                      <span>📈 {item.improvement_rate > 0 ? '+' : ''}{item.improvement_rate?.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message">
                Complete more quizzes to build your strengths!
              </div>
            )}
          </div>

          {/* Detailed Weaknesses */}
          <div className="card">
            <h3 className="card-title">📚 Detailed Areas to Improve</h3>
            {journey.weaknesses && journey.weaknesses.length > 0 ? (
              <div className="detailed-topics">
                {journey.weaknesses.map((item, index) => (
                  <div key={index} className="detailed-topic-item weakness-border">
                    <div className="dt-header">
                      <span className="dt-name">{item.topic?.name}</span>
                      <span className="dt-score weakness-score">{item.average_score?.toFixed(0)}%</span>
                    </div>
                    <div className="dt-stats">
                      <span>📊 {item.total_attempts} attempts</span>
                      <span>✅ {item.correct_answers} correct</span>
                      <span>❌ {item.incorrect_answers} incorrect</span>
                      <span>📈 {item.improvement_rate > 0 ? '+' : ''}{item.improvement_rate?.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message">
                No weaknesses identified. Great job!
              </div>
            )}
          </div>

          {/* Recent Activity */}
          {journey.recent_activity && journey.recent_activity.length > 0 && (
            <div className="card">
              <h3 className="card-title">⏱️ Recent Activity</h3>
              <div className="recent-activity">
                {journey.recent_activity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">✅</div>
                    <div className="activity-details">
                      <div className="activity-title">
                        {activity.quiz?.title || `Quiz ${activity.quiz?.id}`}
                      </div>
                      <div className="activity-meta">
                        {new Date(activity.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className={`activity-score ${activity.score >= 80 ? 'high' : activity.score >= 60 ? 'medium' : 'low'}`}>
                      {activity.score?.toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
