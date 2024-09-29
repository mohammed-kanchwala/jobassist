'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Job } from '../page'
import SidePanel from '@/components/sidepanel'
import ChatBot from '@/components/chatbot'
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Calendar, FileText, Heart } from 'lucide-react'
import { X } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default function JobDetailsPage() {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('Jobs')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setJob(data)
      } catch (error) {
        console.error('Error fetching job details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()
  }, [params.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!job) {
    return <div>Job not found</div>
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <SidePanel />
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-grow flex overflow-hidden">
          <main className="flex-grow p-6 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-end p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <Link href="/jobs" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{job.title}</h1>
              <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">{job.company}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {job.job_type}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {job.posted_date}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-medium mt-4 mb-2" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-md font-medium mt-3 mb-2" {...props} />,
                    p: ({ node, ...props }) => <p className="text-gray-700 dark:text-gray-300 mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                  }}
                >
                  {job.description}
                </ReactMarkdown>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="bg-background text-foreground hover:bg-primary/10">
                  <Heart className="w-4 h-4 mr-1" />
                  Save Job
                </Button>
                <Button variant="outline" className="bg-background text-foreground hover:bg-primary/10">
                  <FileText className="w-4 h-4 mr-1" />
                  Download Custom Resume
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => window.open(job.url, '_blank')}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </main>
          
          <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700">
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  )
}