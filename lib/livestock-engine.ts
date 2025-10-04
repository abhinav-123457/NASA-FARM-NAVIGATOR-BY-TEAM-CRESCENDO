import type { LivestockType, LivestockData, WeatherCondition } from "@/types/game"

export interface LivestockInfo {
  name: string
  description: string
  dailyFeed: number // kg
  waterNeed: number // liters
  spaceRequired: number // tiles
  productivity: {
    type: "milk" | "eggs" | "meat"
    amount: number
    unit: string
  }
  idealTemp: [number, number]
  lifespan: number // days
  cost: number // Bharat Points
}

export const LIVESTOCK_INFO: Record<Exclude<LivestockType, null>, LivestockInfo> = {
  cow: {
    name: "Dairy Cow (Gir/Sahiwal)",
    description: "Indigenous Indian breed, heat-tolerant, produces A2 milk",
    dailyFeed: 25,
    waterNeed: 60,
    spaceRequired: 2,
    productivity: {
      type: "milk",
      amount: 12,
      unit: "liters/day",
    },
    idealTemp: [15, 35],
    lifespan: 3650,
    cost: 200,
  },
  buffalo: {
    name: "Water Buffalo (Murrah)",
    description: "High-fat milk producer, prefers wet conditions",
    dailyFeed: 30,
    waterNeed: 80,
    spaceRequired: 2,
    productivity: {
      type: "milk",
      amount: 15,
      unit: "liters/day",
    },
    idealTemp: [10, 30],
    lifespan: 3650,
    cost: 250,
  },
  goat: {
    name: "Goat (Jamunapari/Beetal)",
    description: "Hardy, adaptable, good for small farms",
    dailyFeed: 5,
    waterNeed: 8,
    spaceRequired: 1,
    productivity: {
      type: "milk",
      amount: 2,
      unit: "liters/day",
    },
    idealTemp: [15, 40],
    lifespan: 2190,
    cost: 100,
  },
  chicken: {
    name: "Desi Chicken (Kadaknath)",
    description: "Free-range, disease-resistant, nutritious eggs",
    dailyFeed: 0.12,
    waterNeed: 0.25,
    spaceRequired: 1,
    productivity: {
      type: "eggs",
      amount: 5,
      unit: "eggs/week",
    },
    idealTemp: [18, 35],
    lifespan: 730,
    cost: 50,
  },
}

export interface HealthIssue {
  name: string
  severity: number
  symptoms: string
  treatment: string
  prevention: string
}

export class LivestockEngine {
  updateLivestockHealth(
    livestock: LivestockData,
    weather: { temp: number; condition: WeatherCondition },
    fedToday: boolean,
    wateredToday: boolean,
    isStoryMode = false,
  ): LivestockData {
    const info = LIVESTOCK_INFO[livestock.type!]
    let newHealth = livestock.health
    let newHunger = livestock.hunger

    const healthPenaltyMultiplier = isStoryMode ? 0.2 : 0.4

    if (!fedToday) {
      newHunger = Math.min(100, newHunger + 15)
      newHealth -= 5 * healthPenaltyMultiplier
    } else {
      newHunger = Math.max(0, newHunger - 30)
      newHealth = Math.min(100, newHealth + 2)
    }

    if (!wateredToday) {
      newHealth -= 8 * healthPenaltyMultiplier
    }

    const [minTemp, maxTemp] = info.idealTemp
    if (weather.temp < minTemp || weather.temp > maxTemp) {
      newHealth -= 3 * healthPenaltyMultiplier
    }

    if (weather.condition === "drought" && livestock.type !== "goat") {
      newHealth -= 4 * healthPenaltyMultiplier
    } else if (weather.condition === "monsoon" && livestock.type === "chicken") {
      newHealth -= 3 * healthPenaltyMultiplier
    }

    if (livestock.age > info.lifespan * 0.8) {
      newHealth -= 1 * healthPenaltyMultiplier
    }

    let newProductivity = info.productivity.amount
    if (newHealth < 70) {
      newProductivity *= newHealth / 100
    }

    return {
      ...livestock,
      health: Math.max(0, Math.min(100, newHealth)),
      hunger: newHunger,
      productivity: newProductivity,
      age: livestock.age + 1,
    }
  }

