'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Plus, HelpCircle, LogOut, ArrowRight, X, Loader2 } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'

export default function JobSearchForm() {
  const router = useRouter()
  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [currentJobTitle, setCurrentJobTitle] = useState('')

  const [jobTypes, setJobTypes] = useState({
    fullTime: false,
    contract: false,
    partTime: false,
    internship: false
  })

  const [locationPreferences, setLocationPreferences] = useState({
    remote: false,
    hybrid: false,
    onSite: false
  })

  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    checkUser()
  }, [supabase.auth])

  const addJobTitle = () => {
    if (currentJobTitle.trim()) {
      setJobTitles([...jobTitles, currentJobTitle.trim()])
      setCurrentJobTitle('')
    }
  }

  const removeJobTitle = (index: number) => {
    setJobTitles(jobTitles.filter((_, i) => i !== index))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userId) {
      console.error('User not authenticated')
      router.push('/')
      return
    }

    setIsLoading(true)

    try {
      let parsedResumeData = null;
      if (file && file.type === 'application/pdf') {
        // Check local storage first
        const storedData = localStorage.getItem(`resumeData_${userId}`);
        if (storedData) {
          parsedResumeData = JSON.parse(storedData);
          console.log('Retrieved parsed resume data from local storage');
        } else {
          // If not in local storage, call RapidAPI
          const formData = new FormData();
          formData.append('file', file);

          const url = 'https://ai-resume-parser-extractor.p.rapidapi.com/resume/file';
          const options = {
            method: 'POST',
            headers: {
              'x-rapidapi-key': 'd1915a5fefmsh73621f73961cb94p1fbceajsn985f05129535',
              'x-rapidapi-host': 'ai-resume-parser-extractor.p.rapidapi.com',
            },
            body: formData
          };

          try {
            const response = await fetch(url, options);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('response: ', data);
            parsedResumeData = data.data;
            console.log('parsedResumeData: ', parsedResumeData);

            // Save to local storage
            localStorage.setItem(`resumeData_${userId}`, JSON.stringify(parsedResumeData));
            console.log('Saved parsed resume data to local storage');

          } catch (error) {
            console.error('Error:', error);
            toast.error('Error parsing resume');
            setIsLoading(false)
            return;
          }
        }

        // Save parsed resume data if available
        if (parsedResumeData) {
          const { error: resumeError } = await supabase
            .from('Resumes')
            .upsert({
              user_id: userId,
              content: parsedResumeData,
              title: parsedResumeData.personal_info.full_name,
            });

          if (resumeError) {
            throw new Error('Error saving user\'s resume');
          }
        }
      } else if (file) {
        toast.error('Please upload a PDF file only');
        setIsLoading(false)
        return;
      }

      const jobPreferences = {
        user_id: userId,
        preferred_positions: jobTitles,
        preferred_job_types: Object.entries(jobTypes)
          .filter(([_, value]) => value)
          .map(([key, _]) => key),
        preferred_locations: Object.entries(locationPreferences)
          .filter(([_, value]) => value)
          .map(([key, _]) => key),
      };

      // Upsert the job preferences
      const { error: preferencesError } = await supabase
        .from('UserPreferences')
        .upsert(jobPreferences);

      if (preferencesError) {
        throw new Error('Error saving job preferences');
      }

      toast.success('Job preferences and resume data saved successfully');
      router.push('/jobs');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving data');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            <span className="text-xl font-semibold text-gray-800">JobAssist</span>
            <span className="text-sm text-gray-500">Your AI Copilot</span>
          </div>
        </div>
      </header>

      <main className="flex-grow container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            I see. Speed is important.<br />
            Now, what type of role are you looking for?
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="job-title" className="text-sm font-medium text-gray-700">
                Job Title
              </Label>
              <div className="flex items-center">
                <Input
                  id="job-title"
                  value={currentJobTitle}
                  onChange={(e) => setCurrentJobTitle(e.target.value)}
                  className="flex-grow"
                />
                <Button type="button" variant="ghost" size="sm" className="ml-2" onClick={addJobTitle}>
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
              {jobTitles.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {jobTitles.map((title, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded">
                      <span>{title}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeJobTitle(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Job Type</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(jobTypes).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => setJobTypes(prev => ({ ...prev, [key]: checked }))}
                    />
                    <Label htmlFor={key} className="ml-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Location Preference</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(locationPreferences).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => setLocationPreferences(prev => ({ ...prev, [key]: checked }))}
                    />
                    <Label htmlFor={key} className="ml-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume" className="text-sm font-medium text-gray-700">
                Upload Resume
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="resume"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('resume')?.click()}
                  className="w-full justify-start"
                >
                  <Upload className="mr-2 w-4 h-4" />
                  {file ? file.name : 'Choose file'}
                </Button>
                {file && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported format: PDF</p>
            </div>

            <div className="flex justify-end items-center pt-4">
              <Button 
                type="submit" 
                className="bg-purple-600 text-white hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          &copy; 2023 JobAssist. All rights reserved.
        </div>
      </footer>
    </div>
  )
}