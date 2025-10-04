"use client"

import { useState, useEffect } from "react"
import { chapters } from "@/lib/chapters"
import { quizzes, allBadges } from "@/lib/badges"
import { ChapterIntro } from "@/components/game/chapter-intro"
import { TutorialOverlay } from "@/components/game/tutorial-overlay"
import { ObjectivesPanel } from "@/components/game/objectives-panel"
import { IsometricGrid } from "@/components/game/isometric-grid"
import { GameToolbar } from "@/components/game/game-toolbar"
import { WeatherPanel } from "@/components/game/weather-panel"
import { SoilPanel } from "@/components/game/soil-panel"
import { CropInfoPanel } from "@/components/game/crop-info-panel"
import { LivestockPanel } from "@/components/game/livestock-panel"
import { QuickTips } from "@/components/game/quick-tips"
import { CropSelectionModal } from "@/components/game/crop-selection-modal"
import { CropDetailsModal } from "@/components/game/crop-details-modal"
import { SoilSelectionModal } from "@/components/game/soil-selection-modal"
import { LivestockSelectionModal } from "@/components/game/livestock-selection-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Award, ChevronRight, Trophy, Coins } from "lucide-react"
import Link from "next/link"
import type {
  GameState,
  TileData,
  CropType,
  LivestockType,
  LivestockData,
  SoilType,
  LocationType,
  ChapterObjective,
} from "@/types/game"
import { createEmptyTile } from "@/lib/game-utils"
import { WeatherEngine, LOCATION_CLIMATE } from "@/lib/weather-engine"
import { SoilEngine } from "@/lib/soil-engine"
import { CropEngine } from "@/lib/crop-engine"
import { LivestockEngine, LIVESTOCK_INFO } from "@/lib/livestock-engine"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

function mapChapterSoilToGameSoil(chapterSoil: string): SoilType {
  const mapping: Record<string, SoilType> = {
    "Sandy Loam": "sandy",
    "sandy loam": "sandy",
    Alluvial: "alluvial",
    alluvial: "alluvial",
    Laterite: "red",
    laterite: "red",
    "Mountain Loam": "loamy",
    "mountain loam": "loamy",
    "Black Soil": "black",
    "black soil": "black",
    "Red Soil": "red",
    "red soil": "red",
  }
  return mapping[chapterSoil] || "loamy"
}

function mapChapterRegionToLocation(chapterRegion: string): LocationType {
  const mapping: Record<string, LocationType> = {
    Rajasthan: "rajasthan",
    Punjab: "punjab",
    Bihar: "bihar",
    Karnataka: "karnataka",
    "Himachal Pradesh": "himachal",
    "Tamil Nadu": "tamilnadu",
    Gujarat: "gujarat",
    "West Bengal": "westbengal",
  }
  return mapping[chapterRegion] || "punjab"
}

