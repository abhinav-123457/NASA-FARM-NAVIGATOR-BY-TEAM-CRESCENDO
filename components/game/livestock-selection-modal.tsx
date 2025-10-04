"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LivestockType } from "@/types/game"
import { LIVESTOCK_INFO } from "@/lib/livestock-engine"
import { Coins, Heart, Droplets, Beef } from "lucide-react"

interface LivestockSelectionModalProps {
  open: boolean
  onClose: () => void
  onSelectLivestock: (type: LivestockType) => void
  currentCredits: number
}

export function LivestockSelectionModal({
  open,
  onClose,
  onSelectLivestock,
  currentCredits,
}: LivestockSelectionModalProps) {
  const livestockTypes: Exclude<LivestockType, null>[] = ["cow", "buffalo", "goat", "chicken"]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Livestock Market</DialogTitle>
          <DialogDescription>
            Choose livestock to add to your farm. Each animal provides different benefits and requires care.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex items-center justify-between bg-green-100 p-3 rounded-lg">
          <span className="text-sm font-semibold text-green-900">Your Credits:</span>
          <Badge className="bg-green-600 text-white text-lg px-3 py-1">
            <Coins className="w-4 h-4 mr-1" />
            {currentCredits} Credits
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {livestockTypes.map((type) => {
            const info = LIVESTOCK_INFO[type]
            const canAfford = currentCredits >= info.cost

            return (
              <Card
                key={type}
                className={`p-4 transition-all ${
                  canAfford
                    ? "hover:border-green-500 hover:shadow-lg cursor-pointer"
                    : "opacity-60 cursor-not-allowed border-gray-300"
                }`}
                onClick={() => canAfford && onSelectLivestock(type)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base">{info.name}</h3>
                    <Badge
                      variant={canAfford ? "default" : "secondary"}
                      className={canAfford ? "bg-green-600" : "bg-gray-400"}
                    >
                      {info.cost} Credits
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">{info.description}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-muted-foreground">Produces:</span>
                      <span className="font-medium">
                        {info.productivity.amount} {info.productivity.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Beef className="w-4 h-4 text-amber-600" />
                      <span className="text-muted-foreground">Daily Feed:</span>
                      <span className="font-medium">{info.dailyFeed} kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground">Water Need:</span>
                      <span className="font-medium">{info.waterNeed} L</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Space:</span>
                      <span className="font-medium">{info.spaceRequired} tile(s)</span>
                    </div>
                  </div>

                  <Button className="w-full" size="sm" disabled={!canAfford}>
                    {canAfford ? `Purchase for ${info.cost} Credits` : "Insufficient Credits"}
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
