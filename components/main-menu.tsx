"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sprout, BookOpen, Play, Trophy, Sparkles, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function MainMenu() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<"story" | "farm" | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[url('/indian-farm-landscape-with-green-fields.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by NASA  Data
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-balance">
            <span className="text-primary">NASA Farm Navigators</span>
            <br />
            
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Journey across India's diverse farming regions and master sustainable agriculture through NASA satellite
            data and ISRO's Bhuvan insights
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-primary" />
              <span>5 Chapters Across India</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-secondary" />
              <span>Real Farming Science</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span>Earn Badges & Knowledge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Journey</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Story Mode */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                selectedMode === "story" ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => setSelectedMode("story")}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary">Beginner Friendly</Badge>
                </div>
                <CardTitle className="text-2xl">Story Mode</CardTitle>
                <CardDescription className="text-base">Guided 5-chapter narrative with Coach Aria</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Travel from Rajasthan's deserts to Himachal's mountains</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Master drought management, water conservation, and pest control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Grow millets, rice, wheat, coffee, and apples across diverse soils</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Unlock badges and become a certified Bharat Farm Navigator</span>
                  </li>
                </ul>
                {selectedMode === "story" && (
                  <Button className="w-full" size="lg" onClick={() => router.push("/story/roadmap")}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Story Mode
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Farm Mode */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                selectedMode === "farm" ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => setSelectedMode("farm")}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Sprout className="w-6 h-6 text-accent" />
                  </div>
                  <Badge variant="secondary">Expert Sandbox</Badge>
                </div>
                <CardTitle className="text-2xl">Farm Mode</CardTitle>
                <CardDescription className="text-base">Free-play sandbox with full customization</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Customizable 10x10 isometric grid (expandable to 20x20)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Choose any Indian region, soil type, and crop combination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Accelerated time with 1x, 2x, and 4x speed controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Experiment with livestock, weather patterns, and farming strategies</span>
                  </li>
                </ul>
                {selectedMode === "farm" && (
                  <Button className="w-full" size="lg" variant="secondary" onClick={() => router.push("/farm")}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Farm Mode
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-12">
            <Link href="/badges">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Award className="w-5 h-5" />
                View Your Badges & Achievements
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border/50 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">What You'll Learn</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Soil Science",
                  desc: "Master sandy, alluvial, loamy, and red laterite soils across India's regions",
                  icon: "🌱",
                },
                {
                  title: "Weather Adaptation",
                  desc: "Navigate droughts, monsoons, and seasonal changes with NASA data",
                  icon: "🌦️",
                },
                {
                  title: "Crop Diversity",
                  desc: "Cultivate millets, rice, wheat, coffee, and apples with proper techniques",
                  icon: "🌾",
                },
                {
                  title: "Water Management",
                  desc: "Use SMAP moisture data for efficient irrigation and conservation",
                  icon: "💧",
                },
                {
                  title: "Pest Control",
                  desc: "Apply Integrated Pest Management with biocontrols and monitoring",
                  icon: "🐛",
                },
                {
                  title: "Livestock Integration",
                  desc: "Manage dairy cattle nutrition, health, and farm sustainability",
                  icon: "🐄",
                },
              ].map((feature, i) => (
                <Card key={i} className="text-center">
                  <CardHeader>
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
