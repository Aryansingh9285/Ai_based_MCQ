'use client';

import { useEffect, useState } from 'react';

export default function AssessmentPage() {
  const [hydrated, setHydrated] = useState(false);
  const [summary, setSummary] = useState('');
  const [parsedAnswers, setParsedAnswers] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [celebrationMode, setCelebrationMode] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      // Get real data from URL params
      const searchParams = new URLSearchParams(window.location.search);
      const nameParam = searchParams.get('name') || '';
      const domainParam = searchParams.get('domain') || '';
      const answersParam = searchParams.get('answers') || '';
      setName(nameParam);
      setDomain(domainParam);

      let parsed = [];
      try {
        parsed = JSON.parse(answersParam);
        setParsedAnswers(parsed);
      } catch {
        setParsedAnswers([]);
      }

      if (answersParam && domainParam && nameParam) {
        fetch('/api/generate-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameParam,
            domain: domainParam,
            answers: parsed,
          }),
        })
          .then(res => res.json())
          .then(data => {
            setSummary(data.content);
            setShowResults(true);
            setCelebrationMode(true);
            setTimeout(() => setCelebrationMode(false), 3000);
          })
          .catch(() => {
            setSummary('Failed to load assessment.');
            setShowResults(true);
          });
      }
    }
  }, [hydrated]);

  // Animate answers one by one
  useEffect(() => {
    if (parsedAnswers.length > 0) {
      const interval = setInterval(() => {
        setCurrentAnswerIndex(prev => {
          if (prev < parsedAnswers.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [parsedAnswers]);

  if (!hydrated) return null;

  const getDomainEmoji = (domain: string) => {
    const emojis = {
      'JavaScript': '🚀',
      'Python': '🐍',
      'Java': '☕',
      'C++': '⚡',
      'C#': '💎',
      'TypeScript': '📘',
      'React': '⚛️'
    };
    return emojis[domain] || '🎯';
  };

  // Calculate correct and wrong counts
  const correctCount = parsedAnswers.filter(
    (ans: any) => ans?.isCorrect === true
  ).length;
  const wrongCount = parsedAnswers.filter(
    (ans: any) => ans?.isCorrect === false
  ).length;
  const chosenOptions = parsedAnswers.map(
    (ans: any, idx: number) =>
      typeof ans === 'object' && ans.chosenOption
        ? `${idx + 1}) ${ans.chosenOption}`
        : typeof ans === 'object' && ans.text
        ? `${idx + 1}) ${ans.text}`
        : `${idx + 1}) ${ans}`
  );

  return (
    <>
      {/* Celebration confetti background */}
      {celebrationMode && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-confetti-1"></div>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-confetti-2"></div>
          <div className="absolute top-0 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-confetti-3"></div>
          <div className="absolute top-0 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-confetti-4"></div>
          <div className="absolute top-0 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-confetti-5"></div>
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-red-400 rounded-full animate-confetti-6"></div>
        </div>
      )}

      {/* Animated background */}
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
          <div className="absolute top-40 right-32 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-twinkle animation-delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-twinkle animation-delay-2000"></div>
          <div className="absolute top-32 right-20 w-0.5 h-0.5 bg-blue-300 rounded-full animate-twinkle animation-delay-3000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto p-6 pt-12">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full mb-6 animate-bounce-slow">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-slide-up">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Amazing Work,
              </span>
              <br />
              <span className="text-white animate-pulse">{name}!</span>
            </h1>
            <div className="flex items-center justify-center space-x-2 text-xl text-gray-200 animate-fade-in animation-delay-1000">
              <span>{getDomainEmoji(domain)}</span>
              <span className="italic font-semibold">{domain}</span>
              <span>Assessment Complete</span>
              <span className="animate-bounce">✨</span>
            </div>
          </div>

          {/* Results Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-8 animate-scale-in animation-delay-500">
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      i <= currentAnswerIndex ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Your Answers Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin-slow">
                  <span className="text-2xl">📝</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Your Answers
                  <span className="ml-3 text-lg font-medium text-gray-500">
                    ({parsedAnswers.length} attempted)
                  </span>
                </h2>
              </div>

              {/* Correct/Wrong Count */}
              <div className="flex items-center justify-center gap-6 mb-2">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <span className="text-2xl">✅</span>
                  <span>{correctCount} Correct</span>
                </div>
                <div className="flex items-center gap-2 text-red-600 font-semibold">
                  <span className="text-2xl">❌</span>
                  <span>{wrongCount} Wrong</span>
                </div>
              </div>
              {/* Show all chosen options */}
              {/* <div className="text-center text-gray-700 text-base mb-4">
                <span className="font-semibold">Your chosen options:</span>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {chosenOptions.map((opt, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 rounded px-2 py-1 text-sm border border-gray-300"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div> */}

              <div className="space-y-4">
                {parsedAnswers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`transform transition-all duration-700 ${
                      idx <= currentAnswerIndex 
                        ? 'translate-x-0 opacity-100' 
                        : 'translate-x-full opacity-0'
                    }`}
                  >
                    {/* Correct answer style */}
                    {ans?.isCorrect !== false ? (
                      <div className="bg-gradient-to-r from-green-100 to-blue-50 rounded-2xl p-4 border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce-gentle">
                            {idx + 1}
                          </div>
                          <div className="flex-1 flex items-center">
                            <span className="text-2xl mr-2">✅</span>
                            <p className="text-gray-800 font-medium">{typeof ans === 'object' ? ans.text : ans}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Wrong answer style
                      <div className="bg-gradient-to-r from-red-100 to-yellow-50 rounded-2xl p-4 border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce-gentle">
                            {idx + 1}
                          </div>
                          <div className="flex-1 flex items-center">
                            <span className="text-2xl mr-2">❌</span>
                            <p className="text-gray-800 font-medium">{typeof ans === 'object' ? ans.text : ans}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Results */}
            {showResults && (
              <div className="animate-fade-in-up">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-heartbeat">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-800">Your Performance Summary</h3>
                  </div>
                  
                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: summary || 'Loading your amazing results...' }}
                  />
                </div>
              </div>
            )}

            {/* Motivational Footer */}
            <div className="text-center pt-6 border-t border-gray-200 animate-fade-in animation-delay-3000">
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                <span className="animate-bounce">🌟</span>
                <span className="font-semibold">Keep learning, keep growing!</span>
                <span className="animate-bounce animation-delay-500">🚀</span>
              </div>
              <p className="text-sm text-gray-500">
                Every step forward is a step toward achieving something bigger and better than your current situation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti-1 {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes confetti-2 {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(-720deg); opacity: 0; }
        }
        @keyframes confetti-3 {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(540deg); opacity: 0; }
        }
        @keyframes confetti-4 {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(-540deg); opacity: 0; }
        }
        @keyframes confetti-5 {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes confetti-6 {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(-360deg); opacity: 0; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes slide-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-confetti-1 { animation: confetti-1 3s ease-out; }
        .animate-confetti-2 { animation: confetti-2 3s ease-out 0.2s; }
        .animate-confetti-3 { animation: confetti-3 3s ease-out 0.4s; }
        .animate-confetti-4 { animation: confetti-4 3s ease-out 0.6s; }
        .animate-confetti-5 { animation: confetti-5 3s ease-out 0.8s; }
        .animate-confetti-6 { animation: confetti-6 3s ease-out 1s; }
        
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 1s ease-out; }
        .animate-scale-in { animation: scale-in 0.8s ease-out; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-heartbeat { animation: heartbeat 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </>
  );
}