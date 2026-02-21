const express = require("express");
const router = express.Router();

const { GoogleGenAI } =require('@google/genai');
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


router.post("/suggest", async (req, res) => {
  try {
    const { partialText } = req.body;

    if (!partialText || partialText.trim().length <= 5) {
      return res.json({ suggestion: null });
    }

    const prompt = `
You are an AI that completes chat messages.

User message:
"${partialText}"

Task:
Return only ONE short natural continuation for this message.

Rules:
- Maximum 12 words
- Do NOT explain anything
- Do NOT add quotes
- Do NOT return multiple options
- Only return the continuation text
`;

     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const suggestion = response.text.trim();

    return res.json({ suggestion });
  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    res.status(500).json({ suggestion: null });
  }
});

module.exports = router;
