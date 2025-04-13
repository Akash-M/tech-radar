"use client"

import TechRadarControls from "@/components/tech-radar-controls"
import TechRadarDetailModal from "@/components/tech-radar-detail-modal"
import { useTechRadar } from "@/components/tech-radar-context"

export default function TechRadarPage() {
  const { viewMode } = useTechRadar()

  return (
    <div className="flex flex-col gap-6">
      <TechRadarControls />
      <TechRadarViewSwitcher />
      <TechRadarDetailModal />
    </div>
  )
}

function TechRadarViewSwitcher() {
  const { viewMode } = useTechRadar()

  if (viewMode === "radar") {
    return (
      <div className="relative h-[calc(100vh-250px)] min-h-[500px] w-full">
        <TechRadarComponent />
      </div>
    )
  }

  return <TechRadarTableComponent />
}

// Dynamically import the components to avoid SSR issues
import dynamic from "next/dynamic"

const TechRadarComponent = dynamic(() => import("@/components/tech-radar"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center">Loading radar chart...</div>,
})

const TechRadarTableComponent = dynamic(() => import("@/components/tech-radar-table"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center">Loading table view...</div>,
})

