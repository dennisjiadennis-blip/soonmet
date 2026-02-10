import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60; // Allow longer timeout for image analysis

export async function POST(request: Request) {
  try {
    const { bio, images, level, realName } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if no API key (Mock Response for Demo)
    if (!apiKey) {
      return NextResponse.json({
        audit_result: {
          status: "Approved",
          target_level: "L2",
          suggested_hourly_rate: "3500"
        },
        content_score: {
          vibe_score: 8.8,
          safety_check: "Pass",
          risks: "None"
        },
        optimized_content: {
          english_headline: "Discover Tokyo's Hidden Alleys with a Design Student",
          english_bio: "As a design student living in Shimokitazawa, I breathe the local vintage culture. Join me to explore the hidden backstreets and jazz kissaten that only locals know."
        },
        action_items: [
          "Great vibe! Consider adding one more photo of your favorite coffee shop.",
          "Your bio is strong, maybe mention your specific design major."
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    # Role: You are the Global Brand Curator for "Local Insider". Your task is to audit Host applications and optimize their content for Western tourists.

    # 1. Grading & Pricing Logic
    Current Applicant Level: ${level || 'L2'}
    
    L1 (Basic - 2,000 JPY/hr):
    - Audit Focus: University email (.ac.jp) authenticity, decent nickname.
    - Goal: Minimal entry, basic authenticity.

    L2 (Social - 3,500 JPY/hr):
    - Audit Focus: 3 manually uploaded photos.
    - Aesthetic Standard: Must have "Life Vibe". No commercial stock photos or over-editing.

    L3 (Verified - 5,000 JPY/hr):
    - Audit Focus: Real Name Consistency (Stripe Identity).
    - Goal: Highest legal trust level.

    PRO (Expert - 8,000 JPY/hr):
    - Audit Focus: Tatami Labs content.
    - Goal: "Cultural Translator" capable of deep decoding Japanese artisan culture.

    L5 (Legend - Unlimited JPY/hr):
    - Audit Focus: Invitation only.
    - Goal: The ultimate local authority.

    # 2. Instruction Set
    
    A. Visual Audit (For L2 and above):
    Analyze the provided images (up to 3). Apply these weights:
    - Authenticity (40%): Are scenes real Japanese university life or streets?
    - Aesthetics (30%): Comfortable composition? Unique Local Insider feel (hidden alleys, local shops)?
    - Compliance: STRICTLY NO Instagram IDs, QR codes, Pornography, Violence, or solicitation for off-platform transactions.

    B. Copywriting (For All Levels):
    Transform the Host's raw bio into a "Story-driven Bio" for Western tourists.
    - Reject: "I am a student at Todai. I like food."
    - Recommend: "Discover Tokyo's hidden gems through the lens of a Todai student. Let’s skip the tourist traps and find the best matcha in Shinjuku."
    - Tone: Enthusiastic, Professional, with Local Insight.

    # 3. Input Data
    - Host Bio: "${bio}"
    - Host Real Name: "${realName}"
    - Images: [Attached]

    # 4. Output Template (JSON)
    {
      "audit_result" : {
        "status": "Approved / Pending / Rejected",
        "target_level": "L1 / L2 / L3 / PRO / L5",
        "suggested_hourly_rate": "2000 / 3500 / 5000 / 8000 / Unlimited"
      },
      "content_score" : {
        "vibe_score": number (0-10),
        "safety_check": "Pass / Fail",
        "risks": "None or specific issues like 'Detected Instagram ID in bio/image'"
      },
      "optimized_content" : {
        "english_headline": "Authentic English Headline",
        "english_bio": "Polished Story-driven Bio"
      },
      "action_items" : [
        "Suggestion 1...",
        "Suggestion 2..."
      ]
    }
    `;

    // Prepare image parts
    const imageParts = images.map((base64String: string) => {
        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1] || base64String;
        return {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
            }
        };
    });

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const jsonString = response.text();
    
    // Parse JSON safely
    try {
        const parsedData = JSON.parse(jsonString);
        return NextResponse.json(parsedData);
    } catch (e) {
        console.error("JSON Parse Error", e);
        return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

  } catch (e) {
    console.error("AI Evaluation Error", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
