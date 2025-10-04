import type { CropType, TileData, SoilType, WeatherCondition } from "@/types/game"
import { CROP_DATA, SOIL_PROPERTIES } from "./game-utils"

export interface CropStageInfo {
  stage: number
  name: string
  description: string
  daysInStage: number
  waterNeed: number
  nutrientNeed: number
}

export interface CropYield {
  quantity: number // kg per tile
  quality: number // 0-100%
  bharatPoints: number
  message: string
}

export interface PestDisease {
  type: "pest" | "disease"
  name: string
  severity: number // 0-100
  impact: string
  treatment: string
  treatmentCost: number
  healthBoost: number
}

export class CropEngine {
  getCropStages(cropType: CropType): CropStageInfo[] {
    if (!cropType) return []

    const crop = CROP_DATA[cropType]

    return [
      {
        stage: 0,
        name: "Empty",
        description: "No crop planted",
        daysInStage: 0,
        waterNeed: 0,
        nutrientNeed: 0,
      },
      {
        stage: 1,
        name: "Germination",
        description: "Seeds sprouting, establishing roots",
        daysInStage: crop.germinationDays,
        waterNeed: crop.waterNeed * 1.2,
        nutrientNeed: 20,
      },
      {
        stage: 2,
        name: "Vegetative Growth",
        description: "Rapid leaf and stem development",
        daysInStage: Math.floor(crop.harvestDays * 0.3),
        waterNeed: crop.waterNeed * 1.5,
        nutrientNeed: 40,
      },
      {
        stage: 3,
        name: "Flowering/Fruiting",
        description: "Reproductive stage, flowers and fruits forming",
        daysInStage: Math.floor(crop.harvestDays * 0.3),
        waterNeed: crop.waterNeed,
        nutrientNeed: 60,
      },
      {
        stage: 4,
        name: "Maturation",
        description: "Crop ready for harvest",
        daysInStage: Math.floor(crop.harvestDays * 0.2),
        waterNeed: crop.waterNeed * 0.8,
        nutrientNeed: 30,
      },
    ]
  }

  updateCropGrowth(
    tile: TileData,
    weather: { temp: number; precip: number; condition: WeatherCondition },
    soilType: SoilType,
  ): TileData {
    if (!tile.crop || tile.cropStage >= 4) return tile

    const crop = CROP_DATA[tile.crop]
    const stages = this.getCropStages(tile.crop)
    const currentStage = stages[Math.floor(tile.cropStage)]

    // Calculate growth rate based on conditions
    let growthRate = 0.1 // Base growth per day

    // Temperature factor
    const [minTemp, maxTemp] = crop.tempRange
    const optimalTemp = (minTemp + maxTemp) / 2
    const tempDiff = Math.abs(weather.temp - optimalTemp)
    const tempFactor = Math.max(0, 1 - tempDiff / 20)

    // Water factor
    const waterDiff = Math.abs(tile.moisture - currentStage.waterNeed)
    const waterFactor = Math.max(0, 1 - waterDiff / 50)

    // Nutrient factor
    const nutrientFactor = tile.nutrients / 100

    // Soil compatibility factor
    const soilFactor = crop.idealSoil.includes(soilType) ? 1.2 : 0.7

    // Weather condition factor
    let weatherFactor = 1.0
    if (weather.condition === "drought") weatherFactor = 0.5
    else if (weather.condition === "monsoon" && tile.crop !== "rice") weatherFactor = 0.8
    else if (weather.condition === "sunny") weatherFactor = 1.1

    // Calculate final growth rate
    growthRate *= tempFactor * waterFactor * nutrientFactor * soilFactor * weatherFactor

    // Update crop stage
    const newStage = Math.min(4, tile.cropStage + growthRate)

    let newHealth = tile.health
    if (tempFactor < 0.5) newHealth -= 1 // Reduced from 5
    if (waterFactor < 0.5) newHealth -= 2 // Reduced from 8
    if (nutrientFactor < 0.3) newHealth -= 1 // Reduced from 4
    newHealth = Math.max(0, Math.min(100, newHealth))

    // Consume nutrients
    const nutrientConsumption = 0.5
    const newNutrients = Math.max(0, tile.nutrients - nutrientConsumption)

    return {
      ...tile,
      cropStage: newStage,
      health: newHealth,
      nutrients: newNutrients,
    }
  }

  calculateYield(tile: TileData, soilType: SoilType): CropYield {
    if (!tile.crop || tile.cropStage < 4) {
      return {
        quantity: 0,
        quality: 0,
        bharatPoints: 0,
        message: "Crop not ready for harvest",
      }
    }

    const crop = CROP_DATA[tile.crop]
    const soil = SOIL_PROPERTIES[soilType]

    // Base yield (kg per tile)
    const baseYield: Record<string, number> = {
      ragi: 2.5,
      bajra: 2.0,
      rice: 4.0,
      wheat: 3.5,
      coffee: 1.5,
      apple: 5.0,
    }

    let quantity = baseYield[tile.crop] || 2.0

    // Quality factors
    let quality = 100

    // Health impact
    quality *= tile.health / 100

    // Soil compatibility
    if (!crop.idealSoil.includes(soilType)) {
      quality *= 0.7
      quantity *= 0.7
    }

    // Nutrient level at harvest
    if (tile.nutrients < 30) {
      quality *= 0.8
      quantity *= 0.9
    }

    // Calculate Bharat Points
    let bharatPoints = Math.floor(quantity * quality * 10)

    // Bonus for using ideal soil
    if (crop.idealSoil.includes(soilType)) {
      bharatPoints += 50
    }

    // Bonus for high health
    if (tile.health > 80) {
      bharatPoints += 30
    }

    // Generate message
    let message = ""
    if (quality > 90) {
      message = `Excellent harvest! Premium quality ${crop.name}.`
    } else if (quality > 70) {
      message = `Good harvest of ${crop.name}.`
    } else if (quality > 50) {
      message = `Average harvest. Consider improving soil conditions.`
    } else {
      message = `Poor harvest. Review farming practices.`
    }

    return {
      quantity: Math.round(quantity * 10) / 10,
      quality: Math.round(quality),
      bharatPoints,
      message,
    }
  }

