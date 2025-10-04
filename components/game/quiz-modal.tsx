"use client"

import { useState } from "react"
import type { Quiz } from "@/lib/badges"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Award } from "lucide-react"

interface QuizModalProps {
  quiz: Quiz
  onComplete: (correct: boolean) => void
  onClose: () => void
}

export function QuizModal({ quiz, onComplete, onClose }: QuizModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
  }

  const handleContinue = () => {
    onComplete(selectedAnswer === quiz.correctAnswer)
    onClose()
  }

  const isCorrect = selectedAnswer === quiz.correctAnswer

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 p-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="bg-blue-600 text-white mb-4">Educational Quiz</Badge>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Test Your Knowledge</h2>
              <p className="text-blue-700">Answer correctly to earn {quiz.bharatPoints} Bharat Points!</p>
            </div>

            <div className="bg-white/60 rounded-lg p-6">
              <p className="text-lg font-medium text-blue-900 mb-4">{quiz.question}</p>

              <div className="space-y-3">
                {quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? "border-blue-600 bg-blue-100"
                        : "border-blue-200 bg-white hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index ? "border-blue-600 bg-blue-600" : "border-blue-300"
                        }`}
                      >
                        {selectedAnswer === index && <div className="w-3 h-3 rounded-full bg-white" />}
                      </div>
                      <span className="text-blue-900">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Skip Quiz
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Submit Answer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              {isCorrect ? (
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">
                {isCorrect ? (
                  <span className="text-green-900">Correct!</span>
                ) : (
                  <span className="text-red-900">Not Quite</span>
                )}
              </h3>
              {isCorrect && (
                <Badge className="bg-yellow-500 text-white">
                  <Award className="w-4 h-4 mr-1" />+{quiz.bharatPoints} Bharat Points
                </Badge>
              )}
            </div>

            <div className="bg-white/60 rounded-lg p-6 text-left">
              <h4 className="font-bold text-blue-900 mb-2">Explanation:</h4>
              <p className="text-blue-800 leading-relaxed">{quiz.explanation}</p>
              {!isCorrect && (
                <p className="text-sm text-blue-600 mt-3">
                  The correct answer was: <strong>{quiz.options[quiz.correctAnswer]}</strong>
                </p>
              )}
            </div>

            <Button onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-700">
              Continue
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
