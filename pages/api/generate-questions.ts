import type { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; // ✅ use a valid URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { domain } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!domain) {
    return res.status(400).json({ error: "Missing domain" });
  }

  try {
    const prompt = `
Generate 20 multiple-choice questions suitable for updated technical interviews at companies like Google, Amazon, or Meta or Indian origin company  in the domain: ${domain}.

Generate **20 up-to-date**, **FAANG-level** multiple-choice questions for the technical domain: "${domain}".

Questions should be suitable for **onsite or phone interviews** at top tech companies (Google, Amazon, Meta, Netflix, Apple, Microsoft).

Instructions:
- Each question must have 4 answer options: A, B, C, D
- Clearly mark the correct answer as: **Answer: A** (just the letter)
- Include a brief, **technical** explanation (2–3 lines)
- Cover a mix of difficulty levels: easy (5), medium (10), hard (5)
- Questions should reflect **real-world system design**, **data structures**, **algorithms**, or relevant concepts based on the domain

If code is needed, wrap it like:
\`\`\`js
// Your code
\`\`\`

📝 Format Example:
Question: What is the output of the following JavaScript code?
\`\`\`js
let a = [1, 2, 3];
a.length = 0;
console.log(a);
\`\`\`
A) [1, 2, 3]  
B) [0, 0, 0]  
C) []  
D) undefined  
Answer: C  
Explanation: Setting \`length = 0\` clears the array.

💡 Do not include intro text, summaries, or closing remarks. Start directly with the first question.
`;

    const geminiRes = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const error = await geminiRes.text();
      return res.status(500).json({ error: "Gemini API error", details: error });
    }

    const geminiData = await geminiRes.json();

    const content =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      geminiData?.candidates?.[0]?.content?.text ||
      "";

    if (!content) {
      return res.status(500).json({ error: "No content returned from Gemini" });
    }

    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({
      error: "Gemini API error",
      details: (error as Error).message,
    });
  }
}
