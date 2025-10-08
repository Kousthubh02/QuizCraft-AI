import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card fade-in text-center">
      <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🤖</div>
      <h1 className="card-title">404 - Page Not Found</h1>
      <p className="card-subtitle">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="mt-4">
        <Link to="/" className="btn btn-primary">
          🏠 Go Home
        </Link>
      </div>
    </div>
  );
}