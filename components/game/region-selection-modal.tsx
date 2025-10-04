"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { LocationType } from "@/types/game"
import { REGION_SOIL_REQUIREMENTS } from "@/lib/game-utils"

interface RegionSelectionModalProps {
  open: boolean
  onSelect: (region: LocationType) => void
}

const REGION_ICONS: Record<LocationType, string> = {
  rajasthan: "🏜️",
  punjab: "🌾",
  bihar: "🌊",
  karnataka: "☕",
  himachal: "🏔️",
  tamilnadu: "🌴",
  gujarat: "🌑",
  westbengal: "🍵",
}

export function RegionSelectionModal({ open, onSelect }: RegionSelectionModalProps) {
  const regions: LocationType[] = [
    "punjab",
    "rajasthan",
    "bihar",
    "karnataka",
    "himachal",
    "tamilnadu",
    "gujarat",
    "westbengal",
  ]

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Choose Your Region</DialogTitle>
          <DialogDescription>
            Select the region where your farm is located. Each region has different climate conditions and ideal soil
            types.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {regions.map((region) => {
            const regionData = REGION_SOIL_REQUIREMENTS[region]
            return (
              <Card
                key={region}
                className="p-4 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => onSelect(region)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{regionData.name}</h3>
                    <div className="text-3xl">{REGION_ICONS[region]}</div>
                  </div>

                  <p className="text-sm text-muted-foreground">{regionData.description}</p>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Water Needs:</span>
                      <span className="font-medium">
                        {regionData.moistureMultiplier < 1
                          ? "Low"
                          : regionData.moistureMultiplier > 1.2
                            ? "High"
                            : "Moderate"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fertilizer Needs:</span>
                      <span className="font-medium">
                        {regionData.fertilizationMultiplier < 1
                          ? "Low"
                          : regionData.fertilizationMultiplier > 1.1
                            ? "High"
                            : "Moderate"}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-muted-foreground">Ideal Soils:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {regionData.idealSoils.map((soil) => (
                          <span key={soil} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            {soil}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Select {regionData.name}
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
