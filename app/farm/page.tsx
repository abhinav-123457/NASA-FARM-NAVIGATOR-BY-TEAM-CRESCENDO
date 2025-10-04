"use client"

import { useState, useEffect } from "react"
import { IsometricGrid } from "@/components/game/isometric-grid"
import { GameToolbar } from "@/components/game/game-toolbar"
import { WeatherPanel } from "@/components/game/weather-panel"
import { SoilPanel } from "@/components/game/soil-panel"
import { CropInfoPanel } from "@/components/game/crop-info-panel"
import { CropSelectionModal } from "@/components/game/crop-selection-modal"
import { CropDetailsModal } from "@/components/game/crop-details-modal"
import { SoilSelectionModal } from "@/components/game/soil-selection-modal"
import { RegionSelectionModal } from "@/components/game/region-selection-modal"
import { LivestockSelectionModal } from "@/components/game/livestock-selection-modal"
import { Barn } from "@/components/game/barn"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Coins } from "lucide-react"
import { useRouter } from "next/navigation"
import type { GameState, TileData, CropType, LivestockType, LivestockData, SoilType, LocationType } from "@/types/game"
import { createEmptyTile } from "@/lib/game-utils"
import { WeatherEngine, LOCATION_CLIMATE } from "@/lib/weather-engine"
import { SoilEngine } from "@/lib/soil-engine"
import { CropEngine } from "@/lib/crop-engine"
import { LivestockEngine, LIVESTOCK_INFO } from "@/lib/livestock-engine"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { QuickTips } from "@/components/game/quick-tips" // Import QuickTips
import { TutorialHelper } from "@/components/game/tutorial-helper" // Import TutorialHelper

