import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Review {
  text: string;
  author_name?: string;
  rating?: number;
  time?: number;
  [key: string]: unknown;
}

// Helper to fetch image and convert to base64 for Gemini
async function fetchImageForGemini(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    return {
      inlineData: {
        data: Buffer.from(arrayBuffer).toString('base64'),
        mimeType: response.headers.get('content-type') || 'image/jpeg',
      },
    };
  } catch (error) {
    console.warn("Image fetch failed for Gemini analysis:", error);
    return null;
  }
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { locationName, address, language, googleData, hostProfile, googlePhotos, tags, theme, notes } = body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Determine Target Language
    const targetLangName = language === 'ja' ? 'Japanese' : (language === 'zh' || language === 'zh-CN') ? 'Simplified Chinese' : 'English';
    
    if (!apiKey) {
       console.warn("GEMINI_API_KEY not found. Using Mock Data for demonstration.");
       // Don't return error, let it fall through to catch block which handles fallback
       // return NextResponse.json({ 
       //   error: "Configuration Error: GEMINI_API_KEY is missing on server.",
       //   details: "Please add GEMINI_API_KEY to your .env.local file."
       // }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey || "dummy_key");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Mode 1: Location Analysis (New Request)
    if (locationName && address) {
        
        // 1. Image Analysis Prep
        let imagePart = null;
        if (apiKey && googlePhotos && googlePhotos.length > 0) {
            // Try to fetch the first image
            imagePart = await fetchImageForGemini(googlePhotos[0]);
        }

        // 2. Host Persona Construction
        const hostName = hostProfile?.nickname || "Yuki";
        const hostAge = hostProfile?.age || "22";
        const hostGender = hostProfile?.gender || "Student";
        const hostIdentity = (hostProfile?.tags && hostProfile.tags.length > 0) ? hostProfile.tags.join(", ") : "Architecture Student";
        
        // Merge theme into tags for stronger AI context
        const combinedTags = [...(tags || [])];
        if (theme && !combinedTags.includes(theme)) {
            combinedTags.push(theme);
        }
        const locationTags = combinedTags.length > 0 ? combinedTags.join(", ") : "None";

        // Prepare Data for Prompt Injection
        const rating = googleData?.rating ? `${googleData.rating}` : "Unknown";
        
        let topReviews = "No reviews available.";
        if (googleData?.reviews && Array.isArray(googleData.reviews)) {
            topReviews = googleData.reviews
                .filter((r: { text: string }) => r.text && r.text.length > 10)
                .slice(0, 3)
                .map((r: { text: string }) => `- "${r.text.replace(/\n/g, ' ').substring(0, 100)}..."`)
                .join("\n");
        }

        const nearbyLandmarks = (googleData?.distance) ? `${address} (${googleData.distance})` : (address || "Tokyo");

        const prompt = `
# 1. 核心角色与任务 (Role & Mission)
你是一位精通全球城市文化与 SEO 写作的顶级旅游策展人。你的任务是根据 Host 提供的基础数据，结合 Google Maps 实时检索信息，生成一篇极具“本地灵魂”且逻辑严密的深度推荐文案。

# 2. 必须遵循的【前置校验流程】 (Pre-check Logic)
在动笔之前，你必须通过以下步骤进行行业核实，严禁跨类描述：

1. **行业判定**：根据 Google Maps Type (${googleData?.types?.join(", ") || "Unknown"}) 判定主行业（如：餐饮、零售、文化、休闲）。
2. **搜索对齐**：将 店名 (${locationName}) + 详细地址 (${address}) 放入搜索。如果搜索结果显示该地为“服装店”但用户标签选了“美食”，你必须优先以用户选择的标签为准。
3. **反差描述逻辑**：如果知名品牌（如 Y-3）在商场内经营跨界业务（如咖啡馆），文案必须明确指出这种“跨界身份”，避免用户走错。

# 3. 文案构建的五个维度 (Content Dimensions)
1. **品牌 DNA (20%)**：检索店名的背景（品牌历史、主理人哲学、标志性元素）。
2. **客观事实 (Data Grounding)**：包含 Google Maps 评分 (${rating}分)、高频评价关键词（如“蛋包饭绝赞”、“灯光昏暗适合约会”）、地址距离描述。
3. **视觉与氛围 (Sensory)**：描述装修材质（混凝土、雪松木）、灯光、背景音乐类型、店内常客的特征。
4. **Host 主观背书**：融合 Host 的职业背景（${hostIdentity}）与选中的 Strong Reasons（${locationTags}）。
5. **总结性赞美**：所有的形容词必须由前文的事实推导而来，禁止空洞吹捧。

# 4. 推荐理由标签 (Strong Reasons) 的处理逻辑
根据用户勾选的标签 (${locationTags})，自动调整文案语调：
- 若选 [Eye Candy / 时尚精]：语调变得时髦、大胆、关注人群质量。
- 若选 [Super Cheap / 性价比]：语调变得亲民、务实，强调“赚到了”的感觉。
- 若选 [Artisan / 匠人]：语调变得庄重、专业，强调材质、工艺和时间成本。
- 若选 [English Friendly]：必须在文案中强调“无障碍沟通”的安心感。

# 5. 输出结构要求 (Output Format)
请生成以下 JSON 格式的内容（不要使用 Markdown）：

**[SEO Title]**
格式：[地区] + [店名] + [核心 Strong Reason 关键词]

**[Lush Narrative]** (Description)
- **Hook (氛围引入)**：一句话勾勒画面。
- **The Vibe (空间描述)**：基于事实的空间拆解。
- **The Flavor/Craft (核心产品)**：基于搜索评论的具体细节。
- **Host's Verdict (主观推荐)**：体现 Host 身份价值的点评。

**[Smart Info]**
- **Location & Access**：地址及交通建议。
- **Best Vibe Time**：最佳到店时段。
- **Perfect For**：精准定位人群。

# 6. 变量注入 (Variables)
- {{google_map_rating}}: ${rating}
- {{top_3_reviews}}: 
${topReviews}
- {{nearby_landmarks}}: ${nearbyLandmarks}
- 文字总数：300字左右
- 输出语言：${targetLangName}

# Output Format (JSON Only)
Please output ONLY a JSON object with this structure:
{
  "price_estimate": "String (e.g., ¥1,000 - ¥2,000)",
  "visual_hook": "String (Short catchy sentence)",
  "description": "String (Full narrative including [SEO Title], [Lush Narrative] sections, and [Smart Info])",
  "tags": ["String"],
  "image_alts": ["String", "String", "String", "String", "String", "String"]
}
`;
        try {
            const parts = imagePart ? [prompt, imagePart] : [prompt];
            const result = await model.generateContent(parts);
            const response = await result.response;
            const text = response.text();
            
            // robust JSON extraction
            let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const start = jsonStr.indexOf('{');
            const end = jsonStr.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                jsonStr = jsonStr.substring(start, end + 1);
            }
            return NextResponse.json(JSON.parse(jsonStr));
        } catch (error) {
            console.error("Gemini API Failed, switching to Fallback Mock Data:", error);
            
            // FALLBACK MOCK DATA (Multilingual)
            const safeName = locationName || "this hidden gem";
            
            // Mock Image Sets for Variety
            const IMAGE_SETS = [
                [
                    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", // Indoor warm
                    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80", // Cocktail
                    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80", // Food
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", // Restaurant
                    "https://images.unsplash.com/photo-1554797589-7241bb691973?w=800&q=80", // Izakaya
                    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80"  // Chef
                ],
                [
                    "https://images.unsplash.com/photo-1540959733-3246671c662e?w=800&q=80", // Night
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", // Pizza/Food
                    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", // Plating
                    "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=800&q=80", // Table
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80", // Chef 2
                    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80"  // Coffee/Bar
                ],
                [
                    "https://images.unsplash.com/photo-1493936734716-77ba6da663d6?w=800&q=80", // Tea House
                    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80", // Japan Street
                    "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80", // Lanterns
                    "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=800&q=80", // Sushi
                    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80", // Ramen
                    "https://images.unsplash.com/photo-1569937756447-e1e3b4d66f53?w=800&q=80"  // Subway
                ]
            ];

            // Mock Templates Database
            const TEMPLATES = {
                ja: [
                    {
                        desc: `[SEO Title] 東京の隠れ家：${safeName}で過ごす昭和レトロな夜\n\n[Vibe Introduction] ${safeName}の古びた木の扉を開けると、そこはまるで昭和にタイムスリップしたかのような空間です。暖簾越しの柔らかな光が、訪れる人を優しく迎え入れてくれます。\n\n[The Story] この建物は築60年以上の古民家を改装したもので、天井の梁や柱は当時のまま残されています。レビューでも「まるで実家に帰ってきたようだ」と評される通り、店主の温かい人柄と煮込み料理の香りが、この場所独自の物語を紡いでいます。\n\n[Why Host Loves It] ${hostAge}歳の${hostGender}として建築を学ぶ私、${hostName}にとって、ここはデザインの宝庫。特に天井の梁の組み方は見事としか言いようがありません。私の「深夜の避難所」です。\n\n[Smart Info] 📍住所: ${address || "東京都内某所"} ({{DISTANCE_DATA}})\n🕰️ おすすめ時間: 19:00 - 22:00\n👥 こんな人に: レトロ好き、一人飲み`,
                        hook: `${safeName}の暖簾越しの柔らかな光`,
                        tip: "¥4,000",
                        alts: [`${safeName}の入り口`, "店内の様子", "おすすめ料理", "店主の笑顔", "古民家風の内装", "夜の雰囲気"],
                        images: IMAGE_SETS[0]
                    },
                    {
                         desc: `[SEO Title] モダンと伝統の融合：${safeName}で味わう至高の体験\n\n[Vibe Introduction] 打ちっ放しのコンクリートと温かい木材が融合した${safeName}。その洗練された空間は、現代的ながらもどこか懐かしさを感じさせ、心地よい緊張感を与えてくれます。\n\n[The Story] レビューで絶賛される「一口食べた瞬間に広がる出汁の香り」は、創業以来守り続けられた秘伝のレシピによるもの。都会の喧騒を忘れて、五感で楽しむ食のアートがここにあります。\n\n[Why Host Loves It] ${hostName}です。普段はデザインを勉強していますが、ここの照明設計にはいつもインスピレーションをもらっています。クリエイティブな刺激が欲しい時に必ず訪れる場所です。\n\n[Smart Info] 📍住所: ${address || "東京都内某所"} ({{DISTANCE_DATA}})\n🕰️ おすすめ時間: 平日のランチタイム\n👥 こんな人に: デザイン好き、美食家`,
                        hook: `${safeName}の洗練されたモダンな入口`,
                        tip: "¥5,000",
                        alts: [`${safeName}の外観`, "モダンな内装", "シェフの調理風景", "こだわりの器", "照明のディテール", "人気の席"],
                        images: IMAGE_SETS[1]
                    }
                ],
                zh: [
                    {
                        desc: `[SEO Title] 东京秘境：在${safeName}邂逅昭和时代的温柔\n\n[Vibe Introduction] 推开${safeName}那扇略显斑驳的木门，仿佛瞬间穿越回了昭和时代。夕阳洒在红砖外墙上，营造出一种温暖而怀旧的氛围。\n\n[The Story] 正如一位资深食客所说：“这里的空气里都弥漫着故事。”角落里那台老式黑胶唱机流淌出的爵士乐，配上招牌菜，让这里成为了都市传说中的“深夜食堂”。\n\n[Why Host Loves It] 我是${hostName}，一名${hostAge}岁的${hostIdentity}。对我来说，这里不仅仅是一家餐厅，更是灵感的源泉。我特别迷恋这里光影交错的氛围，是我的私藏好店。\n\n[Smart Info] 📍地址: ${address || "东京某处"} ({{DISTANCE_DATA}})\n🕰️ 建议时间: 傍晚时分\n👥 适合人群: 复古爱好者、摄影师`,
                        hook: `夕阳洒在${safeName}的红砖外墙上`,
                        tip: "¥4,000",
                        alts: [`${safeName}复古门面`, "内部光影", "招牌料理", "黑胶唱机", "窗边座位", "店主特调"],
                        images: IMAGE_SETS[0]
                    },
                     {
                        desc: `[SEO Title] 极简美学：${safeName}，都市中的隐世桃源\n\n[Vibe Introduction] ${safeName}采用了大面积的落地玻璃与原木结合，通透而温馨。每一个角落都透着店主的巧思，是现代和风美学的典范。\n\n[The Story] “不仅仅是食物，更是一种艺术体验。”这句评论精准概括了这里的精髓。隐于闹市的${safeName}，用极致的细节打造了一个让时间静止的空间。\n\n[Why Host Loves It] 嗨，我是${hostName}。作为一个对空间设计敏感的人，我不得不说，这里的动线设计简直是教科书级别的。这是我寻找内心平静的秘密基地。\n\n[Smart Info] 📍地址: ${address || "东京某处"} ({{DISTANCE_DATA}})\n🕰️ 建议时间: 下午2点后\n👥 适合人群: 极简主义者、独处`,
                        hook: `${safeName}通透温暖的玻璃幕墙`,
                        tip: "¥6,500",
                        alts: [`${safeName}玻璃外观`, "原木内饰", "精致摆盘", "开放式厨房", "隐秘包间", "夜景"],
                        images: IMAGE_SETS[1]
                    }
                ],
                en: [
                    {
                        desc: `[SEO Title] Tokyo Hidden Gem: A Nostalgic Night at ${safeName}\n\n[Vibe Introduction] Pushing open the weathered wooden door of ${safeName}, you are immediately transported back to the Showa era. The warm light spilling from the entrance welcomes you into a different world.\n\n[The Story] As one reviewer perfectly put it, "The air here is thick with stories." The jazz from the vintage vinyl player in the corner completes the perfect hideaway vibe, offering a unique slice of Tokyo history.\n\n[Why Host Loves It] I'm ${hostName}, a ${hostAge}-year-old ${hostIdentity}. For me, this isn't just a restaurant; it's a sanctuary of design. I'm obsessed with how the light plays off the cedar counters. It's my go-to spot for inspiration.\n\n[Smart Info] 📍Address: ${address || "Tokyo"} ({{DISTANCE_DATA}})\n🕰️ Best Time: After 7 PM\n👥 Best For: Solo travelers, History buffs`,
                        hook: `Warm light spilling from ${safeName}'s entrance`,
                        tip: "¥4,000",
                        alts: [`${safeName} entrance`, "Interior mood", "Signature dish", "Vinyl player", "Cozy corner", "Night view"],
                        images: IMAGE_SETS[0]
                    },
                    {
                        desc: `[SEO Title] Urban Oasis: The Modern Serenity of ${safeName}\n\n[Vibe Introduction] The contrast between the exposed concrete and warm timber at ${safeName} creates a strikingly modern yet cozy facade. It's a visual treat before you even step inside.\n\n[The Story] "The broth tastes like a warm hug." This review wasn't exaggerating. Tucked away in a quiet alley, ${safeName} offers a rare moment of stillness and culinary excellence in the bustling city.\n\n[Why Host Loves It] Hi, I'm ${hostName}. As someone studying design, I find the lighting arrangement here absolutely genius—it makes everyone look good. It's where I bring friends to impress them.\n\n[Smart Info] 📍Address: ${address || "Tokyo"} ({{DISTANCE_DATA}})\n🕰️ Best Time: Weekday Lunch\n👥 Best For: Design lovers, Foodies`,
                        hook: `The modern yet cozy facade of ${safeName}`,
                        tip: "¥5,000",
                        alts: [`${safeName} facade`, "Modern interior", "Chef at work", "Plating detail", "Lighting", "Busy atmosphere"],
                        images: IMAGE_SETS[1]
                    }
                ]
            };

            const langKey = (language === 'ja') ? 'ja' : (language === 'zh' || language === 'zh-CN') ? 'zh' : 'en';
            // Randomly select one template
            const templates = TEMPLATES[langKey] || TEMPLATES['en'];
            const selectedMock = templates[Math.floor(Math.random() * templates.length)];

            // Process Mock Data
            // 1. Inject Real Photos if available (Fixes "Images didn't change" issue)
            let finalImages = selectedMock.images || IMAGE_SETS[0];
            if (googlePhotos && Array.isArray(googlePhotos) && googlePhotos.length > 0) {
                // Use real Google Photos, supplemented by stock photos if needed
                finalImages = googlePhotos.slice(0, 6);
                if (finalImages.length < 6) {
                    const stockNeeded = 6 - finalImages.length;
                    finalImages = [...finalImages, ...IMAGE_SETS[0].slice(0, stockNeeded)];
                }
            }

            // 2. Inject Distance Data (Fixes "{{DISTANCE_DATA}}" placeholder)
            let distanceStr = "";
            if (googleData?.distance) {
                 // Use real calculated distance from frontend
                 // Expected format: "X mins walk from Y"
                 const match = googleData.distance.match(/(\d+)\s*mins?\s*walk\s*from\s*(.*)/i);
                 if (match) {
                     const mins = match[1];
                     const station = match[2];
                     const distanceText = {
                        ja: `${station}から徒歩${mins}分`,
                        zh: `距离${station}步行${mins}分钟`,
                        en: `${mins} min walk from ${station}`
                     };
                     distanceStr = distanceText[langKey as keyof typeof distanceText] || distanceText['en'];
                 } else {
                     distanceStr = googleData.distance;
                 }
            } else {
                // Mocking Distance Matrix API result for now
                const walkMins = Math.floor(Math.random() * 10) + 2; // Random 2-12 mins
                const distanceText = {
                    ja: `最寄り駅から徒歩${walkMins}分`,
                    zh: `距离最近车站步行${walkMins}分钟`,
                    en: `${walkMins} min walk from the nearest station`
                };
                distanceStr = distanceText[langKey as keyof typeof distanceText] || distanceText['en'];
            }

            let finalDesc = selectedMock.desc.replace(/{{DISTANCE_DATA}}/g, distanceStr);

            // 3. Inject Review Data (Real "Soul" from Google Reviews)
            if (googleData?.reviews && Array.isArray(googleData.reviews) && googleData.reviews.length > 0) {
                // Find a review with text
                const validReview = googleData.reviews.find((r: Review) => r.text && r.text.length > 10);
                if (validReview) {
                    let snippet = validReview.text.replace(/\n/g, ' ').substring(0, 60);
                    if (validReview.text.length > 60) snippet += "...";
                    
                    // Replace the hardcoded quote in [Soul] section
                    // Matches "..." or 「...」
                    if (langKey === 'en') {
                         finalDesc = finalDesc.replace(/"[^"]*"/, `"${snippet}"`);
                    } else {
                         finalDesc = finalDesc.replace(/「[^」]*」/, `「${snippet}」`);
                    }
                }
            }

            return NextResponse.json({
                price_estimate: selectedMock.tip || "¥4,000 - ¥6,000 /人",
                visual_hook: selectedMock.hook,
                description: finalDesc,
                tags: ["Locals' Favorite", "Artisan & Culture", "Hidden Gem", "Photography Spot"],
                image_alts: selectedMock.alts || [`${safeName} view 1`, `${safeName} view 2`, "Interior", "Food detail", "Entrance", "Atmosphere"],
                images: finalImages
            });
        }
    }

    // Mode 2: Existing Guide Creation (Fallback)
    if (notes) {
         const prompt = `
      # Role 
      You are a Senior Product Operations Expert. Transform these notes into a Bókun API v2 product.
      
      # Input Notes
      "${notes}"

      # Output Format (Strict JSON)
      {
        "externalName": "...",
        "shortDescription": "...",
        "description": "...",
        "highlights": ["..."],
        "hostProfile": "...",
        "itinerary": []
      }
    `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return NextResponse.json(JSON.parse(text));
    }

    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });

  } catch (error: unknown) {
    console.error("AI Parse Error:", error);
    
    // Check for specific API activation error
    const err = error as { message?: string };
    if (err.message?.includes("Generative Language API has not been used") || err.message?.includes("SERVICE_DISABLED")) {
        return NextResponse.json({
            error: "Google Gemini API Not Enabled",
            details: "Please enable the API here: https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview"
        }, { status: 403 });
    }

    // Return actual error to client for debugging
    return NextResponse.json({ 
        error: "AI Generation Failed", 
        details: error.message || String(error) 
    }, { status: 500 });
  }
}
