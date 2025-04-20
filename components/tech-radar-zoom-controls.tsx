"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, RefreshCw } from "lucide-react"

interface TechRadarZoomControlsProps {
  zoom: number
  setZoom: (zoom: number) => void
  minZoom: number
  maxZoom: number
  zoomStep: number
}

export default function TechRadarZoomControls({
  zoom,
  setZoom,
  minZoom,
  maxZoom,
  zoomStep,
}: TechRadarZoomControlsProps) {
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + zoomStep, maxZoom))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - zoomStep, minZoom))
  }

  const handleReset = () => {
    setZoom(1)
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border bg-background p-1 shadow-sm w-fit mx-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
        aria-label="Zoom out"
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="min-w-[40px] text-center text-xs">{Math.round(zoom * 100)}%</div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
        aria-label="Zoom in"
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReset}
        disabled={zoom === 1}
        aria-label="Reset zoom"
        className="h-8 w-8"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  )
}

