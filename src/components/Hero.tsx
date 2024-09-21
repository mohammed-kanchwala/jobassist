'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <>
    {/* Hero Section */}
    <section className="pt-40 pb-30 bg-gradient-to-br from-purple-200 to-red-100 relative overflow-hidden" style={{ minHeight: '79vh' }}> 
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800 animate-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          <br />
          AI-Powered Job Search
          
          <br />
          </h1>         
          <p className="text-xl md:text-2xl mb-8 text-gray-600">
          Our AI streamlines the job search process, helping you secure interviews faster than ever. Get personalized job matches, a customized resume, and insider connection recommendations—all in under a minute!
          <br />
          <br />
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg relative z-10 transition-transform hover:scale-105">
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </>
  )
}