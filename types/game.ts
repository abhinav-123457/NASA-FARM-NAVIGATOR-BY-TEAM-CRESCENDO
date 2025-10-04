export type SoilType = "sandy" | "alluvial" | "loamy" | "laterite" | "clay" | "black" | "red"
export type CropType = "ragi" | "rice" | "wheat" | "coffee" | "apple" | "bajra" | null
export type LocationType = "rajasthan" | "punjab" | "bihar" | "karnataka" | "himachal"
export type WeatherCondition = "sunny" | "rainy" | "cloudy" | "drought" | "monsoon"
export type LivestockType = "cow" | "buffalo" | "goat" | "chicken" | null

export interface TileData {
  x: number
  y: number
  soilType: SoilType
  crop: CropType
  cropStage: number // 0-4 (0 = empty, 1 = planted, 2 = growing, 3 = mature, 4 = harvest ready)
  moisture: number // 0-100%
  nutrients: number // 0-100%
  health: number // 0-100%
  hasCow: boolean
  livestock: LivestockType
  livestockHealth: number // 0-100%
  livestockHunger: number // 0-100%
}

export interface LivestockData {
  id: string
  type: LivestockType
  name: string
  health: number
  hunger: number
  age: number // in days
  productivity: number // milk/eggs per day
  tileX: number
  tileY: number
}

export interface GameState {
  gridSize: number
  tiles: TileData[][]
  location: LocationType
  soilType: SoilType
  weather: WeatherCondition
  temperature: number
  precipitation: number
  day: number
  bharatPoints: number
  credits: number
  badges: string[]
  livestock: LivestockData[]
}
