"use client"

import type { ChapterData } from "@/lib/chapters"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Target, Award } from "lucide-react"

interface ChapterIntroProps {
  chapter: ChapterData
  onStart: () => void
}

export function ChapterIntro({ chapter, onStart }: ChapterIntroProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-600 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Badge className="bg-amber-600 text-white mb-2">Chapter {chapter.id}</Badge>
            <h1 className="text-4xl font-bold text-amber-900">{chapter.title}</h1>
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{chapter.region}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-amber-800 text-center leading-relaxed">{chapter.description}</p>

          {/* Objectives */}
          <div className="bg-white/60 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <Target className="w-5 h-5" />
              <span>Your Objectives</span>
            </div>
            <ul className="space-y-2">
              {chapter.objectives.map((obj) => (
                <li key={obj.id} className="flex items-start gap-2 text-amber-800">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{obj.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rewards */}
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <Award className="w-5 h-5" />
              <span>Rewards</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-yellow-200 text-yellow-900">
                {chapter.rewards.bharatPoints} Bharat Points
              </Badge>
              <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                {chapter.rewards.badge} Badge
              </Badge>
              {chapter.rewards.unlockedCrops && (
                <Badge variant="secondary" className="bg-green-200 text-green-900">
                  Unlock: {chapter.rewards.unlockedCrops.join(", ")}
                </Badge>
              )}
            </div>
          </div>

          {/* Start Button */}
          <Button onClick={onStart} className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6">
            Begin Your Journey
          </Button>
        </div>
      </Card>
    </div>
  )
}
