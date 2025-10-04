"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Lightbulb, ChevronRight, ChevronLeft } from "lucide-react"

interface TutorialStep {
  title: string
  description: string
  icon: string
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Your Farm!",
    description:
      "This is your isometric farm grid. Each hexagonal tile represents a plot of land where you can plant crops or place livestock.",
    icon: "🌾",
  },
  {
    title: "Plant Tool 🌱",
    description:
      "Select the Plant tool, choose a crop (ragi, rice, wheat, etc.), then click on an empty tile to plant seeds. Different crops thrive in different soils!",
    icon: "🌱",
  },
  {
    title: "Water Tool 💧",
    description:
      "Crops need water to grow! Select the Water tool and click on planted tiles to increase their moisture level. Watch the blue water indicator on each tile.",
    icon: "💧",
  },
  {
    title: "Fertilize Tool ✨",
    description:
      "Boost your crop's health and growth with fertilizer. Use it wisely - too much can harm your plants. Look for the health bar on each tile.",
    icon: "✨",
  },
  {
    title: "Harvest Tool ✂️",
    description:
      "When crops are fully grown (bright green color), use the Harvest tool to collect them and earn Bharat Points. Timing is everything!",
    icon: "✂️",
  },
  {
    title: "Livestock Tool 🐄",
    description:
      "Add animals like cows, buffalo, goats, or chickens to your farm. They provide milk, eggs, and manure. Remember to feed and water them daily!",
    icon: "🐄",
  },
  {
    title: "Weather & Soil Panels",
    description:
      "Check the Weather panel for temperature and rainfall. The Soil panel shows pH and nutrients. Use this data to make smart farming decisions!",
    icon: "🌤️",
  },
  {
    title: "Day/Night Cycle ⏰",
    description:
      "Time advances automatically (5 seconds = 1 day). Use the Pause button to stop time and plan your strategy. Crops grow over multiple days.",
    icon: "⏰",
  },
  {
    title: "Bharat Points 🏆",
    description:
      "Earn points by harvesting crops and collecting livestock products. Use points to unlock new features and advance through chapters!",
    icon: "🏆",
  },
]

export function TutorialHelper() {
  const [isOpen, setIsOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="fixed bottom-6 right-6 shadow-lg bg-white hover:bg-accent z-40"
        onClick={() => setIsOpen(true)}
      >
        <Lightbulb className="w-4 h-4 mr-2" />
        Tutorial
      </Button>
    )
  }

  const step = tutorialSteps[currentStep]

  return (
    <Card className="fixed bottom-6 right-6 w-80 shadow-2xl z-50 bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <CardTitle className="text-sm">Tutorial</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{step.icon}</div>
          <h3 className="font-semibold text-base mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-1">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.min(tutorialSteps.length - 1, currentStep + 1))}
            disabled={currentStep === tutorialSteps.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Badge variant="secondary" className="w-full justify-center">
          Step {currentStep + 1} of {tutorialSteps.length}
        </Badge>
      </CardContent>
    </Card>
  )
}
