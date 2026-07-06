"use client"

import { useEffect } from "react"

export function DailyLoginTrigger() {
  useEffect(() => {
    // Runs once per mount (once per session/tab open)
    fetch("/api/v2/daily-login", { method: "POST" }).catch(() => {})
  }, [])
  return null
}
