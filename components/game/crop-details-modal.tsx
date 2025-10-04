"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TileData } from "@/types/game"
import { CROP_DATA } from "@/lib/game-utils"
import { CropEngine } from "@/lib/crop-engine"
import { Sprout, Droplet, Leaf, Heart, Calendar, AlertTriangle } from "lucide-react"

interface CropDetailsModalProps {
  open: boolean
  onClose: () => void
  tile: TileData | null
  onApplyTreatment?: (x: number, y: number) => void
  onEmergencyCare?: (x: number, y: number) => void
}

export function CropDetailsModal({ open, onClose, tile, onApplyTreatment, onEmergencyCare }: CropDetailsModalProps) {
  if (!tile || !tile.crop) return null

  const cropEngine = new CropEngine()
  const cropData = CROP_DATA[tile.crop]
  const stages = cropEngine.getCropStages(tile.crop)
  const currentStageIndex = Math.floor(tile.cropStage)
  const currentStage = stages[currentStageIndex]

  const stageProgress = ((tile.cropStage - currentStageIndex) * 100).toFixed(0)
  const isCritical = tile.health < 30

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-600" />
            {cropData.name} Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Crop Icon */}
          <div className="flex justify-center">
            <div className="text-6xl">{cropData.icon}</div>
          </div>

          {/* Growth Stage */}
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Growth Stage</span>
                <Badge variant="secondary" className="bg-green-200 text-green-900">
                  {currentStage.name}
                </Badge>
              </div>
              <Progress value={Number(stageProgress)} className="h-2" />
              <p className="text-xs text-green-700">{currentStage.description}</p>
            </div>
          </Card>

          {/* Health Status */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Health</span>
              </div>
              <Progress value={tile.health} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">{Math.round(tile.health)}%</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Moisture</span>
              </div>
              <Progress value={tile.moisture} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">{Math.round(tile.moisture)}%</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Nutrients</span>
              </div>
              <Progress value={tile.nutrients} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">{Math.round(tile.nutrients)}%</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Stage</span>
              </div>
              <p className="text-lg font-bold text-purple-900">{currentStageIndex}/4</p>
              <p className="text-xs text-muted-foreground">{currentStageIndex === 4 ? "Ready!" : "Growing"}</p>
            </Card>
          </div>

          {/* Crop Info */}
          <Card className="p-4 bg-amber-50">
            <h4 className="font-semibold text-amber-900 mb-2">Crop Information</h4>
            <div className="space-y-1 text-sm text-amber-800">
              <p>
                <strong>Harvest Time:</strong> {cropData.harvestDays} days
              </p>
              <p>
                <strong>Water Need:</strong> {cropData.waterNeed}%
              </p>
              <p>
                <strong>Ideal Soil:</strong> {cropData.idealSoil.join(", ")}
              </p>
              <p>
                <strong>Temperature:</strong> {cropData.tempRange[0]}°C - {cropData.tempRange[1]}°C
              </p>
            </div>
          </Card>

          {/* Status Message */}
          {tile.cropStage >= 4 && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
              <p className="text-green-900 font-semibold">🎉 Ready for Harvest!</p>
              <p className="text-sm text-green-700">Use the harvest tool to collect your crop</p>
            </div>
          )}

          {isCritical && (
            <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-red-900 font-semibold">⚠️ Crop in Critical Condition!</p>
                  <p className="text-sm text-red-700 mt-1">Health is dangerously low. Take immediate action:</p>
                  <ul className="text-xs text-red-700 list-disc list-inside mt-2 space-y-1">
                    <li>Check moisture levels and water if needed</li>
                    <li>Apply fertilizer if nutrients are low</li>
                    <li>Use emergency care for comprehensive treatment</li>
                  </ul>
                </div>
              </div>
              {onEmergencyCare && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    onEmergencyCare(tile.x, tile.y)
                    onClose()
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Apply Emergency Care (150 Credits)
                </Button>
              )}
            </div>
          )}

          {tile.health < 70 && tile.health >= 30 && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center">
              <p className="text-yellow-900 font-semibold">⚠️ Crop Health Declining</p>
              <p className="text-sm text-yellow-700">Water and fertilize to improve conditions</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
