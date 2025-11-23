"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import ScoreCard from "@/components/results/score-card"
import AnalysisChart from "@/components/results/analysis-chart"
import SourcesList from "@/components/results/sources-list"
import RedFlagsList from "@/components/results/red-flags-list"
import HederaProofs from "@/components/results/hedera-proofs"
import ExifData from "@/components/results/exif-data"

interface ResultsPageProps {
  data: any
  fileName: string
  onBack: () => void
}

export default function ResultsPage({ data, fileName, onBack }: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const forensicScore = data?.forensic_score || 0
  const osintScore = data?.osint_score || 0
  const semanticScore = data?.semantic_score || 0
  const finalScore = data?.final_score || 0

  const credibilityLevel = finalScore >= 75 ? "authentic" : finalScore >= 50 ? "uncertain" : "suspicious"
  const credibilityColor =
    credibilityLevel === "authentic" ? "text-success" : credibilityLevel === "uncertain" ? "text-warning" : "text-error"

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "forensic", label: "Forensic Analysis" },
    { id: "osint", label: "OSINT Research" },
    { id: "sources", label: "Sources" },
    { id: "red-flags", label: "Red Flags" },
    { id: "hedera", label: "Blockchain" },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-playfair font-bold mb-2">Analysis Report</h1>
          <p className="text-foreground/60 text-sm">{fileName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Credibility Score */}
      <div className="max-w-6xl mx-auto mb-12 p-8 rounded border border-accent/20 bg-surface/50">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-playfair text-2xl font-bold mb-4">Credibility Assessment</h2>
            <p className="text-foreground/70 mb-4">Based on comprehensive forensic, OSINT, and AI semantic analysis</p>
            <div className={`text-5xl font-playfair font-bold ${credibilityColor}`}>{finalScore.toFixed(1)}%</div>
            <p className={`mt-2 text-lg font-semibold ${credibilityColor} uppercase tracking-wide`}>
              {credibilityLevel === "authentic"
                ? "Likely Authentic"
                : credibilityLevel === "uncertain"
                  ? "Uncertain - Review Required"
                  : "Likely Fabricated"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ScoreCard label="Forensic" score={forensicScore} icon="🔬" />
            <ScoreCard label="OSINT" score={osintScore} icon="🔍" />
            <ScoreCard label="Semantic" score={semanticScore} icon="🧠" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 whitespace-nowrap font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-accent border-b-2 border-accent"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <AnalysisChart forensic={forensicScore} osint={osintScore} semantic={semanticScore} />
          )}

          {activeTab === "forensic" && (
            <div className="p-6 rounded border border-border bg-surface/30 space-y-4">
              <h3 className="font-playfair text-xl font-bold">Forensic Analysis Results</h3>
              <div className="grid gap-4">
                {data?.forensic_details?.map((detail: any, idx: number) => (
                  <div key={idx} className="p-4 bg-surface rounded border border-border/50">
                    <p className="font-semibold text-accent">{detail.check}</p>
                    <p className="text-foreground/70 text-sm mt-1">{detail.result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "osint" && (
            <div className="p-6 rounded border border-border bg-surface/30 space-y-4">
              <h3 className="font-playfair text-xl font-bold">OSINT Investigation</h3>
              <div className="grid gap-4">
                {data?.osint_details?.map((detail: any, idx: number) => (
                  <div key={idx} className="p-4 bg-surface rounded border border-border/50">
                    <p className="font-semibold text-accent">{detail.finding}</p>
                    <p className="text-foreground/70 text-sm mt-1">{detail.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sources" && <SourcesList sources={data?.sources || []} />}

          {activeTab === "red-flags" && <RedFlagsList flags={data?.red_flags || []} />}

          {activeTab === "hedera" && <HederaProofs proofs={data?.hedera_proofs || []} />}
        </div>
      </div>

      {/* EXIF Data (if available) */}
      {data?.exif_metadata && (
        <div className="max-w-6xl mx-auto mt-12">
          <ExifData data={data.exif_metadata} />
        </div>
      )}

      {/* Summary */}
      {data?.summary && (
        <div className="max-w-6xl mx-auto mt-12 p-8 rounded border border-accent/20 bg-surface/50">
          <h3 className="font-playfair text-xl font-bold mb-4">Analysis Summary</h3>
          <p className="text-foreground/70 leading-relaxed">{data.summary}</p>
        </div>
      )}
    </div>
  )
}
