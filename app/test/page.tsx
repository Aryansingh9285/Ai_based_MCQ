'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseQuestions } from '@/lib/parseQuestions';

export default function TestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name') ?? '';
  const domain = searchParams.get('domain') ?? '';

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch('/api/generate-questions', { method: 'POST', body: JSON.stringify({ domain }) });
      const data = await res.json();

      if (typeof data.content === 'string') {
        const parsedQuestions = parseQuestions(data.content);
        setQuestions(parsedQuestions);
      } else {
        console.error('Expected string but got:', data.content);
      }
    }
    fetchQuestions();
  }, [domain]);

  const handleAnswer = (choice: string) => {
    if (showFeedback) return; // Prevent double answer
    setSelected(choice);
    setAnswers([...answers, choice]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push(`/assessment?name=${name}&domain=${domain}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
    }
  };

  if (!hydrated) return null; // or a loading spinner
  if (!questions.length) return <p>Loading questions...</p>;

  const q = questions[current];
  const userAnswer = selected;
  const isCorrect = userAnswer === q.answer;

  console.log('Current question:', q);
  console.log('Options:', q.options);

  return (
   <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
  <h1 className="text-3xl font-extrabold text-indigo-600 mb-6">
    Quiz for <span className="text-gray-800">{name}</span> on <span className="italic">{domain}</span>
  </h1>

  <h2 className="text-xl font-semibold mb-6 text-gray-900">{q.question}</h2>

  <div className="grid gap-4 mb-6">
    {q.options.map((opt, idx) => (
      <button
        key={idx}
        onClick={() => handleAnswer(opt)}
        disabled={showFeedback || selected !== null}
        className={`w-full py-3 rounded-lg border text-gray-700 font-medium transition-colors
          ${
            selected === opt
              ? 'bg-indigo-100 border-indigo-500'
              : 'bg-white border-gray-300 hover:bg-indigo-50'
          }
          ${showFeedback || selected !== null ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        `}
      >
        {typeof opt === 'string' ? opt : JSON.stringify(opt)}
      </button>
    ))}
  </div>

  {showFeedback && userAnswer && (
    <div className="p-4 border-t border-gray-200">
      <p
        className={`mb-2 text-lg font-semibold ${
          isCorrect ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isCorrect ? '✅ Correct!' : `❌ Incorrect! Correct Answer: ${q.answer}`}
      </p>
      <p className="mb-4 text-gray-700">📘 Explanation: {q.explanation}</p>
      <button
        onClick={handleNext}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
      >
        {current < questions.length - 1 ? 'Next' : 'Finish'}
      </button>
    </div>
  )}
</div>

  );
}
