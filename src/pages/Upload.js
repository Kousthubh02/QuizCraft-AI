import React, { useState } from 'react';
import SourceSelector from '../components/SourceSelector';
import PDFViewer from '../components/PDFViewer';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [source, setSource] = useState('local');

  const sources = [
    { value: 'local', label: 'Local upload' },
    { value: 'url', label: 'URL' },
  ];

  function handleUpload(e) {
    e.preventDefault();
    if (source === 'local' && !file) return;

    if (source === 'local') {
      const form = new FormData();
      form.append('file', file);
      form.append('title', file.name);
      fetch('/api/pdfs/upload/', {
        method: 'POST',
        body: form,
      })
        .then(r => r.json())
        .then(data => {
          setUploadedUrl(data.file);
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div>
      <h2>Upload PDF</h2>
      <SourceSelector sources={sources} value={source} onChange={setSource} />
      {source === 'local' && (
        <form onSubmit={handleUpload}>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
          <button type="submit">Upload</button>
        </form>
      )}

      {uploadedUrl && (
        <div>
          <h3>Uploaded PDF</h3>
          <PDFViewer fileUrl={uploadedUrl} />
        </div>
      )}
    </div>
  );
}
