'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) return;
    router.push(`/test?name=${encodeURIComponent(name)}&domain=${encodeURIComponent(domain)}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4 sm:px-6 lg:px-8 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 text-center">Start Your Quiz</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          {/* Domain Dropdown */}
          <div className="relative">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1">Select Domain</label>
            <select
              value={domain}
              onChange={e => setDomain(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm sm:text-base"
            >
              <option value="">Select a domain</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="C#">C#</option>
              <option value="Data Structure Algorithm">DSA</option>
              <option value="TypeScript">TypeScript</option>
              <option value="SSC CGL">SSC Cgl</option>
              <option value="PHP">PHP</option>
              <option value="Swift">Swift</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
          >
            Start Quiz
          </button>

          {/* Extra spacing for mobile to avoid dropdown clipping */}
          <div className="h-12 sm:h-0" />
        </form>
      </div>
    </main>
  );
}
