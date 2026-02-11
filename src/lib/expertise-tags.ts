
export interface ExpertiseTag {
  id: string;
  label: {
    en: string;
    [key: string]: string | undefined;
  };
  value: string;
  category: "Global" | "Japan" | "Korea" | "Taiwan" | "France" | "UK" | "Thailand" | "China" | "United States" | "Malaysia" | "Spain" | "Italy" | "Netherlands" | "Greece" | "Portugal" | "Australia" | "New Zealand" | "Germany" | "Switzerland";
}

export const GLOBAL_EXPERTISE_TAGS: ExpertiseTag[] = [
  {
    id: "gourmet",
    category: "Global",
    label: { 
      en: "Gourmet & Fine Dining", 
      zh: "美食与高级餐厅专家",
      ja: "グルメ・高級ダイニング",
      ko: "미식 & 파인 다이닝",
      th: "อาหารรสเลิศ & ไฟน์ไดนิ่ง",
      ms: "Gourmet & Makanan Mewah",
      fr: "Gastronomie & Cuisine Raffinée",
      es: "Gastronomía y Alta Cocina",
      de: "Gourmet & Feine Küche",
      it: "Gastronomia e Ristoranti Raffinati",
      nl: "Gourmet & Fine Dining",
      el: "Γκουρμέ & Υψηλή Γαστρονομία",
      pt: "Gastronomia e Alta Cozinha"
    },
    value: "Gourmet & Fine Dining"
  },
  {
    id: "womens_fashion",
    category: "Global",
    label: { 
      en: "Women's Fashion & Personal Shopper", 
      zh: "女性服装购买与私人买手",
      ja: "レディースファッション & パーソナルショッパー",
      ko: "여성 패션 & 퍼스널 쇼퍼",
      th: "แฟชั่นผู้หญิง & นักช้อปส่วนตัว",
      ms: "Fesyen Wanita & Pembeli Peribadi",
      fr: "Mode Féminine & Personal Shopper",
      es: "Moda Femenina y Personal Shopper",
      de: "Damenmode & Personal Shopper",
      it: "Moda Donna e Personal Shopper",
      nl: "Damesmode & Personal Shopper",
      el: "Γυναικεία Μόδα & Personal Shopper",
      pt: "Moda Feminina e Personal Shopper"
    },
    value: "Women's Fashion & Personal Shopper"
  },
  {
    id: "nightlife_insider",
    category: "Global",
    label: { 
      en: "Nightlife & Party Scene Insider", 
      zh: "夜生活专家 — 侧重氛围与安全",
      ja: "ナイトライフ & パーティーシーン",
      ko: "나이트라이프 & 파티 인사이더",
      th: "ผู้เชี่ยวชาญด้านสถานบันเทิงยามค่ำคืน",
      ms: "Dalaman Kehidupan Malam & Pesta",
      fr: "Expert Vie Nocturne & Fêtes",
      es: "Experto en Vida Nocturna y Fiestas",
      de: "Nachtleben & Party-Szene Insider",
      it: "Esperto di Vita Notturna e Feste",
      nl: "Uitgaansleven & Party Scene Insider",
      el: "Γνώστης Νυχτερινής Ζωής & Πάρτι",
      pt: "Insider de Vida Noturna e Festas"
    },
    value: "Nightlife & Party Scene Insider"
  },
  {
    id: "private_club",
    category: "Global",
    label: { 
      en: "Private Club & Membership Access", 
      zh: "私人俱乐部内线 — 高净值社交",
      ja: "会員制クラブ & メンバーシップ",
      ko: "프라이빗 클럽 & 멤버십 액세스",
      th: "คลับส่วนตัว & การเข้าถึงสมาชิก",
      ms: "Kelab Peribadi & Akses Keahlian",
      fr: "Clubs Privés & Accès Membres",
      es: "Clubes Privados y Acceso a Membresía",
      de: "Privatclub & Mitgliedschaftszugang",
      it: "Club Privati e Accesso Membri",
      nl: "Privéclub & Lidmaatschapstoegang",
      el: "Ιδιωτικά Κλαμπ & Πρόσβαση Μελών",
      pt: "Clubes Privados e Acesso a Membros"
    },
    value: "Private Club & Membership Access"
  },
  {
    id: "lgbtq",
    category: "Global",
    label: { 
      en: "LGBTQ+ Community & Culture", 
      zh: "LGBTQ+ 社群与文化友好建议",
      ja: "LGBTQ+ コミュニティ & カルチャー",
      ko: "LGBTQ+ 커뮤니티 & 문화",
      th: "ชุมชนและวัฒนธรรม LGBTQ+",
      ms: "Komuniti & Budaya LGBTQ+",
      fr: "Communauté & Culture LGBTQ+",
      es: "Comunidad y Cultura LGBTQ+",
      de: "LGBTQ+ Gemeinschaft & Kultur",
      it: "Comunità e Cultura LGBTQ+",
      nl: "LGBTQ+ Gemeenschap & Cultuur",
      el: "Κοινότητα & Πολιτισμός LGBTQ+",
      pt: "Comunidade e Cultura LGBTQ+"
    },
    value: "LGBTQ+ Community & Culture"
  },
  {
    id: "family_kids",
    category: "Global",
    label: { 
      en: "Family & Kids Travel Consultant", 
      zh: "育儿与亲子旅游专家",
      ja: "ファミリー & キッズ旅行コンサルタント",
      ko: "가족 & 어린이 여행 컨설턴트",
      th: "ที่ปรึกษาการท่องเที่ยวครอบครัวและเด็ก",
      ms: "Perunding Perjalanan Keluarga & Kanak-kanak",
      fr: "Voyages Famille & Enfants",
      es: "Consultor de Viajes Familiares",
      de: "Familien- & Kinderreiseberater",
      it: "Consulente Viaggi Famiglia e Bambini",
      nl: "Familie- & Kinderreizen Consultant",
      el: "Σύμβουλος Ταξιδιών για Οικογένειες & Παιδιά",
      pt: "Consultor de Viagens em Família"
    },
    value: "Family & Kids Travel Consultant"
  },
  {
    id: "pet_friendly",
    category: "Global",
    label: { 
      en: "Pet-Friendly Travel & Rules", 
      zh: "宠物旅行及本地法规专家",
      ja: "ペット同伴旅行 & ルール",
      ko: "반려동물 동반 여행 & 규정",
      th: "การท่องเที่ยวและกฎระเบียบที่เป็นมิตรต่อสัตว์เลี้ยง",
      ms: "Perjalanan & Peraturan Mesra Haiwan Peliharaan",
      fr: "Voyage & Règles Pet-Friendly",
      es: "Viajes y Normas Pet-Friendly",
      de: "Haustierfreundliches Reisen & Regeln",
      it: "Viaggi e Regole Pet-Friendly",
      nl: "Huisdiervriendelijk Reizen & Regels",
      el: "Ταξίδια & Κανόνες Φιλικά προς Κατοικίδια",
      pt: "Viagens e Regras Pet-Friendly"
    },
    value: "Pet-Friendly Travel & Rules"
  },
  {
    id: "nature_wildlife",
    category: "Global",
    label: { 
      en: "Nature & Wildlife Exploration", 
      zh: "自然及野生动物观察",
      ja: "自然 & 野生動物探検",
      ko: "자연 & 야생동물 탐험",
      th: "การสำรวจธรรมชาติและสัตว์ป่า",
      ms: "Penerokaan Alam & Hidupan Liar",
      fr: "Nature & Exploration Faune",
      es: "Naturaleza y Exploración de Vida Silvestre",
      de: "Natur & Wildtiererkundung",
      it: "Natura ed Esplorazione Fauna Selvatica",
      nl: "Natuur & Wildlife Exploratie",
      el: "Εξερεύνηση Φύσης & Άγριας Ζωής",
      pt: "Natureza e Exploração de Vida Selvagem"
    },
    value: "Nature & Wildlife Exploration"
  },
  {
    id: "accessibility",
    category: "Global",
    label: { 
      en: "Accessibility & Disability Travel", 
      zh: "无障碍旅行规划 — 针对残疾游客",
      ja: "バリアフリー旅行",
      ko: "장애인 접근성 여행",
      th: "การท่องเที่ยวสำหรับผู้พิการและการเข้าถึง",
      ms: "Kebolehcapaian & Perjalanan Orang Kurang Upaya",
      fr: "Accessibilité & Voyage Handicap",
      es: "Accesibilidad y Viajes para Discapacitados",
      de: "Barrierefreies Reisen",
      it: "Accessibilità e Viaggi per Disabili",
      nl: "Toegankelijkheid & Reizen met Beperking",
      el: "Προσβασιμότητα & Ταξίδια για ΑμεΑ",
      pt: "Acessibilidade e Viagens para Deficientes"
    },
    value: "Accessibility & Disability Travel"
  },
  {
    id: "bar_mixology",
    category: "Global",
    label: { 
      en: "Bar & Mixology Specialist", 
      zh: "酒吧与调酒专家",
      ja: "バー & ミクソロジー",
      ko: "바 & 믹솔로지 전문가",
      th: "ผู้เชี่ยวชาญด้านบาร์และการผสมเครื่องดื่ม",
      ms: "Pakar Bar & Mixology",
      fr: "Spécialiste Bar & Mixologie",
      es: "Especialista en Bares y Mixología",
      de: "Bar & Mixologie Spezialist",
      it: "Specialista Bar e Mixology",
      nl: "Bar & Mixologie Specialist",
      el: "Ειδικός σε Μπαρ & Mixology",
      pt: "Especialista em Bares e Mixologia"
    },
    value: "Bar & Mixology Specialist"
  },
  {
    id: "whisky_spirits",
    category: "Global",
    label: { 
      en: "Whisky & Spirits Sommelier", 
      zh: "威士忌与烈酒大师",
      ja: "ウイスキー & スピリッツソムリエ",
      ko: "위스키 & 증류주 소믈리에",
      th: "ซอมเมอลิเยร์วิสกี้และสุรา",
      ms: "Sommelier Whisky & Semangat",
      fr: "Sommelier Whisky & Spiritueux",
      es: "Sommelier de Whisky y Licores",
      de: "Whisky & Spirituosen Sommelier",
      it: "Sommelier di Whisky e Distillati",
      nl: "Whisky & Spirits Sommelier",
      el: "Σομελιέ Ουίσκι & Αποσταγμάτων",
      pt: "Sommelier de Whisky e Destilados"
    },
    value: "Whisky & Spirits Sommelier"
  },
  {
    id: "vintage_luxury",
    category: "Global",
    label: { 
      en: "Vintage & Luxury Resale Hunter", 
      zh: "中古、二手及奢侈品鉴赏",
      ja: "ヴィンテージ & 高級リセールハンター",
      ko: "빈티지 & 럭셔리 리세일 헌터",
      th: "นักล่าสินค้าวินเทจและแบรนด์เนมมือสอง",
      ms: "Pemburu Jualan Semula Vintaj & Mewah",
      fr: "Chasseur Vintage & Luxe",
      es: "Cazador de Vintage y Lujo de Segunda Mano",
      de: "Vintage & Luxus Resale Jäger",
      it: "Cacciatore di Vintage e Lusso",
      nl: "Vintage & Luxe Resale Hunter",
      el: "Κυνηγός Vintage & Πολυτελών Μεταχειρισμένων",
      pt: "Caçador de Vintage e Revenda de Luxo"
    },
    value: "Vintage & Luxury Resale Hunter"
  },
  {
    id: "art_gallery",
    category: "Global",
    label: { 
      en: "Art, Gallery & Museum Insider", 
      zh: "艺术、画廊与美术馆内线",
      ja: "アート・ギャラリー & 美術館インサイダー",
      ko: "예술, 갤러리 & 박물관 인사이더",
      th: "ผู้รู้ลึกด้านศิลปะ แกลเลอรี และพิพิธภัณฑ์",
      ms: "Dalaman Seni, Galeri & Muzium",
      fr: "Insider Art, Galeries & Musées",
      es: "Insider de Arte, Galerías y Museos",
      de: "Kunst, Galerie & Museum Insider",
      it: "Insider Arte, Gallerie e Musei",
      nl: "Kunst, Galerij & Museum Insider",
      el: "Γνώστης Τέχνης, Γκαλερί & Μουσείων",
      pt: "Insider de Arte, Galerias e Museus"
    },
    value: "Art, Gallery & Museum Insider"
  },
  {
    id: "health_wellness",
    category: "Global",
    label: { 
      en: "Local Health & Wellness", 
      zh: "本地康养、瑜伽与医疗资源",
      ja: "ローカルヘルス & ウェルネス",
      ko: "현지 건강 & 웰니스",
      th: "สุขภาพและความเป็นอยู่ที่ดีในท้องถิ่น",
      ms: "Kesihatan & Kesejahteraan Tempatan",
      fr: "Santé & Bien-être Local",
      es: "Salud y Bienestar Local",
      de: "Lokale Gesundheit & Wellness",
      it: "Salute e Benessere Locale",
      nl: "Lokale Gezondheid & Wellness",
      el: "Τοπική Υγεία & Ευεξία",
      pt: "Saúde e Bem-Estar Local"
    },
    value: "Local Health & Wellness"
  },
  {
    id: "photography",
    category: "Global",
    label: { 
      en: "Photography & Cinematic Locations", 
      zh: "摄影出片机位与取景地",
      ja: "写真 & シネマティックロケーション",
      ko: "사진 & 시네마틱 로케이션",
      th: "การถ่ายภาพและสถานที่ถ่ายทำภาพยนตร์",
      ms: "Fotografi & Lokasi Sinematik",
      fr: "Photographie & Lieux Cinématographiques",
      es: "Fotografía y Ubicaciones de Cine",
      de: "Fotografie & Filmische Orte",
      it: "Fotografia e Luoghi Cinematografici",
      nl: "Fotografie & Filmische Locaties",
      el: "Φωτογραφία & Κινηματογραφικές Τοποθεσίες",
      pt: "Fotografia e Locais Cinematográficos"
    },
    value: "Photography & Cinematic Locations"
  },
  {
    id: "digital_nomad",
    category: "Global",
    label: { 
      en: "Digital Nomad & Expat Living", 
      zh: "数字游民与长期居留咨询",
      ja: "デジタルノマド & 海外移住",
      ko: "디지털 노마드 & 국외 거주 생활",
      th: "ดิจิทัลโนแมดและการใช้ชีวิตต่างแดน",
      ms: "Nomad Digital & Kehidupan Ekspatriat",
      fr: "Digital Nomad & Vie d'Expat",
      es: "Nómada Digital y Vida de Expatriado",
      de: "Digital Nomad & Expat-Leben",
      it: "Nomade Digitale e Vita da Espatriato",
      nl: "Digital Nomad & Expat Leven",
      el: "Ψηφιακοί Νομάδες & Ζωή στο Εξωτερικό",
      pt: "Nômade Digital e Vida de Expatriado"
    },
    value: "Digital Nomad & Expat Living"
  },
  {
    id: "underground_subculture",
    category: "Global",
    label: { 
      en: "Underground Subcultures", 
      zh: "地下亚文化 — 滑板、涂鸦、摇滚等",
      ja: "アンダーグラウンド・サブカルチャー",
      ko: "언더그라운드 서브컬처",
      th: "วัฒนธรรมย่อยใต้ดิน",
      ms: "Subbudaya Bawah Tanah",
      fr: "Subcultures Underground",
      es: "Subculturas Underground",
      de: "Underground Subkulturen",
      it: "Sottoculture Underground",
      nl: "Underground Subculturen",
      el: "Underground Υποκουλτούρες",
      pt: "Subculturas Underground"
    },
    value: "Underground Subcultures"
  },
  {
    id: "watch_jewelry",
    category: "Global",
    label: { 
      en: "High-End Watch & Jewelry Collector", 
      zh: "名表与珠宝收藏",
      ja: "高級時計 & ジュエリーコレクター",
      ko: "하이엔드 시계 & 주얼리 컬렉터",
      th: "นักสะสมนาฬิกาและเครื่องประดับหรู",
      ms: "Pengumpul Jam & Barang Kemas Mewah",
      fr: "Collectionneur Montres & Joaillerie",
      es: "Coleccionista de Relojes y Joyas de Alta Gama",
      de: "High-End Uhren & Schmuck Sammler",
      it: "Collezionista di Orologi e Gioielli di Lusso",
      nl: "High-End Horloge & Sieraden Verzamelaar",
      el: "Συλλέκτης Ρολογιών & Κοσμημάτων Πολυτελείας",
      pt: "Colecionador de Relógios e Joias de Alto Padrão"
    },
    value: "High-End Watch & Jewelry Collector"
  },
  {
    id: "niche_sports",
    category: "Global",
    label: { 
      en: "Niche Sports & Outdoor Activity", 
      zh: "小众运动与户外活动",
      ja: "ニッチスポーツ & アウトドアアクティビティ",
      ko: "니치 스포츠 & 야외 활동",
      th: "กีฬากลุ่มเฉพาะและกิจกรรมกลางแจ้ง",
      ms: "Sukan Niche & Aktiviti Luar",
      fr: "Sports de Niche & Activités Plein Air",
      es: "Deportes de Nicho y Actividades al Aire Libre",
      de: "Nischensport & Outdoor-Aktivitäten",
      it: "Sport di Nicchia e Attività all'Aperto",
      nl: "Niche Sporten & Buitenactiviteiten",
      el: "Εξειδικευμένα Αθλήματα & Υπαίθριες Δραστηριότητες",
      pt: "Esportes de Nicho e Atividades ao Ar Livre"
    },
    value: "Niche Sports & Outdoor Activity"
  },
  {
    id: "budget_gems",
    category: "Global",
    label: { 
      en: "Budget-Friendly Hidden Gems", 
      zh: "高性价比本地隐藏好去处",
      ja: "高コスパ & 隠れた名店",
      ko: "가성비 좋은 숨은 명소",
      th: "ของดีราคาประหยัดที่ซ่อนอยู่",
      ms: "Permata Tersembunyi Mesra Bajet",
      fr: "Bons Plans & Trésors Cachés",
      es: "Joyas Ocultas Económicas",
      de: "Preiswerte Geheimtipps",
      it: "Gemme Nascoste Economiche",
      nl: "Budgetvriendelijke Verborgen Pareltjes",
      el: "Οικονομικοί Κρυμμένοι Θησαυροί",
      pt: "Joias Escondidas Econômicas"
    },
    value: "Budget-Friendly Hidden Gems"
  }
];

