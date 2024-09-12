'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Menu, Star, X } from "lucide-react"

export default function Features() {
  const features = [
    { title: "AI-Powered Screening", description: "Automatically screen and rank candidates based on job requirements" },
    { title: "Interview Assistance", description: "Generate tailored interview questions and evaluate responses" },
    { title: "Bias Reduction", description: "Minimize unconscious bias in your hiring process with our AI" }
  ]

  return (
    <>
    {/* Features Section */}
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">Why Choose JobRight</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['AI-Powered Matching', 'Personalized Recommendations', 'Real-Time Job Alerts'].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
                <CheckCircle className="text-purple-600 mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature}</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}