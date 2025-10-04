"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { ChapterObjective } from "@/lib/chapters"
import { CheckCircle2, Circle } from "lucide-react"

interface ObjectivesPanelProps {
  objectives: ChapterObjective[]
}

export function ObjectivesPanel({ objectives }: ObjectivesPanelProps) {
  const completedCount = objectives.filter((obj) => obj.completed).length
  const totalCount = objectives.length

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary">Objectives</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {completedCount}/{totalCount}
          </Badge>
        </div>

        {/* Overall Progress */}
        <Progress value={(completedCount / totalCount) * 100} className="h-2" />

        {/* Objectives List */}
        <div className="space-y-3">
          {objectives.map((obj) => (
            <div
              key={obj.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                obj.completed ? "bg-green-100 border border-green-300" : "bg-card border"
              }`}
            >
              {obj.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${obj.completed ? "text-green-900 line-through" : "text-foreground"}`}
                >
                  {obj.description}
                </p>
                {obj.target && !obj.completed && (
                  <div className="mt-2">
                    <Progress value={((obj.current || 0) / obj.target) * 100} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {obj.current || 0} / {obj.target}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
