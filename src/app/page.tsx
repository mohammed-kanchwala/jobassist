"use client"
import { useSession } from 'next-auth/react'
import JobListing from '@/components/JobListing'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
import AuthScreen from '@/components/AuthScreen'
import { useState } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const [showAuthScreen, setShowAuthScreen] = useState(false)

  const handleGetStarted = () => {
    setShowAuthScreen(true)
  }

  const handleCloseAuthScreen = () => {
    setShowAuthScreen(false)
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (session) {
    return <JobListing />
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      {showAuthScreen && <AuthScreen onClose={() => setShowAuthScreen(false)} />}
      <Header onGetStarted={handleGetStarted} />
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <Pricing />
      </main>
      <Footer />
      {showAuthScreen && <AuthScreen onClose={handleCloseAuthScreen} />}
    </div>
  )
}