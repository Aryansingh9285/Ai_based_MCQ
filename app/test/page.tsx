'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { parseQuestions } from '@/lib/parseQuestions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import HamsterWheel from './HamsterWheel';

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen flex-col">
          <div className="text-center mt-4">
            <p className="text-lg font-medium text-gray-700">Loading...</p>
          </div>
        </div>
      }
    >
      <TestPageContent />
    </Suspense>
  );
}

function TestPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams?.get('name') ?? '';
  const domain = searchParams?.get('domain') ?? '';

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  // Store answers as objects: { text, isCorrect, chosenOption }
  const [answers, setAnswers] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();

      if (typeof data.content === 'string') {
        const parsed = parseQuestions(data.content);
        setQuestions(parsed);
      }
    }
    if (hydrated) fetchQuestions();
  }, [domain, hydrated]);

  const handleAnswer = (choice: string) => {
    if (showFeedback) return;
    setSelected(choice);

    // Determine correct answer for this question
    const q = questions[current];
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    let correctIndex = -1;
    let correctValue = q.answer;
    if (optionLetters.includes(q.answer?.toUpperCase())) {
      correctIndex = optionLetters.indexOf(q.answer.toUpperCase());
      correctValue = q.options[correctIndex];
    } else {
      correctIndex = q.options.findIndex(
        (opt: string) => opt.trim().toLowerCase() === q.answer?.trim().toLowerCase()
      );
      correctValue = q.options[correctIndex];
    }
    if (correctIndex === -1) correctIndex = 0;

    const isCorrect = choice.trim().toLowerCase() === correctValue?.trim().toLowerCase();

    setAnswers(prev => [
      ...prev,
      {
        text: choice,
        isCorrect,
        chosenOption: choice,
        correctOption: correctValue,
        question: q.question,
      },
    ]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push(
        `/assessment?name=${name}&domain=${domain}&answers=${encodeURIComponent(
          JSON.stringify(answers)
        )}`
      );
    }
  };

  if (!hydrated) return null;
  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <HamsterWheel />
      </div>
    );
  }

  const q = questions[current];
  const userAnswer = selected;
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Always resolve correctIndex and correctValue
  let correctIndex = -1;
  let correctValue = q.answer;
  if (optionLetters.includes(q.answer?.toUpperCase())) {
    correctIndex = optionLetters.indexOf(q.answer.toUpperCase());
    correctValue = q.options[correctIndex];
  } else {
    correctIndex = q.options.findIndex(
      (opt: string) => opt.trim().toLowerCase() === q.answer?.trim().toLowerCase()
    );
    correctValue = q.options[correctIndex];
  }
  if (correctIndex === -1) correctIndex = 0;
  const correctLetter = optionLetters[correctIndex] || '?';

  // Final fixed answer check
  const isCorrect =
    userAnswer?.trim().toLowerCase() === correctValue?.trim().toLowerCase();

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-6">
          Quiz for <span className="text-gray-800">{name}</span> on{' '}
          <span className="italic">{domain}</span>
        </h1>

        <div className="prose max-w-none text-lg text-gray-800 mb-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {q.question}
          </ReactMarkdown>
        </div>

        <div className="grid gap-4 mb-6">
          {q.options.map((opt: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              disabled={showFeedback || selected !== null}
              className={`w-full py-3 px-4 rounded-lg border text-gray-700 font-medium transition-all
                ${
                  selected === opt
                    ? 'bg-indigo-100 border-indigo-500'
                    : 'bg-white border-gray-300 hover:bg-indigo-50'
                }
                ${showFeedback ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className="p-4 border-t border-gray-200 mt-4">
            <p
              className={`mb-2 text-lg font-semibold ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isCorrect ? (
                <span className="text-green-600 font-bold">✅ Correct!</span>
              ) : (
                <div>
                  <p className="text-red-600 font-bold">
                    ❌ Incorrect! Your answer: {userAnswer}.
                  </p>
                  <p>
                    <span className="text-green-600 font-bold">✅ Correct:</span>
                    <span className="text-blue-600 font-bold">
                      {' '}
                      {correctLetter}. {correctValue}
                    </span>
                  </p>
                </div>
              )}
            </p>
            <p className="mb-4 text-gray-700">
              📘 <strong>Explanation:</strong>{' '}
              <span className="inline">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {q.explanation}
                </ReactMarkdown>
              </span>
            </p>
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
            >
              {current < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        )}
      </div>

      
    </>
  );
}
