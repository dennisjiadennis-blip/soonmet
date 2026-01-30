
export interface Attraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  category: "Shrine" | "Shopping" | "Nature" | "Food" | "Modern";
  rating: number;
}

export const ATTRACTIONS: Attraction[] = [
  {
    id: "1",
    name: "Senso-ji Temple",
    description: "Tokyo's oldest temple, a colorful Buddhist temple located in Asakusa. The Nakamise-dori street leading to the temple is lined with shops selling crafts and street food.",
    imageUrl: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=2960&auto=format&fit=crop",
    location: "Asakusa",
    category: "Shrine",
    rating: 4.8
  },
  {
    id: "2",
    name: "Shibuya Crossing",
    description: "The world's busiest pedestrian crossing. Experience the organized chaos of Tokyo's heartbeat surrounded by giant neon screens.",
    imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3270&auto=format&fit=crop",
    location: "Shibuya",
    category: "Modern",
    rating: 4.7
  },
  {
    id: "3",
    name: "Meiji Shrine",
    description: "A tranquil Shinto shrine dedicated to Emperor Meiji and his wife, located in a lush forest in the heart of the city.",
    imageUrl: "https://images.unsplash.com/photo-1528360983277-13d9b152c6d4?q=80&w=3270&auto=format&fit=crop",
    location: "Harajuku",
    category: "Shrine",
    rating: 4.9
  },
  {
    id: "4",
    name: "Tokyo Tower",
    description: "A communications and observation tower in the Shiba-koen district of Minato, Tokyo. At 332.9 meters, it is the second-tallest structure in Japan.",
    imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=3336&auto=format&fit=crop",
    location: "Minato",
    category: "Modern",
    rating: 4.6
  },
  {
    id: "5",
    name: "Tsukiji Outer Market",
    description: "A district adjacent to the site of the former Tsukiji Wholesale Market. It consists of a few blocks of wholesale and retail shops, as well as restaurants.",
    imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=3270&auto=format&fit=crop",
    location: "Tsukiji",
    category: "Food",
    rating: 4.5
  },
  {
    id: "6",
    name: "Shinjuku Gyoen",
    description: "One of Tokyo's largest and most popular parks. Located a short walk from Shinjuku Station, the park's spacious lawns, meandering paths and tranquil scenery provide a relaxing escape.",
    imageUrl: "https://images.unsplash.com/photo-1522547902298-51560486758e?q=80&w=3270&auto=format&fit=crop",
    location: "Shinjuku",
    category: "Nature",
    rating: 4.8
  }
];

export const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=3270&auto=format&fit=crop",
    alt: "Tokyo Night View"
  },
  {
    src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=3294&auto=format&fit=crop",
    alt: "Rainy Tokyo Street"
  },
  {
    src: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=3384&auto=format&fit=crop",
    alt: "Cherry Blossoms"
  },
  {
    src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=3270&auto=format&fit=crop",
    alt: "Akihabara Neon"
  },
  {
    src: "https://images.unsplash.com/photo-1554790170-08b30cbe0b4f?q=80&w=3270&auto=format&fit=crop",
    alt: "Japanese Lanterns"
  },
  {
    src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=3270&auto=format&fit=crop",
    alt: "Tokyo Skyline"
  }
];
