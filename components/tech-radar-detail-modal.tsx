"use client"

import { useTechRadar } from "./tech-radar-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, Users, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TechRadarDetailModal() {
  const { selectedItem, showModal, setShowModal } = useTechRadar()

  if (!selectedItem) return null

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Get the quadrant and ring display names
  const getQuadrantName = (quadrant: string) => {
    const names: Record<string, string> = {
      adopt: "Adopt",
      trial: "Trial",
      assess: "Assess",
      hold: "Hold",
    }
    return names[quadrant] || quadrant
  }

  const getRingName = (ring: string) => {
    const names: Record<string, string> = {
      techniques: "Techniques",
      tools: "Tools",
      platforms: "Platforms",
      "languages-and-frameworks": "Languages & Frameworks",
    }
    return names[ring] || ring
  }

  // Get color for quadrant badge
  const getQuadrantColor = (quadrant: string) => {
    const colors: Record<string, string> = {
      adopt: "bg-success text-success-foreground",
      assess: "bg-warning text-warning-foreground",
      trial: "bg-muted text-muted-foreground",
      hold: "bg-destructive text-destructive-foreground",
    }
    return colors[quadrant] || "bg-primary text-primary-foreground"
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">{selectedItem.name}</DialogTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={getQuadrantColor(selectedItem.quadrant)}>{getQuadrantName(selectedItem.quadrant)}</Badge>
            <Badge variant="outline">{getRingName(selectedItem.ring)}</Badge>
          </div>
          <DialogDescription className="text-base mt-4">{selectedItem.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-muted-foreground">GitHub Stars</div>
              <div className="flex items-center gap-1 font-medium">
                <Star className="h-4 w-4 text-yellow-500" />
                {selectedItem.stars ? formatNumber(selectedItem.stars) : "N/A"}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-sm text-muted-foreground">Contributors</div>
              <div className="flex items-center gap-1 font-medium">
                <Users className="h-4 w-4 text-blue-500" />
                {selectedItem.contributors ? formatNumber(selectedItem.contributors) : "N/A"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-sm text-muted-foreground">Last Release</div>
            <div className="flex items-center gap-1 font-medium">
              <Calendar className="h-4 w-4 text-green-500" />
              {selectedItem.daysSinceLastRelease ? `${selectedItem.daysSinceLastRelease} days ago` : "N/A"}
            </div>
          </div>
        </div>

        <DialogFooter>
          {selectedItem.githubLink && (
            <Button asChild className="gap-2">
              <a href={selectedItem.githubLink} target="_blank" rel="noopener noreferrer">
                View on GitHub <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

