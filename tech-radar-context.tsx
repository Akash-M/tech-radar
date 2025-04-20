"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export type Quadrant = "adopt" | "trial" | "assess" | "hold"

export interface TechItem {
  id: string
  name: string
  quadrant: Quadrant
  description: string
  isNew?: boolean
  githubLink?: string
  stars?: number
  contributors?: number
  daysSinceLastRelease?: number
  relatedTo?: string[]
  category?: string
}

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

// Helper function to assign a category to each item
const assignCategory = (name: string): string => {
  // Languages
  if (
    [
      "TypeScript",
      "JavaScript",
      "Dart",
      "Swift",
      "Kotlin",
      "C#",
      "Objective-C",
      "Elm",
      "ReScript",
      "ClojureScript",
      "PureScript",
    ].includes(name)
  ) {
    return "languages"
  }

  // Frameworks
  if (["React", "Vue.js", "Angular", "Svelte", "Solid.js", "Preact", "Alpine.js", "HTMX"].includes(name)) {
    return "frameworks"
  }

  // Meta-frameworks
  if (["Next.js", "Nuxt.js", "Remix", "Astro", "Gatsby", "SvelteKit", "Blazor"].includes(name)) {
    return "meta-frameworks"
  }

  // UI Libraries
  if (
    [
      "Tailwind CSS",
      "Material UI",
      "Chakra UI",
      "Shadcn UI",
      "Bootstrap",
      "Ant Design",
      "XAML",
      "SwiftUI",
      "Jetpack Compose",
    ].includes(name)
  ) {
    return "ui-libraries"
  }

  // Form Libraries
  if (
    [
      "React Hook Form",
      "Formik",
      "React Final Form",
      "Vuelidate",
      "VeeValidate",
      "FormKit",
      "Angular Reactive Forms",
      "ngx-formly",
      "Zod",
      "Yup",
      "Vest",
      "Svelte Forms Lib",
      "Felte",
    ].includes(name)
  ) {
    return "form-libraries"
  }

  // Chart Libraries
  if (
    [
      "D3.js",
      "Chart.js",
      "Recharts",
      "Victory",
      "Nivo",
      "Visx",
      "ApexCharts",
      "Highcharts",
      "ECharts",
      "Plotly.js",
      "C3.js",
      "Vega",
      "Vega-Lite",
      "G2Plot",
      "Chartist",
    ].includes(name)
  ) {
    return "chart-libraries"
  }

  // Date Libraries
  if (
    [
      "date-fns",
      "Moment.js",
      "Day.js",
      "Luxon",
      "js-joda",
      "date-io",
      "React Datepicker",
      "Flatpickr",
      "FullCalendar",
      "React Big Calendar",
      "Vue Calendar",
      "Angular Material Datepicker",
    ].includes(name)
  ) {
    return "date-libraries"
  }

  // Testing
  if (
    [
      "Cypress",
      "Playwright",
      "Jest",
      "Testing Library",
      "Vitest",
      "Selenium",
      "Puppeteer",
      "WebdriverIO",
      "Mocha",
      "Jasmine",
      "Karma",
      "Appium",
      "Postman",
      "k6",
    ].includes(name)
  ) {
    return "testing"
  }

  // State Management
  if (["Redux", "React Query", "Zustand", "Jotai", "MobX"].includes(name)) {
    return "state-management"
  }

  // Build Tools
  if (["Vite", "Webpack", "Gulp"].includes(name)) {
    return "build-tools"
  }

  // Mobile
  if (["React Native", "Flutter"].includes(name)) {
    return "mobile"
  }

  // CMS
  if (
    [
      "Adobe Experience Manager",
      "Contentful",
      "Storyblok",
      "Sanity",
      "Prismic",
      "Strapi",
      "WordPress",
      "Drupal",
      "Ghost",
      "Webflow",
      "Payload CMS",
      "Directus",
      "Netlify CMS",
      "Tina CMS",
    ].includes(name)
  ) {
    return "cms"
  }

  return "other"
}

