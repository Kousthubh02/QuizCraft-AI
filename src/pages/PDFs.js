import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PDFs() {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    fetch('/api/pdfs/')
      .then(r => r.json())
      .then(setPdfs)
      .catch(() => setPdfs([]));
  }, []);

  return (
    <div>
      <h2>PDFs</h2>
      <ul>
        {pdfs.map(p => (
          <li key={p.id}>{p.title} - <Link to={`/quiz/${p.id}`}>View Quiz</Link></li>
        ))}
      </ul>
    </div>
  );
}
