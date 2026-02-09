import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { tags, city, audience, stops } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if no API key
    if (!apiKey) {
      return NextResponse.json({
        candidates: [
          {
            title: "Tokyo Hidden Bar Hopping with Local Student",
            seoLogic: "Includes City (Tokyo), Experience (Bar Hopping), Identity (Local Student), Hook (Hidden).",
            psychologicalHook: "Appeals to desire for exclusivity and authentic connection.",
            emoji: "🍻 🤫"
          },
          {
            title: "Authentic Tokyo Ramen Hunt: Campus Vibes & Local Eats",
            seoLogic: "Keywords: Authentic, Ramen Hunt, Campus Vibes, Local Eats.",
            psychologicalHook: "Promises a non-touristy, student-led food adventure.",
            emoji: "🍜 🎓"
          },
          {
            title: "Secret Akihabara Geek Tour by University Insider",
            seoLogic: "Target: Geek/Akihabara. Identity: University Insider. Hook: Secret.",
            psychologicalHook: "Insider access to subculture.",
            emoji: "🎮 🤓"
          },
          {
            title: "Local Buddy's Guide to Shimokitazawa Vintage Shops",
            seoLogic: "Location: Shimokitazawa. Activity: Vintage Shops. Identity: Local Buddy.",
            psychologicalHook: "Friendly, casual shopping experience.",
            emoji: "👗 🧥"
          },
          {
            title: "Non-commercial Tokyo Night Walk: Neon & Alleys",
            seoLogic: "Value: Non-commercial. Experience: Night Walk. Keywords: Tokyo, Alleys.",
            psychologicalHook: "Anti-tourism trap appeal.",
            emoji: "🌃 🚶"
          }
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    let stopsDesc = "";
    if (Array.isArray(stops) && stops.length > 0) {
       if (typeof stops[0] === 'string') {
          stopsDesc = stops.join(', ');
       } else {
          // Rich object structure
          stopsDesc = stops.map((s: { name: string; features?: string | string[] }) => 
            `${s.name} [Features: ${Array.isArray(s.features) ? s.features.join(',') : s.features || ''}]`
          ).join('; ');
       }
    }

    const prompt = `
# Role: You are a local insider for the travel platform "soonmet". Your goal is to turn "Strong Reasons" into persuasive copy.

# Task:
Analyze the provided {{Strong Reasons}} (Tags) and create 5 distinct title candidates that strictly align with the specific vibe of the selected tags.
Focus on the 4 core dimensions:
1. "Taste & Price" (Sensory & Value)
2. "People & Vibe" (Social & Emotional)
3. "Design & Pedigree" (Aesthetic & Intellectual)
4. "Experience & Utility" (Functional & Unique)

# Reason-Driven Hooks:
- If "Taste & Price" tags (e.g., Super Cheap, Insanely Fresh) are present: Focus on the "win-win" value or extreme sensory stimulation.
- If "People & Vibe" tags (e.g., Eye Candy, Super Friendly Owner) are present: Focus on the human connection, social atmosphere, or "who is there".
- If "Design & Pedigree" tags (e.g., Legendary Designer, Brutalist) are present: Use a professional, reverent tone. Focus on history, aesthetics, and rational depth.
- If "Experience & Utility" tags (e.g., Perfect for Solo, Best Sunset) are present: Focus on the specific utility or unique situational value.

# The "Why" Logic:
Connect the Host's identity (e.g., University Student / Local Insider) to the specific reason.
(e.g., "As a student, the 'Super Cheap' tag here isn't just a label—it's my daily survival secret.")

# Input Data:
- **Strong Reasons (Tags)**: ${tags}
- **Stops/Spots**: ${stopsDesc}
- **City**: ${city || "Tokyo"}
- **Target Audience**: ${audience || "Global Gen Z / Millennials"}

# Output Format:
Provide 5 candidates in a JSON Array. Each object must follow this structure:
[
  {
    "title": "[SEO Title] (Must include the strongest reason)",
    "seoLogic": "[The Local Secret] (Why this reason matters to locals)",
    "psychologicalHook": "[Host's Personal Verdict] (A concluding praise based on the tags)",
    "emoji": "Relevant Emoji"
  }
]

# Constraints:
- Keep it direct and "street-smart". No generic tourist fluff.
- Title Length: 50-75 characters.
- NO "Best", "Top", "Amazing". Use specific descriptors.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from text (in case it's wrapped in markdown code blocks)
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candidates = JSON.parse(jsonStr).map((c: any) => c.replace(/^["']|["']$/g, '').trim());

    return NextResponse.json({ candidates });
    
  } catch (error) {
    console.error("AI Title Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate titles" }, { status: 500 });
  }
}