export const COUNTRY_SPECIFIC_TAGS: Record<string, ExpertiseTag[]> = {
  "Japan": [
    {
      id: "jp_shinise",
      category: "Japan",
      label: { en: "Centuries-old Artisan Enterprises (Shinise)", zh: "百年工匠企业专家", ja: "老舗・伝統工芸企業" },
      value: "Centuries-old Artisan Enterprises (Shinise)"
    },
    {
      id: "jp_artisan_workshop",
      category: "Japan",
      label: { en: "Artisan Workshop Visit Specialist", zh: "工匠作坊拜访专业 Insider", ja: "職人工房見学スペシャリスト" },
      value: "Artisan Workshop Visit Specialist"
    },
    {
      id: "jp_sake",
      category: "Japan",
      label: { en: "Sake (Nihonshu) Master", zh: "清酒大师", ja: "日本酒マスター" },
      value: "Sake (Nihonshu) Master"
    },
    {
      id: "jp_anime",
      category: "Japan",
      label: { en: "Anime & Manga Otaku Culture", zh: "二次元/动漫文化", ja: "アニメ・マンガ・オタク文化" },
      value: "Anime & Manga Otaku Culture"
    },
    {
      id: "jp_shinto",
      category: "Japan",
      label: { en: "Shinto Shrine & Temple Rituals", zh: "神社寺庙与祭典仪式", ja: "神社仏閣・祭礼儀式" },
      value: "Shinto Shrine & Temple Rituals"
    },
    {
      id: "jp_kaiseki",
      category: "Japan",
      label: { en: "Kyoto Hidden Kaiseki Booking", zh: "京都隐秘怀石预约", ja: "京都隠れ家懐石予約" },
      value: "Kyoto Hidden Kaiseki Booking"
    },
    {
      id: "jp_nightlife_safety",
      category: "Japan",
      label: { en: "Nightlife Safety Advisor", zh: "夜生活安全避坑指南/歌舞伎町等", ja: "夜の街・歌舞伎町安全ガイド" },
      value: "Nightlife Safety Advisor"
    },
    {
      id: "jp_lolita",
      category: "Japan",
      label: { en: "Lolita & Underground Fashion", zh: "萝莉塔与地雷系时尚", ja: "ロリータ・アンダーグラウンドファッション" },
      value: "Lolita & Underground Fashion"
    },
    {
      id: "jp_ryokan",
      category: "Japan",
      label: { en: "Ryokan & Onsen Etiquette", zh: "温泉旅馆礼仪与文化", ja: "旅館・温泉マナー" },
      value: "Ryokan & Onsen Etiquette"
    },
    {
      id: "jp_snow",
      category: "Japan",
      label: { en: "Ski & Snowboard Powder Specialist", zh: "滑雪与粉雪专家", ja: "スキー・スノーボード パウダー専門" },
      value: "Ski & Snowboard Powder Specialist"
    }
  ],
  "South Korea": [
    {
      id: "kr_kpop",
      category: "Korea",
      label: { en: "K-Pop Fandom & Concert Access", zh: "K-Pop 追星与演唱会内线", ko: "K-POP 팬덤 & 콘서트 투어" },
      value: "K-Pop Fandom & Concert Access"
    },
    {
      id: "kr_beauty",
      category: "Korea",
      label: { en: "K-Beauty & Plastic Surgery Consulting", zh: "医美与韩系妆造咨询", ko: "K-뷰티 & 성형 상담" },
      value: "K-Beauty & Plastic Surgery Consulting"
    },
    {
      id: "kr_food_tour",
      category: "Korea",
      label: { en: "Seoul Street Food Night Tour", zh: "首尔街头美食深夜巡礼", ko: "서울 길거리 음식 야간 투어" },
      value: "Seoul Street Food Night Tour"
    },
    {
      id: "kr_hanbok",
      category: "Korea",
      label: { en: "Traditional Hanbok Social", zh: "韩服社交与摄影", ko: "전통 한복 체험 & 소셜" },
      value: "Traditional Hanbok Social"
    },
    {
      id: "kr_indie_music",
      category: "Korea",
      label: { en: "Hongdae Indie Music Scene", zh: "弘大独立音乐圈", ko: "홍대 인디 음악 신" },
      value: "Hongdae Indie Music Scene"
    }
  ],
  "Taiwan": [
    {
      id: "tw_tea",
      category: "Taiwan",
      label: { en: "Oolong Tea & Modern Tea Ceremony", zh: "乌龙茶与现代茶道" },
      value: "Oolong Tea & Modern Tea Ceremony"
    },
    {
      id: "tw_night_market",
      category: "Taiwan",
      label: { en: "Night Market Secret Menu", zh: "夜市隐藏菜单" },
      value: "Night Market Secret Menu"
    },
    {
      id: "tw_cycling",
      category: "Taiwan",
      label: { en: "Cyclist's Route Planning", zh: "单车环岛路线规划" },
      value: "Cyclist's Route Planning"
    },
    {
      id: "tw_indigenous",
      category: "Taiwan",
      label: { en: "Indigenous Culture & Heritage", zh: "原住民文化与遗产" },
      value: "Indigenous Culture & Heritage"
    },
    {
      id: "tw_old_house",
      category: "Taiwan",
      label: { en: "Old House Renovation & Cafes", zh: "老屋改造与特色咖啡馆" },
      value: "Old House Renovation & Cafes"
    }
  ],
  "France": [
    {
      id: "fr_haute_couture",
      category: "France",
      label: { en: "Parisian Haute Couture History", zh: "巴黎高定历史", fr: "Histoire de la Haute Couture Parisienne" },
      value: "Parisian Haute Couture History"
    },
    {
      id: "fr_wine",
      category: "France",
      label: { en: "Wine Region Specialist (Bordeaux/Burgundy)", zh: "葡萄酒产区专家", fr: "Spécialiste des Vins (Bordeaux/Bourgogne)" },
      value: "Wine Region Specialist (Bordeaux/Burgundy)"
    },
    {
      id: "fr_michelin",
      category: "France",
      label: { en: "Michelin Dining Strategy", zh: "米其林餐厅订位策略", fr: "Stratégie Gastronomique Michelin" },
      value: "Michelin Dining Strategy"
    },
    {
      id: "fr_flea_market",
      category: "France",
      label: { en: "Flea Market Negotiation Expert", zh: "跳蚤市场砍价专家", fr: "Expert en Marchés aux Puces & Négociation" },
      value: "Flea Market Negotiation Expert"
    },
    {
      id: "fr_boulangerie",
      category: "France",
      label: { en: "Boulangerie & Patisserie Master", zh: "法式面包与甜点大师", fr: "Maître Boulangerie & Pâtisserie" },
      value: "Boulangerie & Patisserie Master"
    }
  ],
  "United Kingdom": [
    {
      id: "uk_tailoring",
      category: "UK",
      label: { en: "Savile Row Bespoke Tailoring", zh: "萨维尔街西装定制" },
      value: "Savile Row Bespoke Tailoring"
    },
    {
      id: "uk_vinyl",
      category: "UK",
      label: { en: "London Vinyl Record Shops", zh: "伦敦黑胶唱片店" },
      value: "London Vinyl Record Shops"
    },
    {
      id: "uk_football",
      category: "UK",
      label: { en: "Premier League Football Fan Culture", zh: "英超足球粉丝文化" },
      value: "Premier League Football Fan Culture"
    },
    {
      id: "uk_harry_potter",
      category: "UK",
      label: { en: "Harry Potter & Fantasy Literature", zh: "哈利波特与奇幻文学" },
      value: "Harry Potter & Fantasy Literature"
    },
    {
      id: "uk_royal",
      category: "UK",
      label: { en: "Royal Family History & Protocol", zh: "皇室历史与礼仪" },
      value: "Royal Family History & Protocol"
    }
  ],
  "Thailand": [
    {
      id: "th_muay_thai",
      category: "Thailand",
      label: { en: "Muay Thai Training Camps", zh: "泰拳训练营", th: "ค่ายฝึกมวยไทย" },
      value: "Muay Thai Training Camps"
    },
    {
      id: "th_gay_scene",
      category: "Thailand",
      label: { en: "Bangkok Gay Scene Insider", zh: "曼谷 Gay 圈内线", th: "อินไซเดอร์เกย์ซีนกรุงเทพฯ" },
      value: "Bangkok Gay Scene Insider"
    },
    {
      id: "th_tattoo",
      category: "Thailand",
      label: { en: "Spiritual Tattoo (Sak Yant) Guide", zh: "法力纹身指南", th: "สักยันต์ & จิตวิญญาณ" },
      value: "Spiritual Tattoo (Sak Yant) Guide"
    },
    {
      id: "th_rooftop",
      category: "Thailand",
      label: { en: "Luxury Rooftop Bar Hopping", zh: "顶级屋顶酒吧巡礼", th: "ทัวร์รูฟท็อปบาร์หรู" },
      value: "Luxury Rooftop Bar Hopping"
    },
    {
      id: "th_royal_cuisine",
      category: "Thailand",
      label: { en: "Royal Thai Cuisine Master", zh: "皇室泰餐大师", th: "อาหารชาววังต้นตำรับ" },
      value: "Royal Thai Cuisine Master"
    }
  ],
  "China": [
    {
      id: "cn_ancient_architecture",
      category: "China",
      label: { en: "Ancient Architecture & History", zh: "古建筑与历史文化 (故宫/长城)" },
      value: "Ancient Architecture & History"
    },
    {
      id: "cn_regional_food",
      category: "China",
      label: { en: "Regional Cuisines Specialist", zh: "地道美食与八大菜系向导" },
      value: "Regional Cuisines Specialist"
    },
    {
      id: "cn_tea_culture",
      category: "China",
      label: { en: "Tea Culture & Ceremony", zh: "茶文化与茶馆体验" },
      value: "Tea Culture & Ceremony"
    },
    {
      id: "cn_cashless",
      category: "China",
      label: { en: "Digital Life & Cashless Payment", zh: "移动支付与数字生活指南 (Alipay/WeChat)" },
      value: "Digital Life & Cashless Payment"
    },
    {
      id: "cn_high_speed_rail",
      category: "China",
      label: { en: "High-Speed Rail Travel Planning", zh: "高铁旅行规划与购票" },
      value: "High-Speed Rail Travel Planning"
    }
  ],
  "United States": [
    {
      id: "us_national_parks",
      category: "United States",
      label: { en: "National Parks & Road Trips", zh: "国家公园与公路旅行" },
      value: "National Parks & Road Trips"
    },
    {
      id: "us_sports",
      category: "United States",
      label: { en: "Major League Sports (NBA/NFL)", zh: "职业体育赛事 (NBA/NFL) 观赛" },
      value: "Major League Sports (NBA/NFL)"
    },
    {
      id: "us_tipping",
      category: "United States",
      label: { en: "Tipping Culture & Etiquette", zh: "小费文化与社交礼仪" },
      value: "Tipping Culture & Etiquette"
    },
    {
      id: "us_hollywood",
      category: "United States",
      label: { en: "Hollywood & Entertainment", zh: "好莱坞与娱乐产业" },
      value: "Hollywood & Entertainment"
    },
    {
      id: "us_college",
      category: "United States",
      label: { en: "University Campus Tours", zh: "名校校园参观" },
      value: "University Campus Tours"
    }
  ],
  "Malaysia": [
    {
      id: "my_food",
      category: "Malaysia",
      label: { en: "Hawker Food & Street Eats", zh: "街头小贩美食", ms: "Makanan Penjaja & Hidangan Jalanan" },
      value: "Hawker Food & Street Eats"
    },
    {
      id: "my_culture",
      category: "Malaysia",
      label: { en: "Multicultural Heritage", zh: "多元文化遗产 (马来/华裔/印度)", ms: "Warisan Pelbagai Budaya" },
      value: "Multicultural Heritage"
    },
    {
      id: "my_nature",
      category: "Malaysia",
      label: { en: "Rainforests & Wildlife", zh: "热带雨林与野生动物", ms: "Hutan Hujan & Hidupan Liar" },
      value: "Rainforests & Wildlife"
    }
  ],
  "Spain": [
    {
      id: "es_tapas",
      category: "Spain",
      label: { en: "Tapas & Pintxos Culture", zh: "Tapas 与 Pintxos 美食文化", es: "Cultura de Tapas y Pintxos" },
      value: "Tapas & Pintxos Culture"
    },
    {
      id: "es_architecture",
      category: "Spain",
      label: { en: "Gaudi & Modernist Architecture", zh: "高迪与现代主义建筑", es: "Gaudí y Arquitectura Modernista" },
      value: "Gaudi & Modernist Architecture"
    },
    {
      id: "es_flamenco",
      category: "Spain",
      label: { en: "Flamenco & Andalusian Culture", zh: "弗拉明戈与安达卢西亚文化", es: "Flamenco y Cultura Andaluza" },
      value: "Flamenco & Andalusian Culture"
    }
  ],
  "Italy": [
    {
      id: "it_art_history",
      category: "Italy",
      label: { en: "Renaissance Art & History", zh: "文艺复兴艺术与历史", it: "Arte e Storia del Rinascimento" },
      value: "Renaissance Art & History"
    },
    {
      id: "it_culinary",
      category: "Italy",
      label: { en: "Culinary Tours & Wine Tasting", zh: "烹饪之旅与品酒", it: "Tour Gastronomici e Degustazione Vini" },
      value: "Culinary Tours & Wine Tasting"
    },
    {
      id: "it_fashion",
      category: "Italy",
      label: { en: "Fashion & Shopping (Milan/Florence)", zh: "时尚与购物 (米兰/佛罗伦萨)", it: "Moda e Shopping (Milano/Firenze)" },
      value: "Fashion & Shopping (Milan/Florence)"
    }
  ],
  "Netherlands": [
    {
      id: "nl_cycling",
      category: "Netherlands",
      label: { en: "Cycling Culture & Routes", zh: "骑行文化与路线", nl: "Fiets cultuur & Routes" },
      value: "Cycling Culture & Routes"
    },
    {
      id: "nl_art",
      category: "Netherlands",
      label: { en: "Dutch Masters (Rembrandt/Van Gogh)", zh: "荷兰大师艺术 (伦勃朗/梵高)", nl: "Hollandse Meesters (Rembrandt/Van Gogh)" },
      value: "Dutch Masters (Rembrandt/Van Gogh)"
    },
    {
      id: "nl_canals",
      category: "Netherlands",
      label: { en: "Canal Cruises & Houseboats", zh: "运河游船与船屋体验", nl: "Rondvaarten & Woonboten" },
      value: "Canal Cruises & Houseboats"
    }
  ],
  "Greece": [
    {
      id: "gr_ancient_history",
      category: "Greece",
      label: { en: "Ancient History & Mythology", zh: "古希腊历史与神话", el: "Αρχαία Ιστορία & Μυθολογία" },
      value: "Ancient History & Mythology"
    },
    {
      id: "gr_island_hopping",
      category: "Greece",
      label: { en: "Island Hopping & Ferry Logistics", zh: "跳岛游与轮渡攻略", el: "Island Hopping & Ακτοπλοϊκά" },
      value: "Island Hopping & Ferry Logistics"
    },
    {
      id: "gr_sunset",
      category: "Greece",
      label: { en: "Sunset Photography (Santorini)", zh: "日落摄影 (圣托里尼)", el: "Φωτογραφία Ηλιοβασιλέματος (Σαντορίνη)" },
      value: "Sunset Photography (Santorini)"
    }
  ],
  "Portugal": [
    {
      id: "pt_fado",
      category: "Portugal",
      label: { en: "Fado Music & Culture", zh: "法朵音乐与文化", pt: "Fado e Cultura" },
      value: "Fado Music & Culture"
    },
    {
      id: "pt_wine",
      category: "Portugal",
      label: { en: "Port Wine & Douro Valley", zh: "波特酒与杜罗河谷", pt: "Vinho do Porto e Vale do Douro" },
      value: "Port Wine & Douro Valley"
    },
    {
      id: "pt_azulejos",
      category: "Portugal",
      label: { en: "Tile Art & Architecture", zh: "瓷砖艺术与建筑", pt: "Azulejos e Arquitetura" },
      value: "Tile Art & Architecture"
    }
  ],
  "Australia": [
    {
      id: "au_coffee",
      category: "Australia",
      label: { en: "Coffee Culture & Brunch", zh: "咖啡文化与早午餐" },
      value: "Coffee Culture & Brunch"
    },
    {
      id: "au_wildlife",
      category: "Australia",
      label: { en: "Wildlife Encounters", zh: "野生动物接触 (袋鼠/考拉)" },
      value: "Wildlife Encounters"
    },
    {
      id: "au_beaches",
      category: "Australia",
      label: { en: "Surf & Beach Culture", zh: "冲浪与海滩文化" },
      value: "Surf & Beach Culture"
    }
  ],
  "New Zealand": [
    {
      id: "nz_adventure",
      category: "New Zealand",
      label: { en: "Adventure Sports", zh: "极限运动 (蹦极/跳伞)" },
      value: "Adventure Sports"
    },
    {
      id: "nz_lotr",
      category: "New Zealand",
      label: { en: "Lord of the Rings Locations", zh: "指环王取景地" },
      value: "Lord of the Rings Locations"
    },
    {
      id: "nz_nature",
      category: "New Zealand",
      label: { en: "Glaciers & Fjords", zh: "冰川与峡湾自然风光" },
      value: "Glaciers & Fjords"
    }
  ],
  "Germany": [
    {
      id: "de_beer",
      category: "Germany",
      label: { en: "Beer Gardens & Oktoberfest", zh: "啤酒花园与啤酒节", de: "Biergärten & Oktoberfest" },
      value: "Beer Gardens & Oktoberfest"
    },
    {
      id: "de_history",
      category: "Germany",
      label: { en: "WWII & Cold War History", zh: "二战与冷战历史", de: "Zweiter Weltkrieg & Kalter Krieg Geschichte" },
      value: "WWII & Cold War History"
    },
    {
      id: "de_techno",
      category: "Germany",
      label: { en: "Berlin Techno & Club Scene", zh: "柏林 Techno 与夜店文化", de: "Berliner Techno & Clubszene" },
      value: "Berlin Techno & Club Scene"
    }
  ],
  "Switzerland": [
    {
      id: "ch_alps",
      category: "Switzerland",
      label: { en: "Alpine Skiing & Hiking", zh: "阿尔卑斯滑雪与徒步", de: "Alpines Skifahren & Wandern" },
      value: "Alpine Skiing & Hiking"
    },
    {
      id: "ch_chocolate",
      category: "Switzerland",
      label: { en: "Chocolate & Cheese", zh: "瑞士巧克力与奶酪", de: "Schokolade & Käse" },
      value: "Chocolate & Cheese"
    },
    {
      id: "ch_watches",
      category: "Switzerland",
      label: { en: "Luxury Watches", zh: "奢侈腕表与钟表文化", de: "Luxusuhren" },
      value: "Luxury Watches"
    }
  ]
};
