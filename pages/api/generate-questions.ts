import type { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; // ✅ safer
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { domain } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!domain) {
    return res.status(400).json({ error: "Missing domain" });
  }

  try {
    const prompt = `
Generate 20 multiple-choice questions suitable for technical interviews at companies like Google, Amazon, or Meta in the domain: ${domain}.

Each question must:
- Have 4 options (A-D)
- Include a correct answer (A/B/C/D only)
- Include a brief explanation

📌 If the question has code, wrap it inside triple backticks for markdown like this:
\`\`\`js
console.log("example");
\`\`\`

📄 Format exactly like:
Question: What will this code output?

\`\`\`js
let x = 1;
console.log(x++);
\`\`\`

A) 0  
B) 1  
C) undefined  
D) NaN  
Answer: B  
Explanation: \`x++\` returns the value before incrementing.

Now begin. Format all 20 questions in this structure. No intro, no notes.
`;

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
      }),
    });

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
