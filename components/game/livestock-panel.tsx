"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { LivestockData } from "@/types/game"
import { LivestockEngine, LIVESTOCK_INFO } from "@/lib/livestock-engine"
import { Heart, Beef, Droplets, Plus } from "lucide-react" // Added Plus icon

interface LivestockPanelProps {
  livestock: LivestockData[]
  selectedLivestock: LivestockData | null
  onFeed?: (id: string) => void
  onWater?: (id: string) => void
  onCollect?: (id: string) => void
  onAddLivestock?: () => void // Added callback for purchasing livestock
}

export function LivestockPanel({
  livestock,
  selectedLivestock,
  onFeed,
  onWater,
  onCollect,
  onAddLivestock,
}: LivestockPanelProps) {
  const livestockEngine = new LivestockEngine()

  if (!selectedLivestock) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Livestock Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {livestock.length === 0 ? "No livestock on farm" : "Select a livestock to view details"}
          </p>
          {onAddLivestock && (
            <Button onClick={onAddLivestock} className="w-full mb-4 bg-transparent" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Purchase Livestock
            </Button>
          )}
          {livestock.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold">Your Livestock:</div>
              {livestock.map((animal) => (
                <div key={animal.id} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                  <span>{LIVESTOCK_INFO[animal.type!].name}</span>
                  <Badge variant="outline">{Math.round(animal.health)}% health</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const info = LIVESTOCK_INFO[selectedLivestock.type!]
  const feedRec = livestockEngine.getFeedRecommendations(selectedLivestock)
  const yieldData = livestockEngine.calculateDailyYield(selectedLivestock)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="w-5 h-5" />
          {info.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Health</span>
            <span className="text-sm font-bold">{Math.round(selectedLivestock.health)}%</span>
          </div>
          <Progress
            value={selectedLivestock.health}
            className="h-2"
            // @ts-ignore
            indicatorClassName={
              selectedLivestock.health > 70
                ? "bg-green-500"
                : selectedLivestock.health > 40
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }
          />
        </div>

        {/* Hunger Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Hunger</span>
            <span className="text-sm font-bold">{Math.round(selectedLivestock.hunger)}%</span>
          </div>
          <Progress
            value={selectedLivestock.hunger}
            className="h-2"
            // @ts-ignore
            indicatorClassName={
              selectedLivestock.hunger < 30
                ? "bg-green-500"
                : selectedLivestock.hunger < 70
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Age</div>
            <div className="font-semibold">{selectedLivestock.age} days</div>
          </div>
          <div>
            <div className="text-muted-foreground">Productivity</div>
            <div className="font-semibold">
              {yieldData.amount} {info.productivity.unit.split("/")[0]}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Daily Feed</div>
            <div className="font-semibold">{info.dailyFeed} kg</div>
          </div>
          <div>
            <div className="text-muted-foreground">Water Need</div>
            <div className="font-semibold">{info.waterNeed} L</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="outline" onClick={() => onFeed?.(selectedLivestock.id)}>
            <Beef className="w-4 h-4 mr-1" />
            Feed
          </Button>
          <Button size="sm" variant="outline" onClick={() => onWater?.(selectedLivestock.id)}>
            <Droplets className="w-4 h-4 mr-1" />
            Water
          </Button>
          <Button size="sm" variant="default" onClick={() => onCollect?.(selectedLivestock.id)}>
            Collect
          </Button>
        </div>

        {/* Feed Recommendations */}
        <div className="text-xs space-y-2 bg-muted p-3 rounded">
          <div className="font-semibold">Daily Feed Plan:</div>
          <ul className="space-y-1">
            {feedRec.feed.slice(0, 2).map((item, i) => (
              <li key={i} className="text-muted-foreground">
                • {item}
              </li>
            ))}
          </ul>
          <div className="text-muted-foreground">{feedRec.schedule}</div>
        </div>
      </CardContent>
    </Card>
  )
}
