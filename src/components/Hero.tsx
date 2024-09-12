'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <>
    {/* Hero Section */}
    <section className="pt-32 pb-20 bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800 animate-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI-Powered Job Search
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600">
            Find your dream job with the power of artificial intelligence
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg relative z-10 transition-transform hover:scale-105">
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </>
  )
}