"use client"

import { useState, useEffect } from "react"
import { allBadges } from "@/lib/badges"
import { BadgeCollection } from "@/components/game/badge-collection"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BadgesPage() {
  const [badges, setBadges] = useState(allBadges)

  // Load badge progress from localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem("farmNavigatorBadges")
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Main Menu
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-green-900">Your Achievements</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <BadgeCollection badges={badges} />
      </div>
    </div>
  )
}
