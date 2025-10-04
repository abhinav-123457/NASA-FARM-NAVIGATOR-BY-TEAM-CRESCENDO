"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { TileData } from "@/types/game"
import { CROP_DATA } from "@/lib/game-utils"
import { CropEngine } from "@/lib/crop-engine"
import { Sprout, AlertTriangle, TrendingUp, Heart, Siren } from "lucide-react"

interface CropInfoPanelProps {
  tile: TileData | null
  weather: { temp: number; precip: number; condition: any }
  onApplyTreatment?: (x: number, y: number) => void
  onEmergencyCare?: (x: number, y: number) => void
}

export function CropInfoPanel({ tile, weather, onApplyTreatment, onEmergencyCare }: CropInfoPanelProps) {
  const cropEngine = new CropEngine()

  if (!tile || !tile.crop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sprout className="w-5 h-5" />
            Crop Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Select a tile with a crop to view details</p>
        </CardContent>
      </Card>
    )
  }

  const crop = CROP_DATA[tile.crop]
  const stages = cropEngine.getCropStages(tile.crop)
  const currentStageIndex = Math.floor(tile.cropStage)
  const currentStage = stages[currentStageIndex]
  const stageProgress = ((tile.cropStage - currentStageIndex) * 100).toFixed(0)

  const pestDisease = cropEngine.checkPestsAndDiseases(tile, weather.condition)
  const isCritical = tile.health < 30

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sprout className="w-5 h-5" />
          {crop.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Growth Stage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Growth Stage</span>
            <Badge variant="secondary">{currentStage.name}</Badge>
          </div>
          <Progress value={Number(stageProgress)} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">{currentStage.description}</p>
        </div>

        {/* Health Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Health</span>
            <span className="text-sm font-bold">{tile.health}%</span>
          </div>
          <Progress
            value={tile.health}
            className="h-2"
            // @ts-ignore
            indicatorClassName={tile.health > 70 ? "bg-green-500" : tile.health > 40 ? "bg-yellow-500" : "bg-red-500"}
          />
        </div>

        {isCritical && (
          <Alert variant="destructive" className="border-2">
            <Siren className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <div className="font-semibold mb-2 text-red-900">🚨 CRITICAL: Crop Dying!</div>
              <div className="mb-2 text-red-800">
                Your crop is in critical condition. Take immediate action to save it!
              </div>
              <div className="space-y-2">
                <div className="text-xs text-red-700 font-medium">Emergency Actions:</div>
                <ul className="text-xs text-red-700 list-disc list-inside space-y-1 mb-3">
                  <li>Water immediately if moisture is low</li>
                  <li>Apply fertilizer if nutrients are depleted</li>
                  <li>Use emergency care for comprehensive treatment</li>
                </ul>
                {onEmergencyCare && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => onEmergencyCare(tile.x, tile.y)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Emergency Care (150 Credits)
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Conditions */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Water Need</div>
            <div className="font-semibold">{currentStage.waterNeed}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Current Moisture</div>
            <div className="font-semibold">{tile.moisture}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Nutrient Need</div>
            <div className="font-semibold">{currentStage.nutrientNeed}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Current Nutrients</div>
            <div className="font-semibold">{tile.nutrients}%</div>
          </div>
        </div>

        {/* Ideal Conditions */}
        <div className="text-xs space-y-1">
          <div className="font-semibold text-muted-foreground">Ideal Conditions:</div>
          <div>
            Temperature: {crop.tempRange[0]}-{crop.tempRange[1]}°C
          </div>
          <div>Soil: {crop.idealSoil.join(", ")}</div>
          <div>Days to Harvest: {crop.harvestDays}</div>
        </div>

        {pestDisease && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <div className="font-semibold mb-1">
                {pestDisease.type === "pest" ? "🐛 Pest" : "🦠 Disease"} Detected: {pestDisease.name}
              </div>
              <div className="mb-1 text-red-800">
                <strong>Impact:</strong> {pestDisease.impact}
              </div>
              <div className="mb-2 text-red-700">
                <strong>Treatment:</strong> {pestDisease.treatment}
              </div>
              <div className="mb-2 text-xs text-red-600">
                <strong>Effectiveness:</strong> +{pestDisease.healthBoost}% health recovery
              </div>
              {onApplyTreatment && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-red-300 hover:bg-red-50 bg-transparent"
                  onClick={() => onApplyTreatment(tile.x, tile.y)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Apply Treatment ({pestDisease.treatmentCost} Credits)
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Harvest Prediction */}
        {tile.cropStage >= 3.5 && (
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <div className="font-semibold mb-1">Ready for Harvest Soon!</div>
              <div className="text-muted-foreground">Expected yield: {Math.round((tile.health / 100) * 2.5)} kg</div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
