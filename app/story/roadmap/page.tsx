"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { chapters } from "@/lib/chapters"
import { CheckCircle2, Lock, Play, Trophy, MapPin, Target, Award } from "lucide-react"

interface ChapterProgress {
  completed: boolean
  unlocked: boolean
  bharatPoints: number
  badge?: string
}

export default function StoryRoadmap() {
  const router = useRouter()
  const [chapterProgress, setChapterProgress] = useState<Record<number, ChapterProgress>>({})

  useEffect(() => {
    // Load chapter progress from localStorage
    const savedProgress = localStorage.getItem("chapterProgress")
    if (savedProgress) {
      setChapterProgress(JSON.parse(savedProgress))
    } else {
      // Initialize with first chapter unlocked
      setChapterProgress({
        1: { completed: false, unlocked: true, bharatPoints: 0 },
      })
    }
  }, [])

  const handleStartChapter = (chapterId: number) => {
    router.push(`/story?chapter=${chapterId}`)
  }

  const totalChapters = chapters.length
  const completedChapters = Object.values(chapterProgress).filter((p) => p.completed).length
  const totalBharatPoints = Object.values(chapterProgress).reduce((sum, p) => sum + p.bharatPoints, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Story Mode Roadmap</h1>
              <p className="text-muted-foreground">Choose your farming adventure across India</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Menu
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Chapters Completed</div>
                  <div className="text-3xl font-bold text-primary">
                    {completedChapters}/{totalChapters}
                  </div>
                  <Progress value={(completedChapters / totalChapters) * 100} className="mt-2" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Total Bharat Points</div>
                  <div className="text-3xl font-bold text-accent">{totalBharatPoints} BP</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Badges Earned</div>
                  <div className="text-3xl font-bold text-secondary">
                    {Object.values(chapterProgress).filter((p) => p.badge).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapter Cards */}
          <div className="space-y-6">
            {chapters.map((chapter, index) => {
              const progress = chapterProgress[chapter.id] || { completed: false, unlocked: false, bharatPoints: 0 }
              const isLocked = !progress.unlocked && !progress.completed

              return (
                <Card
                  key={chapter.id}
                  className={`transition-all ${
                    isLocked ? "opacity-60" : "hover:shadow-lg hover:scale-[1.01]"
                  } ${progress.completed ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                              progress.completed
                                ? "bg-primary text-primary-foreground"
                                : isLocked
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-accent text-accent-foreground"
                            }`}
                          >
                            {progress.completed ? <CheckCircle2 className="w-6 h-6" /> : chapter.id}
                          </div>
                          <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                              {chapter.title}
                              {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4" />
                              {chapter.region}
                            </CardDescription>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{chapter.description}</p>

                        {/* Objectives Preview */}
                        <div className="mb-4">
                          <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Objectives:
                          </div>
                          <ul className="space-y-1">
                            {chapter.objectives.slice(0, 3).map((obj) => (
                              <li key={obj.id} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{obj.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Rewards */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="bg-background">
                            <Trophy className="w-3 h-3 mr-1" />
                            {chapter.rewards.bharatPoints} BP
                          </Badge>
                          <Badge variant="outline" className="bg-background">
                            <Award className="w-3 h-3 mr-1" />
                            {chapter.rewards.badge}
                          </Badge>
                          {chapter.rewards.unlockedCrops && (
                            <Badge variant="outline" className="bg-background">
                              Unlocks: {chapter.rewards.unlockedCrops.join(", ")}
                            </Badge>
                          )}
                        </div>

                        {progress.completed && progress.badge && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed - {progress.badge}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {!isLocked && (
                          <Button onClick={() => handleStartChapter(chapter.id)} size="lg" className="gap-2">
                            <Play className="w-4 h-4" />
                            {progress.completed ? "Replay" : "Start"}
                          </Button>
                        )}
                        {isLocked && (
                          <Button disabled size="lg" variant="outline" className="gap-2 bg-transparent">
                            <Lock className="w-4 h-4" />
                            Locked
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
