"use client"

import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored) {
      const darkMode = JSON.parse(stored)
      setIsDarkMode(darkMode)
      document.documentElement.classList.toggle('dark', darkMode)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return { isDarkMode, toggleDarkMode }
}