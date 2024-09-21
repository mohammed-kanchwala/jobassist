'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Menu, Star, X } from "lucide-react"

export default function Features() {
  const features = [
    { title: "AI-Powered Job Matching", description: "Job searching is tough - boost your chances with AI-matched opportunities" },
    { title: "AI-Powered Resume", description: "Make your resume shine and stand out ATS friendly with AI to grab attention in just 6 seconds" },
    { title: "Insider Connections", description: "Network like an expert with our recommended insider contacts. Connect, get referrals, and secure interviews!" },
    { title: "Your AI Copilot", description: "Job hunting doesn't have to be lonely - chat with AI Copilot for 24/7 career support." }
  ]

  return (
    <>
    {/* Features Section */}
    <section className="py-20 bg-gradient-to-r from-purple-400 to-blue-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Why Choose JobAssist</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center mb-4">
                  <CheckCircle className="text-purple-600" size={32} />
                  <h3 className="text-xl font-semibold ml-4 text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}