export default function FarmPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showRegionSelection, setShowRegionSelection] = useState(true)
  const [showSoilSelection, setShowSoilSelection] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<LocationType | null>(null)
  const [showLivestockModal, setShowLivestockModal] = useState(false)
  const [pendingLivestockTile, setPendingLivestockTile] = useState<{ x: number; y: number } | null>(null)
  const [livestockCareToday, setLivestockCareToday] = useState<Record<string, { fed: boolean; watered: boolean }>>({})
  const [gameState, setGameState] = useState<GameState>({
    gridSize: 5, // Reduced from 6 to 5 for more compact gameplay
    tiles: [],
    location: "punjab",
    soilType: "alluvial",
    weather: "sunny",
    temperature: 25,
    precipitation: 50,
    day: 1,
    bharatPoints: 0,
    credits: 1000,
    badges: [],
    livestock: [],
  })

  const [isPaused, setIsPaused] = useState(false)
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<LivestockData | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [showCropDetails, setShowCropDetails] = useState(false)
  const [pendingPlantTile, setPendingPlantTile] = useState<{ x: number; y: number } | null>(null)
  const [weatherEngine, setWeatherEngine] = useState<WeatherEngine | null>(null)
  const [soilEngine] = useState(() => new SoilEngine())
  const [cropEngine] = useState(() => new CropEngine())
  const [livestockEngine] = useState(() => new LivestockEngine())
  const [simulationSpeed, setSimulationSpeed] = useState(1)

  function handleRegionSelect(region: LocationType) {
    setSelectedRegion(region)
    setWeatherEngine(new WeatherEngine(region))
    setGameState((prev) => ({ ...prev, location: region }))
    setShowRegionSelection(false)
    setShowSoilSelection(true)
    toast({
      title: "Region Selected",
      description: `Your farm is located in ${LOCATION_CLIMATE[region].name}`,
    })
  }

  function handleSoilSelect(soilType: SoilType) {
    const newTiles: TileData[][] = []
    for (let y = 0; y < gameState.gridSize; y++) {
      const row: TileData[] = []
      for (let x = 0; x < gameState.gridSize; x++) {
        row.push(createEmptyTile(x, y, soilType))
      }
      newTiles.push(row)
    }
    setGameState((prev) => ({ ...prev, tiles: newTiles, soilType }))
    setShowSoilSelection(false)
    toast({
      title: "Soil Selected",
      description: `Your farm now has ${soilType} soil`,
    })
  }

  useEffect(() => {
    if (isPaused || gameState.tiles.length === 0 || !weatherEngine) return

    const intervalMs = 5000 / simulationSpeed // Reduced base interval from 60000ms to 5000ms for faster gameplay
    const interval = setInterval(() => {
      setGameState((prev) => {
        const newDay = prev.day + 1
        const weather = weatherEngine.getCurrentWeather(newDay)

        const newTiles = prev.tiles.map((row) =>
          row.map((tile) => {
            if (!tile.crop) return tile

            return cropEngine.updateCropGrowth(
              tile,
              {
                temp: weather.temperature,
                precip: weather.precipitation,
                condition: weather.condition,
              },
              prev.soilType,
            )
          }),
        )

        const newLivestock = prev.livestock.map((animal) => {
          const care = livestockCareToday[animal.id] || { fed: false, watered: false }
          return livestockEngine.updateLivestockHealth(
            animal,
            { temp: weather.temperature, condition: weather.condition },
            care.fed,
            care.watered,
            false, // isStoryMode = false for normal difficulty
          )
        })

        setLivestockCareToday({})

        return {
          ...prev,
          tiles: newTiles,
          livestock: newLivestock,
          day: newDay,
          weather: weather.condition,
          temperature: weather.temperature,
          precipitation: weather.precipitation,
        }
      })
    }, intervalMs)

    return () => clearInterval(interval)
  }, [
    isPaused,
    gameState.tiles.length,
    weatherEngine,
    cropEngine,
    livestockEngine,
    gameState.soilType,
    simulationSpeed,
    livestockCareToday,
  ])

  function handleApplyTreatment(x: number, y: number) {
    const tile = gameState.tiles[y][x]
    if (!tile.crop) return

    const pestDisease = cropEngine.checkPestsAndDiseases(tile, gameState.weather)
    if (!pestDisease) {
      toast({
        title: "No Treatment Needed",
        description: "This crop is healthy and doesn't need treatment",
      })
      return
    }

    if (gameState.credits < pestDisease.treatmentCost) {
      toast({
        title: "Insufficient Credits",
        description: `Need ${pestDisease.treatmentCost} Credits for treatment`,
        variant: "destructive",
      })
      return
    }

    setGameState((prev) => {
      const newTiles = [...prev.tiles]
      const treatedTile = cropEngine.applyTreatment(newTiles[y][x], pestDisease)
      newTiles[y][x] = treatedTile

      toast({
        title: "Treatment Applied!",
        description: `${pestDisease.name} treated. Health improved by ${pestDisease.healthBoost}%`,
      })

      return {
        ...prev,
        tiles: newTiles,
        credits: prev.credits - pestDisease.treatmentCost,
      }
    })
  }

  function handleEmergencyCare(x: number, y: number) {
    const tile = gameState.tiles[y][x]
    if (!tile.crop) return

    const { tile: treatedTile, cost } = cropEngine.applyEmergencyCare(tile)

    if (gameState.credits < cost) {
      toast({
        title: "Insufficient Credits",
        description: `Need ${cost} Credits for emergency care`,
        variant: "destructive",
      })
      return
    }

    setGameState((prev) => {
      const newTiles = [...prev.tiles]
      newTiles[y][x] = treatedTile

      toast({
        title: "Emergency Care Applied!",
        description: "Comprehensive treatment provided. Crop health significantly improved!",
      })

      return {
        ...prev,
        tiles: newTiles,
        credits: prev.credits - cost,
      }
    })
  }

  function handleTileClick(x: number, y: number) {
    const tile = gameState.tiles[y][x]
    setSelectedTile(tile)
    setSelectedAnimal(null)

    if (tile.crop) {
      setShowCropDetails(true)
      return
    }

    if (!tile.crop) {
      setPendingPlantTile({ x, y })
      setShowCropModal(true)
      return
    }
  }

  function handleLivestockSelect(type: LivestockType) {
    if (!type) return

    const info = LIVESTOCK_INFO[type]

    if (gameState.credits >= info.cost) {
      setGameState((prev) => {
        const newAnimal: LivestockData = {
          id: `${type}-${Date.now()}`,
          type: type,
          name: info.name,
          health: 100,
          hunger: 0,
          age: 0,
          productivity: info.productivity.amount,
          tileX: -1,
          tileY: -1,
        }

        toast({
          title: "Livestock Purchased!",
          description: `${info.name} added to your barn (-${info.cost} Credits)`,
        })

        return {
          ...prev,
          livestock: [...prev.livestock, newAnimal],
          credits: prev.credits - info.cost,
        }
      })
    } else {
      toast({
        title: "Insufficient Credits",
        description: `Need ${info.cost} Credits`,
        variant: "destructive",
      })
    }

    setShowLivestockModal(false)
    setPendingLivestockTile(null)
  }

  function handleCropSelect(crop: CropType) {
    if (!pendingPlantTile) return

    const { x, y } = pendingPlantTile
    setGameState((prev) => {
      const newTiles = [...prev.tiles]
      const tile = { ...newTiles[y][x] }

      if (tile.crop === null && !tile.livestock) {
        tile.crop = crop
        tile.cropStage = 1
        toast({
          title: "Crop Planted",
          description: `${crop} planted successfully`,
        })
      }

      newTiles[y][x] = tile
      return { ...prev, tiles: newTiles }
    })

    setPendingPlantTile(null)
  }

  function handleFeedLivestock(id: string) {
    setGameState((prev) => {
      const newLivestock = prev.livestock.map((animal) => {
        if (animal.id === id) {
          return { ...animal, hunger: Math.max(0, animal.hunger - 30) }
        }
        return animal
      })
      toast({ title: "Fed", description: "Livestock fed successfully" })
      return { ...prev, livestock: newLivestock }
    })
    setLivestockCareToday((prev) => ({
      ...prev,
      [id]: { ...prev[id], fed: true, watered: prev[id]?.watered || false },
    }))
  }

  function handleWaterLivestock(id: string) {
    toast({ title: "Watered", description: "Livestock watered" })
    setLivestockCareToday((prev) => ({
      ...prev,
      [id]: { fed: prev[id]?.fed || false, watered: true },
    }))
  }

  function handleCollectFromLivestock(id: string) {
    const animal = gameState.livestock.find((a) => a.id === id)
    if (!animal) return

    const yieldData = livestockEngine.calculateDailyYield(animal)
    setGameState((prev) => ({
      ...prev,
      bharatPoints: prev.bharatPoints + yieldData.bharatPoints,
    }))
    toast({
      title: "Collected!",
      description: `${yieldData.amount} ${LIVESTOCK_INFO[animal.type!].productivity.unit.split("/")[0]} (+${yieldData.bharatPoints} BP)`,
    })
  }

  function handleApplyAmendment(amendment: "lime" | "manure" | "fertilizer" | "mulch") {
    if (!selectedTile) return

    setGameState((prev) => {
      const newTiles = [...prev.tiles]
      const tile = newTiles[selectedTile.y][selectedTile.x]
      newTiles[selectedTile.y][selectedTile.x] = soilEngine.applyAmendment(tile, amendment)
      toast({
        title: "Amendment Applied",
        description: `${amendment} applied successfully`,
      })
      return { ...prev, tiles: newTiles }
    })
  }

  function handleIrrigateAll() {
    setGameState((prev) => {
      const newTiles = prev.tiles.map((row) =>
        row.map((tile) => {
          if (tile.crop) {
            return { ...tile, moisture: Math.min(100, tile.moisture + 20) }
          }
          return tile
        }),
      )

      const cropsWatered = newTiles.flat().filter((tile) => tile.crop).length

      if (cropsWatered > 0) {
        toast({
          title: "Irrigated All Crops",
          description: `Watered ${cropsWatered} crops. Moisture increased by 20%`,
        })
      } else {
        toast({
          title: "No Crops to Water",
          description: "Plant some crops first!",
          variant: "destructive",
        })
      }

      return { ...prev, tiles: newTiles }
    })
  }

  function handleFertilizeAll() {
    setGameState((prev) => {
      const newTiles = prev.tiles.map((row) =>
        row.map((tile) => {
          if (tile.crop) {
            return { ...tile, nutrients: Math.min(100, tile.nutrients + 30) }
          }
          return tile
        }),
      )

      const cropsFertilized = newTiles.flat().filter((tile) => tile.crop).length

      if (cropsFertilized > 0) {
        toast({
          title: "Fertilized All Crops",
          description: `Applied fertilizer to ${cropsFertilized} crops. Nutrients increased by 30%`,
        })
      } else {
        toast({
          title: "No Crops to Fertilize",
          description: "Plant some crops first!",
          variant: "destructive",
        })
      }

      return { ...prev, tiles: newTiles }
    })
  }

  function handleHarvestAll() {
    setGameState((prev) => {
      let totalBharatPoints = 0
      let harvestedCount = 0

      const newTiles = prev.tiles.map((row) =>
        row.map((tile) => {
          if (tile.crop && tile.cropStage >= 4) {
            const yieldData = cropEngine.calculateYield(tile, prev.soilType)
            totalBharatPoints += yieldData.bharatPoints
            harvestedCount++
            return { ...tile, crop: null, cropStage: 0 }
          }
          return tile
        }),
      )

      if (harvestedCount > 0) {
        toast({
          title: "Harvest Complete!",
          description: `Harvested ${harvestedCount} crops. Earned ${totalBharatPoints} Bharat Points!`,
        })
        return { ...prev, tiles: newTiles, bharatPoints: prev.bharatPoints + totalBharatPoints }
      } else {
        toast({
          title: "No Crops Ready",
          description: "No mature crops to harvest yet",
          variant: "destructive",
        })
        return prev
      }
    })
  }

  if (showRegionSelection) {
    return <RegionSelectionModal open={showRegionSelection} onSelect={handleRegionSelect} />
  }

  if (showSoilSelection) {
    return (
      <SoilSelectionModal open={showSoilSelection} onSelect={handleSoilSelect} region={selectedRegion || undefined} />
    )
  }

  return (
    <div className="h-screen bg-background p-2 overflow-hidden flex flex-col">
      <CropSelectionModal
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
        onSelectCrop={handleCropSelect}
      />

      <CropDetailsModal
        open={showCropDetails}
        onClose={() => setShowCropDetails(false)}
        tile={selectedTile}
        onApplyTreatment={handleApplyTreatment}
        onEmergencyCare={handleEmergencyCare}
      />

      <LivestockSelectionModal
        open={showLivestockModal}
        onClose={() => {
          setShowLivestockModal(false)
          setPendingLivestockTile(null)
        }}
        onSelectLivestock={handleLivestockSelect}
        currentCredits={gameState.credits}
      />

      <div className="mb-2 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Menu
          </Button>
          <h1 className="text-xl font-bold">Farm Mode - Sandbox</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Day {gameState.day}</div>
          <Badge variant="secondary" className="bg-yellow-200 text-yellow-900">
            <Award className="w-3 h-3 mr-1" />
            {gameState.bharatPoints} BP
          </Badge>
          <Badge variant="secondary" className="bg-green-200 text-green-900">
            <Coins className="w-3 h-3 mr-1" />
            {gameState.credits} Credits
          </Badge>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[260px_1fr_260px] gap-3 overflow-hidden px-2">
        <div className="flex flex-col gap-2 overflow-y-auto">
          <GameToolbar
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
            day={gameState.day}
            bharatPoints={gameState.bharatPoints}
            onIrrigateAll={handleIrrigateAll}
            onFertilizeAll={handleFertilizeAll}
            onHarvestAll={handleHarvestAll}
            simulationSpeed={simulationSpeed}
            onSpeedChange={setSimulationSpeed}
          />

          <WeatherPanel
            condition={gameState.weather}
            temperature={gameState.temperature}
            precipitation={gameState.precipitation}
            humidity={60}
            windSpeed={10}
            location={LOCATION_CLIMATE[gameState.location].name}
          />

          <QuickTips gameState={gameState} />
        </div>

        <div className="flex items-center justify-center overflow-hidden">
          <div className="flex items-center justify-center w-full h-full">
            {gameState.tiles.length > 0 && (
              <IsometricGrid tiles={gameState.tiles} gridSize={gameState.gridSize} onTileClick={handleTileClick} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          <Barn
            livestock={gameState.livestock}
            maxCapacity={12}
            selectedAnimal={selectedAnimal}
            onSelectAnimal={setSelectedAnimal}
            onFeed={handleFeedLivestock}
            onWater={handleWaterLivestock}
            onCollect={handleCollectFromLivestock}
            onAddLivestock={() => setShowLivestockModal(true)}
          />

          <CropInfoPanel
            tile={selectedTile}
            weather={{
              temp: gameState.temperature,
              precip: gameState.precipitation,
              condition: gameState.weather,
            }}
            onApplyTreatment={handleApplyTreatment}
            onEmergencyCare={handleEmergencyCare}
          />

          <SoilPanel
            soilType={gameState.soilType}
            selectedTile={selectedTile}
            onApplyAmendment={handleApplyAmendment}
          />
        </div>
      </div>

      <TutorialHelper />
    </div>
  )
}
