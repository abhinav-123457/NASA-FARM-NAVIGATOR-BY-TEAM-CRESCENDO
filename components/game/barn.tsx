"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { LivestockData } from "@/types/game"
import { LivestockEngine, LIVESTOCK_INFO } from "@/lib/livestock-engine"
import { BanIcon as BarnIcon, Heart, Beef, Droplets, Plus } from "lucide-react"

interface BarnProps {
  livestock: LivestockData[]
  maxCapacity?: number
  onSelectAnimal?: (animal: LivestockData) => void
  onFeed?: (id: string) => void
  onWater?: (id: string) => void
  onCollect?: (id: string) => void
  onAddLivestock?: () => void
  selectedAnimal?: LivestockData | null
}

export function Barn({
  livestock,
  maxCapacity = 12,
  onSelectAnimal,
  onFeed,
  onWater,
  onCollect,
  onAddLivestock,
  selectedAnimal,
}: BarnProps) {
  const livestockEngine = new LivestockEngine()
  const emptySlots = maxCapacity - livestock.length

  function getLivestockIcon(type: string) {
    const icons: Record<string, string> = {
      cow: "🐄",
      buffalo: "🐃",
      goat: "🐐",
      chicken: "🐔",
    }
    return icons[type] || "🐄"
  }

  return (
    <div className="space-y-4">
      {/* Barn Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarnIcon className="w-5 h-5" />
              Barn
            </div>
            <Badge variant="secondary">
              {livestock.length}/{maxCapacity} Animals
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barn Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {livestock.map((animal) => {
              const info = LIVESTOCK_INFO[animal.type!]
              const isSelected = selectedAnimal?.id === animal.id

              return (
                <button
                  key={animal.id}
                  onClick={() => onSelectAnimal?.(animal)}
                  className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-1">{getLivestockIcon(animal.type!)}</div>
                  <div className="text-xs font-semibold truncate">{info.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Heart className="w-3 h-3" />
                    <span className="text-xs">{Math.round(animal.health)}%</span>
                  </div>
                </button>
              )
            })}

            {/* Empty Slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <button
                key={`empty-${i}`}
                onClick={onAddLivestock}
                className="p-3 rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-1"
              >
                <Plus className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add</span>
              </button>
            ))}
          </div>

          {livestock.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">Your barn is empty</p>
              <Button onClick={onAddLivestock} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Buy Livestock
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Animal Details */}
      {selectedAnimal && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{getLivestockIcon(selectedAnimal.type!)}</span>
              {LIVESTOCK_INFO[selectedAnimal.type!].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Health Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Health</span>
                <span className="text-sm font-bold">{Math.round(selectedAnimal.health)}%</span>
              </div>
              <Progress
                value={selectedAnimal.health}
                className="h-2"
                // @ts-ignore
                indicatorClassName={
                  selectedAnimal.health > 70
                    ? "bg-green-500"
                    : selectedAnimal.health > 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              />
            </div>

            {/* Hunger Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Hunger</span>
                <span className="text-sm font-bold">{Math.round(selectedAnimal.hunger)}%</span>
              </div>
              <Progress
                value={selectedAnimal.hunger}
                className="h-2"
                // @ts-ignore
                indicatorClassName={
                  selectedAnimal.hunger < 30
                    ? "bg-green-500"
                    : selectedAnimal.hunger < 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Age</div>
                <div className="font-semibold">{selectedAnimal.age} days</div>
              </div>
              <div>
                <div className="text-muted-foreground">Productivity</div>
                <div className="font-semibold">
                  {livestockEngine.calculateDailyYield(selectedAnimal).amount}{" "}
                  {LIVESTOCK_INFO[selectedAnimal.type!].productivity.unit.split("/")[0]}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline" onClick={() => onFeed?.(selectedAnimal.id)}>
                <Beef className="w-4 h-4 mr-1" />
                Feed
              </Button>
              <Button size="sm" variant="outline" onClick={() => onWater?.(selectedAnimal.id)}>
                <Droplets className="w-4 h-4 mr-1" />
                Water
              </Button>
              <Button size="sm" variant="default" onClick={() => onCollect?.(selectedAnimal.id)}>
                Collect
              </Button>
            </div>

            {/* Feed Recommendations */}
            <div className="text-xs space-y-2 bg-muted p-3 rounded">
              <div className="font-semibold">Daily Feed Plan:</div>
              <ul className="space-y-1">
                {livestockEngine
                  .getFeedRecommendations(selectedAnimal)
                  .feed.slice(0, 2)
                  .map((item, i) => (
                    <li key={i} className="text-muted-foreground">
                      • {item}
                    </li>
                  ))}
              </ul>
              <div className="text-muted-foreground">
                {livestockEngine.getFeedRecommendations(selectedAnimal).schedule}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
