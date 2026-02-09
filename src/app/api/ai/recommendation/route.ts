import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { locationName, address, tags, googleTypes } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        recommendation: "Welcome to this amazing spot! As a local student, I love the vibe here. It's perfect for hanging out and experiencing the real Tokyo. (Mock AI Response)"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are a local "Host Twin" (a digital twin of a local university student guide).
      Generate a short, engaging "Host Recommendation" for the following location.
      
      Location: ${locationName}
      Address: ${address}
      Tags: ${tags?.join(', ') || 'General'}
      Google Types: ${googleTypes?.join(', ') || ''}
      
      Constraint:
      - Max 100 words.
      - Tone: Enthusiastic, personal, "in-the-know", student vibe.
      - Mention specific vibe or why it fits the tags (e.g., if "Anime", mention the selection).
      - If you know this place from your training data, use that knowledge.
      
      Output JSON format:
      {
        "recommendation": "..."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 });
  }
}
