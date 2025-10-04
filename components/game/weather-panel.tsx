"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WeatherCondition } from "@/types/game"
import { getWeatherIcon, getWeatherDescription } from "@/lib/weather-engine"
import { Thermometer, Droplets, Wind } from "lucide-react"

interface WeatherPanelProps {
  condition: WeatherCondition
  temperature: number
  precipitation: number
  humidity: number
  windSpeed: number
  location: string
}

export function WeatherPanel({
  condition,
  temperature,
  precipitation,
  humidity,
  windSpeed,
  location,
}: WeatherPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">{getWeatherIcon(condition)}</span>
          Weather - {location}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Badge variant="secondary" className="mb-2">
            {condition.toUpperCase()}
          </Badge>
          <p className="text-sm text-muted-foreground">{getWeatherDescription(condition)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-accent" />
            <div>
              <div className="text-muted-foreground">Temperature</div>
              <div className="font-semibold">{temperature}°C</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary" />
            <div>
              <div className="text-muted-foreground">Precipitation</div>
              <div className="font-semibold">{Math.round(precipitation)} mm</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-muted-foreground">Humidity</div>
              <div className="font-semibold">{Math.round(humidity)}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Wind Speed</div>
              <div className="font-semibold">{Math.round(windSpeed)} km/h</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
