import React, { useState } from 'react';
import PDFViewer from '../components/PDFViewer';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  }

  function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const form = new FormData();
    form.append('file', file);
    form.append('title', file.name);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    fetch('/api/pdfs/upload/', {
      method: 'POST',
      body: form,
    })
      .then(r => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        if (!r.ok) throw new Error('Upload failed');
        return r.json();
      })
      .then(data => {
        setUploadedUrl(data.file);
        setSuccess(true);
        setIsUploading(false);
      })
      .catch(err => {
        clearInterval(progressInterval);
        console.error(err);
        setError('Failed to upload PDF. Please try again.');
        setIsUploading(false);
        setUploadProgress(0);
      });
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📄 Upload PDF Document</h2>
          <p className="card-subtitle">
            Upload your PDF to generate an AI-powered quiz
          </p>
        </div>

        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <div className="file-input">
              <input 
                type="file" 
                id="pdf-upload"
                accept="application/pdf" 
                onChange={handleFileChange}
              />
              <label htmlFor="pdf-upload" className="file-input-label">
                {file ? (
                  <>
                    <span>📄 {file.name}</span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </>
                ) : (
                  <>
                    <span>📤 Click to select PDF file</span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      or drag and drop here
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #fcc'
            }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{ 
              background: '#efe', 
              color: '#363', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #cfc'
            }}>
              ✅ PDF uploaded successfully! Quiz is being generated...
            </div>
          )}

          {isUploading && (
            <div className="upload-progress">
              <div className="d-flex justify-center align-center mb-2">
                <div className="spinner"></div>
                <span>Uploading... {uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!file || isUploading}
            style={{ 
              width: '100%',
              opacity: (!file || isUploading) ? 0.6 : 1,
              cursor: (!file || isUploading) ? 'not-allowed' : 'pointer'
            }}
          >
            {isUploading ? (
              <>
                <div className="spinner" style={{ width: '1rem', height: '1rem', margin: 0, marginRight: '0.5rem' }}></div>
                Uploading...
              </>
            ) : (
              <>🚀 Upload & Generate Quiz</>
            )}
          </button>
        </form>
      </div>

      {uploadedUrl && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 PDF Preview</h3>
            <p className="card-subtitle">
              Your PDF has been uploaded successfully
            </p>
          </div>
          <PDFViewer fileUrl={uploadedUrl} />
          
          <div className="text-center mt-3">
            <button className="btn btn-success">
              🎯 Start Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
