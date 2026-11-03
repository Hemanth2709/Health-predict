function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  // Set automatically by Vercel at build time (e.g. "vital-scope.vercel.app").
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return "http://localhost:3000"
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, "")
export const SITE_NAME = "VitalScope"
export const SITE_DESCRIPTION =
  "Free health risk assessment. Machine-learning models trained on 253,680 CDC survey responses estimate your cardiovascular and metabolic risk and explain what drives it."
