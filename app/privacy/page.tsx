import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy & medical disclaimer",
  description: "VitalScope never stores your health answers. Read how your data is handled and the medical disclaimer.",
}

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">Privacy &amp; medical disclaimer</h1>

      <section className="mb-10 space-y-3 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">What happens to your answers</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Your answers are sent once over HTTPS to <code>/api/predict</code>. They are validated, scored in memory and
            then discarded. Nothing is written to a database, file or log.
          </li>
          <li>
            Your results are saved in your browser&apos;s <code>sessionStorage</code> so the results pages can show them.
            They are cleared when you close the tab.
          </li>
          <li>
            <strong>Share scores</strong> creates a link that contains only your six scores and risk levels, never your
            answers.
          </li>
          <li>There are no accounts, cookies, analytics or third-party trackers.</li>
        </ul>
      </section>

      <section className="mb-10 space-y-3 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">Medical disclaimer</h2>
        <p>
          VitalScope is an educational portfolio project. It is not a medical device and has not been clinically
          validated. Scores are statistical estimates based on self-reported answers and US population survey data from
          2015. They may not apply to you.
        </p>
        <p>
          Do not use VitalScope to diagnose or treat any condition, or to delay seeking medical care. Talk to a qualified
          healthcare professional about any health concern. In an emergency, call your local emergency number.
        </p>
      </section>

      <p className="text-sm text-gray-500">
        Read more about the models on the <Link href="/about" className="underline">How it works</Link> page.
      </p>
    </main>
  )
}
