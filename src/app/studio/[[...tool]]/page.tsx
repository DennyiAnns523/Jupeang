'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { projectId } from '../../../../sanity/env'

export default function StudioPage() {
  if (!projectId) return <main className="editorial-page"><div className="page-heading"><h1>Connect your Studio.</h1><p>Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to manage your products and journal.</p></div></main>
  return <NextStudio config={config} />
}
