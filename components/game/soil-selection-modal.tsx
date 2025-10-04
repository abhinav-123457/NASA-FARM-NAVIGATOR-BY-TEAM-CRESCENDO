"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { SoilType, LocationType } from "@/types/game"
import { SOIL_PROPERTIES, checkRegionSoilCompatibility } from "@/lib/game-utils"

interface SoilSelectionModalProps {
  open: boolean
  onSelect?: (soilType: SoilType) => void
  onSelectSoil?: (soilType: SoilType) => void
  onClose?: () => void
  allowedSoils?: SoilType[]
  chapterSoilType?: string
  region?: LocationType
}

export function SoilSelectionModal({
  open,
  onSelect,
  onSelectSoil,
  onClose,
  allowedSoils,
  chapterSoilType,
  region,
}: SoilSelectionModalProps) {
  const allSoilTypes: SoilType[] = ["sandy", "clay", "loamy", "alluvial", "black", "red"]

  const soilTypes = allowedSoils && allowedSoils.length > 0 ? allowedSoils : allSoilTypes

  const handleSelect = (soilType: SoilType) => {
    if (onSelect) onSelect(soilType)
    if (onSelectSoil) onSelectSoil(soilType)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{chapterSoilType ? `Chapter Soil: ${chapterSoilType}` : "Choose Your Soil Type"}</DialogTitle>
          <DialogDescription>
            {chapterSoilType
              ? `This chapter requires ${chapterSoilType} soil. Select it to begin your farming journey.`
              : region
                ? "Select the soil type for your farm. Compatibility with your region is shown below."
                : "Select the soil type for your farm. Each soil has different properties that affect crop growth."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {soilTypes.map((soilType) => {
            const soil = SOIL_PROPERTIES[soilType]
            const compatibility = region ? checkRegionSoilCompatibility(region, soilType) : null

            return (
              <Card
                key={soilType}
                className={`p-4 hover:shadow-lg transition-all cursor-pointer ${
                  compatibility?.score >= 90
                    ? "border-green-500 hover:border-green-600"
                    : compatibility?.score >= 60
                      ? "border-yellow-500 hover:border-yellow-600"
                      : "hover:border-gray-400"
                }`}
                onClick={() => handleSelect(soilType)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg capitalize">{soilType} Soil</h3>
                    <div className="text-3xl">{soil.icon}</div>
                  </div>

                  {compatibility && (
                    <div className="flex items-center gap-2">
                      {compatibility.score >= 90 ? (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Ideal Match
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Workable
                        </Badge>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">{soil.description}</p>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Water Retention:</span>
                      <span className="font-medium">{soil.waterRetention}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Drainage:</span>
                      <span className="font-medium">{soil.drainage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fertility:</span>
                      <span className="font-medium">{soil.fertility}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">pH Level:</span>
                      <span className="font-medium">{soil.pH}</span>
                    </div>
                  </div>

                  {compatibility && (
                    <div className="text-xs p-2 bg-muted rounded">
                      <p className="font-medium mb-1">{compatibility.message}</p>
                    </div>
                  )}

                  <Button className="w-full" size="sm">
                    Select {soilType}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
