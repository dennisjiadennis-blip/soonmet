export interface RouteNode {
  startTime: string; // e.g., "14:00"
  endTime: string; // e.g., "15:00"
  locationName: string;
  coordinates: { lat: number, lng: number };
  description: string;
  imageUrl: string;
  tags: string[]; // e.g., "Vintage", "Photography", "Private"
  googleMapLink?: string;
  localAppeal?: string; // Generated "Local Appeal" text
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  content: string;
}

export interface Activity {
  id: string;
  hostId: string;
  title: string;
  type: 'Coffee' | 'Art' | 'Shopping' | 'Food' | 'Walk' | 'Other';
  description: string;
  duration: string; // e.g., "3 hours"
  price: number; // Total Host Fee (calculated from pricePerHour * duration hours)
  pricePerHour?: number; // e.g., 4000
  estimatedExpenseCap?: number; // e.g., 2000 (Expenses paid by guest, cap estimate)
  currency?: string; // default "JPY"
  imageUrl: string;
  location: string; // e.g., "Shinjuku", "Omotesando"
  nextAvailable: string; // e.g., "Tomorrow 14:00"
  tags?: string[];
  routeNodes?: RouteNode[]; // Added RouteNodes
  publishStatus?: 'published' | 'draft';
  availability?: 'available' | 'booked';
}

export interface Host {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  tags: string[];
  price: number;
  stories: string;
  quirks: string[];
  photos: string[];
  activities: Activity[];
  instagramAnalysis?: {
    summary: string;
    vibeTags: string[];
    aesthetic: string;
  };
  nationality: string;
  gender: string;
  languages: string[];
  age?: string;
  uniquePassions?: string;
  guidePath?: string;
  translationSupport?: boolean;
  expectations?: string;
  exchange?: string;
  socialVision?: string;
  productTitle?: string;
  offerTitle?: string;
  offerDescription?: string;
  hostTags?: string[];
  guestTags?: string[];
  dailyVibe?: string[];
  zoomMeeting?: boolean;
  zoomPrice?: number;
  reviews?: Review[];
}

