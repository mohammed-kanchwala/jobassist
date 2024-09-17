'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, MapPin, Clock, Building2, Calendar, CheckCircle, Filter } from 'lucide-react'
import SidePanel from '@/components/sidepanel'
import ChatBot from '@/components/chatbot'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { fetchJobs } from './action'

const filterOptions = [
  "Account Manager", "Full-time", "Within US", "Senior Level", "Director", "Onsite",
  "Remote", "Hybrid", "50 miles"
]

const CircularProgressBar = ({ percentage }: { percentage: number }) => {
  const circumference = 2 * Math.PI * 18;
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
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Recommended")
  const [jobListings, setJobListings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    query: localStorage.getItem('jobTitle') || 'Web Developer',
    location: localStorage.getItem('jobLocation') || 'India',
    remoteOnly: localStorage.getItem('remoteOnly') || 'false',
    datePosted:  'month',
    employmentTypes: localStorage.getItem('jobTypes') || 'fulltime;parttime;intern;contractor',
  })

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

  useEffect(() => {
    handleFetchJobs()
  }, [filters])

  const handleFetchJobs = async () => {
    setIsLoading(true)
    try {
      const response = await fetchJobs(filters)
      const data = await response.json()
      console.log('data from rapidapi: ', data)
      setJobListings(data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }))
  }

  if (!user) return null 

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex">
        <SidePanel />    
        <div className="flex min-h-screen bg-gray-100">
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
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="bg-gray-200 text-gray-700">
                      {`${key}: ${value}`}
                    </Badge>
                  ))}
                </div>
                <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-4">Loading jobs...</div>
              ) : (
                <div className="space-y-6">
                  {jobListings.map((job: any) => (
                    <div key={job.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <img src={job.image || "/placeholder.svg?height=40&width=40"} alt={job.company} className="w-12 h-12 rounded-full mr-4" />
                          <div>
                            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                        </div>
                        <Button variant="ghost">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.employmentType}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {job.datePosted}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        {job.salaryRange && <p className="text-sm text-gray-500">{job.salaryRange}</p>}
                        <div className="flex space-x-2">
                          <Button variant="outline" className="text-gray-600">
                            Ask JobAssist
                          </Button>
                          <Button className="bg-purple-600 text-white hover:bg-purple-700">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
          {showFilters && (
            <div className="w-64 bg-white p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              {Object.entries(filters).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              ))}
              <Button onClick={fetchJobs} className="w-full">Apply Filters</Button>
            </div>
          )}
          <ChatBot />
        </div>
      </div>
    </>
  )
}