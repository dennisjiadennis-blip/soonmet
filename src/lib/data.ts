export interface Activity {
  id: string;
  hostId: string;
  title: string;
  type: 'Coffee' | 'Art' | 'Shopping' | 'Food' | 'Walk' | 'Other';
  description: string;
  duration: string; // e.g., "2 hours"
  price?: number;
  imageUrl: string;
  tags?: string[];
  status?: 'draft' | 'pending' | 'active' | 'rejected';
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
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  instagramAnalysis?: {
    summary: string;
    vibeTags: string[];
    aesthetic: string;
  };
}

export const HOSTS: Host[] = [
  {
    id: "1",
    name: "Saki",
    role: "早稻田大学生",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
    tags: [
      "深夜食堂深度爱好者", "古着猎人", "昭和歌谣", "胶片摄影", 
      "纯喫茶巡礼", "黑胶唱片", "下北泽", "高圆寺", "城市漫游", "复古穿搭",
      "CityPop", "AnalogLife", "FilmCamera", "TokyoNight", "JazzBar",
      "HarukiMurakami", "CoffeeAddict", "VintageFashion", "VinylCollection",
      "HiddenGems", "UrbanExplorer", "Nostalgia", "TokyoStreets", "IndieMusic",
      "ArtHouseCinema", "SecondHandBooks", "RainyDays", "NeonLights", "SubwayTraveler"
    ],
    price: 2500,
    stories: "我喜欢在下课后去神保町的旧书店闲逛，或者在新宿御苑的草坪上发呆。我可以带你通过 Zoom 参观我在日比谷的工作室，或者聊聊我在新宿街头采访的趣事。",
    quirks: ["#深夜食堂深度爱好者", "#极简主义修行者", "#会一点古筝"],
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=3254&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516205651411-a416745265dd?q=80&w=3284&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=3336&auto=format&fit=crop",
    ],
    instagramAnalysis: {
      summary: "Saki is a true 'Retro Soul'. Her feed is a curated collection of Showa-era kissaten and 80s vinyls.",
      vibeTags: ["Vintage Hunter", "Analog Life", "City Pop"],
      aesthetic: "Warm Film Grain"
    },
    activities: [
      {
        id: "a1",
        hostId: "1",
        title: "下北泽古着店闲聊",
        type: "Shopping",
        description: "陪我一起挑衣服，聊聊最近的复古潮流，像朋友一样云逛街。",
        duration: "1.5 hours",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=3270&auto=format&fit=crop",
        tags: ["Vintage", "Fashion", "Tokyo Style", "Shopping", "Hidden Gems", "Sustainable", "Retro", "Styling", "Culture", "Walk", "ThriftShop", "OldSchool", "Trendy", "StreetWear", "Harajuku", "Shimokitazawa", "TreasureHunt", "UniqueFinds", "EcoFriendly", "SlowFashion"],
        status: 'active'
      },
      {
        id: "a2",
        hostId: "1",
        title: "旧书店的午后时光",
        type: "Walk",
        description: "分享一本我最近发现的绝版杂志，享受安静的阅读时光，聊聊喜欢的作家。",
        duration: "1 hour",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=3270&auto=format&fit=crop",
        tags: ["Books", "History", "Quiet", "Culture", "Art", "Walking", "Hidden Gems", "Photography", "Relaxing", "Intellectual", "Bookworm", "RareFinds", "Literature", "Jimbocho", "OldBooks", "Reading", "Atmosphere", "Nostalgic", "Peaceful", "CityWalk"]
      }
    ]
  },
  {
    id: "2",
    name: "Kenji",
    role: "传统漆器职人",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3387&auto=format&fit=crop",
    tags: [
      "极简主义修行者", "茶道", "禅宗", "传统工艺", "漆器", 
      "京都", "枯山水", "冥想", "手工", "职人精神"
    ],
    price: 2500,
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
        title: "午后的抹茶时光",
        type: "Coffee",
        description: "看我打抹茶，聊聊最近的生活感悟，享受片刻的宁静。",
        duration: "1 hour",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=3270&auto=format&fit=crop",
        tags: ["Tea Ceremony", "Matcha", "Zen", "Culture", "Meditation", "History", "Peaceful", "Traditional", "Art", "Wellness"]
      }
    ]
  },
  {
    id: "3",
    name: "Yuki",
    role: "独立摄影师",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=3387&auto=format&fit=crop",
    tags: [
      "胶片迷", "猫奴", "咖啡探店", "街头摄影", "赛博朋克", 
      "夜景", "霓虹灯", "建筑", "画廊", "暗房",
      "Cyberpunk", "StreetPhotography", "TokyoNeon", "CatLover", "CoffeeTime",
      "ArchitectureHunter", "VisualDiary", "Darkroom", "ArtGallery", "UrbanJungle",
      "NightCrawler", "CinematicLook", "FilmGrain", "ShibuyaCrossing", "TokyoTower",
      "ModernArt", "CreativeSoul", "Snapshot", "CandidMoments", "CityLights"
    ],
    price: 2500,
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
        title: "美术馆漫游与闲聊",
        type: "Art",
        description: "带你看看我喜欢的展品，随便聊聊艺术和生活，分享我的拍摄角度。",
        duration: "2 hours",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=3266&auto=format&fit=crop",
        tags: ["Art", "Museum", "Photography", "Culture", "Modern", "Design", "Inspiration", "Walking", "Architecture", "Creativity"]
      },
      {
        id: "a5",
        hostId: "3",
        title: "涩谷街头散步",
        type: "Walk",
        description: "陪我在涩谷街头散步，看看东京的霓虹灯，感受城市的脉搏。",
        duration: "1.5 hours",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3270&auto=format&fit=crop",
        tags: ["Photography", "Street", "Shibuya", "Skills", "Urban", "Neon", "Action", "Walking", "Tutorial", "Vibe"]
      }
    ]
  },
  {
    id: "4",
    name: "Hiro",
    role: "筑地市场买手",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
    tags: [
      "清酒品鉴", "凌晨四点的东京", "海鲜达人", "居酒屋", "寿司", 
      "筑地市场", "料理", "美食家", "刀工", "老铺",
      "SakeLover", "TsukijiMarket", "SushiMaster", "Foodie", "IzakayaHopping",
      "FreshSeafood", "CulinaryArts", "ChefLife", "TokyoGourmet", "EarlyRiser",
      "LocalFlavors", "TraditionalFood", "Umami", "Gastronomy", "FishMarket",
      "JapaneseCuisine", "Sashimi", "FoodCulture", "HiddenEats", "TasteOfJapan"
    ],
    price: 2500,
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
        title: "筑地市场的早晨",
        type: "Food",
        description: "带你看看我常去的海鲜摊位，聊聊今天的鱼获，感受市场的烟火气。",
        duration: "1 hour",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=3270&auto=format&fit=crop",
        tags: ["Food", "Sushi", "Market", "Local", "Fresh", "Culture", "Tour", "Culinary", "Taste", "Authentic", "Tsukiji", "Seafood", "TunaAuction", "StreetFood", "Gourmet", "FoodTour", "Delicious", "JapanEats", "LocalMarket", "FoodieHeaven"]
      }
    ]
  },
  {
    id: "5",
    name: "Taro",
    role: "相扑力士",
    imageUrl: "https://images.unsplash.com/photo-1574887427561-d3d5d58c9273?q=80&w=3270&auto=format&fit=crop",
    tags: [
      "相扑", "传统文化", "大力士", "美食", "居酒屋",
      "东京生活", "体育精神", "私密话题", "Sumo", "Tradition"
    ],
    price: 2500,
    stories: "我是现役相扑力士，训练之余最喜欢去隐秘的居酒屋享受美食。我可以带你了解相扑部屋的真实生活。",
    quirks: ["#食量惊人", "#相扑", "#居酒屋"],
    photos: [
      "https://images.unsplash.com/photo-1574887427561-d3d5d58c9273?q=80&w=3270&auto=format&fit=crop",
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
        title: "居酒屋的下班时光",
        type: "Food",
        description: "训练结束了，陪我喝一杯，聊聊相扑选手的日常八卦，分享私密生活。",
        duration: "2 hours",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1574887427561-d3d5d58c9273?q=80&w=3270&auto=format&fit=crop",
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
