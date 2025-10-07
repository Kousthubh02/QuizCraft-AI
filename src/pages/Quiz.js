import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`/api/quizzes/${id}/`)
      .then(r => r.json())
      .then(setQuiz)
      .catch(() => setQuiz(null));
  }, [id]);

  if (!quiz) return <div>Loading...</div>;

  function selectAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function submitAnswers() {
    const payload = { answers: Object.keys(answers).map(qid => ({ question: parseInt(qid, 10), answer: answers[qid] })) };
    fetch(`/api/quizzes/${id}/submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(setResult)
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h2>{quiz.title}</h2>
      <div>{quiz.description}</div>
      <ol>
        {quiz.questions.map(q => (
          <li key={q.id}>
            <div>{q.text}</div>
            <ul>
              {q.choices.map((c, idx) => (
                <li key={c.id}>
                  <label>
                    <input type="radio" name={`q_${q.id}`} onChange={() => selectAnswer(q.id, c.id)} checked={answers[q.id] === c.id} />
                    {c.text}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <button onClick={submitAnswers}>Submit</button>
      {result && (
        <div>
          <h3>Result</h3>
          <div>Score: {result.score}</div>
          <div>Correct: {result.correct}/{result.total}</div>
        </div>
      )}
    </div>
  );
}
