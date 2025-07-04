import type { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = "AIzaSyBFOWlEtR9Inlve93rsR5cuTKFUO01LvAI";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { domain } = JSON.parse(req.body || "{}");
  if (!domain) {
    return res.status(400).json({ error: "Missing domain" });
  }

  try {
    const prompt = `Generate 20 multiple choice questions suitable for technical interviews at top tech companies (like FANG) for the domain: ${domain}. Each question should have 4 options, the correct answer, and a brief explanation. The questions should cover a range of difficulty and important topics relevant to interviews.\n\nFormat:\nQuestion: ...\nA) ...\nB) ...\nC) ...\nD) ...\nAnswer: ...\nExplanation: ...\n\nNow generate 20 questions for the domain: ${domain} in the above format. Do not include any extra commentary or answers in the output except as specified in the format.`;

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
      return res
        .status(500)
        .json({ error: "Gemini API error", details: error });
    }

    const geminiData = await geminiRes.json();
    // Extract the generated text from Gemini's response
    const content =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      geminiData?.candidates?.[0]?.content?.text ||
      "";

    if (!content) {
      return res.status(500).json({ error: "No content returned from Gemini" });
    }

    res.status(200).json({ content });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gemini API error", details: (error as Error).message });
  }
}
