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

type PageState = "home" | "upload" | "loading" | "results" | "features" | "about"

const MOCK_ANALYSIS_DATA = {
  final_score: 68,
  forensic_score: 72,
  osint_score: 65,
  semantic_score: 67,
  forensic_details: [
    {
      check: "Metadata Authenticity",
      result:
        "Metadata shows signs of tampering. Timestamp discrepancies detected between EXIF and file creation time.",
    },
    {
      check: "Compression Analysis",
      result: "Image shows multiple re-compression artifacts. Consistent with image editing software usage.",
    },
    {
      check: "Pixel Pattern Analysis",
      result: "Irregular pixel distribution in certain regions suggests potential deepfake markers.",
    },
    {
      check: "Noise Profile",
      result: "Background noise levels inconsistent with foreground elements.",
    },
  ],
  osint_details: [
    {
      finding: "Reverse Image Search",
      description:
        "Image found on 3 different websites dating back to 2019. Original source appears to be Getty Images.",
    },
    {
      finding: "Geolocation Analysis",
      description: "Metadata indicates location mismatch with reported incident location by ~250 miles.",
    },
    {
      finding: "Face Recognition",
      description: "Facial features partially match known public figures, suggesting potential manipulation.",
    },
    {
      finding: "Context Verification",
      description: "No corroborating news reports or official statements from verified sources.",
    },
  ],
  sources: [
    {
      name: "Associated Press",
      credibility: 95,
      statement: "No official reports confirm this incident",
    },
    {
      name: "Reuters",
      credibility: 92,
      statement: "Similar images flagged in disinformation databases",
    },
    {
      name: "Snopes.com",
      credibility: 88,
      statement: "Marked as unverified claim - multiple inconsistencies",
    },
    {
      name: "PolitiFact",
      credibility: 87,
      statement: "Rated as 'Pants on Fire' - completely false",
    },
  ],
  red_flags: [
    {
      flag: "Timestamp Manipulation",
      severity: "high",
      description: "EXIF data shows modification",
    },
    {
      flag: "Reverse Image Found",
      severity: "high",
      description: "Image previously published with different context in 2019",
    },
    {
      flag: "Deepfake Indicators",
      severity: "medium",
      description: "Subtle facial blending artifacts detected",
    },
    {
      flag: "No Corroborating Sources",
      severity: "medium",
      description: "Zero mentions in major news outlets",
    },
    {
      flag: "Inconsistent Metadata",
      severity: "low",
      description: "Camera model doesn't match reported device",
    },
  ],
  hedera_proofs: [
    {
      transactionId: "0.0.123456@1700000000.001",
      timestamp: "2024-11-15T10:30:00Z",
      status: "verified",
      description: "Original file hash recorded on Hedera ledger",
    },
    {
      transactionId: "0.0.123456@1700100000.002",
      timestamp: "2024-11-15T14:45:00Z",
      status: "verified",
      description: "Analysis report immutably stored",
    },
  ],
  exif_metadata: {
    "Camera Model": "Canon EOS 5D Mark IV",
    "Date Taken": "2024-03-15 14:22:33",
    "GPS Latitude": "40.7128",
    "GPS Longitude": "-74.0060",
    Software: "Adobe Photoshop 2024",
    "Color Space": "sRGB",
    Resolution: "3840x2160",
  },
  summary:
    "This image shows moderate indicators of manipulation and lacks corroboration from credible sources. While some forensic markers suggest potential editing, the most significant concern is that reverse image searches reveal this content was previously published with entirely different context. The credibility assessment suggests treating this content with considerable skepticism until verified by established news organizations.",
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>("home")
  const [analysisData, setAnalysisData] = useState(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleStartAnalysis = () => {
    setCurrentPage("upload")
  }

  const handleFileSelected = async (file: File) => {
    setUploadedFile(file)
    setCurrentPage("loading")

    setTimeout(() => {
      setAnalysisData(MOCK_ANALYSIS_DATA)
      setCurrentPage("results")
    }, 3000)
  }

  const handleBackToUpload = () => {
    setCurrentPage("upload")
  }

  const handleBackToHome = () => {
    setCurrentPage("home")
    setAnalysisData(null)
    setUploadedFile(null)
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
      </main>

      <Footer />
    </>
  )
}
