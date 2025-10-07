import React from 'react';

export default function SourceSelector({ sources, value, onChange }) {
  return (
    <div>
      <label>Source: </label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {sources.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
