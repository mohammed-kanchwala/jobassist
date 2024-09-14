'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, MapPin, Clock, Building2, Calendar, CheckCircle , LucideLoaderCircle } from 'lucide-react'
import SidePanel from '@/components/sidepanel'
import ChatBot from '@/components/chatbot'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'


const jobListings = [
  {
    id: 1,
    title: "Senior Account Manager",
    company: "Daniels Health",
    logo: "/placeholder.svg?height=40&width=40",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Senior Level",
    experience: "5+ years exp",
    postedAgo: "54 minutes ago",
    applicants: "Less than 25 applicants",
    matchPercentage: 83,
  },
  {
    id: 2,
    title: "Partner Account Manager",
    company: "CommScope",
    logo: "/placeholder.svg?height=40&width=40",
    location: "New Jersey, United States",
    type: "Full-time",
    level: "Mid, Senior Level",
    experience: "5+ years exp",
    postedAgo: "5 hours ago",
    applicants: "Less than 25 applicants",
    matchPercentage: 84,
    sponsorship: true,
  },
]

const filterOptions = [
  "Account Manager", "Full-time", "Within US", "Senior Level", "Director", "Onsite",
  "Remote", "Hybrid", "50 miles"
]

const CircularProgressBar = ({ percentage }: { percentage: number }) => {
  const circumference = 2 * Math.PI * 18; // 18 is the radius of the circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full" viewBox="0 0 40 40">
        <circle
          className="text-gray-300"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="18"
          cx="20"
          cy="20"
        />
        <circle
          className="text-purple-600"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="18"
          cx="20"
          cy="20"
          transform="rotate(-90 20 20)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold">{percentage}%</span>
      </div>
    </div>
  )
}

export default function JobSearchPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Recommended")

  useEffect(() => {
    const supabase = createClient()
    
    async function getUser() {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/')
      } else {
        setUser(data.user)
      }
    }

    getUser()
  }, [router])

  if (!user) return null // or a loading spinner


  return (
    <>
    <div className="min-h-screen bg-gray-100 flex">
      <SidePanel />    
      <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
        <main className="flex-grow p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">JOBS</h1>
            <div className="flex space-x-4">
              {["Recommended", "Liked", "Applied", "External"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? "bg-gray-800 text-white" : "text-gray-600"}
                >
                  {tab}
                  {tab !== "Recommended" && <Badge variant="secondary" className="ml-2">0</Badge>}
                </Button>
              ))}
            </div>
          </header>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {filterOptions.map((option) => (
                <Badge key={option} variant="secondary" className="bg-gray-200 text-gray-700">
                  {option}
                </Badge>
              ))}
              <Badge variant="secondary" className="bg-purple-100 text-purple-600">
                Filters
              </Badge>
            </div>

            <div className="space-y-6">
              {jobListings.map((job) => (
                <div key={job.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-full mr-4" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CircularProgressBar percentage={job.matchPercentage} />
                      <Button variant="ghost">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.type}
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {job.level}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.experience}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{job.applicants}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="text-gray-600">
                        Ask JobAssist
                      </Button>
                      <Button className="bg-purple-600 text-white hover:bg-purple-700">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-purple-600">GOOD MATCH</span>
                    {job.sponsorship && (
                      <span className="ml-2 flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        H1B Sponsor Likely
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <ChatBot />
      </div>
    </div>
    </>
  )
}