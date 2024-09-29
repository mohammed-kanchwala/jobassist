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
    <section id="pricing" className="py-20 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">Simple Pricing</h2>
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-[#0A2A40] rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full ${!isYearly ? 'bg-primary text-background' : 'text-white'}`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full ${isYearly ? 'bg-primary text-background' : 'text-white'}`}
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
              <Card className={`bg-[#0A2A40] border-primary ${index === 1 ? 'border-2' : 'border'}`}>
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-primary">
                    {typeof plan.price === 'number' ? `$${plan.price}${isYearly ? '/year' : '/month'}` : plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-primary text-background hover:bg-[#5FFFC1]">Choose Plan</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
    </section>
  )
}