"use client"

import { useTechRadar, type Quadrant } from "./tech-radar-context"

export default function TechRadarChartLegend() {
  const { filteredQuadrant, setFilteredQuadrant } = useTechRadar()

  const quadrants: { id: Quadrant; name: string; description: string }[] = [
    {
      id: "adopt",
      name: "Adopt",
      description: "Technologies we have high confidence in and should be widely used",
    },
    {
      id: "trial",
      name: "Trial",
      description: "Technologies worth pursuing, but not yet proven in all scenarios",
    },
    {
      id: "assess",
      name: "Assess",
      description: "Technologies worth exploring with the goal of understanding how they affect your projects",
    },
    {
      id: "hold",
      name: "Hold",
      description: "Technologies that should be avoided for new projects or being phased out",
    },
  ]

  return <div></div>
}

function getColorForQuadrant(quadrant: Quadrant): string {
  switch (quadrant) {
    case "adopt":
      return "hsl(var(--success))"
    case "trial":
      return "hsl(var(--warning))"
    case "assess":
      return "hsl(var(--info))"
    case "hold":
      return "hsl(var(--destructive))"
    default:
      return "hsl(var(--primary))"
  }
}