export const HOSTS: Host[] = [
  {
    id: "yoko",
    name: "Yoko Yamazaki",
    role: "前电通创意总监 / 文化策展人",
    age: "30s",
    nationality: "Japan",
    gender: "Female",
    languages: ["Japanese", "French", "English"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2776&auto=format&fit=crop",
    zoomMeeting: true,
    zoomPrice: 1500,
    dailyVibe: [
        "reading a 1920s diplomatic diary in a hidden cafe",
        "observing the architecture of the French embassy",
        "sorting through old letters from Paris"
    ],
    tags: [
      "优雅的外交官", "历史解码者", "跨文化缪斯"
    ],
    productTitle: "The Diplomat's Shadow: Decoding Tokyo's Hidden Power Games\n外交官的影子：解码东京隐秘的权力游戏",
    offerTitle: "This Week: The Forbidden Showa Mansion / 本周特供：那座地图上消失的昭和洋馆",
    offerDescription: "Deep in the Hiroo embassy enclave, there is a residence that has refused interviews for 50 years. I have the key. We will not just visit; we will decipher the unspoken rules of the aristocracy hidden in the lintels.",
    hostTags: ["文化转译者", "审美标杆", "职人魂", "探索者"],
    guestTags: ["多元文化背景", "交换思想", "同好中人"],
    price: 8000,
    stories: "我曾驻派巴黎五年，沉迷于寻找东京与巴黎的隐秘镜像。我不做导游，我做文化的翻译官。",
    uniquePassions: "我对“和洋折衷”建筑背后的权力博弈有着近乎偏执的研究。不要只看表面的红砖，我要带你看明治维新时期，那些被刻意隐藏的欧洲野心与日本武士精神的拉扯。",
    guidePath: "带你走进広尾（Hiroo）大使馆区不对外开放的“飞地”。我们会穿过一条只有外交官才知道的捷径，探访一座隐藏在森林里的昭和初期洋馆，最后在一家没有招牌的会员制 Jazz Bar，喝一杯以“大正浪漫”命名的鸡尾酒。",
    translationSupport: true,
    expectations: "希望你是一个对世界充满好奇的“文化杂食者”。无论你是来自纽约的设计师，还是上海的诗人，只要你愿意剥开城市的表皮，寻找肌理。",
    exchange: "这不仅是单向的输出。我分享东京的隐秘历史，你分享你所在城市的边缘故事。我们交换的不是景点，是看待世界的视角。",
    socialVision: "让两个小时的散步，成为一段跨越国界的智识友谊的开始。",
    quirks: ["#法式日语", "#建筑侦探", "#会员制玩家"],
    reviews: [
      {
        id: "r1",
        authorName: "Sarah M.",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        date: "October 2023",
        content: "Yoko is absolutely brilliant. The embassy walk was unlike anything I've done in Tokyo. She knows so much hidden history!"
      },
      {
        id: "r2",
        authorName: "David Chen",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        date: "September 2023",
        content: "Not just a tour, but a deep cultural conversation. Yoko's perspective on 'Wa-Yo Setchu' architecture changed how I see the city."
      }
    ],
    photos: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2776&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=3254&auto=format&fit=crop"
    ],
    instagramAnalysis: {
      summary: "Yoko is the bridge between Edo and Paris. Her feed is a sophisticated blend of architectural details and diplomatic soirées.",
      vibeTags: ["Culture Bridge", "Hidden History", "Diplomat Style"],
      aesthetic: "Sophisticated & Intellectual"
    },
    activities: [
      {
        id: "a-yoko-1",
        hostId: "yoko",
        title: "大使馆区的隐秘散步",
        type: "Walk",
        description: "避开游客，潜入东京最国际化却最封闭的街区，解读建筑背后的外交风云。",
        duration: "2 hours",
        price: 8000,
        estimatedExpenseCap: 1500,
        location: "Hiroo, Tokyo",
        nextAvailable: "Sat, 14:00",
        imageUrl: "https://images.unsplash.com/photo-1522547902298-51560486758e?q=80&w=3270&auto=format&fit=crop",
        tags: ["History", "Architecture", "Hidden Gems", "Luxury", "Walking", "Culture", "Diplomacy", "Stories"]
      }
    ]
  },
  {
    id: "juri",
    name: "Juri",
    role: "Visual Artist / Street Photographer",
    nationality: "Japan",
    gender: "Female",
    languages: ["Japanese", "English"],
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2940&auto=format&fit=crop",
    zoomMeeting: true,
    zoomPrice: 1500,
    dailyVibe: [
        "developing black & white film in a darkroom",
        "hunting for light leaks in Shibuya alleyways",
        "discussing cinematic color grading"
    ],
    tags: [
      "Photography", "Visual Art", "Hidden Gems", "Creative", "Walking", "Camera", "Vintage",
      "Cinema", "Aesthetics", "StreetSnap", "Shinjuku", "Darkroom"
    ],
    productTitle: "Tokyo Analog Underground: Vintage Gear & Hidden Jazz",
    offerTitle: "This Week: Private Studio Session",
    offerDescription: "A rare chance to visit a private editing studio and discuss visual aesthetics.",
    hostTags: ["Visual Storyteller", "Creative Soul"],
    guestTags: ["Photographers", "Art Lovers"],
    price: 9000,
    stories: "I see Tokyo not as a city, but as a series of movie sets. Let me show you the angles only locals know.",
    uniquePassions: "Visual storytelling through light and shadow. I love finding beauty in the mundane 'gap' spaces of Tokyo.",
    guidePath: "From vintage camera shops to hidden rooftop views.",
    translationSupport: true,
    expectations: "Bring your camera or just your eyes. Be ready to look up and down, not just ahead.",
    exchange: "I'll share my visual language; you share your perspective.",
    socialVision: "Connecting through the shared language of imagery.",
    quirks: ["#FilmIsAlive", "#ChasingLight", "#NoFilter"],
    photos: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552355554-15f914b18c66?q=80&w=3387&auto=format&fit=crop"
    ],
    instagramAnalysis: {
      summary: "Juri's world is high-contrast black and white. She finds art in urban decay.",
      vibeTags: ["Street Photography", "Monochrome", "Urban Art"],
      aesthetic: "High Contrast & Gritty"
    },
    activities: [
      {
        id: "a-juri-1",
        hostId: "juri",
        title: "Shinjuku Visual Walk: Light & Shadows",
        type: "Art",
        description: "A photographer's walk through the back alleys of Shinjuku, focusing on visual storytelling and hidden spots.",
        duration: "3 hours",
        price: 9000,
        pricePerHour: 3000,
        estimatedExpenseCap: 2000,
        location: "Shinjuku, Tokyo",
        nextAvailable: "Sun, 15:00",
        imageUrl: "https://images.unsplash.com/photo-1552355554-15f914b18c66?q=80&w=3387&auto=format&fit=crop",
        tags: ["Photography", "Visual Art", "Hidden Gems", "Creative", "Walking", "Camera", "Vintage"],
        publishStatus: 'published',
        availability: 'available',
        routeNodes: [
          {
            startTime: "14:00",
            endTime: "15:00",
            locationName: "Kitamura Camera (Vintage Floor)",
            coordinates: { lat: 35.6915, lng: 139.7034 },
            description: "We start at the legendary vintage camera floor. I'll show you how to check lens condition and spot rare Leica bodies.",
            imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=3000&auto=format&fit=crop",
            tags: ["Vintage", "Photography", "Tech"],
            googleMapLink: "https://maps.app.goo.gl/example1",
            localAppeal: "A pilgrimage site for camera lovers, but few know about the 'Junk' corner where treasures hide."
          },
          {
            startTime: "15:00",
            endTime: "16:30",
            locationName: "Hidden Private Editing Room",
            coordinates: { lat: 35.6920, lng: 139.7040 },
            description: "A friend's private editing studio tucked away in a residential building. We can discuss color grading and visual aesthetics in a quiet, creative space.",
            imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=3512&auto=format&fit=crop",
            tags: ["Private", "Studio", "Visual Art", "Deep Talk"],
            googleMapLink: "https://maps.app.goo.gl/example2",
            localAppeal: "Normally accessible only to industry professionals. A rare chance to see a working Tokyo creative space."
          },
          {
            startTime: "16:30",
            endTime: "17:00",
            locationName: "Kagurazaka 'No Sign' Tea House",
            coordinates: { lat: 35.7010, lng: 139.7400 },
            description: "Ending at a tea house with no signboard. The lighting here perfectly demonstrates the concept of 'Ma' (negative space).",
            imageUrl: "https://images.unsplash.com/photo-1595244195277-28562649a5b3?q=80&w=3464&auto=format&fit=crop",
            tags: ["Hidden", "Cafe", "Aesthetics", "Chill"],
            googleMapLink: "https://maps.app.goo.gl/example3",
            localAppeal: "The ultimate 'hideout' for Tokyo creatives. The light in the late afternoon is magical."
          }
        ]
      }
    ]
  },
  {
    id: "kenji",
    name: "Kenji",
    role: "传统漆器职人",
    nationality: "Japan",
    gender: "Male",
    languages: ["Japanese"],
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3387&auto=format&fit=crop",
    zoomMeeting: false,
    dailyVibe: [
        "polishing a lacquer bowl in silence",
        "meditating in the garden while the tea water boils",
        "sketching a new design inspired by moss"
    ],
    tags: [
      "极简主义修行者", "茶道", "禅宗", "传统工艺", "漆器", 
      "京都", "枯山水", "冥想", "手工", "职人精神"
    ],
    offerTitle: "This Week: The Silence of Zen",
    expectations: "Can you sit in silence for 5 minutes?",
    price: 5000,
    stories: "在这个快节奏的时代，我坚持用最传统的方式制作漆器。希望能通过屏幕，让你感受到器物的温度。",
    quirks: ["#极简主义", "#职人精神", "#抹茶控"],
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3387&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604606775515-c21d8995393a?q=80&w=3270&auto=format&fit=crop"
    ],
    instagramAnalysis: {
      summary: "Kenji embodies 'Zen Minimalism'. His posts reflect deep appreciation for craftsmanship and quiet moments.",
      vibeTags: ["Zen Master", "Craftsmanship", "Tea Ceremony"],
      aesthetic: "Clean & Natural"
    },
    activities: [
      {
        id: "a3",
        hostId: "2",
        title: "云端茶道体验",
        type: "Coffee",
        description: "虽然无法亲手为你点茶，但我会演示完整的茶道礼仪，并教你如何在家打出一碗完美的抹茶。",
        duration: "1 hour",
        price: 6000,
        estimatedExpenseCap: 500,
        location: "Kyoto (Online)",
        nextAvailable: "Daily, 10:00",
        imageUrl: "https://images.unsplash.com/photo-1545652985-5edd39d27575?q=80&w=3270&auto=format&fit=crop",
        tags: ["Tea Ceremony", "Matcha", "Zen", "Culture", "Meditation", "History", "Peaceful", "Traditional", "Art", "Wellness"]
      }
    ]
  },
  {
    id: "3",
    name: "Yuki",
    role: "独立摄影师",
    nationality: "Japan",
    gender: "Female",
    languages: ["Japanese", "English"],
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=3387&auto=format&fit=crop",
    tags: [
      "胶片迷", "猫奴", "咖啡探店", "街头摄影", "赛博朋克", 
      "夜景", "霓虹灯", "建筑", "画廊", "暗房",
      "Cyberpunk", "StreetPhotography", "TokyoNeon", "CatLover", "CoffeeTime",
      "ArchitectureHunter", "VisualDiary", "Darkroom", "ArtGallery", "UrbanJungle",
      "NightCrawler", "CinematicLook", "FilmGrain", "ShibuyaCrossing", "TokyoTower",
      "ModernArt", "CreativeSoul", "Snapshot", "CandidMoments", "CityLights"
    ],
    price: 4000,
    stories: "用胶片记录东京的每一个清晨和黄昏。如果你也喜欢摄影，我们可以一起聊聊构图和光影。",
    quirks: ["#胶片摄影", "#街头摄影", "#咖啡重度依赖"],
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=3387&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2564&auto=format&fit=crop"
    ],
    instagramAnalysis: {
      summary: "Yuki's feed is a 'Visual Diary' of Tokyo's streets. High contrast B&W shots mixed with vibrant neon nights.",
      vibeTags: ["Street Snapper", "Neon Hunter", "Urban Explorer"],
      aesthetic: "High Contrast B&W"
    },
    activities: [
      {
        id: "a4",
        hostId: "3",
        title: "六本木森美术馆导览",
        type: "Art",
        description: "一起参观最新的现代艺术展，我会分享我对每件作品的理解和拍摄角度。",
        duration: "2 hours",
        price: 5000,
        estimatedExpenseCap: 2500,
        location: "Roppongi, Tokyo",
        nextAvailable: "Fri, 18:00",
        imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=3266&auto=format&fit=crop",
        tags: ["Art", "Museum", "Photography", "Culture", "Modern", "Design", "Inspiration", "Walking", "Architecture", "Creativity"]
      },
      {
        id: "a5",
        hostId: "3",
        title: "涩谷街头摄影教学",
        type: "Walk",
        description: "我会带着相机走在涩谷街头，通过 Zoom 镜头教你如何捕捉瞬息万变的街头瞬间。",
        duration: "1.5 hours",
        price: 4500,
        estimatedExpenseCap: 1000,
        location: "Shibuya, Tokyo",
        nextAvailable: "Sat, 16:00",
        imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3270&auto=format&fit=crop",
        tags: ["Photography", "Street", "Shibuya", "Skills", "Urban", "Neon", "Action", "Walking", "Tutorial", "Vibe"]
      }
    ]
  },
  {
    id: "4",
    name: "Hiro",
    role: "筑地市场买手",
    nationality: "Japan",
    gender: "Male",
    languages: ["Japanese"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
    tags: [
      "清酒品鉴", "凌晨四点的东京", "海鲜达人", "居酒屋", "寿司", 
      "筑地市场", "料理", "美食家", "刀工", "老铺",
      "SakeLover", "TsukijiMarket", "SushiMaster", "Foodie", "IzakayaHopping",
      "FreshSeafood", "CulinaryArts", "ChefLife", "TokyoGourmet", "EarlyRiser",
      "LocalFlavors", "TraditionalFood", "Umami", "Gastronomy", "FishMarket",
      "JapaneseCuisine", "Sashimi", "FoodCulture", "HiddenEats", "TasteOfJapan"
    ],
    price: 4500,
    stories: "我在筑地市场工作了十年，知道哪里有最新鲜的海鲜和最好喝的清酒。",
    quirks: ["#海鲜达人", "#清酒", "#早起冠军"],
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582236528752-6e21b033d838?q=80&w=3270&auto=format&fit=crop"
    ],
    instagramAnalysis: {
      summary: "Hiro is the 'Insider of Tsukiji'. His stories are filled with fresh catch of the day and hidden izakayas.",
      vibeTags: ["Foodie Insider", "Early Bird", "Sake Sommelier"],
      aesthetic: "Authentic & Raw"
    },
    activities: [
      {
        id: "a6",
        hostId: "4",
        title: "筑地市场云试吃",
        type: "Food",
        description: "带你逛真正的筑地场外市场，看刚刚切开的金枪鱼，教你如何挑选顶级食材。",
        duration: "1 hour",
        price: 4500,
        estimatedExpenseCap: 3000,
        location: "Tsukiji, Tokyo",
        nextAvailable: "Mon, 09:00",
        imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=3270&auto=format&fit=crop",
      tags: ["Food", "Sushi", "Market", "Local", "Fresh", "Culture", "Tour", "Culinary", "Taste", "Authentic", "Tsukiji", "Seafood", "TunaAuction", "StreetFood", "Gourmet", "FoodTour", "Delicious", "JapanEats", "LocalMarket", "FoodieHeaven"]
      }
    ]
  },
  {
    id: "5",
    name: "Taro",
    role: "相扑力士",
    nationality: "Japan",
    gender: "Male",
    languages: ["Japanese"],
    imageUrl: "https://tmp-file-server-79040334887.us-central1.run.app/1737035345705-188610582-74d32a89-0824-4f05-b04b-324b1154563a.jpg",
    tags: [
      "相扑", "传统文化", "大力士", "美食", "居酒屋",
      "东京生活", "体育精神", "私密话题", "Sumo", "Tradition"
    ],
    price: 10000,
    stories: "我是现役相扑力士，训练之余最喜欢去隐秘的居酒屋享受美食。我可以带你了解相扑部屋的真实生活。",
    quirks: ["#食量惊人", "#相扑", "#居酒屋"],
    photos: [
      "https://tmp-file-server-79040334887.us-central1.run.app/1737035345705-188610582-74d32a89-0824-4f05-b04b-324b1154563a.jpg",
      "https://images.unsplash.com/photo-1582457601170-65f5a2d677a2?q=80&w=3000&auto=format&fit=crop"
    ],
    instagramAnalysis: {
      summary: "Taro offers a rare glimpse into the world of Sumo. His feed is full of training sessions and massive meals.",
      vibeTags: ["Sumo Life", "Big Eater", "Tradition"],
      aesthetic: "Powerful & Raw"
    },
    activities: [
      {
        id: "a7",
        hostId: "5",
        title: "相扑运动员一起居酒屋",
        type: "Food",
        description: "讲述相扑运动员的私密生活，带你体验只有力士才知道的隐秘菜单。",
        duration: "2 hours",
        price: 23000,
        estimatedExpenseCap: 5000,
        location: "Ryogoku, Tokyo",
        nextAvailable: "Tue, 19:00",
        imageUrl: "https://tmp-file-server-79040334887.us-central1.run.app/1737035345705-188610582-74d32a89-0824-4f05-b04b-324b1154563a.jpg",
        tags: ["Sumo", "Izakaya", "Food", "Culture", "Private", "Talk", "Dinner", "Japan", "Unique", "Experience"]
      }
    ]
  }
];

export function getHostById(id: string): Host | undefined {
  return HOSTS.find(host => host.id === id);
}

export function getAllActivities(): Activity[] {
  return HOSTS.flatMap(host => host.activities);
}
