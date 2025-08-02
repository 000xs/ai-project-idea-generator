"use client"

import { useState } from "react"
import { Lightbulb, Sparkles, Coffee, Rocket, CheckCircle } from "lucide-react"

export default function Home() {
  const [input, setInput] = useState("")
  const [otherProjectIdea, setOtherProjectIdea] = useState("")
  const [projectIdeas, setProjectIdeas] = useState([])
  const [projectTypes, setProjectTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [generateAIIdeas, setGenerateAIIdeas] = useState(false) // State for the toggle

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
      await fetchIdea(generateAIIdeas) // Pass the state of the toggle
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
      setProjectTypes((prev) => prev.filter((type) => type !== value))
    }
  }

  async function fetchIdea(isAI) { // Re-added isAI parameter
    try {
      const response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectTypes: projectTypes,
          otherIdea: otherProjectIdea,
          generateAIIdeas: isAI, // Pass the AI generation flag
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
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-800">AI Project Idea Generator</h1>
          <p className="text-lg text-gray-600">Your brain is on vacation. Let AI do the thinking.</p>
        </div>

        {/* Main Form */}
        <form onSubmit={generateProjectIdea} className="p-8 mb-8 bg-white shadow-xl rounded-2xl">
          <div className="mb-6">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
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

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Specify a topic or custom project type (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., 'AI for education', 'blockchain games', 'sustainable tech'..."
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={otherProjectIdea}
              onChange={(e) => setOtherProjectIdea(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label htmlFor="ai-toggle" className="flex items-center text-sm font-medium text-gray-700">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              Generate AI-focused Ideas
            </label>
            <label htmlFor="ai-toggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="ai-toggle"
                checked={generateAIIdeas}
                onChange={(e) => setGenerateAIIdeas(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || projectTypes.length === 0}
            className="flex items-center justify-center w-full px-6 py-4 space-x-2 font-bold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Generating Ideas...</span>
              </>
            ) : (
              <>
                {generateAIIdeas ? <Sparkles className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                <span>Generate {generateAIIdeas ? "AI Project" : "Project"} Ideas</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="flex items-center justify-center text-xs text-gray-400">
              <Coffee className="w-4 h-4 mr-1" />
              Built with too much coffee and questionable ideas
            </p>
          </div>
        </form>

        {/* Generated Ideas */}
        {projectIdeas?.length > 0 && (
          <div className="space-y-6">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">🎉 Your Project Ideas</h2>
            {projectIdeas.map((idea, index) => (
              <div
                key={index}
                id={`idea-${index + 1}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{idea.title}</h3>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        idea.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : idea.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {idea.difficulty}
                    </span>
                  </div>
                  <p className="mb-6 leading-relaxed text-gray-600">{idea.description}</p>

                  <div className="mb-6">
                    <h4 className="mb-3 font-semibold text-gray-700">Key Features:</h4>
                    <ul className="space-y-2">
                      {idea.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 font-semibold text-gray-700">Suggested Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.techStack.split(",").map((tech, i) => (
                        <span key={i} className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  setProjectIdeas([])
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="px-8 py-3 font-bold text-purple-800 transition-colors duration-300 bg-purple-100 rounded-lg hover:bg-purple-200"
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
