import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PDFs from './pages/PDFs';
import Quiz from './pages/Quiz';
import Upload from './pages/Upload';

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/pdfs">PDFs</Link> | <Link to="/upload">Upload</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdfs" element={<PDFs />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </div>
  );
}
