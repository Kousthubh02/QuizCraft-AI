import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading fade-in">
      <div className="spinner"></div>
      {message}
    </div>
  );
}

export function LoadingCard({ title, message = 'Please wait...' }) {
  return (
    <div className="card fade-in text-center">
      <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
      {title && <h3 className="card-title">{title}</h3>}
      <p className="card-subtitle">{message}</p>
    </div>
  );
}