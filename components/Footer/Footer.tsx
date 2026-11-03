import Link from "next/link"
import { HeartPulse } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-950 py-10 text-gray-300">
      <div className="container mx-auto space-y-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <HeartPulse className="h-5 w-5 text-red-500" aria-hidden />
          <span className="text-lg font-semibold">VitalScope</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm" aria-label="Footer">
          <Link href="/predict" className="hover:text-white">
            Assessment
          </Link>
          <Link href="/about" className="hover:text-white">
            How it works
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy &amp; disclaimer
          </Link>
          <a href="https://github.com/Hemanth2709/Health-predict" className="hover:text-white" rel="noopener noreferrer">
            Source code
          </a>
        </nav>
        <p className="mx-auto max-w-2xl text-xs text-gray-400">
          VitalScope is an educational project, not a medical device. Results are estimates based on self-reported data
          and are not a diagnosis. If you have a health concern, see a qualified healthcare professional.
        </p>
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} VitalScope · MIT License</p>
      </div>
    </footer>
  )
}

export default Footer
