"use client"

import type React from "react"
import { defaultItems } from "./data/data"
import { Quadrant, TechItem } from "./data/types"

import { createContext, useContext, useState, useEffect } from "react"

interface TechRadarContextType {
  items: TechItem[]
  filteredItems: TechItem[]
  addItem: (item: Omit<TechItem, "id">) => void
  removeItem: (id: string) => void
  updateItem: (id: string, item: Partial<TechItem>) => void
  selectedItem: TechItem | null
  setSelectedItem: (item: TechItem | null) => void
  filteredQuadrant: Quadrant | "all"
  setFilteredQuadrant: (quadrant: Quadrant | "all") => void
  filteredCategories: string[]
  setFilteredCategories: (category: string[]) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  showModal: boolean
  setShowModal: (show: boolean) => void
  showRelations: boolean
  setShowRelations: (show: boolean) => void
  starsRange: [number, number]
  setStarsRange: (range: [number, number]) => void
  contributorsRange: [number, number]
  setContributorsRange: (range: [number, number]) => void
  daysRange: [number, number]
  setDaysRange: (range: [number, number]) => void
  searchIn: "all" | "name" | "description"
  setSearchIn: (searchIn: "all" | "name" | "description") => void
  viewMode: "radar" | "table"
  setViewMode: (mode: "radar" | "table") => void
}

const TechRadarContext = createContext<TechRadarContextType | undefined>(undefined)

export function TechRadarProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<TechItem[]>(defaultItems)
  const [selectedItem, setSelectedItem] = useState<TechItem | null>(null)
  const [filteredQuadrant, setFilteredQuadrant] = useState<Quadrant | "all">("all")
  const [filteredCategories, setFilteredCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredItems, setFilteredItems] = useState<TechItem[]>(items)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showRelations, setShowRelations] = useState<boolean>(false)
  const [starsRange, setStarsRange] = useState<[number, number]>([0, Math.max(...items.map((item) => item.stars || 0))])
  const [contributorsRange, setContributorsRange] = useState<[number, number]>([
    0,
    Math.max(...items.map((item) => item.contributors || 0)),
  ])
  const [daysRange, setDaysRange] = useState<[number, number]>([
    0,
    Math.max(...items.map((item) => item.daysSinceLastRelease || 0)),
  ])
  const [searchIn, setSearchIn] = useState<"all" | "name" | "description">("all")
  const [viewMode, setViewMode] = useState<"radar" | "table">("radar")

  // Update filtered items whenever filters or search term changes
  useEffect(() => {
    const newFilteredItems = items.filter((item) => {
      const matchesQuadrant = filteredQuadrant === "all" || item.quadrant === filteredQuadrant

      // Category filtering - only apply if there are selected categories
      const matchesCategory = filteredCategories.length === 0 || filteredCategories.includes(item.category || "")

      // Search term filtering
      let matchesSearch = true
      if (searchTerm !== "") {
        if (searchIn === "name") {
          matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        } else if (searchIn === "description") {
          matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase())
        } else {
          matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        }
      }

      // Advanced filters

      // Filter by stars range
      if ((item.stars || 0) < starsRange[0] || (item.stars || 0) > starsRange[1]) return false

      // Filter by contributors range
      if ((item.contributors || 0) < contributorsRange[0] || (item.contributors || 0) > contributorsRange[1])
        return false

      // Filter by days since last release range
      if ((item.daysSinceLastRelease || 0) < daysRange[0] || (item.daysSinceLastRelease || 0) > daysRange[1])
        return false

      return matchesQuadrant && matchesCategory && matchesSearch
    })

    setFilteredItems(newFilteredItems)
  }, [items, filteredQuadrant, filteredCategories, searchTerm, starsRange, contributorsRange, daysRange, searchIn])

  const addItem = (item: Omit<TechItem, "id">) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
    }
    setItems((prev) => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    if (selectedItem?.id === id) {
      setSelectedItem(null)
    }
  }

  const updateItem = (id: string, updatedItem: Partial<TechItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)))
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, ...updatedItem } : null))
    }
  }

  return (
    <TechRadarContext.Provider
      value={{
        items,
        filteredItems,
        addItem,
        removeItem,
        updateItem,
        selectedItem,
        setSelectedItem,
        filteredQuadrant,
        setFilteredQuadrant,
        filteredCategories,
        setFilteredCategories,
        searchTerm,
        setSearchTerm,
        showModal,
        setShowModal,
        showRelations,
        setShowRelations,
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
      }}
    >
      {children}
    </TechRadarContext.Provider>
  )
}

export function useTechRadar() {
  const context = useContext(TechRadarContext)
  if (context === undefined) {
    throw new Error("useTechRadar must be used within a TechRadarProvider")
  }
  return context
}

