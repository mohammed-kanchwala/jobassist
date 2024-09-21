'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const jobPostings = [
    { company: "Wipro", logo: "/wipro.png?height=40&width=40", title: "Director of Sales Analyst Pre-S...", time: "7 hours ago" },
    { company: "Accenture", logo: "/accenture.png?height=40&width=40", title: "User Experience Design Intern", time: "5 hours ago" },
    { company: "Microsoft", logo: "/microsoft.png?height=40&width=40", title: " Sales Lead", time: "16 hours ago" },
    { company: "Google", logo: "/google.png?height=40&width=40", title: "Staff Intern", time: "7 hours ago" },
  ]

  export default function JobBoard() {
  return (
    <>
    {/* Job Board Section */}
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">Never Miss Out On New Jobs Again</h2>
          <p className="text-xl mb-8 text-center text-gray-600">Join The Largest Job Board!</p>
          <div className="flex justify-center space-x-12 mb-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">400,000+</p>
              <p className="text-gray-600">Today's new jobs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">8,000,000+</p>
              <p className="text-gray-600">Total jobs</p>
            </div>
          </div>
          <div className="overflow-x-auto whitespace-nowrap pb-4">
            <div className="inline-flex space-x-6 animate-scroll">
              {[...jobPostings, ...jobPostings].map((job, index) => (
                <div key={index} className="bg-white p-4 rounded-lg w-64 flex-shrink-0 shadow-md">
                  <div className="flex items-center mb-2">
                    <img src={job.logo} alt={job.company} className="w-10 h-10 mr-3 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-800">{job.company}</p>
                      <p className="text-sm text-gray-500">{job.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{job.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}