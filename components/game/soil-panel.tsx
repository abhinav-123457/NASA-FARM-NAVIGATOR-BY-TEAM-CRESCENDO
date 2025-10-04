"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { SoilType, TileData } from "@/types/game"
import { SOIL_PROPERTIES } from "@/lib/game-utils"
import { SoilEngine } from "@/lib/soil-engine"
import { Beaker, AlertTriangle } from "lucide-react"

interface SoilPanelProps {
  soilType: SoilType
  selectedTile: TileData | null
  onApplyAmendment?: (amendment: "lime" | "manure" | "fertilizer" | "mulch") => void
}

export function SoilPanel({ soilType, selectedTile, onApplyAmendment }: SoilPanelProps) {
  const soilProps = soilType ? SOIL_PROPERTIES[soilType] : null

  if (!soilProps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Beaker className="w-5 h-5" />
            Soil Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No soil data available</p>
        </CardContent>
      </Card>
    )
  }

  const soilEngine = new SoilEngine()

  const analysis = selectedTile ? soilEngine.analyzeSoil(selectedTile) : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Beaker className="w-5 h-5" />
          Soil Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Badge variant="outline" className="mb-2">
            {soilProps.name}
          </Badge>
          <p className="text-sm text-muted-foreground">{soilProps.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">pH Level</div>
            <div className="font-semibold">{analysis ? Math.round(analysis.ph) : Math.round(soilProps.ph)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Water Retention</div>
            <div className="font-semibold">{soilProps.waterRetention}%</div>
          </div>
          {selectedTile && (
            <>
              <div>
                <div className="text-muted-foreground">Nutrients</div>
                <div className="font-semibold">{selectedTile.nutrients}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Moisture</div>
                <div className="font-semibold">{selectedTile.moisture}%</div>
              </div>
            </>
          )}
        </div>

        {analysis && analysis.recommendations.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <div className="font-semibold mb-1">Recommendations:</div>
              <ul className="space-y-1">
                {analysis.recommendations.slice(0, 2).map((rec, i) => (
                  <li key={i} className="text-muted-foreground">
                    • {rec}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {selectedTile && onApplyAmendment && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">Apply Amendments:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={() => onApplyAmendment("lime")}>
                Lime
              </Button>
              <Button size="sm" variant="outline" onClick={() => onApplyAmendment("manure")}>
                Manure
              </Button>
              <Button size="sm" variant="outline" onClick={() => onApplyAmendment("fertilizer")}>
                Fertilizer
              </Button>
              <Button size="sm" variant="outline" onClick={() => onApplyAmendment("mulch")}>
                Mulch
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
