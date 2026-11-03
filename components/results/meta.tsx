import type React from "react"
import {
  Activity,
  AlertCircle,
  Brain,
  Clock,
  Droplets,
  Dumbbell,
  Heart,
  Moon,
  Pill,
  Shield,
  Sun,
  Thermometer,
  Users,
  Utensils,
} from "lucide-react"
import type { CategoryId, RiskLevel } from "@/lib/risk/types"

export const CATEGORY_META: Record<CategoryId, { color: string; icon: React.ReactNode }> = {
  cardiovascular: { color: "#e11d48", icon: <Heart className="h-4 w-4" aria-hidden /> },
  metabolic: { color: "#0891b2", icon: <Activity className="h-4 w-4" aria-hidden /> },
  sleep: { color: "#7c3aed", icon: <Moon className="h-4 w-4" aria-hidden /> },
  mental: { color: "#c026d3", icon: <Brain className="h-4 w-4" aria-hidden /> },
  immune: { color: "#16a34a", icon: <Shield className="h-4 w-4" aria-hidden /> },
  chronic: { color: "#ea580c", icon: <Pill className="h-4 w-4" aria-hidden /> },
}

export const LEVEL_STYLES: Record<RiskLevel, string> = {
  "Low Risk": "text-green-700 bg-green-50",
  "Moderate Risk": "text-amber-700 bg-amber-50",
  "High Risk": "text-red-600 bg-red-50",
  "Very High Risk": "text-red-700 bg-red-100",
  Diagnosed: "text-slate-700 bg-slate-100",
}

export const LEVEL_FILL: Record<RiskLevel, string> = {
  "Low Risk": "#22c55e",
  "Moderate Risk": "#eab308",
  "High Risk": "#ef4444",
  "Very High Risk": "#b91c1c",
  Diagnosed: "#64748b",
}

export function FactorIcon({ name }: { name: string }) {
  const n = name.toLowerCase()
  const cls = "h-4 w-4"
  if (n.includes("exercise") || n.includes("physical") || n.includes("activity"))
    return <Dumbbell className={`${cls} text-blue-500`} aria-hidden />
  if (n.includes("diet") || n.includes("food") || n.includes("fruit") || n.includes("nutrition"))
    return <Utensils className={`${cls} text-green-500`} aria-hidden />
  if (n.includes("sleep")) return <Moon className={`${cls} text-indigo-500`} aria-hidden />
  if (n.includes("stress") || n.includes("mental") || n.includes("mindful"))
    return <Brain className={`${cls} text-purple-500`} aria-hidden />
  if (n.includes("screen")) return <Clock className={`${cls} text-orange-500`} aria-hidden />
  if (n.includes("outdoor")) return <Sun className={`${cls} text-yellow-500`} aria-hidden />
  if (n.includes("weight") || n.includes("bmi")) return <Activity className={`${cls} text-blue-500`} aria-hidden />
  if (n.includes("smok") || n.includes("alcohol")) return <AlertCircle className={`${cls} text-red-500`} aria-hidden />
  if (n.includes("water") || n.includes("hydration")) return <Droplets className={`${cls} text-cyan-500`} aria-hidden />
  if (n.includes("blood") || n.includes("cholesterol") || n.includes("heart") || n.includes("stroke"))
    return <Heart className={`${cls} text-rose-500`} aria-hidden />
  if (n.includes("checkup") || n.includes("vaccination") || n.includes("pain") || n.includes("diagnos"))
    return <Thermometer className={`${cls} text-red-500`} aria-hidden />
  if (n.includes("family") || n.includes("social") || n.includes("sex"))
    return <Users className={`${cls} text-blue-500`} aria-hidden />
  return <Activity className={`${cls} text-gray-500`} aria-hidden />
}

export function impactClass(impact: string): string {
  if (impact.includes("positive")) return "bg-green-100 text-green-800"
  if (impact.includes("negative")) return "bg-red-100 text-red-800"
  return "bg-blue-100 text-blue-800"
}

export function MethodBadge({ method }: { method: "ml" | "guideline" }) {
  return method === "ml" ? (
    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-primary-200">
      ML model · CDC BRFSS
    </span>
  ) : (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
      Guideline-based score
    </span>
  )
}
