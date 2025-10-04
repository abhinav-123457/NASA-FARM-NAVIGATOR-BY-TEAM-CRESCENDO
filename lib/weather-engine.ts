import type { LocationType, WeatherCondition } from "@/types/game"

export interface WeatherData {
  condition: WeatherCondition
  temperature: number
  precipitation: number
  humidity: number
  windSpeed: number
}

export const LOCATION_CLIMATE = {
  rajasthan: {
    name: "Rajasthan (Jodhpur)",
    avgTemp: [25, 45],
    avgPrecip: [0, 200],
    climate: "Arid desert climate with extreme heat and minimal rainfall",
    monsoonMonths: [7, 8, 9],
  },
  punjab: {
    name: "Punjab (Doabs)",
    avgTemp: [15, 35],
    avgPrecip: [600, 1200],
    climate: "Monsoon-influenced with hot summers and moderate winters",
    monsoonMonths: [6, 7, 8, 9],
  },
  bihar: {
    name: "Bihar (Gangetic Plains)",
    avgTemp: [15, 35],
    avgPrecip: [800, 1200],
    climate: "Temperate with distinct monsoon season",
    monsoonMonths: [6, 7, 8, 9],
  },
  karnataka: {
    name: "Karnataka (Coorg)",
    avgTemp: [18, 32],
    avgPrecip: [1500, 3000],
    climate: "Humid tropical with heavy monsoon rainfall",
    monsoonMonths: [6, 7, 8, 9, 10],
  },
  himachal: {
    name: "Himachal Pradesh (Kinnaur)",
    avgTemp: [5, 30],
    avgPrecip: [600, 1000],
    climate: "Cool mountain climate with winter snow",
    monsoonMonths: [7, 8],
  },
  tamilnadu: {
    name: "Tamil Nadu (Coimbatore)",
    avgTemp: [22, 38],
    avgPrecip: [600, 900],
    climate: "Tropical wet and dry with hot summers",
    monsoonMonths: [10, 11, 12],
  },
  gujarat: {
    name: "Gujarat (Saurashtra)",
    avgTemp: [20, 42],
    avgPrecip: [400, 800],
    climate: "Semi-arid with hot dry summers",
    monsoonMonths: [6, 7, 8, 9],
  },
  westbengal: {
    name: "West Bengal (Darjeeling)",
    avgTemp: [10, 25],
    avgPrecip: [2000, 4000],
    climate: "Subtropical highland with heavy monsoon",
    monsoonMonths: [6, 7, 8, 9],
  },
}

export class WeatherEngine {
  private location: LocationType
  private currentDay: number
  private weatherHistory: WeatherData[] = []

  constructor(location: LocationType) {
    this.location = location
    this.currentDay = 1
  }

  setLocation(location: LocationType) {
    this.location = location
  }

  getCurrentWeather(day: number): WeatherData {
    this.currentDay = day
    const climate = LOCATION_CLIMATE[this.location]

    if (!climate) {
      // Return default sunny weather if location is invalid
      return {
        condition: "sunny",
        temperature: 25,
        precipitation: 10,
        humidity: 50,
        windSpeed: 10,
      }
    }

    // Simulate seasonal variation (simplified: 365 days = 1 year)
    const month = Math.floor(((day % 365) / 365) * 12) + 1
    const isMonsoon = climate.monsoonMonths.includes(month)

    // Temperature variation
    const tempRange = climate.avgTemp[1] - climate.avgTemp[0]
    const seasonalTemp = climate.avgTemp[0] + (Math.sin((day / 365) * Math.PI * 2) + 1) * (tempRange / 4)
    const dailyVariation = (Math.random() - 0.5) * 10
    const temperature = Math.round(seasonalTemp + dailyVariation)

    // Precipitation (higher during monsoon)
    let precipitation = 0
    let condition: WeatherCondition = "sunny"

    if (isMonsoon) {
      precipitation = Math.random() * 100 + 50 // 50-150mm during monsoon
      if (precipitation > 100) {
        condition = "monsoon"
      } else if (precipitation > 50) {
        condition = "rainy"
      } else {
        condition = "cloudy"
      }
    } else {
      // Dry season
      const dryChance = Math.random()
      if (this.location === "rajasthan" && dryChance > 0.8) {
        condition = "drought"
        precipitation = 0
      } else if (dryChance > 0.7) {
        condition = "cloudy"
        precipitation = Math.random() * 20
      } else {
        condition = "sunny"
        precipitation = Math.random() * 10
      }
    }

    // Humidity (related to precipitation)
    const humidity = Math.min(100, 30 + precipitation * 0.5 + (isMonsoon ? 20 : 0))

    // Wind speed
    const windSpeed = Math.random() * 20 + 5

    const weather: WeatherData = {
      condition,
      temperature,
      precipitation,
      humidity,
      windSpeed,
    }

    this.weatherHistory.push(weather)
    return weather
  }

  getWeatherForecast(days: number): WeatherData[] {
    const forecast: WeatherData[] = []
    for (let i = 1; i <= days; i++) {
      forecast.push(this.getCurrentWeather(this.currentDay + i))
    }
    return forecast
  }

  getWeatherHistory(days: number): WeatherData[] {
    return this.weatherHistory.slice(-days)
  }
}

export function getWeatherIcon(condition: WeatherCondition): string {
  switch (condition) {
    case "sunny":
      return "☀️"
    case "rainy":
      return "🌧️"
    case "cloudy":
      return "☁️"
    case "drought":
      return "🌵"
    case "monsoon":
      return "⛈️"
    default:
      return "🌤️"
  }
}

export function getWeatherDescription(condition: WeatherCondition): string {
  switch (condition) {
    case "sunny":
      return "Clear skies with abundant sunshine"
    case "rainy":
      return "Moderate rainfall expected"
    case "cloudy":
      return "Overcast with possible light showers"
    case "drought":
      return "Extremely dry conditions, water conservation critical"
    case "monsoon":
      return "Heavy monsoon rains, flooding risk"
    default:
      return "Variable conditions"
  }
}
