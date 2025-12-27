"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import SettingsContent, { SettingsTab, isValidTab } from "../SettingsContent"

export default function SettingsTabPage() {
  const params = useParams()
  const router = useRouter()
  const tab = params.tab as string

  // Redirect to general if invalid tab
  useEffect(() => {
    if (!isValidTab(tab)) {
      router.replace('/settings/general')
    }
  }, [tab, router])

  if (!isValidTab(tab)) {
    return null
  }

  return <SettingsContent activeTab={tab as SettingsTab} />
}
