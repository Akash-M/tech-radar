"use client"

import { useTechRadar, type Quadrant } from "./tech-radar-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Network, Github, Star, Users, Calendar, X, LayoutGrid, PieChart, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RangeSlider } from "@/components/ui/range-slider"
// Remove or comment out the Slider import if it's no longer used
// import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Custom styles for slider thumbs
const sliderThumbStyles = "h-4 w-4 border-2 border-primary bg-background ring-offset-background"

// Remove the import if it's not used elsewhere

export default function TechRadarControls() {
  const {
    filteredCategories,
    setFilteredCategories,
    filteredQuadrant,
    setFilteredQuadrant,
    addItem,
    searchTerm,
    setSearchTerm,
    showRelations,
    setShowRelations,
    items,
    starsRange,
    setStarsRange,
    contributorsRange,
    setContributorsRange,
    daysRange,
    setDaysRange,
    searchIn,
    setSearchIn,
    viewMode,
    setViewMode,
  } = useTechRadar()

  const [open, setOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Calculate max values for sliders
  const maxStars = Math.max(...items.map((item) => item.stars || 0))
  const maxContributors = Math.max(...items.map((item) => item.contributors || 0))
  const maxDays = Math.max(...items.map((item) => item.daysSinceLastRelease || 0))

  // Calculate active filters count
  useEffect(() => {
    let count = 0
    if (filteredCategories.length > 0) count++
    if (filteredQuadrant !== "all") count++
    if (starsRange[0] > 0 || starsRange[1] < maxStars) count++
    if (contributorsRange[0] > 0 || contributorsRange[1] < maxContributors) count++
    if (daysRange[0] > 0 || daysRange[1] < maxDays) count++
    if (searchTerm) count++
    setActiveFiltersCount(count)
  }, [
    filteredCategories,
    filteredQuadrant,
    starsRange,
    contributorsRange,
    daysRange,
    searchTerm,
    maxStars,
    maxContributors,
    maxDays,
  ])

  const [newItem, setNewItem] = useState({
    name: "",
    quadrant: "assess" as Quadrant,
    description: "",
    isNew: true,
    githubLink: "",
    stars: 0,
    contributors: 0,
    daysSinceLastRelease: 0,
    relatedTo: [] as string[],
    category: "frameworks" as string,
  })

  const handleAddItem = () => {
    if (newItem.name.trim() === "") return

    addItem(newItem)
    setNewItem({
      name: "",
      quadrant: "assess",
      description: "",
      isNew: true,
      githubLink: "",
      stars: 0,
      contributors: 0,
      daysSinceLastRelease: 0,
      relatedTo: [],
      category: "frameworks",
    })
    setOpen(false)
  }

  const handleRelatedItemToggle = (itemId: string) => {
    setNewItem((prev) => {
      const isAlreadyRelated = prev.relatedTo.includes(itemId)

      if (isAlreadyRelated) {
        return {
          ...prev,
          relatedTo: prev.relatedTo.filter((id) => id !== itemId),
        }
      } else {
        return {
          ...prev,
          relatedTo: [...prev.relatedTo, itemId],
        }
      }
    })
  }

  const clearAllFilters = () => {
    setFilteredCategories([])
    setFilteredQuadrant("all")
    setStarsRange([0, maxStars])
    setContributorsRange([0, maxContributors])
    setDaysRange([0, maxDays])
    setSearchTerm("")
    setSearchIn("all")
  }

  // Apply advanced filters to the items
  const applyAdvancedFilters = (items) => {
    return items.filter((item) => {
      // Filter by isNew
      // Filter by stars range
      if ((item.stars || 0) < starsRange[0] || (item.stars || 0) > starsRange[1]) return false

      // Filter by contributors range
      if ((item.contributors || 0) < contributorsRange[0] || (item.contributors || 0) > contributorsRange[1])
        return false

      // Filter by days since last release range
      if ((item.daysSinceLastRelease || 0) < daysRange[0] || (item.daysSinceLastRelease || 0) > daysRange[1])
        return false

      return true
    })
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* First Row: View Mode and Show Relations */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="view-mode" className="text-sm">
                  View Mode
                </Label>
              </div>
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "radar" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none h-8 px-3"
                  onClick={() => setViewMode("radar")}
                >
                  <PieChart className="h-4 w-4 mr-1" />
                  Radar
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none h-8 px-3"
                  onClick={() => setViewMode("table")}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Table
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Network className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="show-relations" className="text-sm">
                  Show Relations
                </Label>
              </div>
              <Switch
                id="show-relations"
                checked={showRelations}
                onCheckedChange={setShowRelations}
                aria-label="Toggle technology relations"
              />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="ml-auto">Add Technology</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Technology</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quadrant">Quadrant</Label>
                      <Select
                        value={newItem.quadrant}
                        onValueChange={(value) => setNewItem({ ...newItem, quadrant: value as Quadrant })}
                      >
                        <SelectTrigger id="quadrant">
                          <SelectValue placeholder="Select Quadrant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adopt">Adopt</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="assess">Assess</SelectItem>
                          <SelectItem value="hold">Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="languages">Languages</SelectItem>
                          <SelectItem value="frameworks">Frameworks</SelectItem>
                          <SelectItem value="meta-frameworks">Meta-frameworks</SelectItem>
                          <SelectItem value="ui-libraries">UI Libraries</SelectItem>
                          <SelectItem value="form-libraries">Form Libraries</SelectItem>
                          <SelectItem value="chart-libraries">Chart Libraries</SelectItem>
                          <SelectItem value="date-libraries">Date Libraries</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                          <SelectItem value="state-management">State Management</SelectItem>
                          <SelectItem value="build-tools">Build Tools</SelectItem>
                          <SelectItem value="mobile">Mobile Development</SelectItem>
                          <SelectItem value="cms">Content Management Systems</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="githubLink" className="flex items-center gap-1">
                      <Github className="h-4 w-4" /> GitHub Link
                    </Label>
                    <Input
                      id="githubLink"
                      placeholder="https://github.com/org/repo"
                      value={newItem.githubLink}
                      onChange={(e) => setNewItem({ ...newItem, githubLink: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="stars" className="flex items-center gap-1">
                        <Star className="h-4 w-4" /> Stars
                      </Label>
                      <Input
                        id="stars"
                        type="number"
                        min="0"
                        value={newItem.stars}
                        onChange={(e) => setNewItem({ ...newItem, stars: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contributors" className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> Contributors
                      </Label>
                      <Input
                        id="contributors"
                        type="number"
                        min="0"
                        value={newItem.contributors}
                        onChange={(e) => setNewItem({ ...newItem, contributors: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="daysSinceLastRelease" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Days Since Release
                      </Label>
                      <Input
                        id="daysSinceLastRelease"
                        type="number"
                        min="0"
                        value={newItem.daysSinceLastRelease}
                        onChange={(e) =>
                          setNewItem({ ...newItem, daysSinceLastRelease: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-1">
                      <Network className="h-4 w-4" /> Related Technologies
                    </Label>
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`related-${item.id}`}
                              checked={newItem.relatedTo.includes(item.id)}
                              onCheckedChange={() => handleRelatedItemToggle(item.id)}
                            />
                            <Label htmlFor={`related-${item.id}`} className="text-sm cursor-pointer">
                              {item.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNew"
                      checked={newItem.isNew}
                      onCheckedChange={(checked) => setNewItem({ ...newItem, isNew: checked === true })}
                    />
                    <Label htmlFor="isNew" className="text-sm cursor-pointer">
                      Mark as new technology
                    </Label>
                  </div>
                </div>
                <Button onClick={handleAddItem}>Add Technology</Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Second Row: Search, Category, and Advanced Filters */}
          <div className="flex flex-wrap gap-4 items-start">
            <div className="w-full md:w-64">
              <Label htmlFor="search-filter" className="mb-1 block text-sm">
                Search Technologies
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-filter"
                  placeholder="Search by name or description..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="category-filter" className="mb-1 block text-sm">
                Categories
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filteredCategories.length === 0 ? "All Categories" : `${filteredCategories.length} selected`}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("languages")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "languages"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "languages"))
                        }
                      }}
                    >
                      Languages
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("frameworks")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "frameworks"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "frameworks"))
                        }
                      }}
                    >
                      Frameworks
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("meta-frameworks")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "meta-frameworks"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "meta-frameworks"))
                        }
                      }}
                    >
                      Meta-frameworks
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("ui-libraries")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "ui-libraries"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "ui-libraries"))
                        }
                      }}
                    >
                      UI Libraries
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("form-libraries")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "form-libraries"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "form-libraries"))
                        }
                      }}
                    >
                      Form Libraries
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("chart-libraries")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "chart-libraries"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "chart-libraries"))
                        }
                      }}
                    >
                      Chart Libraries
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("date-libraries")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "date-libraries"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "date-libraries"))
                        }
                      }}
                    >
                      Date Libraries
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("testing")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "testing"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "testing"))
                        }
                      }}
                    >
                      Testing
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("state-management")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "state-management"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "state-management"))
                        }
                      }}
                    >
                      State Management
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("build-tools")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "build-tools"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "build-tools"))
                        }
                      }}
                    >
                      Build Tools
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("mobile")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "mobile"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "mobile"))
                        }
                      }}
                    >
                      Mobile Development
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filteredCategories.includes("cms")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilteredCategories([...filteredCategories, "cms"])
                        } else {
                          setFilteredCategories(filteredCategories.filter((c) => c !== "cms"))
                        }
                      }}
                    >
                      Content Management Systems
                    </DropdownMenuCheckboxItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setFilteredCategories([])}>
                      Clear Selection
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="advanced-filter" className="mb-1 block text-sm">
                Advanced
              </Label>
              <Select onValueChange={(value) => setAdvancedFiltersOpen(value === "open")}>
                <SelectTrigger id="advanced-filter" className="w-full">
                  <SelectValue placeholder="Advanced Filters" />
                </SelectTrigger>
                <SelectContent className="w-[300px]">
                  <div className="p-4 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          GitHub Stars
                        </Label>
                        <div className="text-xs text-muted-foreground">
                          {starsRange[0].toLocaleString()} - {starsRange[1].toLocaleString()}
                        </div>
                      </div>
                      <RangeSlider
                        value={[starsRange[0], starsRange[1]]}
                        min={0}
                        max={maxStars}
                        step={100}
                        onValueChange={(value) => setStarsRange([value[0], value[1]])}
                        className="py-4"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          Contributors
                        </Label>
                        <div className="text-xs text-muted-foreground">
                          {contributorsRange[0].toLocaleString()} - {contributorsRange[1].toLocaleString()}
                        </div>
                      </div>
                      <RangeSlider
                        value={[contributorsRange[0], contributorsRange[1]]}
                        min={0}
                        max={maxContributors}
                        step={10}
                        onValueChange={(value) => setContributorsRange([value[0], value[1]])}
                        className="py-4"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          Days Since Last Release
                        </Label>
                        <div className="text-xs text-muted-foreground">
                          {daysRange[0]} - {daysRange[1]} days
                        </div>
                      </div>
                      <RangeSlider
                        value={[daysRange[0], daysRange[1]]}
                        min={0}
                        max={maxDays}
                        step={5}
                        onValueChange={(value) => setDaysRange([value[0], value[1]])}
                        className="py-4"
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Search In</Label>
                      <Tabs defaultValue="all" value={searchIn} onValueChange={(value) => setSearchIn(value as any)}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="name">Name</TabsTrigger>
                          <TabsTrigger value="description">Description</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Filter count and clear button */}
          <div className="flex justify-end mt-4">
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="mr-2">
                  {activeFiltersCount} active
                </Badge>
              )}
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="flex items-center gap-1">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

