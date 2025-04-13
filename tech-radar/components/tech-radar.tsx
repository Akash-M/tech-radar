"use client"

import { useEffect, useRef, useState } from "react"
import { useTechRadar, type Quadrant, type TechItem } from "./tech-radar-context"
import TechRadarZoomControls from "./tech-radar-zoom-controls"
import TechRadarChartLegend from "./tech-radar-chart-legend"
import TechRadarDetailModal from "./tech-radar-detail-modal"

export default function TechRadar() {
  const { filteredItems, setSelectedItem, filteredQuadrant, filteredCategories, setShowModal, showRelations } =
    useTechRadar()

  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const [zoom, setZoom] = useState(1)
  const minZoom = 0.5
  const maxZoom = 3
  const zoomStep = 0.25

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    const resizeObserver = new ResizeObserver(updateDimensions)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY * -0.01
        setZoom((prevZoom) => {
          const newZoom = Math.max(minZoom, Math.min(maxZoom, prevZoom + delta))
          return newZoom
        })
      }
    }

    if (svgRef.current) {
      svgRef.current.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      resizeObserver.disconnect()
      if (svgRef.current) {
        svgRef.current.removeEventListener("wheel", handleWheel)
      }
    }
  }, [])

  const radius = (Math.min(dimensions.width, dimensions.height) / 2) * zoom
  const center = { x: dimensions.width / 2, y: dimensions.height / 2 }

  // Quadrant configuration
  const quadrants: { id: Quadrant; name: string; startAngle: number; endAngle: number }[] = [
    { id: "adopt", name: "Adopt", startAngle: Math.PI, endAngle: (3 * Math.PI) / 2 },
    { id: "assess", name: "Assess", startAngle: (3 * Math.PI) / 2, endAngle: 2 * Math.PI },
    { id: "hold", name: "Hold", startAngle: 0, endAngle: Math.PI / 2 },
    { id: "trial", name: "Trial", startAngle: Math.PI / 2, endAngle: Math.PI },
  ]

  // Category color mapping
  const categoryColors: Record<string, string> = {
    languages: "#3498db", // Blue
    frameworks: "#2ecc71", // Green
    "meta-frameworks": "#9b59b6", // Purple
    "ui-libraries": "#e74c3c", // Red
    "form-libraries": "#f39c12", // Orange
    "chart-libraries": "#1abc9c", // Turquoise
    "date-libraries": "#d35400", // Pumpkin
    testing: "#8e44ad", // Wisteria
    "state-management": "#27ae60", // Nephritis
    "build-tools": "#f1c40f", // Sunflower
    mobile: "#e67e22", // Carrot
    cms: "#16a085", // Green Sea
    other: "#7f8c8d", // Asbestos
  }

  // Calculate position for each item
  const positionedItems = filteredItems
    .map((item, index) => {
      const quadrant = quadrants.find((q) => q.id === item.quadrant)
      if (!quadrant) return null

      // Calculate angle within the quadrant
      const angleRange = quadrant.endAngle - quadrant.startAngle
      const itemCount = filteredItems.filter((i) => i.quadrant === item.quadrant).length
      const itemIndex = filteredItems.filter((i) => i.quadrant === item.quadrant).findIndex((i) => i.id === item.id)

      // Calculate the angle for this item
      const angle = quadrant.startAngle + (angleRange * (itemIndex + 0.5)) / Math.max(itemCount, 1)

      // Calculate the radius for this item (distribute evenly within the quadrant)
      const minRadius = radius * 0.2 // Inner padding
      const maxRadius = radius * 0.9 // Outer padding

      // Distribute items radially based on their index
      const itemRadius = minRadius + ((maxRadius - minRadius) * ((itemIndex % 5) + 1)) / 6

      // Calculate x and y coordinates
      const x = center.x + itemRadius * Math.cos(angle)
      const y = center.y + itemRadius * Math.sin(angle)

      return {
        ...item,
        x,
        y,
        angle,
        radius: itemRadius,
      }
    })
    .filter(Boolean) as (TechItem & { x: number; y: number; angle: number; radius: number })[]

  // Handle item click
  const handleItemClick = (item: TechItem) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  // Generate relation lines
  const relationLines = showRelations ? generateRelationLines(positionedItems) : []

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="overflow-visible"
        style={{ touchAction: "none" }}
      >
        <g
          transform={`translate(${(dimensions.width / 2) * (1 - zoom)}, ${(dimensions.height / 2) * (1 - zoom)}) scale(${zoom})`}
        >
          {/* Quadrant circles */}
          <circle
            cx={center.x}
            cy={center.y}
            r={radius / zoom}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.2}
            strokeWidth={1 / zoom}
          />

          {/* Quadrant lines */}
          {quadrants.map((quadrant) => (
            <line
              key={quadrant.id}
              x1={center.x}
              y1={center.y}
              x2={center.x + (radius / zoom) * Math.cos(quadrant.startAngle)}
              y2={center.y + (radius / zoom) * Math.sin(quadrant.startAngle)}
              stroke="currentColor"
              strokeOpacity={0.2}
              strokeWidth={1 / zoom}
            />
          ))}

          {/* Relation lines */}
          {showRelations &&
            relationLines.map((line, index) => (
              <line
                key={`relation-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="currentColor"
                strokeOpacity={0.3}
                strokeWidth={1 / zoom}
                strokeDasharray={`${4 / zoom},${4 / zoom}`}
                className="relation-line"
              />
            ))}

          {/* Quadrant labels */}
          {quadrants.map((quadrant) => {
            const midAngle = (quadrant.startAngle + quadrant.endAngle) / 2
            const labelRadius = (radius / zoom) * 1.1
            const x = center.x + labelRadius * Math.cos(midAngle)
            const y = center.y + labelRadius * Math.sin(midAngle)

            return (
              <g key={quadrant.id}>
                <rect
                  x={x - 50 / zoom}
                  y={y - 15 / zoom}
                  width={100 / zoom}
                  height={30 / zoom}
                  rx={5 / zoom}
                  fill="white"
                  stroke="currentColor"
                  strokeOpacity={0.3}
                  strokeWidth={1 / zoom}
                  className="fill-background"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-current font-bold uppercase"
                  style={{
                    opacity: filteredQuadrant === "all" || filteredQuadrant === quadrant.id ? 1 : 0.5,
                    fontSize: `${12 / zoom}px`,
                  }}
                >
                  {quadrant.name}
                </text>
              </g>
            )
          })}

          {/* Items */}
          {positionedItems.map((item) => {
            const textColor =
              item.category && categoryColors[item.category] ? categoryColors[item.category] : categoryColors.other

            return (
              <g
                key={item.id}
                transform={`translate(${item.x}, ${item.y})`}
                onClick={() => handleItemClick(item)}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-medium"
                  style={{
                    fontSize: `${12 / zoom}px`,
                    fill: textColor,
                    fontWeight: "normal",
                    textDecoration: "none",
                  }}
                >
                  {item.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      <TechRadarChartLegend />

      {/* Category Legend */}
      <div className="mt-4 mx-auto bg-white p-3 rounded-md shadow-md max-w-3xl">
        <div className="text-sm font-bold mb-2">Categories</div>
        <div className="flex flex-row flex-wrap gap-3">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <div>{category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
            </div>
          ))}
        </div>
      </div>

      <TechRadarDetailModal />
      <TechRadarZoomControls zoom={zoom} setZoom={setZoom} minZoom={minZoom} maxZoom={maxZoom} zoomStep={zoomStep} />
    </div>
  )
}

// Function to generate relation lines between related items
function generateRelationLines(
  items: (TechItem & { x: number; y: number })[],
): { x1: number; y1: number; x2: number; y2: number }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []

  // Create a map of item IDs to their positions
  const itemPositions = new Map<string, { x: number; y: number }>()
  items.forEach((item) => {
    itemPositions.set(item.id, { x: item.x, y: item.y })
  })

  // For each item, draw lines to its related items
  items.forEach((item) => {
    if (item.relatedTo && item.relatedTo.length > 0) {
      // Only draw lines to items that are currently visible
      const visibleRelatedIds = item.relatedTo.filter((id) => itemPositions.has(id))

      // To avoid too many lines, limit to 3 relations per item
      const limitedRelatedIds = visibleRelatedIds.slice(0, 3)

      limitedRelatedIds.forEach((relatedId) => {
        const relatedPos = itemPositions.get(relatedId)
        if (relatedPos) {
          // Only draw the line once (from lower ID to higher ID)
          if (item.id < relatedId) {
            lines.push({
              x1: item.x,
              y1: item.y,
              x2: relatedPos.x,
              y2: relatedPos.y,
            })
          }
        }
      })
    }
  })

  return lines
}

function getColorForQuadrant(quadrant: Quadrant): string {
  switch (quadrant) {
    case "adopt":
      return "hsl(var(--success))" // Green
    case "assess":
      return "hsl(var(--warning))" // Orange
    case "trial":
      return "hsl(var(--muted))" // Grey
    case "hold":
      return "hsl(var(--destructive))" // Red
    default:
      return "hsl(var(--primary))"
  }
}

