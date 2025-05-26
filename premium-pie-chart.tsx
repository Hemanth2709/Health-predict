"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Info, ExternalLink } from "lucide-react"

// Define our data structure
interface DataPoint {
  id: string
  category: string
  value: number
  previousValue: number
  color: string
}

// Sample data
const sampleData: DataPoint[] = [
  {
    id: "category-a",
    category: "Category A",
    value: 42,
    previousValue: 38,
    color: "#3B82F6", // deep blue
  },
  {
    id: "category-b",
    category: "Category B",
    value: 28,
    previousValue: 30,
    color: "#10B981", // muted teal
  },
  {
    id: "category-c",
    category: "Category C",
    value: 16,
    previousValue: 15,
    color: "#F59E0B", // gold
  },
  {
    id: "category-d",
    category: "Category D",
    value: 14,
    previousValue: 17,
    color: "#6B7280", // slate gray
  },
]

export default function PremiumPieChart() {
  const [data, setData] = useState<DataPoint[]>(sampleData)
  const [activeSlice, setActiveSlice] = useState<string | null>(null)
  const [legendCollapsed, setLegendCollapsed] = useState(false)
  const [focusedSliceIndex, setFocusedSliceIndex] = useState<number | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Find the largest slice for annotation
  const largestSlice = [...data].sort((a, b) => b.value - a.value)[0]

  // Calculate pie chart segments
  const calculateSegments = () => {
    let startAngle = 0
    return data.map((item) => {
      const percentage = (item.value / total) * 100
      const angle = (percentage / 100) * 360
      const endAngle = startAngle + angle

      // Calculate coordinates for the path
      const startRad = (startAngle - 90) * (Math.PI / 180)
      const endRad = (endAngle - 90) * (Math.PI / 180)

      const x1 = 50 + 40 * Math.cos(startRad)
      const y1 = 50 + 40 * Math.sin(startRad)
      const x2 = 50 + 40 * Math.cos(endRad)
      const y2 = 50 + 40 * Math.sin(endRad)

      // Determine if the arc should be drawn as a large arc
      const largeArcFlag = angle > 180 ? 1 : 0

      // Create the path data
      const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

      // Calculate label position (middle of the arc)
      const midAngle = startAngle + angle / 2
      const midRad = (midAngle - 90) * (Math.PI / 180)
      const labelX = 50 + 30 * Math.cos(midRad)
      const labelY = 50 + 30 * Math.sin(midRad)

      // Calculate annotation position for largest slice
      const annotationX = 50 + 55 * Math.cos(midRad)
      const annotationY = 50 + 55 * Math.sin(midRad)

      // Calculate percentage change
      const percentageChange =
        item.previousValue > 0 ? ((item.value - item.previousValue) / item.previousValue) * 100 : 0

      const segment = {
        id: item.id,
        category: item.category,
        value: item.value,
        percentage,
        percentageChange,
        color: item.color,
        pathData,
        startAngle,
        endAngle,
        labelX,
        labelY,
        annotationX,
        annotationY,
        hasSignificantChange: Math.abs(percentageChange) > 5,
      }

      startAngle = endAngle
      return segment
    })
  }

  const segments = calculateSegments()

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (focusedSliceIndex === null && data.length > 0) {
      setFocusedSliceIndex(0)
      return
    }

    if (focusedSliceIndex !== null) {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault()
          setFocusedSliceIndex((focusedSliceIndex + 1) % data.length)
          break
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          setFocusedSliceIndex((focusedSliceIndex - 1 + data.length) % data.length)
          break
        case "Enter":
        case " ":
          e.preventDefault()
          setActiveSlice(data[focusedSliceIndex].id)
          break
        default:
          break
      }
    }
  }

  // Update active slice when focused slice changes
  useEffect(() => {
    if (focusedSliceIndex !== null) {
      setActiveSlice(data[focusedSliceIndex].id)
    }
  }, [focusedSliceIndex, data])

  // Format date for the timestamp
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Format time for the timestamp
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div
      className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)",
      }}
      ref={chartRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Sales Breakdown by Category Pie Chart"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <h2 className="text-lg font-bold text-white">Sales Breakdown by Category</h2>
        <div className="text-sm text-gray-300">
          {formattedDate} | {formattedTime}
        </div>
      </div>

      {/* Main content area with chart and legend */}
      <div className="flex flex-col md:flex-row p-6">
        {/* Chart area */}
        <div className="relative flex-1 aspect-square max-w-md mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" aria-hidden="true">
            {/* Pie segments */}
            {segments.map((segment, index) => {
              const isActive = activeSlice === segment.id || focusedSliceIndex === index

              return (
                <motion.path
                  key={segment.id}
                  d={segment.pathData}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.8, transformOrigin: "50% 50%" }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.05 : 1,
                    transformOrigin: "50% 50%",
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                  }}
                  onMouseEnter={() => setActiveSlice(segment.id)}
                  onMouseLeave={() => setActiveSlice(null)}
                  className="filter drop-shadow-lg cursor-pointer transition-all duration-200"
                  aria-label={`${segment.category}: ${segment.value} (${segment.percentage.toFixed(1)}%)`}
                  role="button"
                  tabIndex={-1}
                />
              )
            })}

            {/* Center circle for better aesthetics */}
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="#1A1A1A"
              stroke="white"
              strokeWidth="1"
              className="filter drop-shadow-md"
            />

            {/* Annotation for largest slice */}
            {segments.map((segment) => {
              if (segment.category === largestSlice.category) {
                return (
                  <g key={`annotation-${segment.id}`}>
                    <line
                      x1={segment.labelX}
                      y1={segment.labelY}
                      x2={segment.annotationX}
                      y2={segment.annotationY}
                      stroke="white"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    <circle cx={segment.annotationX} cy={segment.annotationY} r="1.5" fill="white" />
                    <text
                      x={segment.annotationX + (segment.annotationX > 50 ? 3 : -3)}
                      y={segment.annotationY}
                      fill="white"
                      fontSize="3"
                      textAnchor={segment.annotationX > 50 ? "start" : "end"}
                      dominantBaseline="middle"
                      className="font-light"
                    >
                      Strongest performer this quarter
                    </text>
                  </g>
                )
              }
              return null
            })}
          </svg>

          {/* Tooltips */}
          <AnimatePresence>
            {activeSlice &&
              segments.map((segment) => {
                if (segment.id === activeSlice) {
                  // Calculate position for tooltip
                  const angle = (segment.startAngle + segment.endAngle) / 2
                  const rad = (angle - 90) * (Math.PI / 180)
                  const distance = 42
                  const x = 50 + distance * Math.cos(rad)
                  const y = 50 + distance * Math.sin(rad)

                  // Convert SVG coordinates to pixel values
                  const svgRect = chartRef.current?.getBoundingClientRect()
                  const svgWidth = svgRect?.width || 400
                  const svgHeight = svgRect?.height || 400

                  const pixelX = (x / 100) * svgWidth
                  const pixelY = (y / 100) * svgHeight

                  return (
                    <motion.div
                      key={`tooltip-${segment.id}`}
                      className="absolute pointer-events-none bg-black/90 text-white p-3 rounded-lg border border-white/20 shadow-xl z-10"
                      style={{
                        left: `${pixelX}px`,
                        top: `${pixelY}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="font-bold text-sm">{segment.category}</div>
                      <div className="text-xs text-gray-300">Value: {segment.value}</div>
                      <div className="text-xs text-gray-300">{segment.percentage.toFixed(1)}% of total</div>
                      <div
                        className={`text-xs ${segment.percentageChange > 0 ? "text-green-400" : segment.percentageChange < 0 ? "text-red-400" : "text-gray-300"}`}
                      >
                        {segment.percentageChange > 0 ? "↑" : segment.percentageChange < 0 ? "↓" : ""}{" "}
                        {Math.abs(segment.percentageChange).toFixed(1)}% from last month
                      </div>
                      {segment.hasSignificantChange && (
                        <div className="text-xs mt-1 font-bold text-yellow-300">
                          {segment.percentageChange > 0 ? "Significant growth" : "Significant decline"}
                        </div>
                      )}
                    </motion.div>
                  )
                }
                return null
              })}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div
          className={`mt-6 md:mt-0 md:ml-6 md:w-64 bg-black/20 rounded-lg p-4 transition-all duration-300 ${legendCollapsed ? "md:w-12" : ""}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-medium text-white ${legendCollapsed ? "hidden md:hidden" : ""}`}>Legend</h3>
            <button
              onClick={() => setLegendCollapsed(!legendCollapsed)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={legendCollapsed ? "Expand legend" : "Collapse legend"}
            >
              {legendCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {!legendCollapsed && (
            <div className="space-y-3">
              {segments.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  className={`flex items-center p-2 rounded-md transition-colors ${activeSlice === segment.id ? "bg-white/10" : "hover:bg-white/5"}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  onMouseEnter={() => setActiveSlice(segment.id)}
                  onMouseLeave={() => setActiveSlice(null)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={activeSlice === segment.id}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveSlice(segment.id)
                    }
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-sm mr-3"
                    style={{ backgroundColor: segment.color, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">{segment.category}</div>
                    <div className="text-xs text-gray-400">{segment.percentage.toFixed(1)}%</div>
                  </div>
                  <div className="text-sm text-white font-light">{segment.value}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-black/30 backdrop-blur-sm border-t border-white/10 flex justify-between items-center">
        <div className="text-xs text-gray-400 flex items-center">
          <Info size={12} className="mr-1" />
          Data last updated: May 1, 2025
        </div>
        <a
          href="#"
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
          onClick={(e) => e.preventDefault()}
        >
          View full report
          <ExternalLink size={12} className="ml-1" />
        </a>
      </div>

      {/* Footnote */}
      <div className="px-4 py-2 text-xs text-gray-500 italic">Categories defined per ISO 9001 standard metrics.</div>
    </div>
  )
}
