"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { CropType } from "@/types/game"

interface CropSelectionModalProps {
  open: boolean
  onClose: () => void
  onSelectCrop: (crop: CropType) => void
}

const CROP_INFO: Record<CropType, { name: string; icon: string; description: string }> = {
  ragi: {
    name: "Ragi (Finger Millet)",
    icon: "🌾",
    description: "Drought-resistant crop, grows well in dry conditions",
  },
  rice: {
    name: "Rice",
    icon: "🌾",
    description: "Requires plenty of water, ideal for wet regions",
  },
  wheat: {
    name: "Wheat",
    icon: "🌾",
    description: "Cool season crop, needs moderate water",
  },
  coffee: {
    name: "Coffee",
    icon: "☕",
    description: "Shade-loving crop, needs consistent moisture",
  },
  apple: {
    name: "Apple",
    icon: "🍎",
    description: "Temperate fruit, requires cold winters",
  },
  bajra: {
    name: "Bajra (Pearl Millet)",
    icon: "🌾",
    description: "Heat and drought tolerant, grows in sandy soil",
  },
}

export function CropSelectionModal({ open, onClose, onSelectCrop }: CropSelectionModalProps) {
  const crops: CropType[] = ["ragi", "rice", "wheat", "coffee", "apple", "bajra"]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select a Crop to Plant</DialogTitle>
          <DialogDescription>Choose which crop you want to plant on this tile</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {crops.map((crop) => {
            const info = CROP_INFO[crop]
            return (
              <Card
                key={crop}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  onSelectCrop(crop)
                  onClose()
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{info.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{info.name}</h3>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
