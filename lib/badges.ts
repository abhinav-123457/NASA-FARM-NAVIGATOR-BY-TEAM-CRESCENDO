export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: "chapter" | "achievement" | "mastery"
  earned: boolean
  earnedDate?: Date
}

export interface Quiz {
  id: string
  chapterId: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  bharatPoints: number
}

export const allBadges: Badge[] = [
  // Chapter Badges
  {
    id: "millet-master",
    name: "Millet Master",
    description: "Completed Chapter 1: Rajasthan Millet Challenge",
    icon: "🌾",
    category: "chapter",
    earned: false,
  },
  {
    id: "rice-master",
    name: "Rice Master",
    description: "Completed Chapter 2: Punjab Rice Challenge",
    icon: "🍚",
    category: "chapter",
    earned: false,
  },
  {
    id: "wheat-warrior",
    name: "Wheat Warrior",
    description: "Completed Chapter 3: Bihar Wheat Challenge",
    icon: "🌾",
    category: "chapter",
    earned: false,
  },
  {
    id: "coffee-connoisseur",
    name: "Coffee Connoisseur",
    description: "Completed Chapter 4: Karnataka Coffee Challenge",
    icon: "☕",
    category: "chapter",
    earned: false,
  },
  {
    id: "master-farmer",
    name: "Master Farmer of Bharat",
    description: "Completed all 5 chapters across India",
    icon: "🏆",
    category: "chapter",
    earned: false,
  },
  // Achievement Badges
  {
    id: "water-wise",
    name: "Water Wise",
    description: "Maintained 80%+ water efficiency for 30 days",
    icon: "💧",
    category: "achievement",
    earned: false,
  },
  {
    id: "soil-scientist",
    name: "Soil Scientist",
    description: "Achieved perfect soil health (100%) on all tiles",
    icon: "🔬",
    category: "achievement",
    earned: false,
  },
  {
    id: "pest-controller",
    name: "Pest Controller",
    description: "Prevented pest outbreaks for 50 days",
    icon: "🐛",
    category: "achievement",
    earned: false,
  },
  {
    id: "livestock-expert",
    name: "Livestock Expert",
    description: "Maintained 5+ healthy animals for 30 days",
    icon: "🐄",
    category: "achievement",
    earned: false,
  },
  {
    id: "harvest-hero",
    name: "Harvest Hero",
    description: "Achieved 90%+ crop quality on 20+ harvests",
    icon: "🌟",
    category: "achievement",
    earned: false,
  },
  // Mastery Badges
  {
    id: "quiz-champion",
    name: "Quiz Champion",
    description: "Answered all educational quizzes correctly",
    icon: "📚",
    category: "mastery",
    earned: false,
  },
  {
    id: "sustainable-farmer",
    name: "Sustainable Farmer",
    description: "Used only organic methods for an entire chapter",
    icon: "🌱",
    category: "mastery",
    earned: false,
  },
  {
    id: "weather-watcher",
    name: "Weather Watcher",
    description: "Successfully adapted to 10+ weather events",
    icon: "🌦️",
    category: "mastery",
    earned: false,
  },
]