// Convert the existing items to remove ring property and add category
const defaultItems: TechItem[] = [
  // Frameworks
  {
    id: "1",
    name: "React",
    quadrant: "adopt",
    description: "A JavaScript library for building user interfaces with a component-based architecture",
    isNew: false,
    githubLink: "https://github.com/facebook/react",
    stars: 212000,
    contributors: 1683,
    daysSinceLastRelease: 45,
    relatedTo: ["9", "13", "16", "18", "22", "23", "25", "29", "30", "33"],
    category: "frameworks",
  },
  {
    id: "2",
    name: "Vue.js",
    quadrant: "adopt",
    description: "Progressive JavaScript framework for building user interfaces with an approachable learning curve",
    isNew: false,
    githubLink: "https://github.com/vuejs/vue",
    stars: 203000,
    contributors: 398,
    daysSinceLastRelease: 62,
    relatedTo: ["10", "20", "29", "30"],
    category: "frameworks",
  },
  {
    id: "3",
    name: "Angular",
    quadrant: "trial",
    description: "Platform and framework for building single-page client applications using HTML and TypeScript",
    isNew: false,
    githubLink: "https://github.com/angular/angular",
    stars: 89000,
    contributors: 1456,
    daysSinceLastRelease: 30,
    relatedTo: ["21", "29", "31"],
    category: "frameworks",
  },
  {
    id: "4",
    name: "Svelte",
    quadrant: "trial",
    description: "Compiler-based framework that eliminates the virtual DOM for faster runtime performance",
    isNew: true,
    githubLink: "https://github.com/sveltejs/svelte",
    stars: 72000,
    contributors: 587,
    daysSinceLastRelease: 15,
    relatedTo: ["14", "29", "30"],
    category: "frameworks",
  },
  {
    id: "5",
    name: "Solid.js",
    quadrant: "assess",
    description: "Declarative, efficient, and flexible JavaScript library for building user interfaces",
    isNew: true,
    githubLink: "https://github.com/solidjs/solid",
    stars: 28000,
    contributors: 178,
    daysSinceLastRelease: 7,
    relatedTo: ["24", "29"],
    category: "frameworks",
  },
  {
    id: "6",
    name: "Preact",
    quadrant: "assess",
    description: "Fast 3kB alternative to React with the same modern API",
    isNew: false,
    githubLink: "https://github.com/preactjs/preact",
    stars: 34000,
    contributors: 289,
    daysSinceLastRelease: 90,
    relatedTo: ["1", "24", "29"],
    category: "frameworks",
  },
  {
    id: "7",
    name: "jQuery",
    quadrant: "hold",
    description: "Fast, small, and feature-rich JavaScript library for DOM manipulation",
    isNew: false,
    githubLink: "https://github.com/jquery/jquery",
    stars: 57000,
    contributors: 285,
    daysSinceLastRelease: 180,
    relatedTo: ["19", "28"],
    category: "frameworks",
  },
  {
    id: "8",
    name: "Backbone.js",
    quadrant: "hold",
    description: "Gives structure to web applications by providing models with key-value binding and custom events",
    isNew: false,
    githubLink: "https://github.com/jashkenas/backbone",
    stars: 27000,
    contributors: 302,
    daysSinceLastRelease: 365,
    relatedTo: ["7", "28"],
    category: "frameworks",
  },
  {
    id: "9",
    name: "Next.js",
    quadrant: "adopt",
    description:
      "React framework for production with hybrid static & server rendering, TypeScript support, and route pre-fetching",
    isNew: false,
    githubLink: "https://github.com/vercel/next.js",
    stars: 112000,
    contributors: 2300,
    daysSinceLastRelease: 5,
    relatedTo: ["1", "15", "18", "22", "29", "30"],
    category: "meta-frameworks",
  },
  {
    id: "10",
    name: "Nuxt.js",
    quadrant: "adopt",
    description: "Intuitive Vue framework for building modern web applications with server-side rendering",
    isNew: false,
    githubLink: "https://github.com/nuxt/nuxt",
    stars: 47000,
    contributors: 418,
    daysSinceLastRelease: 14,
    relatedTo: ["2", "15", "29", "30"],
    category: "meta-frameworks",
  },
  {
    id: "11",
    name: "Remix",
    quadrant: "trial",
    description: "Full stack web framework focused on web standards and modern UX",
    isNew: true,
    githubLink: "https://github.com/remix-run/remix",
    stars: 24000,
    contributors: 245,
    daysSinceLastRelease: 8,
    relatedTo: ["1", "15", "29", "30"],
    category: "meta-frameworks",
  },
  {
    id: "12",
    name: "Astro",
    quadrant: "trial",
    description: "All-in-one web framework for building fast, content-focused websites",
    isNew: true,
    githubLink: "https://github.com/withastro/astro",
    stars: 34000,
    contributors: 378,
    daysSinceLastRelease: 3,
    relatedTo: ["1", "2", "4", "15", "24", "29"],
    category: "meta-frameworks",
  },
  {
    id: "13",
    name: "Gatsby",
    quadrant: "assess",
    description: "React-based framework for building websites and apps with excellent performance",
    isNew: false,
    githubLink: "https://github.com/gatsbyjs/gatsby",
    stars: 54000,
    contributors: 3800,
    daysSinceLastRelease: 45,
    relatedTo: ["1", "15", "29", "30"],
    category: "meta-frameworks",
  },
  {
    id: "14",
    name: "SvelteKit",
    quadrant: "assess",
    description: "Framework for building web applications of all sizes with Svelte",
    isNew: true,
    githubLink: "https://github.com/sveltejs/kit",
    stars: 15000,
    contributors: 320,
    daysSinceLastRelease: 10,
    relatedTo: ["4", "15", "24", "29"],
    category: "meta-frameworks",
  },
  {
    id: "15",
    name: "Tailwind CSS",
    quadrant: "adopt",
    description: "Utility-first CSS framework for rapidly building custom user interfaces",
    isNew: false,
    githubLink: "https://github.com/tailwindlabs/tailwindcss",
    stars: 71000,
    contributors: 248,
    daysSinceLastRelease: 30,
    relatedTo: ["9", "10", "11", "12", "13", "14", "18", "26"],
    category: "ui-libraries",
  },
  {
    id: "16",
    name: "Material UI",
    quadrant: "adopt",
    description: "React components for faster and easier web development following Material Design",
    isNew: false,
    githubLink: "https://github.com/mui/material-ui",
    stars: 87000,
    contributors: 2700,
    daysSinceLastRelease: 7,
    relatedTo: ["1", "9", "29", "30"],
    category: "ui-libraries",
  },
  {
    id: "17",
    name: "Chakra UI",
    quadrant: "trial",
    description: "Simple, modular and accessible component library for React applications",
    isNew: false,
    githubLink: "https://github.com/chakra-ui/chakra-ui",
    stars: 33000,
    contributors: 580,
    daysSinceLastRelease: 21,
    relatedTo: ["1", "9", "29", "30"],
    category: "ui-libraries",
  },
  {
    id: "18",
    name: "Shadcn UI",
    quadrant: "trial",
    description: "Re-usable components built using Radix UI and Tailwind CSS",
    isNew: true,
    githubLink: "https://github.com/shadcn-ui/ui",
    stars: 45000,
    contributors: 180,
    daysSinceLastRelease: 5,
    relatedTo: ["1", "9", "15", "29"],
    category: "ui-libraries",
  },
  {
    id: "19",
    name: "Bootstrap",
    quadrant: "assess",
    description: "CSS framework directed at responsive, mobile-first front-end web development",
    isNew: false,
    githubLink: "https://github.com/twbs/bootstrap",
    stars: 164000,
    contributors: 1200,
    daysSinceLastRelease: 60,
    relatedTo: ["7", "28"],
    category: "ui-libraries",
  },
  {
    id: "20",
    name: "Ant Design",
    quadrant: "assess",
    description: "Enterprise-class UI design language and React UI library",
    isNew: false,
    githubLink: "https://github.com/ant-design/ant-design",
    stars: 87000,
    contributors: 1800,
    daysSinceLastRelease: 14,
    relatedTo: ["1", "2", "9", "29", "30"],
    category: "ui-libraries",
  },
  {
    id: "21",
    name: "Redux",
    quadrant: "adopt",
    description: "Predictable state container for JavaScript apps",
    isNew: false,
    githubLink: "https://github.com/reduxjs/redux",
    stars: 59000,
    contributors: 910,
    daysSinceLastRelease: 120,
    relatedTo: ["1", "3", "9", "29"],
    category: "state-management",
  },
  {
    id: "22",
    name: "React Query",
    quadrant: "adopt",
    description: "Data-fetching and state management library for React applications",
    isNew: false,
    githubLink: "https://github.com/tanstack/query",
    stars: 35000,
    contributors: 480,
    daysSinceLastRelease: 15,
    relatedTo: ["1", "9", "29"],
    category: "state-management",
  },
  {
    id: "23",
    name: "Zustand",
    quadrant: "trial",
    description: "Small, fast and scalable bearbones state-management solution",
    isNew: true,
    githubLink: "https://github.com/pmndrs/zustand",
    stars: 34000,
    contributors: 210,
    daysSinceLastRelease: 7,
    relatedTo: ["1", "9", "29"],
    category: "state-management",
  },
  {
    id: "24",
    name: "Vite",
    quadrant: "trial",
    description: "Next generation frontend tooling with fast HMR and optimized build",
    isNew: true,
    githubLink: "https://github.com/vitejs/vite",
    stars: 58000,
    contributors: 780,
    daysSinceLastRelease: 3,
    relatedTo: ["1", "2", "4", "5", "6", "12", "14", "29"],
    category: "build-tools",
  },
  {
    id: "25",
    name: "Jotai",
    quadrant: "assess",
    description: "Primitive and flexible state management for React",
    isNew: true,
    githubLink: "https://github.com/pmndrs/jotai",
    stars: 14000,
    contributors: 120,
    daysSinceLastRelease: 10,
    relatedTo: ["1", "9", "29"],
    category: "state-management",
  },
  {
    id: "26",
    name: "Webpack",
    quadrant: "assess",
    description: "Static module bundler for modern JavaScript applications",
    isNew: false,
    githubLink: "https://github.com/webpack/webpack",
    stars: 62000,
    contributors: 780,
    daysSinceLastRelease: 45,
    relatedTo: ["1", "2", "3", "9", "10", "15", "29"],
    category: "build-tools",
  },
  {
    id: "27",
    name: "MobX",
    quadrant: "hold",
    description: "Simple, scalable state management",
    isNew: false,
    githubLink: "https://github.com/mobxjs/mobx",
    stars: 26000,
    contributors: 240,
    daysSinceLastRelease: 90,
    relatedTo: ["1", "29"],
    category: "state-management",
  },
  {
    id: "28",
    name: "Gulp",
    quadrant: "hold",
    description: "Toolkit to automate & enhance your workflow",
    isNew: false,
    githubLink: "https://github.com/gulpjs/gulp",
    stars: 32000,
    contributors: 320,
    daysSinceLastRelease: 180,
    relatedTo: ["7", "8", "19"],
    category: "build-tools",
  },
  {
    id: "29",
    name: "TypeScript",
    quadrant: "adopt",
    description: "Typed superset of JavaScript that compiles to plain JavaScript",
    isNew: false,
    githubLink: "https://github.com/microsoft/TypeScript",
    stars: 92000,
    contributors: 870,
    daysSinceLastRelease: 14,
    relatedTo: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "16",
      "17",
      "18",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "30",
      "31",
      "32",
      "33",
      "34",
    ],
    category: "languages",
  },
  {
    id: "30",
    name: "Storybook",
    quadrant: "adopt",
    description: "Frontend workshop for building UI components and pages in isolation",
    isNew: false,
    githubLink: "https://github.com/storybookjs/storybook",
    stars: 78000,
    contributors: 1500,
    daysSinceLastRelease: 7,
    relatedTo: ["1", "2", "3", "4", "9", "10", "11", "13", "16", "17", "20", "29"],
    category: "ui-libraries",
  },
  {
    id: "31",
    name: "Cypress",
    quadrant: "trial",
    description: "JavaScript end-to-end testing framework",
    isNew: false,
    githubLink: "https://github.com/cypress-io/cypress",
    stars: 44000,
    contributors: 410,
    daysSinceLastRelease: 21,
    relatedTo: ["1", "2", "3", "4", "9", "10", "29", "32"],
    category: "testing",
  },
  {
    id: "32",
    name: "Playwright",
    quadrant: "trial",
    description: "Framework for web testing and automation",
    isNew: true,
    githubLink: "https://github.com/microsoft/playwright",
    stars: 54000,
    contributors: 520,
    daysSinceLastRelease: 5,
    relatedTo: ["1", "2", "3", "4", "9", "10", "29", "31"],
    category: "testing",
  },
  {
    id: "33",
    name: "Framer Motion",
    quadrant: "assess",
    description: "Production-ready motion library for React",
    isNew: true,
    githubLink: "https://github.com/framer/motion",
    stars: 19000,
    contributors: 110,
    daysSinceLastRelease: 30,
    relatedTo: ["1", "9", "29"],
    category: "ui-libraries",
  },
  {
    id: "34",
    name: "Three.js",
    quadrant: "assess",
    description: "JavaScript 3D library for creating 3D graphics in the browser",
    isNew: false,
    githubLink: "https://github.com/mrdoob/three.js",
    stars: 94000,
    contributors: 1700,
    daysSinceLastRelease: 7,
    relatedTo: ["1", "2", "9", "10", "29"],
    category: "ui-libraries",
  },

  // Frontend languages
  {
    id: "35",
    name: "JavaScript",
    quadrant: "adopt",
    description: "High-level, interpreted programming language that is the foundation of web development",
    isNew: false,
    githubLink: "https://github.com/tc39/ecma262",
    stars: 14000,
    contributors: 150,
    daysSinceLastRelease: 90,
    relatedTo: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "29"],
    category: "languages",
  },
]

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

