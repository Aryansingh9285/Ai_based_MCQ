import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, domain, answers } = req.body;

  if (!name || !domain || !answers) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const prompt = `A user named "${name}" took a 20-question technical interview-style quiz on "${domain}" and gave these answers: ${answers.join(
      ', '
    )}.\n\nPlease provide a performance analysis in the following format:\n1. Write a short, clear summary paragraph (3-5 sentences) about the user's overall knowledge level in ${domain}, based on their answers.\n2. List 3-5 key topics or concepts the user should focus on to improve, as bullet points.\n3. List 3-5 actionable suggestions for how the user can improve in these areas, as bullet points.\n4. Do NOT provide the correct answers to the quiz or repeat the questions.\n5. The analysis should be suitable for someone preparing for FANG-level interviews.`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY!,
        },
      }
    );

    const fullText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!fullText || fullText.trim() === '') {
      return res.status(500).json({ error: 'Gemini returned empty response.' });
    }

    // Trim out extra disclaimer if present
    const startIndex = fullText.indexOf('1. **Summary:**');
    const endIndex = fullText.indexOf('**Important Disclaimer:**');
    const trimmed = startIndex !== -1 ? fullText.slice(startIndex, endIndex !== -1 ? endIndex : undefined) : fullText;

    const lines = trimmed.split('\n').filter(line => line.trim() !== '');

    let html = '<div class="space-y-6 text-gray-800 leading-relaxed">';
    let listStarted = false;

    for (let line of lines) {
      line = line.trim();

      // Numbered section headings (e.g., 1. **Summary:**)
      if (/^\d+\.\s+\*\*(.+?)\*\*/.test(line)) {
        if (listStarted) {
          html += '</ul>';
          listStarted = false;
        }
        const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*/);
        const headingText = match ? match[1].trim() : line;
        html += `<h2 class="text-2xl font-bold text-indigo-800 mt-8 mb-2">${headingText}</h2>`;
        continue;
      }

      // Bullet list items
      if (line.startsWith('*')) {
        if (!listStarted) {
          html += '<ul class="list-disc pl-6 space-y-1">';
          listStarted = true;
        }
        const content = line.replace(/^\*+/, '').trim();
        html += `<li>${content}</li>`;
        continue;
      }

      // Markdown-style bold subheadings
      if (line.startsWith('**') && line.endsWith('**')) {
        if (listStarted) {
          html += '</ul>';
          listStarted = false;
        }
        const heading = line.replace(/\*\*/g, '');
        html += `<h3 class="text-lg font-semibold text-gray-900 mt-4">${heading}</h3>`;
        continue;
      }

      // Plain paragraph
      if (listStarted) {
        html += '</ul>';
        listStarted = false;
      }
      html += `<p>${line}</p>`;
    }

    if (listStarted) html += '</ul>';
    html += '</div>';

    return res.status(200).json({ content: html });
  } catch (error: any) {
    console.error('Gemini API error:', error.response?.data || error.message || error);
    return res.status(500).json({ error: 'Failed to generate assessment' });
  }
}
