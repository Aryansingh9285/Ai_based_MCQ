'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AssessmentPage() {
  const [hydrated, setHydrated] = useState(false);
  const [summary, setSummary] = useState('');
  const [parsedAnswers, setParsedAnswers] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      const searchParams = new URLSearchParams(window.location.search);
      const nameParam = searchParams.get('name') || '';
      const domainParam = searchParams.get('domain') || '';
      const answersParam = searchParams.get('answers') || '';
      setName(nameParam);
      setDomain(domainParam);
      try {
        setParsedAnswers(JSON.parse(answersParam));
      } catch (e) {
        setParsedAnswers([]);
      }
      if (answersParam && domainParam && nameParam) {
        fetch('/api/generate-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameParam,
            domain: domainParam,
            answers: JSON.parse(answersParam),
          }),
        })
          .then(res => res.json())
          .then(data => {
            setSummary(data.content);
          })
          .catch(err => {
            setSummary('Failed to load assessment.');
            console.error(err);
          });
      }
    }
  }, [hydrated]);

  if (!hydrated) return null;

  return (
   <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
    <h1 className="text-3xl font-extrabold text-indigo-600 mb-6">
      Assessment for <span className="text-gray-800">{name}</span> on <span className="italic">{domain}</span>
    </h1>

    <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Answers:</h2>
    <ul className="mb-6 list-disc list-inside text-gray-900">
      {parsedAnswers.map((ans, idx) => (
        <li key={idx} className="mb-1">
          Question {idx + 1}: {ans}
        </li>
      ))}
    </ul>

    <div className="p-4 border-t border-gray-200 mt-4">
      <p className="mb-2 text-lg font-semibold text-indigo-700">Assignment:</p>
      <div
        className="text-gray-700 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: summary || 'Loading assessment...' }}
      />
    </div>
  </div>
  );
}