  calculateDailyYield(livestock: LivestockData): {
    amount: number
    quality: number
    bharatPoints: number
  } {
    const info = LIVESTOCK_INFO[livestock.type!]

    const amount = livestock.productivity

    const quality = livestock.health

    let bharatPoints = 0
    if (info.productivity.type === "milk") {
      bharatPoints = Math.floor(amount * quality * 0.5)
    } else if (info.productivity.type === "eggs") {
      bharatPoints = Math.floor(amount * quality * 0.3)
    }

    return {
      amount: Math.round(amount * 10) / 10,
      quality: Math.round(quality),
      bharatPoints,
    }
  }

  diagnoseHealthIssues(livestock: LivestockData): HealthIssue | null {
    return null
  }

  treatDisease(livestock: LivestockData): {
    success: boolean
    healthRestored: number
    message: string
  } {
    return {
      success: false,
      healthRestored: 0,
      message: "Livestock disease system is disabled.",
    }
  }

  emergencyCare(livestock: LivestockData): {
    success: boolean
    healthRestored: number
    message: string
  } {
    return {
      success: false,
      healthRestored: 0,
      message: "Livestock disease system is disabled.",
    }
  }

  getFeedRecommendations(livestock: LivestockData): {
    feed: string[]
    supplements: string[]
    schedule: string
  } {
    const type = livestock.type!

    const recommendations: Record<
      Exclude<LivestockType, null>,
      { feed: string[]; supplements: string[]; schedule: string }
    > = {
      cow: {
        feed: [
          "Green fodder: 15-20 kg (Berseem, Lucerne, Maize)",
          "Dry fodder: 5-7 kg (Wheat/Rice straw)",
          "Concentrate: 3-4 kg (Cattle feed mix)",
        ],
        supplements: ["Mineral mixture: 50g", "Salt: 30g", "Calcium: 100g for lactating cows"],
        schedule: "Feed 3 times daily: Morning (6 AM), Afternoon (2 PM), Evening (6 PM)",
      },
      buffalo: {
        feed: ["Green fodder: 20-25 kg", "Dry fodder: 6-8 kg", "Concentrate: 4-5 kg", "Water plants (if available)"],
        supplements: ["Mineral mixture: 60g", "Salt: 40g", "Vitamin A & D supplements"],
        schedule: "Feed 3 times daily with access to wallowing water",
      },
      goat: {
        feed: ["Green fodder: 3-4 kg", "Dry fodder: 1 kg", "Concentrate: 200-300g", "Browse leaves"],
        supplements: ["Mineral mixture: 10g", "Salt: 5g"],
        schedule: "Feed 2 times daily: Morning and Evening, allow grazing",
      },
      chicken: {
        feed: ["Layer feed: 100-120g per bird", "Grains: Maize, Bajra, Wheat", "Kitchen scraps (vegetables)"],
        supplements: ["Grit for digestion", "Calcium (crushed shells)", "Green vegetables"],
        schedule: "Feed 2-3 times daily, constant access to water",
      },
    }

    return recommendations[type]
  }

  getBreedingInfo(livestock: LivestockData): {
    canBreed: boolean
    breedingAge: number
    gestationPeriod: number
    offspringValue: number
  } {
    const type = livestock.type!

    const breedingData: Record<
      Exclude<LivestockType, null>,
      { breedingAge: number; gestationPeriod: number; offspringValue: number }
    > = {
      cow: { breedingAge: 730, gestationPeriod: 283, offspringValue: 150 },
      buffalo: { breedingAge: 912, gestationPeriod: 310, offspringValue: 180 },
      goat: { breedingAge: 273, gestationPeriod: 150, offspringValue: 80 },
      chicken: { breedingAge: 150, gestationPeriod: 21, offspringValue: 30 },
    }

    const data = breedingData[type]
    const canBreed = livestock.age >= data.breedingAge && livestock.health > 70

    return {
      canBreed,
      ...data,
    }
  }
}
