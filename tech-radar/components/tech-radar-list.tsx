"use client"

import { useTechRadar } from "./tech-radar-context"

export default function TechRadarList() {
  const { items, selectedItem, setSelectedItem, filteredQuadrant, filteredRing } = useTechRadar()

  const filteredItems = items.filter(
    (item) =>
      (filteredQuadrant === "all" || item.quadrant === filteredQuadrant) &&
      (filteredRing === "all" || item.ring === filteredRing),
  )

  // Group items by quadrant
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.quadrant]) {
        acc[item.quadrant] = []
      }
      acc[item.quadrant].push(item)
      return acc
    },
    {} as Record<string, typeof items>,
  )

  const quadrantNames: Record<string, string> = {
    adopt: "Adopt",
    trial: "Trial",
    assess: "Assess",
    hold: "Hold",
  }

  const ringNames: Record<string, string> = {
    techniques: "Techniques",
    tools: "Tools",
    platforms: "Platforms",
    "languages-and-frameworks": "Languages & Frameworks",
  }

  const quadrantColors: Record<string, string> = {
    adopt: "bg-success text-success-foreground",
    assess: "bg-warning text-warning-foreground",
    trial: "bg-muted text-muted-foreground",
    hold: "bg-destructive text-destructive-foreground",
  }

  return <div className="flex flex-col gap-4">{/* All content removed as requested */}</div>
}

