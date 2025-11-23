"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import HomePage from "@/components/pages/home-page"
import UploadPage from "@/components/pages/upload-page"
import LoadingPage from "@/components/pages/loading-page"
import ResultsPage from "@/components/pages/results-page"
import FeaturesPage from "@/components/pages/features-page"
import AboutPage from "@/components/pages/about-page"

type PageState = "home" | "upload" | "loading" | "results" | "features" | "about" | "error"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>("home")
  const [analysisData, setAnalysisData] = useState(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleStartAnalysis = () => {
    setCurrentPage("upload")
  }

  const handleFileSelected = async (file: File) => {
    setUploadedFile(file)
    setCurrentPage("loading")
    setErrorMessage("")

    try {
      const isImage = file.type.startsWith("image")
      const endpoint = isImage ? "/api/verify-image" : "/api/verify-article"

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`)
      }

      const data = await response.json()
      setAnalysisData(data)
      setCurrentPage("results")
    } catch (error) {
      console.error("[v0] Analysis failed:", error)
      setErrorMessage(error instanceof Error ? error.message : "Analysis failed. Please try again.")
      setCurrentPage("error")
    }
  }

  const handleBackToUpload = () => {
    setCurrentPage("upload")
  }

  const handleBackToHome = () => {
    setCurrentPage("home")
    setAnalysisData(null)
    setUploadedFile(null)
    setErrorMessage("")
  }

  const handleRetryAfterError = () => {
    setCurrentPage("upload")
  }

  return (
    <>
      <Navbar onNavigate={setCurrentPage} />

      <main className="pt-16 min-h-screen">
        {currentPage === "home" && <HomePage onStartAnalysis={handleStartAnalysis} />}
        {currentPage === "features" && <FeaturesPage />}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "upload" && <UploadPage onFileSelected={handleFileSelected} onBack={handleBackToHome} />}
        {currentPage === "loading" && <LoadingPage fileName={uploadedFile?.name || ""} />}
        {currentPage === "results" && analysisData && (
          <ResultsPage data={analysisData} fileName={uploadedFile?.name || ""} onBack={handleBackToUpload} />
        )}
        {currentPage === "error" && (
          <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <div className="p-8 rounded border border-error/30 bg-error/10">
              <h2 className="text-2xl font-playfair font-bold text-error mb-4">Analysis Failed</h2>
              <p className="text-foreground/70 mb-6">{errorMessage}</p>
              <button
                onClick={handleRetryAfterError}
                className="px-6 py-2 bg-accent text-surface rounded hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
