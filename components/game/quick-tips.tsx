"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Droplets, Sprout, ThermometerSun } from "lucide-react"
import type { GameState } from "@/types/game"

interface QuickTipsProps {
  gameState: GameState
}

export function QuickTips({ gameState }: QuickTipsProps) {
  const tips: { icon: React.ReactNode; title: string; message: string; variant?: "default" | "destructive" }[] = []

  // Weather-based tips
  if (gameState.weather === "drought") {
    tips.push({
      icon: <Droplets className="w-4 h-4" />,
      title: "Drought Alert",
      message: "Water your crops frequently. Consider drought-resistant crops like bajra.",
      variant: "destructive",
    })
  } else if (gameState.weather === "monsoon") {
    tips.push({
      icon: <Droplets className="w-4 h-4" />,
      title: "Monsoon Season",
      message: "Ensure proper drainage. Rice thrives in these conditions!",
    })
  }

  // Temperature tips
  if (gameState.temperature > 35) {
    tips.push({
      icon: <ThermometerSun className="w-4 h-4" />,
      title: "High Temperature",
      message: "Provide shade for livestock. Millets handle heat well.",
      variant: "destructive",
    })
  } else if (gameState.temperature < 15) {
    tips.push({
      icon: <ThermometerSun className="w-4 h-4" />,
      title: "Cool Weather",
      message: "Perfect for wheat and apples. Protect tropical crops.",
    })
  }

  // Soil-based tips
  if (gameState.soilType === "sandy") {
    tips.push({
      icon: <Sprout className="w-4 h-4" />,
      title: "Sandy Soil Tip",
      message: "Add organic matter to improve water retention. Bajra and ragi are ideal.",
    })
  }

  // Progress tips
  if (gameState.bharatPoints > 500) {
    tips.push({
      icon: <Lightbulb className="w-4 h-4" />,
      title: "Great Progress!",
      message: "Consider adding livestock for steady income. Try crop rotation.",
    })
  }

  // Default tip if no specific conditions
  if (tips.length === 0) {
    tips.push({
      icon: <Lightbulb className="w-4 h-4" />,
      title: "Pro Tip",
      message: "Match crops to your soil type for better yields. Check the crop info panel!",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Coach Aria's Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.slice(0, 3).map((tip, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className={`mt-0.5 ${tip.variant === "destructive" ? "text-destructive" : "text-primary"}`}>
              {tip.icon}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{tip.title}</span>
                {tip.variant === "destructive" && <Badge variant="destructive">Alert</Badge>}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