export default function StoryModePage() {
  const { toast } = useToast()
  const [showIntro, setShowIntro] = useState(true)
  const [showSoilSelection, setShowSoilSelection] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showLivestockModal, setShowLivestockModal] = useState(false)
  const [pendingLivestockTile, setPendingLivestockTile] = useState<{ x: number; y: number } | null>(null)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [unlockedChapters, setUnlockedChapters] = useState([0])
  const [chapterComplete, setChapterComplete] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])
  const [chapterObjectives, setChapterObjectives] = useState<ChapterObjective[]>([])
  const [selectedTool, setSelectedTool] = useState<"water" | "fertilize" | "harvest" | "livestock" | null>(null)
  const [selectedLivestock, setSelectedLivestock] = useState<LivestockType>("cow")
  const [isPaused, setIsPaused] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<LivestockData | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [showCropDetails, setShowCropDetails] = useState(false)
  const [pendingPlantTile, setPendingPlantTile] = useState<{ x: number; y: number } | null>(null)
  const [livestockCareToday, setLivestockCareToday] = useState<Record<string, { fed: boolean; watered: boolean }>>({})
  const [weatherEngine] = useState(() => new WeatherEngine("rajasthan"))
  const [soilEngine] = useState(() => new SoilEngine())
  const [cropEngine] = useState(() => new CropEngine())
  const [livestockEngine] = useState(() => new LivestockEngine())
  const [gameState, setGameState] = useState<GameState>({
    gridSize: 5, // Reduced from 6 to 5 for more compact gameplay
    tiles: [],
    location: "rajasthan",
    soilType: "sandy",
    weather: "sunny",
    temperature: 25,
    precipitation: 50,
    day: 0,
    bharatPoints: 0,
    credits: 1000,
    badges: [],
    livestock: [],
  })
  const searchParams = useSearchParams()
  const router = useRouter()

  const [bulkActionsUsed, setBulkActionsUsed] = useState({ irrigate: false, fertilize: false, harvest: false })

  useEffect(() => {
    const chapterParam = searchParams.get("chapter")
    if (chapterParam) {
      const id = Number.parseInt(chapterParam, 10)
      if (!Number.isNaN(id)) {
        const idx = chapters.findIndex((c) => c.id === id)
        if (idx !== -1) setCurrentChapter(idx)
      }
    }
  }, [searchParams])

  useEffect(() => {
    const chapter = chapters[currentChapter]
    if (!chapter) return

    setChapterObjectives(
      chapter.objectives.map((obj) => ({
        ...obj,
        current: 0,
        completed: false,
      })),
    )

    const location = mapChapterRegionToLocation(chapter.initialConditions.region)
    weatherEngine.setLocation(location)

    const newTiles: TileData[][] = []
    for (let y = 0; y < gameState.gridSize; y++) {
      const row: TileData[] = []
      for (let x = 0; x < gameState.gridSize; x++) {
        row.push(createEmptyTile(x, y, gameState.soilType))
      }
      newTiles.push(row)
    }
    setGameState((prev) => ({
      ...prev,
      tiles: newTiles,
      location: location,
      soilType: chapter.initialConditions.soilType as any,
      day: chapter.initialConditions.day,
    }))
  }, [currentChapter, weatherEngine, gameState.gridSize])

  useEffect(() => {
    if (chapterObjectives.length === 0) return

    const updatedObjectives = chapterObjectives.map((obj) => {
      let current = obj.current || 0
      let completed = obj.completed

      // Track planting objectives
      if (obj.id.includes("plant")) {
        const plantedCount = gameState.tiles.flat().filter((tile) => tile.crop !== null).length
        current = plantedCount
        if (obj.target && plantedCount >= obj.target) {
          completed = true
        }
      }
      // Track harvest objectives based on Bharat Points earned
      else if (obj.id.includes("harvest")) {
        current = gameState.bharatPoints
        if (obj.target) {
          if (gameState.bharatPoints >= obj.target) {
            completed = true
          }
        } else {
          // No target means just harvest anything
          if (gameState.bharatPoints > 0) {
            completed = true
          }
        }
      }
      // Track livestock objectives
      else if (obj.id.includes("livestock") || obj.id.includes("integrated") || obj.id.includes("add-livestock")) {
        current = gameState.livestock.length
        if (obj.target && gameState.livestock.length >= obj.target) {
          completed = true
        }
      }
      // Track water/irrigate objectives - mark as complete when user uses water tools
      else if (obj.id.includes("water") || obj.id.includes("irrigate")) {
        // This will be manually marked complete when user uses water tools
        // Keep existing completed state
        completed = obj.completed
      }
      // Track fertilize objectives
      else if (obj.id.includes("fertilize") || obj.id.includes("farm-management")) {
        // This will be manually marked complete when user uses fertilize tools
        completed = obj.completed
      } else if (obj.id.includes("pest")) {
        // This will be manually marked complete when user treats pests
        completed = obj.completed
      } else if (obj.id.includes("farm-balance")) {
        // This will be manually marked complete when user uses all bulk actions
        completed = obj.completed
      }
      // Track bulk action objectives
      else if (obj.id.includes("bulk") || obj.id.includes("use-bulk-actions")) {
        // This will be manually marked complete when user uses bulk actions
        completed = obj.completed
      }

      return { ...obj, current, completed }
    })

    setChapterObjectives(updatedObjectives)

    if (updatedObjectives.every((obj) => obj.completed) && !chapterComplete) {
      setTimeout(() => {
        handleChapterComplete()
      }, 0)
    }
  }, [gameState.tiles, gameState.bharatPoints, gameState.livestock, chapterObjectives.length])

  useEffect(() => {
    if (isPaused || gameState.tiles.length === 0) return

    // 1x = 5 seconds per day, 2x = 2.5 seconds per day, 4x = 1.25 seconds per day
    const interval = setInterval(() => {
      setGameState((prev) => {
        const daysToAdvance = 1 // Always advance 1 day per tick
        const newDay = prev.day + daysToAdvance
        const weather = weatherEngine.getCurrentWeather(newDay)

        const newTiles = prev.tiles.map((row) =>
          row.map((tile) => {
            if (!tile.crop) return tile

            // advance growth by 1 day per tick (loop stays for clarity if expanded later)
            let updatedTile = tile
            for (let i = 0; i < daysToAdvance; i++) {
              updatedTile = cropEngine.updateCropGrowth(
                updatedTile,
                {
                  temp: weather.temperature,
                  precip: weather.precipitation,
                  condition: weather.condition,
                },
                prev.soilType,
              )
            }
            return updatedTile
          }),
        )

        const newLivestock = prev.livestock.map((animal) => {
          const care = livestockCareToday[animal.id] || { fed: false, watered: false }
          return livestockEngine.updateLivestockHealth(
            animal,
            { temp: weather.temperature, condition: weather.condition },
            care.fed,
            care.watered,
            true, // isStoryMode = true for reduced difficulty
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
    }, 5000 / simulationSpeed) // Changed from 60000 to 5000 for much faster simulation

    return () => clearInterval(interval)
  }, [
    isPaused,
    gameState.tiles.length,
    simulationSpeed,
    weatherEngine,
    cropEngine,
    livestockEngine,
    gameState.soilType,
    livestockCareToday,
  ])

  const chapter = chapters[currentChapter]

  if (!chapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading chapter...</p>
        </div>
      </div>
    )
  }

  function handleTileClick(x: number, y: number) {
    const tile = gameState.tiles[y][x]
    setSelectedTile(tile)

    const animalOnTile = gameState.livestock.find((a) => a.tileX === x && a.tileY === y)
    if (animalOnTile) {
      setSelectedAnimal(animalOnTile)
    }

    if (tile.crop && !selectedTool) {
      setShowCropDetails(true)
      return
    }

    if (!tile.crop && !tile.livestock && !selectedTool) {
      setPendingPlantTile({ x, y })
      setShowCropModal(true)
      setSelectedTool(null)
      return
    }

    if (!selectedTool) return

    setGameState((prev) => {
      const newTiles = [...prev.tiles]
      const tile = { ...newTiles[y][x] }

      switch (selectedTool) {
        case "water":
          tile.moisture = Math.min(100, tile.moisture + 20)
          toast({
            title: "Watered",
            description: "Moisture increased by 20%",
          })
          setSelectedTool(null)
          setChapterObjectives((prev) =>
            prev.map((obj) =>
              obj.id.includes("water") || obj.id.includes("irrigate") ? { ...obj, completed: true } : obj,
            ),
          )
          break
        case "fertilize":
          tile.nutrients = Math.min(100, tile.nutrients + 30)
          toast({
            title: "Fertilized",
            description: "Nutrients increased by 30%",
          })
          setSelectedTool(null)
          setChapterObjectives((prev) =>
            prev.map((obj) =>
              obj.id.includes("fertilize") || obj.id.includes("farm-management") ? { ...obj, completed: true } : obj,
            ),
          )
          break
        case "harvest":
          if (tile.cropStage >= 4) {
            const yieldData = cropEngine.calculateYield(tile, prev.soilType)
            tile.crop = null
            tile.cropStage = 0
            toast({
              title: "Harvest Complete!",
              description: `${yieldData.message} +${yieldData.bharatPoints} Bharat Points`,
            })
            setSelectedTool(null)
            return { ...prev, tiles: newTiles, bharatPoints: prev.bharatPoints + yieldData.bharatPoints }
          }
          break
        case "livestock":
          if (!tile.livestock && !tile.crop) {
            setPendingLivestockTile({ x, y })
            setShowLivestockModal(true)
            setSelectedTool(null)
          } else {
            toast({
              title: "Cannot Place Livestock",
              description: "This tile is already occupied",
              variant: "destructive",
            })
          }
          return { ...prev, tiles: newTiles }
      }

      newTiles[y][x] = tile
      return { ...prev, tiles: newTiles }
    })
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
        setChapterObjectives((prev) =>
          prev.map((obj) =>
            obj.id.includes("water") || obj.id.includes("irrigate") ? { ...obj, completed: true } : obj,
          ),
        )
        setBulkActionsUsed((prev) => {
          const newState = { ...prev, irrigate: true }
          if (newState.irrigate && newState.fertilize && newState.harvest) {
            setChapterObjectives((prevObj) =>
              prevObj.map((obj) => (obj.id.includes("farm-balance") ? { ...obj, completed: true } : obj)),
            )
          }
          return newState
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
        setChapterObjectives((prev) =>
          prev.map((obj) =>
            obj.id.includes("fertilize") || obj.id.includes("farm-management") ? { ...obj, completed: true } : obj,
          ),
        )
        setBulkActionsUsed((prev) => {
          const newState = { ...prev, fertilize: true }
          if (newState.irrigate && newState.fertilize && newState.harvest) {
            setChapterObjectives((prevObj) =>
              prevObj.map((obj) => (obj.id.includes("farm-balance") ? { ...obj, completed: true } : obj)),
            )
          }
          return newState
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
        setChapterObjectives((prev) =>
          prev.map((obj) =>
            obj.id.includes("bulk") || obj.id.includes("use-bulk-actions") ? { ...obj, completed: true } : obj,
          ),
        )
        setBulkActionsUsed((prev) => {
          const newState = { ...prev, harvest: true }
          if (newState.irrigate && newState.fertilize && newState.harvest) {
            setChapterObjectives((prevObj) =>
              prevObj.map((obj) => (obj.id.includes("farm-balance") ? { ...obj, completed: true } : obj)),
            )
          }
          return newState
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

  const handleStartChapter = () => {
    setShowIntro(false)
    setShowSoilSelection(true)
  }

  const handleSoilSelect = (soilType: SoilType) => {
    const chapter = chapters[currentChapter]
    if (!chapter) return

    setChapterObjectives(
      chapter.objectives.map((obj) => ({
        ...obj,
        current: 0,
        completed: false,
      })),
    )

    const location = mapChapterRegionToLocation(chapter.initialConditions.region)
    weatherEngine.setLocation(location)

    const newTiles: TileData[][] = []
    for (let y = 0; y < gameState.gridSize; y++) {
      const row: TileData[] = []
      for (let x = 0; x < gameState.gridSize; x++) {
        row.push(createEmptyTile(x, y, soilType))
      }
      newTiles.push(row)
    }

    setGameState((prev) => ({
      ...prev,
      tiles: newTiles,
      location: location,
      soilType: soilType,
      day: chapter.initialConditions.day,
    }))

    setShowSoilSelection(false)
    setShowTutorial(true)
  }

  const handleTutorialComplete = () => {
    setShowTutorial(false)
  }

  function persistChapterCompletionAndBadges(chapterId: number, badgeName: string, rewardBP: number) {
    try {
      // Chapter progress
      const savedProgress = localStorage.getItem("chapterProgress")
      const progress = savedProgress ? JSON.parse(savedProgress) : {}
      const current = progress[chapterId] || { completed: false, unlocked: true, bharatPoints: 0 }
      progress[chapterId] = {
        ...current,
        completed: true,
        unlocked: true,
        bharatPoints: (current.bharatPoints || 0) + rewardBP,
        badge: badgeName,
      }
      const next = chapters.find((c) => c.id === chapterId + 1)
      if (next) {
        const nextRec = progress[next.id] || { completed: false, unlocked: false, bharatPoints: 0 }
        progress[next.id] = { ...nextRec, unlocked: true } // unlock next chapter
      }
      localStorage.setItem("chapterProgress", JSON.JSON.stringify(progress))

      // Badges collection (used by /badges)
      const savedBadges = localStorage.getItem("farmNavigatorBadges")
      let badges = savedBadges ? JSON.parse(savedBadges) : allBadges
      badges = badges.map((b: any) => (b.name === badgeName ? { ...b, earned: true, earnedDate: new Date() } : b))
      localStorage.setItem("farmNavigatorBadges", JSON.stringify(badges))
    } catch {
      // no-op in non-browser or quota issues
    }
  }

  const handleChapterComplete = () => {
    setChapterComplete(true)
    if (currentChapter < chapters.length - 1) {
      setUnlockedChapters((prev) => [...prev, currentChapter + 1])
    }

    const chapterQuizzes = quizzes.filter((q) => q.chapterId === chapter.id)
    const uncompletedQuiz = chapterQuizzes.find((q) => !completedQuizzes.includes(q.id))
    if (uncompletedQuiz) {
      setCurrentQuiz(uncompletedQuiz)
      setShowQuiz(true)
    }

    // Persist completion + unlock badge
    persistChapterCompletionAndBadges(chapter.id, chapter.rewards.badge, chapter.rewards.bharatPoints)

    toast({
      title: "Chapter Complete!",
      description: `You've earned the ${chapter.rewards.badge} badge and ${chapter.rewards.bharatPoints} Bharat Points!`,
    })
  }

  const handleNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      const nextChapter = chapters[currentChapter + 1]
      const location = mapChapterRegionToLocation(nextChapter.initialConditions.region)

      // Update URL so refresh/share keeps correct chapter (prevents stale query state)
      router.replace(`/story?chapter=${nextChapter.id}`)

      // Switch to next chapter
      setCurrentChapter((prev) => prev + 1)
      setChapterComplete(false)
      setShowIntro(true)

      // Pre-reset objectives to avoid a single render with stale objectives before effect runs
      setChapterObjectives(
        nextChapter.objectives.map((o) => ({
          ...o,
          current: typeof o.current === "number" ? o.current : 0,
          completed: !!o.completed,
        })),
      )

      // Prepare the next chapter's initial game state
      setGameState((prev) => ({
        gridSize: 5, // Reduced from 6 to 5 for more compact gameplay
        tiles: [],
        location,
        soilType: "sandy",
        weather: "sunny",
        temperature: 25,
        precipitation: 50,
        day: nextChapter.initialConditions.day,
        // keep cumulative points and add reward already earned
        bharatPoints: prev.bharatPoints + chapters[currentChapter].rewards.bharatPoints,
        credits: prev.credits,
        badges: [...prev.badges, chapters[currentChapter].rewards.badge],
        livestock: [],
      }))
    }
  }

  function handleRestartChapter() {
    const currentChapterData = chapters[currentChapter]
    if (!currentChapterData) return

    // Reset all chapter-specific state
    setChapterComplete(false)
    setShowIntro(true)
    setShowSoilSelection(false)
    setShowTutorial(false)
    setShowQuiz(false)
    setCurrentQuiz(null)
    setSelectedTool(null)
    setSelectedTile(null)
    setSelectedAnimal(null)
    setShowCropModal(false)
    setShowCropDetails(false)
    setPendingPlantTile(null)
    setShowLivestockModal(false)
    setPendingLivestockTile(null)
    setIsPaused(false)
    setSimulationSpeed(1)

    // Reset objectives
    setChapterObjectives(
      currentChapterData.objectives.map((o) => ({
        ...o,
        current: typeof o.current === "number" ? o.current : 0,
        completed: !!o.completed,
      })),
    )

    // Reset game state for current chapter
    const location = mapChapterRegionToLocation(currentChapterData.initialConditions.region)
    setGameState((prev) => ({
      gridSize: 5, // Reduced from 6 to 5 for more compact gameplay
      tiles: [],
      location: location,
      soilType: "sandy",
      weather: "sunny",
      temperature: 25,
      precipitation: 50,
      day: currentChapterData.initialConditions.day,
      bharatPoints: prev.bharatPoints, // Keep accumulated points
      credits: 1000, // Reset credits
      badges: prev.badges, // Keep earned badges
      livestock: [],
    }))

    toast({
      title: "Chapter Restarted",
      description: "Starting chapter from the beginning",
    })
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
          tileX: pendingLivestockTile?.x ?? -1, // Use -1 if no tile selected
          tileY: pendingLivestockTile?.y ?? -1,
        }

        // If there's a pending tile, place livestock on it
        if (pendingLivestockTile) {
          const { x, y } = pendingLivestockTile
          const newTiles = [...prev.tiles]
          const tile = { ...newTiles[y][x] }
          tile.livestock = type
          newTiles[y][x] = tile

          toast({
            title: "Livestock Purchased!",
            description: `${info.name} added to your farm (-${info.cost} Credits)`,
          })

          return {
            ...prev,
            tiles: newTiles,
            livestock: [...prev.livestock, newAnimal],
            credits: prev.credits - info.cost,
          }
        } else {
          // No tile selected, just add to livestock array
          toast({
            title: "Livestock Purchased!",
            description: `${info.name} added to your farm (-${info.cost} Credits)`,
          })

          return {
            ...prev,
            livestock: [...prev.livestock, newAnimal],
            credits: prev.credits - info.cost,
          }
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

  function handleApplyTreatment(x: number, y: number) {
    const tile = gameState.tiles[y][x]
    if (!tile.crop) return

    const pestDisease = cropEngine.checkPestsAndDiseases(tile, gameState.weather, true)
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

      setChapterObjectives((prev) => prev.map((obj) => (obj.id.includes("pest") ? { ...obj, completed: true } : obj)))

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

      setChapterObjectives((prev) => prev.map((obj) => (obj.id.includes("pest") ? { ...obj, completed: true } : obj)))

      return {
        ...prev,
        tiles: newTiles,
        credits: prev.credits - cost,
      }
    })
  }

  const onQuizComplete = (isCorrect: boolean) => {
    if (!currentQuiz) return
    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        bharatPoints: prev.bharatPoints + (currentQuiz?.bharatPoints || 0),
      }))
      toast({
        title: "Quiz Correct!",
        description: `+${currentQuiz?.bharatPoints || 0} Bharat Points`,
      })
    } else {
      toast({
        title: "Quiz Complete",
        description: "Good try! Keep going.",
      })
    }
    setCompletedQuizzes((prev) => (currentQuiz?.id ? Array.from(new Set([...prev, currentQuiz.id])) : prev))
    setShowQuiz(false)
    setCurrentQuiz(null)
  }

  if (showIntro) {
    return <ChapterIntro chapter={chapter} onStart={handleStartChapter} />
  }

  if (showSoilSelection) {
    const chapterSoilType = mapChapterSoilToGameSoil(chapter.initialConditions.soilType)

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SoilSelectionModal
          open={true}
          onSelect={handleSoilSelect}
          allowedSoils={[chapterSoilType]}
          chapterSoilType={chapter.initialConditions.soilType}
        />
      </div>
    )
  }

  if (chapterComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white/90 backdrop-blur-sm border-2 border-amber-400 p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-amber-900 mb-2">Chapter Complete!</h1>
              <p className="text-xl text-amber-700">{chapter.title}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-6 space-y-3">
              <h3 className="font-bold text-amber-900 text-lg">Rewards Earned</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                  <Award className="w-5 h-5 mr-2" />
                  {chapter.rewards.badge}
                </Badge>
                <Badge className="bg-amber-500 text-white text-lg px-4 py-2">
                  +{chapter.rewards.bharatPoints} Bharat Points
                </Badge>
              </div>
              {chapter.rewards.unlockedCrops && (
                <p className="text-amber-800 text-sm">Unlocked: {chapter.rewards.unlockedCrops.join(", ")}</p>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Main Menu
                </Button>
              </Link>
              {currentChapter < chapters.length - 1 ? (
                <Button size="lg" onClick={handleNextChapter} className="bg-amber-600 hover:bg-amber-700">
                  Next Chapter
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-900 mb-2">Congratulations, Master Farmer!</p>
                  <p className="text-amber-700">You've completed all chapters and mastered farming across India!</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-2 pt-3">
      {showTutorial && <TutorialOverlay steps={chapter.tutorialSteps} onComplete={handleTutorialComplete} />}

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
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Menu
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleRestartChapter}>
            Restart
          </Button>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-600 text-white">Ch. {chapter.id}</Badge>
            <h1 className="text-lg font-bold">{chapter.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Day {gameState.day}</div>
          <Badge variant="secondary" className="bg-yellow-200 text-yellow-900">
            <Award className="w-4 h-4 mr-1" />
            {gameState.bharatPoints} BP
          </Badge>
          <Badge variant="secondary" className="bg-green-200 text-green-900">
            <Coins className="w-4 h-4 mr-1" />
            {gameState.credits} Credits
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-[260px_1fr_260px] gap-2 h-[calc(100vh-80px)]">
        {/* Left Column */}
        <div className="space-y-2 overflow-y-auto">
          <GameToolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            selectedLivestock={selectedLivestock}
            onLivestockSelect={setSelectedLivestock}
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

          {(() => {
            const objectivesFallback = chapter.objectives.map((o) => ({
              ...o,
              current: typeof o.current === "number" ? o.current : 0,
              completed: !!o.completed,
            }))
            const objectivesToDisplay = chapterObjectives.length ? chapterObjectives : objectivesFallback
            return <ObjectivesPanel objectives={objectivesToDisplay} />
          })()}

          <WeatherPanel
            condition={gameState.weather}
            temperature={gameState.temperature}
            precipitation={gameState.precipitation}
            humidity={60}
            windSpeed={10}
            location={LOCATION_CLIMATE[gameState.location]?.name || chapter.region}
          />

          <QuickTips gameState={gameState} />
        </div>

        {/* Center Column - Farm Grid */}
        <div className="flex items-center justify-center overflow-hidden">
          {gameState.tiles.length > 0 && (
            <IsometricGrid
              tiles={gameState.tiles}
              gridSize={gameState.gridSize}
              onTileClick={handleTileClick}
              onWaterTile={(x, y) => {
                setGameState((prev) => {
                  const newTiles = [...prev.tiles]
                  const tile = { ...newTiles[y][x] }
                  tile.moisture = Math.min(100, tile.moisture + 20)
                  newTiles[y][x] = tile
                  toast({ title: "Watered", description: "Moisture increased by 20%" })
                  return { ...prev, tiles: newTiles }
                })
              }}
              onFertilizeTile={(x, y) => {
                setGameState((prev) => {
                  const newTiles = [...prev.tiles]
                  const tile = { ...newTiles[y][x] }
                  tile.nutrients = Math.min(100, tile.nutrients + 30)
                  newTiles[y][x] = tile
                  toast({ title: "Fertilized", description: "Nutrients increased by 30%" })
                  return { ...prev, tiles: newTiles }
                })
              }}
              onHarvestTile={(x, y) => {
                const tile = gameState.tiles[y][x]
                if (tile.cropStage >= 4) {
                  setGameState((prev) => {
                    const yieldData = cropEngine.calculateYield(tile, prev.soilType)
                    const newTiles = [...prev.tiles]
                    newTiles[y][x] = { ...tile, crop: null, cropStage: 0 }
                    toast({
                      title: "Harvest Complete!",
                      description: `${yieldData.message} +${yieldData.bharatPoints} Bharat Points`,
                    })
                    return { ...prev, tiles: newTiles, bharatPoints: prev.bharatPoints + yieldData.bharatPoints }
                  })
                }
              }}
              onApplyTreatment={handleApplyTreatment}
              onEmergencyCare={handleEmergencyCare}
              currentCredits={gameState.credits}
              weather={gameState.weather}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-2 overflow-y-auto">
          <LivestockPanel
            livestock={gameState.livestock}
            selectedLivestock={selectedAnimal}
            onFeed={handleFeedLivestock}
            onWater={handleWaterLivestock}
            onCollect={handleCollectFromLivestock}
            onAddLivestock={() => setShowLivestockModal(true)}
          />

          <CropInfoPanel
            key={selectedTile ? `${selectedTile.x}-${selectedTile.y}` : "no-tile"}
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
    </div>
  )
}
