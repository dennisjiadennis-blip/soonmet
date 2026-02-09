
export interface ThemeTag {
  id: string;
  category: "Taste & Price" | "People & Vibe" | "Design & Pedigree" | "Experience & Utility";
  label: {
    en: string;
    zh: string;
    ja: string;
  };
  value: string;
  description?: {
    en: string;
    zh: string;
    ja: string;
  };
}

export const THEME_TAGS: ThemeTag[] = [
  // 1. 饮食与味觉 (Taste & Price)
  {
    id: "super_cheap",
    category: "Taste & Price",
    label: {
      en: "Super Cheap (Under 1000¥)",
      zh: "Super Cheap (Under 1000¥) - 价格极低",
      ja: "Super Cheap (Under 1000¥)"
    },
    value: "Super Cheap (Under 1000¥)",
    description: {
      en: "Extremely affordable options with great value.",
      zh: "价格极低，性价比之王。",
      ja: "コスパ最強、1000円以下。"
    }
  },
  {
    id: "insanely_fresh",
    category: "Taste & Price",
    label: {
      en: "Insanely Fresh",
      zh: "Insanely Fresh - 食材极致新鲜",
      ja: "Insanely Fresh"
    },
    value: "Insanely Fresh",
    description: {
      en: "Ingredients are insanely fresh, like direct from Tsukiji.",
      zh: "食材极致新鲜（如筑地直发）。",
      ja: "市場直送、極上の鮮度。"
    }
  },
  {
    id: "authentic_local",
    category: "Taste & Price",
    label: {
      en: "Authentic Local Taste",
      zh: "Authentic Local Taste - 纯正本地口味",
      ja: "Authentic Local Taste"
    },
    value: "Authentic Local Taste",
    description: {
      en: "Pure local taste, no tourist trap interference.",
      zh: "纯正本地口味，无旅游团干扰。",
      ja: "観光客向けではない、本物の地元の味。"
    }
  },
  {
    id: "spicy_lovers",
    category: "Taste & Price",
    label: {
      en: "Spicy Lovers",
      zh: "Spicy Lovers - 无辣不欢",
      ja: "Spicy Lovers"
    },
    value: "Spicy Lovers",
    description: {
      en: "Must-visit for spicy food lovers.",
      zh: "无辣不欢。",
      ja: "激辛好きにはたまらない。"
    }
  },
  {
    id: "masterpiece_dish",
    category: "Taste & Price",
    label: {
      en: "Masterpiece Dish",
      zh: "Masterpiece Dish - 必点招牌菜",
      ja: "Masterpiece Dish"
    },
    value: "Masterpiece Dish",
    description: {
      en: "A signature dish that amazes with one bite.",
      zh: "必点招牌菜，一口惊艳。",
      ja: "一口で感動する至高の逸品。"
    }
  },
  {
    id: "generous_portions",
    category: "Taste & Price",
    label: {
      en: "Generous Portions",
      zh: "Generous Portions - 份量大",
      ja: "Generous Portions"
    },
    value: "Generous Portions",
    description: {
      en: "Huge portions, a paradise for meat lovers.",
      zh: "份量大，肉食者天堂。",
      ja: "ボリューム満点、肉好きの天国。"
    }
  },
  {
    id: "hidden_culinary_gem",
    category: "Taste & Price",
    label: {
      en: "Hidden Culinary Gem",
      zh: "Hidden Culinary Gem - 隐藏美味",
      ja: "Hidden Culinary Gem"
    },
    value: "Hidden Culinary Gem",
    description: {
      en: "Delicious food known only to local foodies.",
      zh: "只有本地老饕知道的隐藏美味。",
      ja: "地元の食通のみぞ知る隠れた名店。"
    }
  },

  // 2. 人物与社交 (People & Vibe)
  {
    id: "eye_candy",
    category: "People & Vibe",
    label: {
      en: "Eye Candy (Staff/Guests)",
      zh: "Eye Candy (Staff/Guests) - 养眼的店员或常客",
      ja: "Eye Candy (Staff/Guests)"
    },
    value: "Eye Candy (Staff/Guests)",
    description: {
      en: "Good-looking staff or regular customers.",
      zh: "养眼的店员或常客（直白表达）。",
      ja: "美男美女のスタッフや常連客。"
    }
  },
  {
    id: "super_friendly_owner",
    category: "People & Vibe",
    label: {
      en: "Super Friendly Owner",
      zh: "Super Friendly Owner - 店主超级健谈",
      ja: "Super Friendly Owner"
    },
    value: "Super Friendly Owner",
    description: {
      en: "Owner is super talkative and personable.",
      zh: "店主超级健谈、有人情味。",
      ja: "人情味あふれる話し好きな店主。"
    }
  },
  {
    id: "language_friendly",
    category: "People & Vibe",
    label: {
      en: "English/Chinese Friendly",
      zh: "English/Chinese Friendly - 无语言障碍",
      ja: "English/Chinese Friendly"
    },
    value: "English/Chinese Friendly",
    description: {
      en: "No language communication barriers.",
      zh: "无语言沟通障碍。",
      ja: "英語・中国語OK、言葉の壁なし。"
    }
  },
  {
    id: "young_creative",
    category: "People & Vibe",
    label: {
      en: "Young Creative Crowd",
      zh: "Young Creative Crowd - 年轻创意人",
      ja: "Young Creative Crowd"
    },
    value: "Young Creative Crowd",
    description: {
      en: "Gathering place for young creatives.",
      zh: "年轻创意人聚集地。",
      ja: "若きクリエイターが集う場所。"
    }
  },
  {
    id: "fashionista_hub",
    category: "People & Vibe",
    label: {
      en: "Fashionista Hub",
      zh: "Fashionista Hub - 时髦精出没",
      ja: "Fashionista Hub"
    },
    value: "Fashionista Hub",
    description: {
      en: "Where the stylish people hang out.",
      zh: "时髦精出没。",
      ja: "おしゃれなファッショニスタの溜まり場。"
    }
  },
  {
    id: "social_lively",
    category: "People & Vibe",
    label: {
      en: "Social & Lively",
      zh: "Social & Lively - 氛围火热",
      ja: "Social & Lively"
    },
    value: "Social & Lively",
    description: {
      en: "Hot atmosphere, great for socializing.",
      zh: "氛围火热，适合社交。",
      ja: "賑やかで社交的な雰囲気。"
    }
  },

  // 3. 设计与审美 (Design & Pedigree)
  {
    id: "legendary_designer",
    category: "Design & Pedigree",
    label: {
      en: "Legendary Designer",
      zh: "Legendary Designer - 顶级大师设计",
      ja: "Legendary Designer"
    },
    value: "Legendary Designer",
    description: {
      en: "Designed by top masters (e.g., Tadao Ando).",
      zh: "由顶级大师设计（如安藤忠雄、山本耀司风格等）。",
      ja: "世界的建築家やデザイナーによる設計。"
    }
  },
  {
    id: "emerging_local",
    category: "Design & Pedigree",
    label: {
      en: "Emerging Local Designer",
      zh: "Emerging Local Designer - 本地新锐设计",
      ja: "Emerging Local Designer"
    },
    value: "Emerging Local Designer",
    description: {
      en: "Supporting local emerging designers.",
      zh: "支持本地新锐设计师。",
      ja: "地元の新進気鋭デザイナーを応援。"
    }
  },
  {
    id: "century_old",
    category: "Design & Pedigree",
    label: {
      en: "Century-Old History",
      zh: "Century-Old History - 百年老店",
      ja: "Century-Old History"
    },
    value: "Century-Old History",
    description: {
      en: "Century-old shop with historical depth.",
      zh: "百年老店，有故事的沉淀。",
      ja: "創業100年、歴史と物語のある老舗。"
    }
  },
  {
    id: "instagrammable",
    category: "Design & Pedigree",
    label: {
      en: "Instagrammable View",
      zh: "Instagrammable View - 随手拍大片",
      ja: "Instagrammable View"
    },
    value: "Instagrammable View",
    description: {
      en: "Every angle is photogenic.",
      zh: "随手一拍都是大片。",
      ja: "どこを切り取っても絵になる。"
    }
  },
  {
    id: "brutalist_minimalist",
    category: "Design & Pedigree",
    label: {
      en: "Brutalist / Minimalist",
      zh: "Brutalist / Minimalist - 极简/工业风",
      ja: "Brutalist / Minimalist"
    },
    value: "Brutalist / Minimalist",
    description: {
      en: "Extreme aesthetics of minimalism or industrial style.",
      zh: "极简主义或工业风极致美学。",
      ja: "ミニマリズム、またはブルータリズムの極致。"
    }
  },
  {
    id: "analog_vinyl",
    category: "Design & Pedigree",
    label: {
      en: "Analog & Vinyl",
      zh: "Analog & Vinyl - 黑胶与模拟",
      ja: "Analog & Vinyl"
    },
    value: "Analog & Vinyl",
    description: {
      en: "Pure vinyl background sound, texture of the analog era.",
      zh: "纯正黑胶背景音，模拟时代的质感。",
      ja: "アナログレコードの音色と質感。"
    }
  },

  // 4. 独特体验 (Experience & Utility)
  {
    id: "artisan_spirit",
    category: "Experience & Utility",
    label: {
      en: "Artisan Spirit",
      zh: "Artisan Spirit - 极致匠人精神",
      ja: "Artisan Spirit"
    },
    value: "Artisan Spirit",
    description: {
      en: "Extreme artisan spirit, focusing on one thing.",
      zh: "极致的匠人精神，专注一件事。",
      ja: "一つのことに打ち込む職人魂。"
    }
  },
  {
    id: "perfect_solo",
    category: "Experience & Utility",
    label: {
      en: "Perfect for Solo",
      zh: "Perfect for Solo - 独处极其自在",
      ja: "Perfect for Solo"
    },
    value: "Perfect for Solo",
    description: {
      en: "Extremely comfortable even when visiting alone.",
      zh: "一个人去也极其自在。",
      ja: "一人でも気兼ねなく楽しめる。"
    }
  },
  {
    id: "off_beaten_path",
    category: "Experience & Utility",
    label: {
      en: "Off the Beaten Path",
      zh: "Off the Beaten Path - 绝对小众",
      ja: "Off the Beaten Path"
    },
    value: "Off the Beaten Path",
    description: {
      en: "Absolutely niche, avoiding all crowds.",
      zh: "绝对小众，避开所有人流。",
      ja: "人混みを避けた穴場スポット。"
    }
  },
  {
    id: "best_sunset",
    category: "Experience & Utility",
    label: {
      en: "Best Sunset Spot",
      zh: "Best Sunset Spot - 绝佳日落",
      ja: "Best Sunset Spot"
    },
    value: "Best Sunset Spot",
    description: {
      en: "Excellent spot for watching the sunset.",
      zh: "绝佳日落观赏点。",
      ja: "夕日の絶景スポット。"
    }
  },
  {
    id: "late_night_soul",
    category: "Experience & Utility",
    label: {
      en: "Late Night Soul",
      zh: "Late Night Soul - 深夜避难所",
      ja: "Late Night Soul"
    },
    value: "Late Night Soul",
    description: {
      en: "A late-night sanctuary, warmth after midnight.",
      zh: "深夜避难所，凌晨后的温暖。",
      ja: "深夜の避難所、真夜中の温もり。"
    }
  },
  {
    id: "limited_edition",
    category: "Experience & Utility",
    label: {
      en: "Limited Edition Only",
      zh: "Limited Edition Only - 期间限定",
      ja: "Limited Edition Only"
    },
    value: "Limited Edition Only",
    description: {
      en: "Limited time only, miss it and it's gone.",
      zh: "期间限定，错过不再有。",
      ja: "期間限定、今しか味わえない。"
    }
  }
];
