"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Droplets, Leaf, Trophy, Heart, Siren } from "lucide-react"
import type { TileData, LivestockType, WeatherCondition } from "@/types/game"
import { CropEngine } from "@/lib/crop-engine"

interface IsometricGridProps {
  tiles: TileData[][]
  gridSize: number
  onTileClick?: (x: number, y: number) => void
  onWaterTile?: (x: number, y: number) => void
  onFertilizeTile?: (x: number, y: number) => void
  onHarvestTile?: (x: number, y: number) => void
  onApplyTreatment?: (x: number, y: number) => void
  onEmergencyCare?: (x: number, y: number) => void
  currentCredits?: number
  weather?: WeatherCondition
}

export function IsometricGrid({
  tiles,
  gridSize,
  onTileClick,
  onWaterTile,
  onFertilizeTile,
  onHarvestTile,
  onApplyTreatment,
  onEmergencyCare,
  currentCredits = 0,
  weather = "sunny",
}: IsometricGridProps) {
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null)
  const cropEngine = new CropEngine()

  const [phLabels] = useState(() => {
    const labels = new Map<string, number>()
    const count = Math.floor(Math.random() * 11) + 20
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * gridSize)
      const y = Math.floor(Math.random() * gridSize)
      const ph = (Math.random() * 3 + 5.5).toFixed(1)
      labels.set(`${x},${y}`, Number.parseFloat(ph))
    }
    return labels
  })

  function handleTileClick(x: number, y: number) {
    onTileClick?.(x, y)
  }

  function getStageIcon(stage: number, isDead: boolean) {
    if (isDead) return "💀"
    switch (stage) {
      case 0:
        return null
      case 1:
        return "🌱"
      case 2:
        return "🌿"
      case 3:
        return "🌾"
      case 4:
        return "🌸"
      case 5:
        return "🌾"
      default:
        return "🌱"
    }
  }

  function getLivestockIcon(type: LivestockType) {
    if (!type) return "🐄"
    switch (type) {
      case "cow":
        return "🐄"
      case "buffalo":
        return "🐃"
      case "goat":
        return "🐐"
      case "chicken":
        return "🐔"
      default:
        return "🐄"
    }
  }

  return (
    <div className="relative max-w-[920px] max-h-[580px] flex items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 rounded-lg p-2 shadow-lg">
      <div className="relative" style={{ width: "900px", height: "550px" }}>
        {tiles.map((row, rowIdx) =>
          row.map((tile, colIdx) => {
            const x = (colIdx - rowIdx) * 52
            const y = (colIdx + rowIdx) * 26

            const hasPH = phLabels.has(`${colIdx},${rowIdx}`)
            const ph = phLabels.get(`${colIdx},${rowIdx}`)
            const isEmpty = !tile.crop && !tile.livestock
            const isDead = tile.health === 0
            const isMature = tile.cropStage >= 4

            const isCritical = tile.crop && tile.health < 30
            const pestDisease = tile.crop ? cropEngine.checkPestsAndDiseases(tile, weather) : null
            const needsTreatment = pestDisease && tile.health < 70

            return (
              <div
                key={`${colIdx}-${rowIdx}`}
                onClick={() => handleTileClick(colIdx, rowIdx)}
                className="absolute transition-all duration-200 cursor-pointer hover:scale-105 hover:z-10"
                style={{
                  left: `${450 + x}px`,
                  top: `${5 + y}px`,
                  width: "104px",
                  height: "104px",
                }}
                onMouseEnter={() => setHoveredTile({ x: colIdx, y: rowIdx })}
                onMouseLeave={() => setHoveredTile(null)}
              >
                <div
                  className={`w-full h-full relative ${
                    tile.crop
                      ? isDead
                        ? "bg-gradient-to-br from-gray-400 to-gray-600"
                        : isMature
                          ? "bg-gradient-to-br from-amber-400 to-yellow-600 ring-2 ring-yellow-400"
                          : tile.health > 70
                            ? "bg-gradient-to-br from-green-400 to-green-600"
                            : tile.health > 40
                              ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                              : "bg-gradient-to-br from-orange-400 to-red-600"
                      : tile.livestock
                        ? "bg-gradient-to-br from-amber-300 to-amber-600 ring-2 ring-amber-400"
                        : tile.health > 70
                          ? "bg-gradient-to-br from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-600"
                          : "bg-gradient-to-br from-amber-400 to-amber-700 hover:from-amber-500 hover:to-amber-800"
                  }`}
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    boxShadow: tile.crop
                      ? isMature
                        ? "0 6px 12px rgba(234, 179, 8, 0.4)"
                        : "0 4px 6px rgba(0,0,0,0.2)"
                      : tile.livestock
                        ? "0 4px 8px rgba(217, 119, 6, 0.3)"
                        : "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    {tile.crop ? (
                      <div className="text-center space-y-0.5">
                        <div className="text-2xl">{getStageIcon(tile.cropStage, isDead)}</div>
                        <p className="text-xs font-bold text-white drop-shadow-md truncate">{tile.crop}</p>
                        <p className="text-xs text-white/90">
                          {isDead ? "Dead" : `Stage ${Math.floor(tile.cropStage)}`}
                        </p>

                        {!isDead && (
                          <>
                            <div className="space-y-0.5 mt-1">
                              <div className="flex items-center justify-between text-xs text-white">
                                <span>HP</span>
                                <span className={tile.health > 70 ? "" : "text-red-200"}>
                                  {Math.round(tile.health)}%
                                </span>
                              </div>
                              <Progress value={tile.health} className="h-1 bg-white/30" />

                              <div className="flex items-center justify-between text-xs text-white">
                                <span>H₂O</span>
                                <span>{Math.round(tile.moisture)}%</span>
                              </div>
                              <Progress value={tile.moisture} className="h-1 bg-white/30" />
                            </div>

                            {isCritical && onEmergencyCare && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full h-6 text-xs mt-1 bg-red-600 hover:bg-red-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEmergencyCare(colIdx, rowIdx)
                                }}
                                disabled={currentCredits < 150}
                              >
                                <Siren className="w-3 h-3 mr-1" />
                                SOS
                              </Button>
                            )}

                            {!isCritical && needsTreatment && onApplyTreatment && pestDisease && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full h-6 text-xs mt-1 bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onApplyTreatment(colIdx, rowIdx)
                                }}
                                disabled={currentCredits < pestDisease.treatmentCost}
                              >
                                <Heart className="w-3 h-3 mr-1" />
                                Treat
                              </Button>
                            )}

                            {!isCritical && !needsTreatment && isMature && onHarvestTile && (
                              <Button
                                size="sm"
                                className="w-full h-6 text-xs mt-1 bg-yellow-600 hover:bg-yellow-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onHarvestTile(colIdx, rowIdx)
                                }}
                              >
                                <Trophy className="w-3 h-3 mr-1" />
                                Harvest
                              </Button>
                            )}

                            {!isCritical &&
                              !needsTreatment &&
                              !isMature &&
                              (tile.moisture < 30 || tile.health < 50) && (
                                <div className="flex gap-1 mt-1">
                                  {tile.moisture < 30 && onWaterTile && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="w-full h-5 text-xs px-1"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onWaterTile(colIdx, rowIdx)
                                      }}
                                    >
                                      <Droplets className="w-2 h-2" />
                                    </Button>
                                  )}
                                  {tile.health < 50 && onFertilizeTile && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="w-full h-5 text-xs px-1 bg-green-600 hover:bg-green-700"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onFertilizeTile(colIdx, rowIdx)
                                      }}
                                    >
                                      <Leaf className="w-2 h-2" />
                                    </Button>
                                  )}
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    ) : tile.livestock ? (
                      <div className="text-center text-white drop-shadow-md">
                        <div className="text-3xl mb-1">{getLivestockIcon(tile.livestock)}</div>
                        <p className="text-xs font-semibold capitalize">{tile.livestock}</p>
                      </div>
                    ) : (
                      <div className="text-center text-white drop-shadow-md">
                        <div className="text-3xl mb-1">+</div>
                        <p className="text-xs font-semibold">Plant</p>
                        {hasPH && <p className="text-xs opacity-75">pH {ph}</p>}
                      </div>
                    )}

                    {hasPH && tile.crop && (
                      <div
                        className="absolute bottom-2 left-2 text-[10px] font-bold text-white pointer-events-none"
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                      >
                        <div>pH</div>
                        <div>{ph}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          }),
        )}
      </div>

      {/* Hover info panel */}
      {hoveredTile && (
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 text-sm shadow-lg z-50">
          <div className="font-semibold text-foreground">
            Tile ({hoveredTile.x}, {hoveredTile.y})
          </div>
          <div className="text-muted-foreground">
            {tiles[hoveredTile.y][hoveredTile.x].crop
              ? `Crop: ${tiles[hoveredTile.y][hoveredTile.x].crop}`
              : tiles[hoveredTile.y][hoveredTile.x].livestock
                ? `Livestock: ${tiles[hoveredTile.y][hoveredTile.x].livestock}`
                : "Empty"}
          </div>
          <div className="text-xs mt-1 space-y-0.5">
            <div>Moisture: {tiles[hoveredTile.y][hoveredTile.x].moisture}%</div>
            <div>Health: {tiles[hoveredTile.y][hoveredTile.x].health}%</div>
            {phLabels.has(`${hoveredTile.x},${hoveredTile.y}`) && (
              <div>pH: {phLabels.get(`${hoveredTile.x},${hoveredTile.y}`)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
