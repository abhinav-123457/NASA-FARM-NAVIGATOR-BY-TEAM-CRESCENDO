import type { SoilType, CropType, TileData, LocationType } from "@/types/game"

export const REGION_SOIL_REQUIREMENTS = {
  rajasthan: {
    name: "Rajasthan",
    idealSoils: ["sandy", "loamy"],
    moistureMultiplier: 0.7, // Crops need less water in arid regions
    fertilizationMultiplier: 1.2, // Need more fertilizer due to poor soil
    description: "Arid desert region - water conservation critical",
  },
  punjab: {
    name: "Punjab",
    idealSoils: ["alluvial", "loamy"],
    moistureMultiplier: 1.3, // High water availability
    fertilizationMultiplier: 0.9, // Rich soil needs less fertilizer
    description: "Fertile plains - excellent for intensive farming",
  },
  bihar: {
    name: "Bihar",
    idealSoils: ["alluvial"],
    moistureMultiplier: 1.2,
    fertilizationMultiplier: 0.8,
    description: "Gangetic plains - naturally fertile soil",
  },
  karnataka: {
    name: "Karnataka",
    idealSoils: ["laterite", "red"],
    moistureMultiplier: 1.4, // High rainfall region
    fertilizationMultiplier: 1.1, // Laterite needs nutrients
    description: "Tropical highlands - ideal for coffee and spices",
  },
  himachal: {
    name: "Himachal Pradesh",
    idealSoils: ["loamy"],
    moistureMultiplier: 1.0,
    fertilizationMultiplier: 1.0,
    description: "Mountain region - cool climate farming",
  },
  tamilnadu: {
    name: "Tamil Nadu",
    idealSoils: ["alluvial", "black"],
    moistureMultiplier: 1.1,
    fertilizationMultiplier: 0.9,
    description: "Tropical region - good for sugarcane and rice",
  },
  gujarat: {
    name: "Gujarat",
    idealSoils: ["black", "alluvial"],
    moistureMultiplier: 0.8, // Semi-arid
    fertilizationMultiplier: 0.85, // Black soil is fertile
    description: "Semi-arid with black soil - perfect for cotton",
  },
  westbengal: {
    name: "West Bengal",
    idealSoils: ["alluvial", "loamy"],
    moistureMultiplier: 1.5, // Very high rainfall
    fertilizationMultiplier: 0.9,
    description: "High rainfall region - tea and rice cultivation",
  },
}

export const SOIL_PROPERTIES = {
  sandy: {
    name: "Sandy Soil",
    icon: "🏜️",
    waterRetention: 12.5,
    drainage: 90,
    fertility: 40,
    ph: 5.2,
    color: "#D4A574",
    description: "Low water retention, drains fast - ideal for millets",
  },
  alluvial: {
    name: "Alluvial Soil",
    icon: "🌾",
    waterRetention: 30,
    drainage: 60,
    fertility: 85,
    ph: 6.8,
    color: "#8B7355",
    description: "High retention, fertile - perfect for rice and wheat",
  },
  loamy: {
    name: "Loamy Soil",
    icon: "🌱",
    waterRetention: 25,
    drainage: 70,
    fertility: 80,
    ph: 6.5,
    color: "#6B5444",
    description: "Balanced nutrients - suits fruits and livestock",
  },
  laterite: {
    name: "Laterite Soil",
    icon: "☕",
    waterRetention: 18,
    drainage: 75,
    fertility: 50,
    ph: 5.5,
    color: "#A0522D",
    description: "Acidic, drains well - good for coffee",
  },
  clay: {
    name: "Clay Soil",
    icon: "🏺",
    waterRetention: 45,
    drainage: 30,
    fertility: 70,
    ph: 7.2,
    color: "#8B6F47",
    description: "High water retention, poor drainage - needs careful management",
  },
  black: {
    name: "Black Soil",
    icon: "🌑",
    waterRetention: 35,
    drainage: 50,
    fertility: 90,
    ph: 7.5,
    color: "#2C2416",
    description: "Rich in nutrients, excellent for cotton and sugarcane",
  },
  red: {
    name: "Red Soil",
    icon: "🔴",
    waterRetention: 20,
    drainage: 80,
    fertility: 60,
    ph: 6.0,
    color: "#B7410E",
    description: "Iron-rich, good drainage - suitable for groundnuts and pulses",
  },
}

