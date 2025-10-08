import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// set worker src from pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    setError('Failed to load PDF document');
    setLoading(false);
    console.error('PDF loading error:', error);
  }

  function goToPrevPage() {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }

  function goToNextPage() {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  }

  if (loading) {
    return (
      <div className="pdf-viewer">
        <div className="loading">
          <div className="spinner"></div>
          Loading PDF...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-viewer">
        <div className="text-center" style={{ padding: '2rem', color: '#c33' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄❌</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      {/* PDF Controls */}
      {numPages > 1 && (
        <div className="d-flex justify-center align-center gap-2 mb-3">
          <button 
            className="btn btn-secondary"
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            style={{ opacity: currentPage <= 1 ? 0.5 : 1 }}
          >
            ← Previous
          </button>
          
          <span style={{ 
            padding: '0.5rem 1rem', 
            background: '#f8f9fa', 
            borderRadius: '5px',
            fontWeight: '600'
          }}>
            Page {currentPage} of {numPages}
          </span>
          
          <button 
            className="btn btn-secondary"
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            style={{ opacity: currentPage >= numPages ? 0.5 : 1 }}
          >
            Next →
          </button>
        </div>
      )}

      {/* PDF Document */}
      <div style={{ textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <Document 
          file={fileUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div style={{ padding: '2rem' }}>
              <div className="spinner"></div>
              <div>Loading PDF...</div>
            </div>
          }
        >
          <Page 
            pageNumber={currentPage} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={Math.min(window.innerWidth * 0.8, 800)}
          />
        </Document>
      </div>

      {/* Page Navigation for Mobile */}
      {numPages > 1 && (
        <div className="d-flex justify-center gap-1 mt-3">
          {Array.from({ length: Math.min(numPages, 10) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={`btn ${pageNum === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCurrentPage(pageNum)}
                style={{ 
                  minWidth: '2.5rem',
                  fontSize: '0.8rem',
                  padding: '0.25rem 0.5rem'
                }}
              >
                {pageNum}
              </button>
            );
          })}
          {numPages > 10 && <span style={{ padding: '0.5rem', color: '#666' }}>...</span>}
        </div>
      )}
    </div>
  );
}
