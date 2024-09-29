'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <>
    {/* Hero Section */}
    <section className="pt-40 pb-30 bg-background relative overflow-hidden" style={{ minHeight: '79vh' }}> 
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground animate-gradient bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          <br />
          AI-Powered Job Search
          
          <br />
          </h1>         
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
          Our AI streamlines the job search process, helping you secure interviews faster than ever. Get personalized job matches, a customized resume, and insider connection recommendations—all in under a minute!
          <br />
          <br />
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full text-lg relative z-10 transition-transform hover:scale-105">
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </>
  )
}