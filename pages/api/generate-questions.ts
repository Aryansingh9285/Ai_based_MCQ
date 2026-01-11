import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Missing domain parameter' });
  }

  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(403).json({
      error: 'Invalid API Key',
      message: 'API key is not configured',
      solutions: [
        '1. Create a .env.local file in the project root',
        '2. Add: GEMINI_API_KEY=your_actual_api_key',
        '3. Get an API key from: https://makersuite.google.com/app/apikey'
      ]
    });
  }

  try {
    const prompt = `Generate 10 MCQ questions on "${domain}".

Format:
Question 1
What is [topic]?
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Answer: C
Explanation: Brief reason.

---

Keep answers concise.`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
      }
    );

    const fullText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!fullText || fullText.trim() === '') {
      return res.status(500).json({ error: 'Gemini returned empty response' });
    }

    // Parse the questions using the existing parseQuestions function
    const { parseQuestions } = require('@/lib/parseQuestions');
    const questions = parseQuestions(fullText);

    if (!questions || questions.length === 0) {
      return res.status(500).json({ 
        error: 'Failed to parse questions',
        details: 'No questions could be extracted from the API response'
      });
    }

    return res.status(200).json({ questions });
  } catch (error: any) {
    console.error('API Error:', error);

    // Handle specific Gemini API errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        status: 'QUOTA_EXCEEDED',
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again in a moment.',
        details: error.response?.data?.error?.message || 'API quota exceeded'
      });
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(403).json({
        error: 'Invalid API Key',
        message: 'Your API key is invalid or expired',
        solutions: [
          '1. Check your GEMINI_API_KEY in .env.local',
          '2. Get a new key from: https://makersuite.google.com/app/apikey',
          '3. Restart the dev server after updating the key'
        ]
      });
    }

    return res.status(500).json({
      error: 'Failed to generate questions',
      message: error.message,
      details: error.response?.data?.error?.message || 'Unknown error'
    });
  }
}
