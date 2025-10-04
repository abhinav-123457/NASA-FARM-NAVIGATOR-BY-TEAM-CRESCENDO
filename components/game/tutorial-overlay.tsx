"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, X } from "lucide-react"

interface TutorialStep {
  step: number
  title: string
  description: string
  highlight?: string
}

interface TutorialOverlayProps {
  steps: TutorialStep[]
  onComplete: () => void
}

export function TutorialOverlay({ steps, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/30 z-40 pointer-events-none">
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 p-6 max-w-md shadow-xl">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-blue-600 font-medium mb-1">
                  Step {step.step} of {steps.length}
                </div>
                <h3 className="text-xl font-bold text-blue-900">{step.title}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSkip} className="text-blue-600 hover:text-blue-800">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Description */}
            <p className="text-blue-800 leading-relaxed">{step.description}</p>

            {/* Progress */}
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full ${idx <= currentStep ? "bg-blue-600" : "bg-blue-200"}`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={handleSkip} className="text-blue-600 hover:text-blue-800">
                Skip Tutorial
              </Button>
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                {currentStep < steps.length - 1 ? (
                  <>
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  "Got it!"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
