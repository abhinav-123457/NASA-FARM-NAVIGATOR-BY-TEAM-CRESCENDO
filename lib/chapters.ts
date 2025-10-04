export interface ChapterObjective {
  id: string
  description: string
  completed: boolean
  target?: number
  current?: number
}

export interface ChapterData {
  id: number
  title: string
  region: string
  description: string
  objectives: ChapterObjective[]
  initialConditions: {
    money: number
    day: number
    region: string
    soilType: string
    weather: string
  }
  tutorialSteps: {
    step: number
    title: string
    description: string
    highlight?: string
  }[]
  successCriteria: {
    minYield: number
    maxDays: number
    minQuality: number
  }
  rewards: {
    bharatPoints: number
    badge: string
    unlockedCrops?: string[]
  }
  recommendedCrop: string
  requiredLivestock: number
}

export const chapters: ChapterData[] = [
  {
    id: 1,
    title: "The Spark in the Soil",
    region: "Rajasthan",
    description:
      "In Jodhpur's arid embrace, young Priya inherits a drought-scarred millet plot. Learn about sandy soil, drought awareness, and basic land preparation in the Thar Desert.",
    recommendedCrop: "ragi",
    requiredLivestock: 2,
    objectives: [
      {
        id: "plant-millet",
        description: "Plant ragi (finger millet) on at least 3 tiles",
        completed: false,
        target: 3,
        current: 0,
      },
      {
        id: "water-crops",
        description: "Water your crops to maintain moisture levels",
        completed: false,
      },
      {
        id: "add-livestock",
        description: "Add 2 cows to your farm for integrated farming",
        completed: false,
        target: 2,
        current: 0,
      },
      {
        id: "harvest-millet",
        description: "Harvest your ragi crop to earn 100 Bharat Points",
        completed: false,
        target: 100,
        current: 0,
      },
    ],
    initialConditions: {
      money: 5000,
      day: 1,
      region: "Rajasthan",
      soilType: "Sandy Loam",
      weather: "Hot & Dry",
    },
    tutorialSteps: [
      {
        step: 1,
        title: "Welcome to Rajasthan, Navigator!",
        description:
          "Namaste! I'm Coach Aria, your guide. Rajasthan's sandy soil has low water retention (10-15%) but is perfect for drought-resistant crops like ragi. Check the soil panel to understand pH levels.",
        highlight: "soil-panel",
      },
      {
        step: 2,
        title: "Understanding Sandy Soil",
        description:
          "Sandy soil drains quickly and needs pH testing (ideal: 6.0-7.5). Real farmers use NASA's SMAP data to map moisture, boosting yields by 20%. You may need to apply lime if soil is too acidic.",
        highlight: "soil-panel",
      },
      {
        step: 3,
        title: "Plant Ragi (Finger Millet)",
        description:
          "Ragi is drought-resistant and nutritious! Plant it 2cm deep with 75x20cm spacing. It germinates in 7-10 days. Click empty tiles to plant your first crop.",
        highlight: "toolbar",
      },
      {
        step: 4,
        title: "Water Management",
        description:
          "Water is precious in the desert! Keep moisture above 15% but don't overwater. Ragi is drought-tolerant and thrives in hot conditions (25-45°C).",
        highlight: "weather-panel",
      },
      {
        step: 5,
        title: "Add Livestock",
        description:
          "Select the livestock tool and add 2 cows to your farm. Feed them forage and water them daily. Their manure will enrich your soil naturally!",
        highlight: "toolbar",
      },
    ],
    successCriteria: {
      minYield: 500,
      maxDays: 90,
      minQuality: 70,
    },
    rewards: {
      bharatPoints: 100,
      badge: "Soil Sentinel",
      unlockedCrops: ["Bajra"],
    },
  },
  {
    id: 2,
    title: "Sowing Dreams",
    region: "Punjab",
    description:
      "Shifting to Punjab's fertile doabs, Priya revives her aunt's waterlogged paddy. Master water management, planting techniques, and weather adaptation during monsoon season.",
    recommendedCrop: "rice",
    requiredLivestock: 4,
    objectives: [
      {
        id: "plant-rice",
        description: "Plant rice on at least 6 tiles",
        completed: false,
        target: 6,
        current: 0,
      },
      {
        id: "irrigate-crops",
        description: "Use Irrigate All to manage water during monsoon",
        completed: false,
      },
      {
        id: "add-livestock",
        description: "Add 4 cows total to your farm",
        completed: false,
        target: 4,
        current: 0,
      },
      {
        id: "harvest-rice",
        description: "Harvest rice to earn 150 Bharat Points",
        completed: false,
        target: 150,
        current: 0,
      },
    ],
    initialConditions: {
      money: 8000,
      day: 1,
      region: "Punjab",
      soilType: "Alluvial",
      weather: "Monsoon",
    },
    tutorialSteps: [
      {
        step: 1,
        title: "Welcome to Punjab's Breadbasket!",
        description:
          "Punjab receives 1000+ mm of monsoon rain (Jun-Sep). Alluvial soil holds 25-35% moisture - perfect for rice! But too much water causes waterlogging.",
        highlight: "weather-panel",
      },
      {
        step: 2,
        title: "Alluvial Soil Benefits",
        description:
          "Alluvial soil is nutrient-rich with high water retention. Rice needs moist conditions (20-30°C) and takes 120-150 days to mature. Use GPM data to time your planting!",
        highlight: "soil-panel",
      },
      {
        step: 3,
        title: "Plant Rice with Proper Spacing",
        description:
          "Plant rice with 75x20cm spacing. Add 5cm mulch layer to retain moisture. Rice goes through vegetative (3-6 weeks), flowering, and maturity stages.",
        highlight: "toolbar",
      },
      {
        step: 4,
        title: "Monsoon Water Management",
        description:
          "During monsoon, maintain 20-50% moisture. Too much water rots roots! Use the Irrigate All button for efficient watering. Add drainage if needed.",
        highlight: "toolbar",
      },
      {
        step: 5,
        title: "Expand Your Livestock",
        description:
          "Add 4 cows total (you should have 2 from Chapter 1). Provide water troughs for their health. Well-fed livestock produce better yields!",
        highlight: "livestock-panel",
      },
    ],
    successCriteria: {
      minYield: 800,
      maxDays: 150,
      minQuality: 75,
    },
    rewards: {
      bharatPoints: 150,
      badge: "Monsoon Maestro",
      unlockedCrops: ["Wheat"],
    },
  },
  {
    id: 3,
    title: "The Gentle Rain of Care",
    region: "Bihar",
    description:
      "Amid Bihar's alluvial plains, Priya joins a co-op battling depleted fields. Learn nutrient planning, soil enrichment, and crop rotation with wheat farming.",
    recommendedCrop: "wheat",
    requiredLivestock: 6,
    objectives: [
      {
        id: "plant-wheat",
        description: "Plant wheat on at least 5 tiles",
        completed: false,
        target: 5,
        current: 0,
      },
      {
        id: "fertilize-crops",
        description: "Use Fertilize All to enrich your soil with N-P-K",
        completed: false,
      },
      {
        id: "add-livestock",
        description: "Add 6 cows total to your farm",
        completed: false,
        target: 6,
        current: 0,
      },
      {
        id: "harvest-wheat",
        description: "Harvest wheat to earn 200 Bharat Points",
        completed: false,
        target: 200,
        current: 0,
      },
    ],
    initialConditions: {
      money: 10000,
      day: 1,
      region: "Bihar",
      soilType: "Alluvial",
      weather: "Cool & Dry",
    },
    tutorialSteps: [
      {
        step: 1,
        title: "Welcome to Bihar's Gangetic Plains!",
        description:
          "Bihar's loamy soil retains 20-30% nutrients. Wheat needs cool temperatures (15-35°C) and balanced N-P-K fertilization. Rotation with legumes breaks pest cycles!",
        highlight: "weather-panel",
      },
      {
        step: 2,
        title: "Nutrient Cycles and Soil Health",
        description:
          "Apply basal N-P-K (135:62.5:50 kg/ha) and split urea applications. Legumes fix nitrogen naturally. Use NASA's Harvest tool to map nutrient deficiencies!",
        highlight: "soil-panel",
      },
      {
        step: 3,
        title: "Plant Wheat for Chhath",
        description:
          "Sow wheat in Oct-Nov, harvest in Mar-Apr (120 days). Plant with proper spacing and monitor for yellowing leaves - a sign of nutrient deficiency.",
        highlight: "toolbar",
      },
      {
        step: 4,
        title: "Fertilization Strategy",
        description:
          "Use the Fertilize All button to apply N-P-K to all crops. Watch for flowering stage (2-4 weeks) - this is critical for yield! Deficiencies stunt growth by 40%.",
        highlight: "toolbar",
      },
      {
        step: 5,
        title: "Livestock Nutrition",
        description:
          "Expand to 6 cows. Feed them 16% protein (60:40 forage-concentrate ratio). Low protein slows milk production over 10 days. Keep pens clean!",
        highlight: "livestock-panel",
      },
    ],
    successCriteria: {
      minYield: 1000,
      maxDays: 120,
      minQuality: 80,
    },
    rewards: {
      bharatPoints: 200,
      badge: "Earth Enricher",
      unlockedCrops: ["Coffee"],
    },
  },
  {
    id: 4,
    title: "Guardians Against the Tiny Foes",
    region: "Karnataka",
    description:
      "In Coorg's hilly haze, Priya defends tribal coffee groves. Master crop monitoring, pest control with IPM, and livestock health in humid conditions.",
    recommendedCrop: "coffee",
    requiredLivestock: 8,
    objectives: [
      {
        id: "plant-coffee",
        description: "Plant coffee on at least 4 tiles",
        completed: false,
        target: 4,
        current: 0,
      },
      {
        id: "pest-management",
        description: "Monitor and treat any pest or disease issues",
        completed: false,
      },
      {
        id: "add-livestock",
        description: "Add 8 cows total to your farm",
        completed: false,
        target: 8,
        current: 0,
      },
      {
        id: "harvest-coffee",
        description: "Harvest coffee to earn 250 Bharat Points",
        completed: false,
        target: 250,
        current: 0,
      },
    ],
    initialConditions: {
      money: 12000,
      day: 1,
      region: "Karnataka",
      soilType: "Laterite",
      weather: "Tropical",
    },
    tutorialSteps: [
      {
        step: 1,
        title: "Welcome to Coorg's Coffee Country!",
        description:
          "Karnataka's red laterite soil (pH 5.0-6.5) drains well but leaches nutrients. Coffee is perennial and harvests 8-9 months post-bloom. Humidity (18-32°C) brings pests!",
        highlight: "weather-panel",
      },
      {
        step: 2,
        title: "Integrated Pest Management (IPM)",
        description:
          "Scout for aphids (50/leaf threshold). Use biocontrols like Trichogramma and neem spray (2 mL/L) first. Chemicals are last resort - IPM cuts chemical use by 40%!",
        highlight: "crop-panel",
      },
      {
        step: 3,
        title: "Plant Shade-Grown Coffee",
        description:
          "Coffee loves partial shade and consistent moisture. Plant on slopes for drainage. Use CASMA to spot stress early - pests can defoliate and reduce yield by 50%!",
        highlight: "toolbar",
      },
      {
        step: 4,
        title: "Monitor Crop Health",
        description:
          "Check the Crop Info Panel regularly for pest warnings. Apply treatment when needed. Healthy coffee cherries ripen for Diwali celebrations!",
        highlight: "crop-panel",
      },
      {
        step: 5,
        title: "Livestock Hygiene",
        description:
          "Expand to 8 cows. In humid conditions, dirty pens cause illness over 14 days, halving milk production. Clean pens regularly and maintain proper feeding!",
        highlight: "livestock-panel",
      },
    ],
    successCriteria: {
      minYield: 400,
      maxDays: 270,
      minQuality: 85,
    },
    rewards: {
      bharatPoints: 250,
      badge: "Canopy Keeper",
      unlockedCrops: ["Apple"],
    },
  },
  {
    id: 5,
    title: "Watching Wonders Grow",
    region: "Himachal Pradesh",
    description:
      "In Kinnaur's crisp folds, Priya orchestrates an integrated orchard. Master strategic planning, full farm balance, and create a Lohri legacy with apples and livestock.",
    recommendedCrop: "apple",
    requiredLivestock: 10,
    objectives: [
      {
        id: "plant-apples",
        description: "Plant apples on at least 6 tiles",
        completed: false,
        target: 6,
        current: 0,
      },
      {
        id: "integrated-farming",
        description: "Add 10 cows total for full integration",
        completed: false,
        target: 10,
        current: 0,
      },
      {
        id: "farm-balance",
        description: "Use all bulk actions (Irrigate, Fertilize, Harvest All)",
        completed: false,
      },
      {
        id: "harvest-apples",
        description: "Harvest apples to earn 300 Bharat Points",
        completed: false,
        target: 300,
        current: 0,
      },
    ],
    initialConditions: {
      money: 15000,
      day: 1,
      region: "Himachal Pradesh",
      soilType: "Mountain Loam",
      weather: "Cold",
    },
    tutorialSteps: [
      {
        step: 1,
        title: "Welcome to Himachal's Mountain Paradise!",
        description:
          "You've reached the final frontier! Loamy soil (pH 6.0-7.0) suits fruits and livestock. Cool weather (5-30°C) with 800mm snow-rain. Apples bloom Mar-Apr, harvest Aug-Oct.",
        highlight: "weather-panel",
      },
      {
        step: 2,
        title: "Strategic Integration",
        description:
          "This is your masterpiece! Balance crops and livestock. Use SERVIR forecasts to predict 20% profit gains. Apples need winter chill but protection from extreme cold.",
        highlight: "objectives-panel",
      },
      {
        step: 3,
        title: "Plant Your Orchard",
        description:
          "Plant 6 apple trees. They take longer to mature (90-120 days full cycle) but yield high returns. Mulch to protect roots from frost!",
        highlight: "toolbar",
      },
      {
        step: 4,
        title: "Master All Tools",
        description:
          "Use Irrigate All, Fertilize All, and Harvest All buttons to manage your farm efficiently. Rotate crops and integrate livestock for maximum sustainability!",
        highlight: "toolbar",
      },
      {
        step: 5,
        title: "Complete Integration",
        description:
          "Expand to 10 cows! Feed them 16% protein (60:40 ratio) and maintain hygiene. Neglect reduces health and yield by 20-30% over 14 days. Balance is key!",
        highlight: "livestock-panel",
      },
    ],
    successCriteria: {
      minYield: 600,
      maxDays: 180,
      minQuality: 90,
    },
    rewards: {
      bharatPoints: 300,
      badge: "Bharat Harmony Master",
      unlockedCrops: ["All Crops Unlocked"],
    },
  },
]
