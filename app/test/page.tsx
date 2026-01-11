'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { parseQuestions } from '@/lib/parseQuestions';
import { getMockQuestions } from '@/lib/mockQuestions';
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
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ domain }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('API Error:', errorData);

          if (res.status === 429 || errorData.status === 'QUOTA_EXCEEDED') {
            console.log('Using mock questions due to quota limit');
            const mockQuestions = getMockQuestions(domain);
            setQuestions(mockQuestions);
            setError(null);
            return;
          } else if (res.status === 403 || errorData.error === 'Invalid API Key') {
            const solutions = errorData.solutions ? errorData.solutions.join('\n\n') : 'Please set up your API key in .env.local';
            setError(
              `🔑 API Key Error\n\n${errorData.message || 'Your API key is missing or invalid.'}\n\nSolutions:\n${solutions}`
            );
            throw new Error(`API Error: ${errorData.error}`);
          } else {
            setError(
              `Failed to load questions: ${errorData.error}\n${errorData.message || ''}\n\nDetails: ${errorData.details || ''}`
            );
            throw new Error(`API Error: ${errorData.error}`);
          }
        }

        const data = await res.json();

        if (typeof data.content === 'string') {
          const parsed = parseQuestions(data.content);
          
          if (!parsed || parsed.length === 0) {
            console.error('Parsing failed. Using mock questions instead.');
            const mockQuestions = getMockQuestions(domain);
            setQuestions(mockQuestions);
            return;
          }
          
          if (parsed.length < 10) {
            console.warn(`⚠️ Only ${parsed.length} questions parsed, expected ~20`);
          }
          
          setQuestions(parsed);
        } else {
          setError('Invalid response format from API. Expected text content.');
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        // Use mock questions as fallback
        const mockQuestions = getMockQuestions(domain);
        setQuestions(mockQuestions);
      } finally {
        setLoading(false);
      }
    }
    if (hydrated) fetchQuestions();
  }, [domain, hydrated]);

  const handleSelectAnswer = (questionIndex: number, selectedOption: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setShowFeedback(false);
    }
  };

  const handleSubmit = () => {
    // Convert answers to detailed format for assessment
    const detailedAnswers = questions.map((q, idx) => {
      const selectedOption = answers[idx];
      const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
      
      let correctIndex = -1;
      let correctValue = q.answer;
      
      // If answer is a letter (A, B, C, D), get the actual option text
      if (q.answer && optionLetters.includes(q.answer.toUpperCase())) {
        correctIndex = optionLetters.indexOf(q.answer.toUpperCase());
        if (correctIndex >= 0 && correctIndex < q.options.length) {
          correctValue = q.options[correctIndex];
        }
      } else {
        // If answer is already text, find it in options
        correctIndex = q.options.findIndex(
          (opt: string) => opt && opt.trim().toLowerCase() === (q.answer ? q.answer.trim().toLowerCase() : '')
        );
        if (correctIndex >= 0) {
          correctValue = q.options[correctIndex];
        }
      }

      // Compare selected answer with correct answer
      const isCorrect = selectedOption && correctValue && 
        selectedOption.trim().toLowerCase() === correctValue.trim().toLowerCase();

      return {
        question: q.question,
        selectedOption: selectedOption || 'Not answered',
        correctOption: correctValue || q.answer,
        isCorrect: isCorrect || false,
        explanation: q.explanation,
      };
    });

    router.push(
      `/assessment?name=${name}&domain=${domain}&answers=${encodeURIComponent(
        JSON.stringify(detailedAnswers)
      )}`
    );
  };

  if (!hydrated) return null;

  // Show error state
  if (error) {
    const isQuotaError = error.includes('Quota') || error.includes('QUOTA');
    const isKeyError = error.includes('API Key') || error.includes('unauthorized');
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
        <div className="max-w-2xl w-full bg-white border-2 border-red-500 rounded-lg p-8 shadow-lg">
          <div className="text-6xl mb-4 text-center">
            {isQuotaError ? '💰' : isKeyError ? '🔑' : '❌'}
          </div>
          <h2 className="text-3xl font-bold text-red-700 mb-2 text-center">
            {isQuotaError ? 'API Quota Exceeded' : isKeyError ? 'API Configuration Error' : 'Unable to Load Questions'}
          </h2>
          <p className="text-gray-600 text-center mb-6">Please follow the solutions below:</p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-red-800 whitespace-pre-wrap font-mono text-sm">{error}</p>
          </div>

          {isQuotaError && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
              <p className="text-blue-900 font-semibold mb-2">✅ Quick Fixes:</p>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>1. Visit: <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Google Cloud Console</a></li>
                <li>2. Enable billing for your project</li>
                <li>3. Wait for free tier quota reset (usually next calendar month)</li>
                <li>4. Or upgrade to a paid plan: <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">AI Studio Pricing</a></li>
              </ul>
            </div>
          )}

          {isKeyError && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
              <p className="text-blue-900 font-semibold mb-2">✅ Quick Fixes:</p>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>1. Get a free API key: <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">ai.google.dev</a></li>
                <li>2. Create <code className="bg-white px-2 py-1 rounded">.env.local</code> in your project root</li>
                <li>3. Add: <code className="bg-white px-2 py-1 rounded">GEMINI_API_KEY=your_key_here</code></li>
                <li>4. Restart your development server</li>
              </ul>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length && loading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <HamsterWheel />
        <p className="text-gray-700 mt-4 text-lg">Loading questions...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">No questions loaded.</p>
          <p className="text-sm text-gray-500 mt-2">Please try again or refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  if (current >= questions.length) {
    setCurrent(0);
    return null;
  }

  const q = questions[current];
  const selectedAnswer = answers[current];
  
  // Determine if answer is correct
  let isCorrect = false;
  let correctAnswer = '';
  if (selectedAnswer && showFeedback) {
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    let correctIndex = -1;
    let correctValue = q.answer;
    
    // If answer is a letter (A, B, C, D), get the actual option text
    if (q.answer && optionLetters.includes(q.answer.toUpperCase())) {
      correctIndex = optionLetters.indexOf(q.answer.toUpperCase());
      if (correctIndex >= 0 && correctIndex < q.options.length) {
        correctValue = q.options[correctIndex];
      }
    } else {
      // If answer is already text, find it in options
      correctIndex = q.options.findIndex(
        (opt: string) => opt && opt.trim().toLowerCase() === (q.answer ? q.answer.trim().toLowerCase() : '')
      );
      if (correctIndex >= 0) {
        correctValue = q.options[correctIndex];
      }
    }
    
    correctAnswer = correctValue || '';
    isCorrect = selectedAnswer && correctAnswer && 
      selectedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {domain} Assessment
              </h1>
              <p className="text-gray-600 mt-1">Test for {name}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-600">
                {current + 1}
              </div>
              <div className="text-gray-600 text-sm">of {questions.length}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* Question Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {current + 1}. {q.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {q.options.slice(0, 4).map((option: string, idx: number) => {
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();

              return (
                <button
                  key={idx}
                  onClick={() => !showFeedback && handleSelectAnswer(current, option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    showFeedback
                      ? isCorrectOption
                        ? 'border-green-500 bg-green-50'
                        : isSelected && !isCorrect
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-gray-50'
                      : isSelected
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        showFeedback
                          ? isCorrectOption
                            ? 'bg-green-500 text-white'
                            : isSelected && !isCorrect
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isCorrectOption && showFeedback && isCorrect ? '✓' : isSelected && showFeedback && !isCorrect ? '✗' : optionLetter}
                    </div>
                    <div className="flex-grow pt-1">
                      <p
                        className={`text-lg ${
                          showFeedback
                            ? isCorrectOption
                              ? 'text-green-900 font-semibold'
                              : isSelected && !isCorrect
                              ? 'text-red-900 font-semibold'
                              : 'text-gray-700'
                            : isSelected
                            ? 'text-indigo-900 font-semibold'
                            : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {showFeedback && selectedAnswer && (
            <div className={`p-6 rounded-lg border-2 mb-6 ${
              isCorrect
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}>
              <div className="mb-4">
                {isCorrect ? (
                  <p className="text-2xl font-bold text-green-600">✅ Correct!</p>
                ) : (
                  <div>
                    <p className="text-2xl font-bold text-red-600">❌ Incorrect</p>
                    <p className="text-red-700 mt-2">Your answer: <span className="font-semibold">{selectedAnswer}</span></p>
                    <p className="text-green-700 mt-2">Correct answer: <span className="font-semibold">{correctAnswer}</span></p>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-gray-300 pt-4">
                <p className="text-gray-800">
                  <strong>📘 Explanation:</strong>
                </p>
                <p className="text-gray-700 mt-2 leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          {/* Previous and Next Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={current === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                current === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              ← Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!showFeedback}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  !showFeedback
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!showFeedback}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  !showFeedback
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Submit Quiz ✓
              </button>
            )}
          </div>

          {/* Question Number Navigation - All 20 Questions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Go to Question:</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrent(idx);
                    setShowFeedback(answers[idx] ? true : false);
                  }}
                  className={`w-full aspect-square rounded-lg font-bold transition-all text-sm flex items-center justify-center ${
                    idx === current
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : answers[idx]
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                  title={`Question ${idx + 1}${answers[idx] ? ' (Answered)' : ''}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Unanswered Questions Warning */}
        {Object.keys(answers).length < questions.length && (
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800">
              ⚠️ You have answered {Object.keys(answers).length} out of {questions.length} questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

