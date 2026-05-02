'use client'

import { useState, useEffect } from 'react'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return { text: 'Good Morning', emoji: '☀️' }
  if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' }
  if (hour >= 17 && hour < 21) return { text: 'Good Evening', emoji: '👋' }
  return { text: 'Good Night', emoji: '🌙' }
}

export default function Greeting({ name }: { name: string }) {
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState({ text: 'Good Evening', emoji: '👋' })

  useEffect(() => {
    setGreeting(getGreeting())
    setMounted(true)
  }, [])

  // Provide a safe default for server-side rendering to avoid hydration mismatch
  if (!mounted) {
    return <>{`Good Evening, ${name} 👋`}</>
  }

  return (
    <>{`${greeting.text}, ${name} ${greeting.emoji}`}</>
  )
}
