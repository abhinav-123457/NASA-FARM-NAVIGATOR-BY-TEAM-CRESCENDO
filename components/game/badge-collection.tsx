"use client"

import type { Badge as BadgeType } from "@/lib/badges"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

interface BadgeCollectionProps {
  badges: BadgeType[]
}

export function BadgeCollection({ badges }: BadgeCollectionProps) {
  const chapterBadges = badges.filter((b) => b.category === "chapter")
  const achievementBadges = badges.filter((b) => b.category === "achievement")
  const masteryBadges = badges.filter((b) => b.category === "mastery")

  const earnedCount = badges.filter((b) => b.earned).length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-2">Badge Collection</h2>
        <p className="text-green-700">
          {earnedCount} of {badges.length} badges earned
        </p>
      </div>

      {/* Chapter Badges */}
      <div>
        <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>🏆</span> Chapter Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {chapterBadges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-4 text-center transition-all ${
                badge.earned
                  ? "bg-gradient-to-br from-yellow-100 to-amber-100 border-amber-400 shadow-lg"
                  : "bg-gray-100 border-gray-300 opacity-60"
              }`}
            >
              <div className="text-4xl mb-2">
                {badge.earned ? badge.icon : <Lock className="w-10 h-10 mx-auto text-gray-400" />}
              </div>
              <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              {badge.earned && badge.earnedDate && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {new Date(badge.earnedDate).toLocaleDateString()}
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div>
        <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
          <span>⭐</span> Achievement Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievementBadges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-4 text-center transition-all ${
                badge.earned
                  ? "bg-gradient-to-br from-green-100 to-emerald-100 border-green-400 shadow-lg"
                  : "bg-gray-100 border-gray-300 opacity-60"
              }`}
            >
              <div className="text-4xl mb-2">
                {badge.earned ? badge.icon : <Lock className="w-10 h-10 mx-auto text-gray-400" />}
              </div>
              <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              {badge.earned && badge.earnedDate && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {new Date(badge.earnedDate).toLocaleDateString()}
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Mastery Badges */}
      <div>
        <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <span>🎓</span> Mastery Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {masteryBadges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-4 text-center transition-all ${
                badge.earned
                  ? "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-400 shadow-lg"
                  : "bg-gray-100 border-gray-300 opacity-60"
              }`}
            >
              <div className="text-4xl mb-2">
                {badge.earned ? badge.icon : <Lock className="w-10 h-10 mx-auto text-gray-400" />}
              </div>
              <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              {badge.earned && badge.earnedDate && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {new Date(badge.earnedDate).toLocaleDateString()}
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
