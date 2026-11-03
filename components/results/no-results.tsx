import Link from "next/link"
import { ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NoResults() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <ClipboardList className="mb-4 h-12 w-12 text-primary-600" aria-hidden />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">No assessment found</h1>
      <p className="mb-6 max-w-md text-gray-600">
        Results are kept only in this browser tab and are never stored on a server. Complete the questionnaire to see
        your health risk profile.
      </p>
      <Button asChild className="bg-primary-600 text-white hover:bg-primary-700">
        <Link href="/predict">Start the assessment</Link>
      </Button>
    </div>
  )
}

export function ResultsLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      <span className="sr-only">Loading your results…</span>
    </div>
  )
}