  checkPestsAndDiseases(tile: TileData, weather: WeatherCondition, isStoryMode = false): PestDisease | null {
    if (!tile.crop || tile.health > 70) return null

    const pests: PestDisease[] = [
      {
        type: "pest",
        name: "Stem Borer",
        severity: 60,
        impact: "Reduces yield by 20-30%",
        treatment: "Apply neem oil spray (5ml/L) or use pheromone traps",
        treatmentCost: 50,
        healthBoost: 25,
      },
      {
        type: "pest",
        name: "Aphids",
        severity: 40,
        impact: "Stunts growth, transmits viruses",
        treatment: "Spray soap solution (10g/L) or introduce ladybugs",
        treatmentCost: 30,
        healthBoost: 20,
      },
      {
        type: "disease",
        name: "Blast Disease",
        severity: 70,
        impact: "Leaf spots, reduced photosynthesis",
        treatment: "Apply Tricyclazole fungicide (0.6g/L) and improve drainage",
        treatmentCost: 80,
        healthBoost: 30,
      },
      {
        type: "disease",
        name: "Root Rot",
        severity: 80,
        impact: "Wilting, plant death",
        treatment: "Reduce watering, improve soil drainage, apply Trichoderma",
        treatmentCost: 100,
        healthBoost: 35,
      },
    ]

    // Higher chance of pests/diseases in poor conditions
    const riskFactor = (100 - tile.health) / 100

    const difficultyMultiplier = isStoryMode ? 0.15 : 1.0

    // Weather influences with reduced probabilities
    if (weather === "monsoon" && Math.random() < riskFactor * 0.7 * difficultyMultiplier) {
      return pests[2] // Blast disease more common in wet conditions
    } else if (weather === "drought" && Math.random() < riskFactor * 0.5 * difficultyMultiplier) {
      return pests[1] // Aphids in dry conditions
    } else if (tile.moisture > 80 && Math.random() < riskFactor * 0.6 * difficultyMultiplier) {
      return pests[3] // Root rot in waterlogged soil
    } else if (Math.random() < riskFactor * 0.4 * difficultyMultiplier) {
      return pests[0] // General pest
    }

    return null
  }

  getCropRecommendations(soilType: SoilType, weather: { temp: number; precip: number }): CropType[] {
    const recommendations: CropType[] = []

    Object.entries(CROP_DATA).forEach(([cropKey, cropData]) => {
      const crop = cropKey as CropType

      // Check soil compatibility
      if (!cropData.idealSoil.includes(soilType)) return

      // Check temperature range
      if (weather.temp < cropData.tempRange[0] || weather.temp > cropData.tempRange[1]) return

      // Check water availability
      if (weather.precip < cropData.waterNeed - 10) return

      recommendations.push(crop)
    })

    return recommendations
  }

  getIntercroppingBenefits(
    crop1: CropType,
    crop2: CropType,
  ): {
    compatible: boolean
    benefits: string[]
    yieldBonus: number
  } {
    // Intercropping combinations
    const combinations: Record<string, { compatible: boolean; benefits: string[]; yieldBonus: number }> = {
      "ragi-legume": {
        compatible: true,
        benefits: ["Nitrogen fixation improves soil", "Reduced pest pressure", "Better land use"],
        yieldBonus: 15,
      },
      "wheat-mustard": {
        compatible: true,
        benefits: ["Complementary root systems", "Pest deterrent", "Increased biodiversity"],
        yieldBonus: 10,
      },
      "rice-fish": {
        compatible: true,
        benefits: ["Fish control pests", "Fish waste fertilizes rice", "Additional protein source"],
        yieldBonus: 20,
      },
    }

    const key = `${crop1}-${crop2}`
    return (
      combinations[key] || {
        compatible: false,
        benefits: [],
        yieldBonus: 0,
      }
    )
  }

  applyTreatment(tile: TileData, pestDisease: PestDisease): TileData {
    if (!tile.crop) return tile

    const newTile = { ...tile }

    // Boost health based on treatment effectiveness
    newTile.health = Math.min(100, newTile.health + pestDisease.healthBoost)

    // Also slightly improve nutrients as treatment includes care
    newTile.nutrients = Math.min(100, newTile.nutrients + 5)

    return newTile
  }

  applyEmergencyCare(tile: TileData): { tile: TileData; cost: number } {
    if (!tile.crop) return { tile, cost: 0 }

    const newTile = { ...tile }
    const cost = 150 // Emergency care is expensive

    // Emergency care provides comprehensive boost
    newTile.health = Math.min(100, newTile.health + 40)
    newTile.moisture = Math.min(100, newTile.moisture + 30)
    newTile.nutrients = Math.min(100, newTile.nutrients + 25)

    return { tile: newTile, cost }
  }
}
