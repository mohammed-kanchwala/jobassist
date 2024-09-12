"use client"
import { useSession } from 'next-auth/react'
import JobListing from '@/components/JobListing'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import JobBoard from '@/components/JobBoard'
import Testimonials from '@/components/Testimonial'
import FAQ from '@/components/faq'
import CTA from '@/components/CTA'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
import AuthScreen from '@/components/AuthScreen'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radiogroup"
import { ArrowRight, CheckCircle, Menu, Star, X, Mail, Lock } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [isModalOpen, setIsModalOpen] = useState(false)
  if (status === "loading") {
    return <div>Loading...</div>
  }
  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle authentication logic here
    console.log(`${authMode} submitted`)
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <Header />
      <main>
        <Hero />
        <Features />
        <JobBoard />
        <Testimonials />
        <FAQ />
        <CTA />
        {/* <Pricing /> */}
      </main>
      <Footer />
    </div>
  )
}