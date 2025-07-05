'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !domain) return;
    router.push(`/test?name=${encodeURIComponent(name)}&domain=${encodeURIComponent(domain)}`);
  };

  const domainEmojis = {
    'JavaScript': '🚀',
    'Python': '🐍',
    'Java': '☕',
    'C++': '⚡',
    'C#': '💎',
    'Data Structure Algorithm': '🧮',
    'TypeScript': '📘',
    'SSC CGL': '📚',
    'PHP': '🐘',
    'Swift': '🍎'
  };

  return (
    <>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -top-8 -right-8 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative w-full py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center animate-spin-slow">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight animate-pulse">FANG Quiz App</h1>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="animate-bounce">🤖</span>
            <span className="text-sm font-medium">AI Interview Practice</span>
          </div>
        </div>
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-1/4 w-2 h-2 bg-white rounded-full animate-float"></div>
          <div className="absolute top-8 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute bottom-4 left-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full animate-float animation-delay-2000"></div>
        </div>
      </header>

      <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-4 sm:px-6 lg:px-8 overflow-auto">
        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
          <div className="absolute top-40 right-32 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-twinkle animation-delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-twinkle animation-delay-2000"></div>
          <div className="absolute top-32 right-20 w-0.5 h-0.5 bg-blue-300 rounded-full animate-twinkle animation-delay-3000"></div>
        </div>

        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 space-y-6 transform hover:scale-105 transition-all duration-300">
          {/* Magical glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl opacity-20 animate-pulse"></div>
          
          <div className="relative">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-bounce">
                <span className="text-2xl">🎉</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                Start Your Quiz Adventure!
              </h1>
              <p className="text-gray-600 mt-2 animate-fade-in">Ready to ace your next interview? Let's go! 🚀</p>
            </div>

            <div className="space-y-6">
              {/* Name Input */}
              <div className="relative">
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">👤</span>
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your awesome name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-sm sm:text-base ${
                      focusedField === 'name' 
                        ? 'border-purple-500 shadow-lg shadow-purple-200 scale-105' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  />
                  {focusedField === 'name' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-bounce">
                      ✨
                    </div>
                  )}
                </div>
              </div>

              {/* Domain Dropdown */}
              <div className="relative">
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">🎯</span>
                  Select Your Challenge
                </label>
                <div className="relative">
                  <select
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    onFocus={() => setFocusedField('domain')}
                    onBlur={() => setFocusedField('')}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-white text-sm sm:text-base cursor-pointer ${
                      focusedField === 'domain' 
                        ? 'border-purple-500 shadow-lg shadow-purple-200 scale-105' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <option value="">Choose your superpower 🦸‍♂️</option>
                    {Object.entries(domainEmojis).map(([key, emoji]) => (
                      <option key={key} value={key}>
                        {emoji} {key}
                      </option>
                    ))}
                  </select>
                  {focusedField === 'domain' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-bounce">
                      ⚡
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl transform transition-all duration-300 text-sm sm:text-base hover:shadow-2xl hover:scale-105 active:scale-95 ${
                    isHovered ? 'animate-pulse' : ''
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Launch Quiz Adventure!</span>
                    <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                      ✨
                    </span>
                  </div>
                </button>
              </form>

              {/* Motivational message */}
              <div className="text-center">
                <p className="text-gray-600 text-sm animate-fade-in">
                  💪 You've got this! Every expert was once a beginner 🌟
                </p>
              </div>

              {/* Extra spacing for mobile */}
              <div className="h-12 sm:h-0" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center text-sm border-t">
        <div className="flex items-center justify-center space-x-2 animate-fade-in">
          <span>© {new Date().getFullYear()} FANG Quiz App. Made with</span>
          <span className="text-red-500 animate-heartbeat">❤️</span>
          <span>by</span>
          <span className="text-pink-400 font-semibold animate-pulse">Aryan Singh</span>
          <span>for amazing learners like you!</span>
          <span className="animate-wave">👋</span>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}