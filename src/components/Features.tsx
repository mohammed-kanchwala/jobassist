'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Features() {
  const features = [
    { title: "AI-Powered Screening", description: "Automatically screen and rank candidates based on job requirements" },
    { title: "Interview Assistance", description: "Generate tailored interview questions and evaluate responses" },
    { title: "Bias Reduction", description: "Minimize unconscious bias in your hiring process with our AI" }
  ]

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#1a1a1a] border-[#333] hover:border-[#8b5cf6] transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#8b5cf6] rounded-full filter blur-3xl opacity-20 -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4c1d95] rounded-full filter blur-3xl opacity-20 translate-y-1/2 translate-x-1/2"></div>
    </section>
  )
}