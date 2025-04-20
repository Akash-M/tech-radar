"use client"

import { useState } from "react"
import { useTechRadar, type TechItem } from "./tech-radar-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Calendar, ArrowUpDown, ExternalLink } from "lucide-react"

type SortField = "name" | "quadrant" | "category" | "stars" | "contributors" | "daysSinceLastRelease"
type SortDirection = "asc" | "desc"

export default function TechRadarTable() {
  const { filteredItems, setSelectedItem, setShowModal } = useTechRadar()
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "quadrant":
        comparison = a.quadrant.localeCompare(b.quadrant)
        break
      case "category":
        comparison = (a.category || "").localeCompare(b.category || "")
        break
      case "stars":
        comparison = (a.stars || 0) - (b.stars || 0)
        break
      case "contributors":
        comparison = (a.contributors || 0) - (b.contributors || 0)
        break
      case "daysSinceLastRelease":
        comparison = (a.daysSinceLastRelease || 0) - (b.daysSinceLastRelease || 0)
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleItemClick = (item: TechItem) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  // Get quadrant display name
  const getQuadrantName = (quadrant: string) => {
    const names: Record<string, string> = {
      adopt: "Adopt",
      trial: "Trial",
      assess: "Assess",
      hold: "Hold",
    }
    return names[quadrant] || quadrant
  }

  // Get quadrant badge color
  const getQuadrantColor = (quadrant: string) => {
    const colors: Record<string, string> = {
      adopt: "bg-success text-success-foreground",
      trial: "bg-muted text-muted-foreground",
      assess: "bg-warning text-warning-foreground",
      hold: "bg-destructive text-destructive-foreground",
    }
    return colors[quadrant] || "bg-primary text-primary-foreground"
  }

  // Format numbers with commas
  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "N/A"
    return num.toLocaleString()
  }

  // Get category display name
  const getCategoryName = (category: string | undefined) => {
    if (!category) return "Other"
    return category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <section aria-labelledby="technology-comparison-table">
      <h2 id="technology-comparison-table" className="sr-only">
        Technology Comparison Table
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Compare {filteredItems.length} technologies across different metrics. Click on any row to view detailed
        information.
      </p>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <Button variant="ghost" onClick={() => handleSort("name")} className="flex items-center gap-1 px-0">
                  Name <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("quadrant")} className="flex items-center gap-1 px-0">
                  Quadrant <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("category")} className="flex items-center gap-1 px-0">
                  Category <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort("stars")} className="flex items-center gap-1 px-0">
                  <Star className="h-3 w-3 text-yellow-500" /> Stars <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("contributors")}
                  className="flex items-center gap-1 px-0"
                >
                  <Users className="h-3 w-3 text-blue-500" /> Contributors <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("daysSinceLastRelease")}
                  className="flex items-center gap-1 px-0"
                >
                  <Calendar className="h-3 w-3 text-green-500" /> Last Release <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleItemClick(item)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {item.name}
                    {item.githubLink && (
                      <a
                        href={item.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-primary"
                        aria-label={`View ${item.name} on GitHub`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getQuadrantColor(item.quadrant)}>{getQuadrantName(item.quadrant)}</Badge>
                </TableCell>
                <TableCell>{getCategoryName(item.category)}</TableCell>
                <TableCell className="text-right">{formatNumber(item.stars)}</TableCell>
                <TableCell className="text-right">{formatNumber(item.contributors)}</TableCell>
                <TableCell className="text-right">
                  {item.daysSinceLastRelease ? `${item.daysSinceLastRelease} days ago` : "N/A"}
                </TableCell>
              </TableRow>
            ))}
            {sortedItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found. Try adjusting your filters to see more technologies.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Data sourced from GitHub and community contributions. Last updated: {new Date().toLocaleDateString()}
      </p>
    </section>
  )
}