export const quizzes: Quiz[] = [
  // Chapter 1 Quizzes
  {
    id: "ch1-q1",
    chapterId: 1,
    question: "Why is pearl millet ideal for Rajasthan's climate?",
    options: [
      "It needs lots of water",
      "It's drought-resistant and heat-tolerant",
      "It grows best in cold weather",
      "It requires rich, fertile soil",
    ],
    correctAnswer: 1,
    explanation:
      "Pearl millet (bajra) is perfectly adapted to hot, dry climates with minimal water. It has deep roots that access moisture and can withstand temperatures up to 42°C.",
    bharatPoints: 50,
  },
  {
    id: "ch1-q2",
    chapterId: 1,
    question: "What is the main challenge with sandy loam soil?",
    options: [
      "It holds too much water",
      "It's too acidic",
      "It drains quickly and needs organic matter",
      "It's too compact",
    ],
    correctAnswer: 2,
    explanation:
      "Sandy loam drains rapidly, which can lead to water and nutrient loss. Adding organic matter like compost improves water retention and provides nutrients.",
    bharatPoints: 50,
  },
  {
    id: "ch1-q3",
    chapterId: 1,
    question: "What does SMAP satellite data measure?",
    options: ["Air temperature", "Soil moisture", "Crop height", "Pest populations"],
    correctAnswer: 1,
    explanation:
      "NASA's SMAP (Soil Moisture Active Passive) satellite measures soil moisture from space, helping farmers make informed irrigation decisions.",
    bharatPoints: 50,
  },
  // Chapter 2 Quizzes
  {
    id: "ch2-q1",
    chapterId: 2,
    question: "What is the main risk during monsoon season for rice farming?",
    options: ["Drought", "Frost damage", "Waterlogging and flooding", "Excessive heat"],
    correctAnswer: 2,
    explanation:
      "While rice needs water, excessive monsoon rains can cause waterlogging, which reduces oxygen to roots and can damage crops. Proper drainage is essential.",
    bharatPoints: 50,
  },
  {
    id: "ch2-q2",
    chapterId: 2,
    question: "Why does rice need high nitrogen levels?",
    options: ["For root development", "For leaf and stem growth", "For pest resistance", "For drought tolerance"],
    correctAnswer: 1,
    explanation:
      "Nitrogen is crucial for vegetative growth - the leaves and stems. Rice is a heavy nitrogen feeder, especially during the vegetative and flowering stages.",
    bharatPoints: 50,
  },
  {
    id: "ch2-q3",
    chapterId: 2,
    question: "What makes alluvial soil ideal for agriculture?",
    options: [
      "It's very sandy",
      "It's rich in nutrients from river deposits",
      "It's highly acidic",
      "It drains very slowly",
    ],
    correctAnswer: 1,
    explanation:
      "Alluvial soil is formed by river deposits and is naturally rich in minerals and organic matter, making it highly fertile for crops like rice and wheat.",
    bharatPoints: 50,
  },
  // Chapter 3 Quizzes
  {
    id: "ch3-q1",
    chapterId: 3,
    question: "What is Integrated Pest Management (IPM)?",
    options: [
      "Using only chemical pesticides",
      "Combining biological, cultural, and chemical methods",
      "Ignoring pests completely",
      "Using only organic methods",
    ],
    correctAnswer: 1,
    explanation:
      "IPM uses multiple strategies: beneficial insects, crop rotation, resistant varieties, and chemicals only as a last resort. This reduces environmental impact.",
    bharatPoints: 50,
  },
  {
    id: "ch3-q2",
    chapterId: 3,
    question: "Why is harvest timing critical for wheat?",
    options: [
      "It affects grain quality and yield",
      "It doesn't matter when you harvest",
      "Only for pest control",
      "Only for soil health",
    ],
    correctAnswer: 0,
    explanation:
      "Harvesting too early reduces yield and grain quality. Harvesting too late causes grain shattering and losses. The optimal window is when grains are golden and firm.",
    bharatPoints: 50,
  },
  {
    id: "ch3-q3",
    chapterId: 3,
    question: "What temperature range is ideal for wheat growth?",
    options: ["30-35°C", "15-20°C", "5-10°C", "25-30°C"],
    correctAnswer: 1,
    explanation:
      "Wheat is a cool-season crop that thrives in temperatures between 15-20°C. Higher temperatures can reduce yield and grain quality.",
    bharatPoints: 50,
  },
  // Chapter 4 Quizzes
  {
    id: "ch4-q1",
    chapterId: 4,
    question: "Why is coffee grown under shade?",
    options: [
      "To hide it from birds",
      "To protect from excessive sun and maintain quality",
      "To save water",
      "To prevent frost",
    ],
    correctAnswer: 1,
    explanation:
      "Shade protects coffee plants from harsh sun, maintains cooler temperatures, and produces higher quality beans. It also supports biodiversity and reduces water stress.",
    bharatPoints: 50,
  },
  {
    id: "ch4-q2",
    chapterId: 4,
    question: "What is the benefit of integrated farming with livestock?",
    options: [
      "Only for milk production",
      "Manure enriches soil and provides extra income",
      "No real benefit",
      "Only for pest control",
    ],
    correctAnswer: 1,
    explanation:
      "Livestock provide natural fertilizer (manure) that enriches soil, plus additional income from milk, eggs, or meat. This creates a sustainable, circular farming system.",
    bharatPoints: 50,
  },
  {
    id: "ch4-q3",
    chapterId: 4,
    question: "Why is laterite soil good for coffee?",
    options: ["It's very alkaline", "It's acidic and well-draining", "It holds too much water", "It's very sandy"],
    correctAnswer: 1,
    explanation:
      "Laterite soil is naturally acidic (pH 5-6) and well-draining, which coffee plants prefer. It's also rich in iron and aluminum oxides.",
    bharatPoints: 50,
  },
  // Chapter 5 Quizzes
  {
    id: "ch5-q1",
    chapterId: 5,
    question: "Why do apple trees need winter chill?",
    options: [
      "For pest control",
      "To break dormancy and ensure good flowering",
      "To save water",
      "They don't need cold",
    ],
    correctAnswer: 1,
    explanation:
      "Apple trees need 800-1200 hours below 7°C to break dormancy. This ensures proper flowering and fruit set in spring. Without chill, trees produce poorly.",
    bharatPoints: 50,
  },
  {
    id: "ch5-q2",
    chapterId: 5,
    question: "What makes high-altitude farming challenging?",
    options: [
      "Too much heat",
      "Cold temperatures, steep slopes, and shorter growing seasons",
      "Too much rain",
      "No challenges",
    ],
    correctAnswer: 1,
    explanation:
      "Mountain farming faces cold stress, frost risk, difficult terrain, soil erosion, and shorter growing seasons. It requires specialized knowledge and crop selection.",
    bharatPoints: 50,
  },
  {
    id: "ch5-q3",
    chapterId: 5,
    question: "What is the key to becoming a master farmer?",
    options: [
      "Using lots of chemicals",
      "Ignoring weather patterns",
      "Integrating knowledge of soil, weather, crops, and livestock",
      "Only growing one crop",
    ],
    correctAnswer: 2,
    explanation:
      "Master farmers understand the interconnections: soil health affects crops, weather influences decisions, livestock enriches soil, and diversity builds resilience.",
    bharatPoints: 50,
  },
]
