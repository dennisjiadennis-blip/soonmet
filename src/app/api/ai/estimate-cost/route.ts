import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { locationName, address, city } = body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        estimatedCost: 1500,
        currency: "JPY",
        explanation: "Mock estimate (API Key missing). Assumed average cafe price."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are a local travel expert in ${city || "Japan"}.
      Please estimate the average cost per person for a visit to the following location:
      
      Location: ${locationName}
      Address: ${address}
      
      Return a JSON object with:
      - "minCost": number (in JPY)
      - "maxCost": number (in JPY)
      - "averageCost": number (in JPY)
      - "currency": "JPY"
      - "explanation": "Brief reason for the estimate (e.g., 'Typical lunch set price', 'Entrance fee + drink')"
      
      If the location is free (like a park or street), cost should be 0.
      If unknown, make a reasonable guess based on the type of place (e.g., Cafe ~1000-1500, Shrine ~0-500).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Cost Estimation Error:", error);
    // Fallback to mock data
    return NextResponse.json({
      estimatedCost: 1500,
      currency: "JPY",
      explanation: "Mock estimate (AI Unavailable). Assumed average price."
    });
  }
}
