import type { SoilType, TileData } from "@/types/game"
import { SOIL_PROPERTIES } from "./game-utils"

export interface SoilAnalysis {
  ph: number
  waterRetention: number
  nutrientLevel: number
  organicMatter: number
  salinity: number
  recommendations: string[]
}

export class SoilEngine {
  analyzeSoil(tile: TileData): SoilAnalysis {
    const soilProps = SOIL_PROPERTIES[tile.soilType]
    const recommendations: string[] = []

    // pH analysis
    let ph = soilProps.ph
    if (tile.nutrients < 30) {
      ph -= 0.3 // Nutrient depletion can acidify soil
    }

    if (ph < 6.0) {
      recommendations.push("Apply lime (2 t/ha) to raise pH to optimal 6.0-7.5 range")
    } else if (ph > 7.5) {
      recommendations.push("Add organic matter to lower pH and improve nutrient availability")
    }

    // Water retention
    const waterRetention = soilProps.waterRetention
    if (waterRetention < 15) {
      recommendations.push("Add mulch (5 cm layer) to improve water retention")
      recommendations.push("Consider drip irrigation to minimize water loss")
    }

    // Nutrient level
    if (tile.nutrients < 40) {
      recommendations.push("Apply basal fertilizer: N-P-K 135:62.5:50 kg/ha")
      recommendations.push("Consider crop rotation with legumes to fix nitrogen")
    }

    // Organic matter
    const organicMatter = tile.nutrients * 0.5 // Simplified correlation
    if (organicMatter < 30) {
      recommendations.push("Add farmyard manure (10 t/ha) to boost organic content")
    }

    // Salinity (increases with over-irrigation)
    const salinity = Math.max(0, tile.moisture - 80) * 2
    if (salinity > 20) {
      recommendations.push("Reduce irrigation to prevent salt buildup")
      recommendations.push("Improve drainage to leach excess salts")
    }

    return {
      ph,
      waterRetention,
      nutrientLevel: tile.nutrients,
      organicMatter,
      salinity,
      recommendations,
    }
  }

  getSoilCompatibility(
    soilType: SoilType,
    cropType: string,
  ): {
    compatible: boolean
    reason: string
    yieldImpact: number
  } {
    const soilProps = SOIL_PROPERTIES[soilType]

    // Crop-specific soil requirements
    const requirements: Record<
      string,
      { idealSoils: SoilType[]; minWaterRetention: number; phRange: [number, number] }
    > = {
      ragi: { idealSoils: ["sandy", "loamy"], minWaterRetention: 10, phRange: [5.5, 7.0] },
      bajra: { idealSoils: ["sandy"], minWaterRetention: 8, phRange: [6.0, 7.5] },
      rice: { idealSoils: ["alluvial"], minWaterRetention: 25, phRange: [6.0, 7.5] },
      wheat: { idealSoils: ["alluvial", "loamy"], minWaterRetention: 20, phRange: [6.0, 7.0] },
      coffee: { idealSoils: ["laterite"], minWaterRetention: 15, phRange: [5.0, 6.5] },
      apple: { idealSoils: ["loamy"], minWaterRetention: 20, phRange: [6.0, 7.0] },
    }

    const req = requirements[cropType]
    if (!req) {
      return { compatible: true, reason: "Unknown crop", yieldImpact: 0 }
    }

    const isIdealSoil = req.idealSoils.includes(soilType)
    const hasGoodWaterRetention = soilProps.waterRetention >= req.minWaterRetention
    const hasGoodPH = soilProps.ph >= req.phRange[0] && soilProps.ph <= req.phRange[1]

    if (isIdealSoil && hasGoodWaterRetention && hasGoodPH) {
      return {
        compatible: true,
        reason: `${soilProps.name} is ideal for ${cropType}`,
        yieldImpact: 20, // +20% yield
      }
    } else if (!isIdealSoil) {
      return {
        compatible: false,
        reason: `${soilProps.name} is not ideal for ${cropType}. Consider ${req.idealSoils.join(" or ")} soil instead.`,
        yieldImpact: -30, // -30% yield
      }
    } else if (!hasGoodWaterRetention) {
      return {
        compatible: false,
        reason: `${soilProps.name} has insufficient water retention (${soilProps.waterRetention}%) for ${cropType}`,
        yieldImpact: -20,
      }
    } else {
      return {
        compatible: false,
        reason: `Soil pH (${soilProps.ph}) is outside optimal range for ${cropType}`,
        yieldImpact: -15,
      }
    }
  }

  applyAmendment(tile: TileData, amendment: "lime" | "manure" | "fertilizer" | "mulch"): TileData {
    const newTile = { ...tile }

    switch (amendment) {
      case "lime":
        // Raises pH, improves nutrient availability
        newTile.nutrients = Math.min(100, newTile.nutrients + 10)
        break
      case "manure":
        // Adds organic matter and nutrients
        newTile.nutrients = Math.min(100, newTile.nutrients + 30)
        break
      case "fertilizer":
        // Direct nutrient boost
        newTile.nutrients = Math.min(100, newTile.nutrients + 40)
        break
      case "mulch":
        // Improves water retention
        newTile.moisture = Math.min(100, newTile.moisture + 15)
        break
    }

    return newTile
  }
}
