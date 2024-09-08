'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    { name: "Starter", price: isYearly ? 190 : 19, features: ["50 AI-powered screenings/mo", "Basic interview assistance", "Email support"] },
    { name: "Pro", price: isYearly ? 490 : 49, features: ["Unlimited AI-powered screenings", "Advanced interview assistance", "Priority support", "Bias reduction tools"] },
    { name: "Enterprise", price: "Custom", features: ["Custom AI model training", "Dedicated account manager", "API access", "Advanced analytics"] }
  ]

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-[#1a1a1a] rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full ${!isYearly ? 'bg-[#8b5cf6] text-white' : 'text-white'}`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full ${isYearly ? 'bg-[#8b5cf6] text-white' : 'text-white'}`}
              onClick={() => setIsYearly(true)}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`bg-[#1a1a1a] border-[#333] ${index === 1 ? 'border-[#8b5cf6]' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-white">
                    {typeof plan.price === 'number' ? `$${plan.price}${isYearly ? '/year' : '/month'}` : plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#8b5cf6]" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-[#8b5cf6] text-white hover:bg-[#7c3aed]">Choose Plan</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#8b5cf6] rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
    </section>
  )
}