export const CROP_DATA = {
  ragi: {
    name: "Ragi (Finger Millet)",
    germinationDays: 7,
    harvestDays: 120,
    idealSoil: ["sandy", "loamy"],
    waterNeed: 15, // percentage
    tempRange: [25, 35],
    color: "#9ACD32",
  },
  rice: {
    name: "Rice (Paddy)",
    germinationDays: 10,
    harvestDays: 135,
    idealSoil: ["alluvial"],
    waterNeed: 40,
    tempRange: [20, 30],
    color: "#7CFC00",
  },
  wheat: {
    name: "Wheat",
    germinationDays: 7,
    harvestDays: 120,
    idealSoil: ["alluvial", "loamy"],
    waterNeed: 25,
    tempRange: [15, 25],
    color: "#DAA520",
  },
  coffee: {
    name: "Coffee",
    germinationDays: 14,
    harvestDays: 240,
    idealSoil: ["laterite"],
    waterNeed: 35,
    tempRange: [18, 28],
    color: "#8B4513",
  },
  apple: {
    name: "Apple",
    germinationDays: 21,
    harvestDays: 180,
    idealSoil: ["loamy"],
    waterNeed: 20,
    tempRange: [5, 25],
    color: "#DC143C",
  },
  bajra: {
    name: "Bajra (Pearl Millet)",
    germinationDays: 5,
    harvestDays: 90,
    idealSoil: ["sandy"],
    waterNeed: 12,
    tempRange: [25, 40],
    color: "#BDB76B",
  },
}

export function checkRegionSoilCompatibility(
  region: LocationType,
  soil: SoilType,
): {
  compatible: boolean
  score: number
  message: string
  recommendations: string[]
} {
  const regionData = REGION_SOIL_REQUIREMENTS[region]
  const soilData = SOIL_PROPERTIES[soil]
  const recommendations: string[] = []

  const isIdealSoil = regionData.idealSoils.includes(soil)
  const score = isIdealSoil ? 90 : 60

  let message = ""

  if (isIdealSoil) {
    message = `✅ Excellent match! ${soilData.name} is ideal for ${regionData.name}.`
    recommendations.push(`This combination is perfect for the region's climate`)
    recommendations.push(
      `Water needs: ${regionData.moistureMultiplier < 1 ? "Low" : regionData.moistureMultiplier > 1.2 ? "High" : "Moderate"}`,
    )
    recommendations.push(
      `Fertilizer needs: ${regionData.fertilizationMultiplier < 1 ? "Low" : regionData.fertilizationMultiplier > 1.1 ? "High" : "Moderate"}`,
    )
  } else {
    message = `⚠️ Workable but not ideal. ${soilData.name} can work in ${regionData.name}, but consider ${regionData.idealSoils.join(" or ")} soil for better results.`
    recommendations.push(`Consider soil amendments to improve compatibility`)
    recommendations.push(`Monitor crops closely for stress signs`)
    recommendations.push(
      `Ideal soils for this region: ${regionData.idealSoils.map((s) => SOIL_PROPERTIES[s].name).join(", ")}`,
    )
  }

  return {
    compatible: score >= 60,
    score,
    message,
    recommendations,
  }
}

export function createEmptyTile(x: number, y: number, soilType: SoilType): TileData {
  return {
    x,
    y,
    soilType,
    crop: null,
    cropStage: 0,
    moisture: 50,
    nutrients: 50,
    health: 100,
    hasCow: false,
    livestock: null,
    livestockHealth: 100,
    livestockHunger: 0,
  }
}

export function isCropSuitableForSoil(crop: CropType, soil: SoilType): boolean {
  if (!crop) return true
  return CROP_DATA[crop].idealSoil.includes(soil)
}

export function calculateCropHealth(tile: TileData, weather: { temp: number; precip: number }): number {
  if (!tile.crop) return 100

  const cropData = CROP_DATA[tile.crop]
  let health = tile.health

  // Temperature check
  if (weather.temp < cropData.tempRange[0] || weather.temp > cropData.tempRange[1]) {
    health -= 5
  }

  // Moisture check
  if (tile.moisture < cropData.waterNeed - 10) {
    health -= 8
  } else if (tile.moisture > cropData.waterNeed + 20) {
    health -= 6
  }

  // Nutrient check
  if (tile.nutrients < 30) {
    health -= 4
  }

  // Soil suitability
  if (!isCropSuitableForSoil(tile.crop, tile.soilType)) {
    health -= 10
  }

  return Math.max(0, Math.min(100, health))
}
