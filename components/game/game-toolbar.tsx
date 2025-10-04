"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Droplets, Sparkles, Scissors, Play, Pause, FastForward } from "lucide-react"

interface GameToolbarProps {
  isPaused: boolean
  onTogglePause: () => void
  day: number
  bharatPoints: number
  onIrrigateAll?: () => void
  onFertilizeAll?: () => void
  onHarvestAll?: () => void
  simulationSpeed?: number
  onSpeedChange?: (speed: number) => void
}

export function GameToolbar({
  isPaused,
  onTogglePause,
  day,
  bharatPoints,
  onIrrigateAll,
  onFertilizeAll,
  onHarvestAll,
  simulationSpeed = 1,
  onSpeedChange,
}: GameToolbarProps) {
  const handleSpeedToggle = () => {
    if (!onSpeedChange) return
    const speeds = [1, 2, 4]
    const currentIndex = speeds.indexOf(simulationSpeed)
    const nextIndex = (currentIndex + 1) % speeds.length
    onSpeedChange(speeds[nextIndex])
  }

  return (
    <TooltipProvider>
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Game Stats */}
          <div className="flex gap-4">
            <div className="text-sm">
              <div className="text-muted-foreground">Day</div>
              <div className="font-bold text-lg">{day}</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Bharat Points</div>
              <div className="font-bold text-lg text-primary">{bharatPoints}</div>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" onClick={onIrrigateAll}>
                  <Droplets className="w-4 h-4 mr-1" />
                  Irrigate All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Irrigate All Crops</p>
                <p className="text-xs">Water all planted crops at once</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" onClick={onFertilizeAll}>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Fertilize All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Fertilize All Crops</p>
                <p className="text-xs">Apply fertilizer to all planted crops at once</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" onClick={onHarvestAll}>
                  <Scissors className="w-4 h-4 mr-1" />
                  Harvest All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Harvest All Mature Crops</p>
                <p className="text-xs">Harvest all crops that are ready at once</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex gap-2">
            {onSpeedChange && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSpeedToggle}
                    className={simulationSpeed > 1 ? "bg-amber-100 hover:bg-amber-200" : ""}
                  >
                    <FastForward className="w-4 h-4 mr-1" />
                    {simulationSpeed}x
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Simulation Speed</p>
                  <p className="text-xs">Click to cycle: 1x → 2x → 4x</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {simulationSpeed}x speed ({60000 / simulationSpeed}ms per day)
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" onClick={onTogglePause}>
                  {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{isPaused ? "Resume Game" : "Pause Game"}</p>
                <p className="text-xs">
                  {isPaused ? "Continue the day/night cycle" : "Pause time to plan your next moves"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}
