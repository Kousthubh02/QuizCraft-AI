import React from 'react';

export default function SourceSelector({ sources, value, onChange }) {
  return (
    <div className="source-selector">
      {sources.map(source => (
        <div 
          key={source.value} 
          className={`source-option ${value === source.value ? 'active' : ''}`}
          onClick={() => onChange(source.value)}
        >
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
            {source.label}
          </div>
          {source.description && (
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              {source.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
