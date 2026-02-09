/* eslint-disable */
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function parseGuide(rawText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an expert Airbnb Experience curator. 
    Task: Parse the following unstructured travel guide notes into a structured JSON object for an Airbnb Experience listing.
    
    Notes: "${rawText}"
    
    Requirements:
    1. title: Catchy, includes "Vibe" or "Hidden", max 50 chars.
    2. description: Story-telling style, inviting, professional English.
    3. location: Specific area (e.g., Shinjuku, Shibuya).
    4. price_jpy: Extract price in JPY (number only). If missing, default to 2500.
    5. duration_mins: Estimate duration in minutes (number only). Default to 120 if unclear.
    
    Output strictly valid JSON with no markdown formatting.
    Format:
    {
      "title": "string",
      "description": "string",
      "location": "string",
      "price_jpy": number,
      "duration_mins": number
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Clean up
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  
  return JSON.parse(text);
}

// Allow running directly
if (require.main === module) {
  const notes = process.argv[2] || "Midnight Tokyo walking tour in Shinjuku, around 3000 yen, 2 hours";
  parseGuide(notes).then(console.log).catch(console.error);
}

module.exports = { parseGuide };
