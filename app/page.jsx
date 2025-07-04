"use client"

import { useState } from "react"
import { Lightbulb, Sparkles, Coffee, Rocket, CheckCircle } from "lucide-react"

export default function Home() {
  const [input, setInput] = useState("")
  const [otherProjectIdea, setOtherProjectIdea] = useState("")
  const [projectIdeas, setProjectIdeas] = useState([])
  const [projectTypes, setProjectTypes] = useState([])
  const [isShowOtherInput, setIsShowOtherInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const projectTypeOptions = [
    "Static Site",
    "Web App",
    "Browser Extension",
    "Userscript",
    "iPhone App",
    "Android App",
    "Desktop App",
    "Command Line Tool",
    "Game Mod",
    "Other",
  ]

  const generateProjectIdea = async (e) => {
    e.preventDefault()
    if (projectTypes.length === 0) {
      alert("Please select at least one project type!")
      return
    }

    setIsLoading(true)
    try {
      await fetchIdea()
    } catch (error) {
      console.error("Error generating ideas:", error)
      alert("Failed to generate ideas. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectTypeChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      if (value === "Other") {
        setIsShowOtherInput(true)
      }
      setProjectTypes((prev) => [...prev, value])
    } else {
      if (value === "Other") {
        setIsShowOtherInput(false)
        setOtherProjectIdea("")
      }
      setProjectTypes((prev) => prev.filter((type) => type !== value))
    }
  }

  async function fetchIdea() {
    try {
      const response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectTypes: projectTypes,
          otherIdea: otherProjectIdea,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch ideas")
      }

      const data = await response.json()
      const ideas = data.ideas
      console.log(ideas)
      setProjectIdeas(ideas)

      setTimeout(() => {
        document.getElementById("idea-1")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (error) {
      console.error("Error fetching ideas:", error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Project Idea Generator</h1>
          <p className="text-gray-600 text-lg">Your brain is on vacation. Let AI do the thinking.</p>
        </div>

        {/* Main Form */}
        <form onSubmit={generateProjectIdea} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              Select Project Types
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {projectTypeOptions.map((type) => (
                <label
                  key={type}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    projectTypes.includes(type) ? "border-purple-500 bg-purple-50" : "border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={type}
                    className="sr-only"
                    checked={projectTypes.includes(type)}
                    onChange={handleProjectTypeChange}
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                      projectTypes.includes(type) ? "border-purple-500 bg-purple-500" : "border-gray-300"
                    }`}
                  >
                    {projectTypes.includes(type) && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {isShowOtherInput && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Specify Other Project Type</label>
              <input
                type="text"
                placeholder="Enter your custom project type..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={otherProjectIdea}
                onChange={(e) => setOtherProjectIdea(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || projectTypes.length === 0}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Ideas...</span>
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                <span>Generate Project Ideas</span>
              </>
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-400 flex items-center justify-center">
              <Coffee className="w-4 h-4 mr-1" />
              Built with too much coffee and questionable ideas
            </p>
          </div>
        </form>

        {/* Generated Ideas */}
        {projectIdeas?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">🎉 Your AI-Generated Project Ideas</h2>
            {projectIdeas.map((idea, index) => (
              <div
                key={index}
                id={`idea-${index + 1}`}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-600 mb-2">Project Idea #{index + 1}</h3>
                    <p className="text-gray-700 leading-relaxed">{idea}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setProjectIdeas([])
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Generate New Ideas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
