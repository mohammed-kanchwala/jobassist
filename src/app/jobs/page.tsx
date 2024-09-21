'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, MapPin, Clock, Building2, Calendar, CheckCircle, Filter, FileText, Heart } from 'lucide-react'
import SidePanel from '@/components/sidepanel'
import ChatBot from '@/components/chatbot'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { fetchJobs } from './action'
import { Checkbox } from "@/components/ui/checkbox"
import  Select  from 'react-select'
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { customResume } from './action'

// Styles for PDF
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 20 },
  subHeader: { fontSize: 14, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  subsection: { marginBottom: 5 },
});


// Main function to generate PDF
export async function generateResumePDF(jsonInput: any) {
  const matchedData = jsonInput;

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{matchedData.personal_info.full_name}</Text>
          <Text style={styles.text}>{matchedData.contact_info.email}</Text>
          <Text style={styles.text}>{matchedData.contact_info.phone}</Text>
          <Text style={styles.text}>{matchedData.contact_info.formatted_address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Summary</Text>
          <Text style={styles.text}>{matchedData.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Education</Text>
          {matchedData.education.map((edu: any, index: number) => (
            <Text key={index} style={styles.text}>
              {`${edu.degree} - ${edu.institution} (${edu.period.start_date} - ${edu.period.end_date})`}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Work Experience</Text>
          {matchedData.experience.map((exp: any, index: number) => (
            <View key={index} style={styles.subsection}>
              <Text style={styles.text}>{`${exp.title} at ${exp.company}`}</Text>
              <Text style={styles.text}>{`${exp.formatted_address} (${exp.period.start_date} - ${exp.period.end_date})`}</Text>
              <Text style={styles.text}>{exp.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Skills</Text>
          <Text style={styles.text}>{matchedData.skills.join(', ')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Languages</Text>
          <Text style={styles.text}>
            {matchedData.languages.map((lang: any) => lang.name).join(', ')}
          </Text>
        </View>
      </Page>
    </Document>
  );

  return MyDocument;
}


export interface Job {
  id: string;
  company: string;
  title: string;
  description: string;  
  location: string;
  job_type: string;
  salary_range: string;
  posted_date: string;
  image?: string;
  employmentType: string;
  datePosted: string;
  salaryRange: string;
  url: string;
}

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
  const [jobListings, setJobListings] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<{
    jobTitles: string[];
    jobType: string[];
    workModel: string[];
    datePosted: string;
  }>({
    jobTitles: [],
    jobType: [],
    workModel: [],
    datePosted: '',
  })
  const supabase = createClient()
  const [generatingResume, setGeneratingResume] = useState<{ [key: string]: boolean }>({});
  const [generationProgress, setGenerationProgress] = useState<{ [key: string]: number }>({});
  const filterPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    
    async function getUserPreferences() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        console.log('user: ', user)
        const { data: preferences, error } = await supabase
          .from('UserPreferences')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user preferences:', error)
        } else if (preferences) {
          console.log('preferences: ', preferences)
          setFilters({
            jobTitles: preferences.preferred_positions || [],
            jobType: preferences.preferred_job_types || [],
            workModel: preferences.preferred_locations || [],
            // location: preferences.preferred_locations?.[0] || '',
            // experienceLevel: preferences.preferred_experience_levels || [],
            // requiredExperience: [0, 11],
            datePosted: 'month',
          })
        }
      }
      else {
        router.push('/')
      }
    }

    getUserPreferences()
  }, [])

  useEffect(() => {
    handleFetchJobs()
  }, [filters])

  const handleFetchJobs = async () => {
    setIsLoading(true);
    try {
      if (localStorage.getItem('jobListings') && JSON.parse(localStorage.getItem('jobListings') || '[]').length > 0) {
        setJobListings(JSON.parse(localStorage.getItem('jobListings') || '[]'));
      } else {
        const { data: jobsFromDB, error } = await supabase
          .from('Jobs')
          .select('*');
  
        if (jobsFromDB && !error) {
          setJobListings(jobsFromDB);
          localStorage.setItem('jobListings', JSON.stringify(jobsFromDB));
        }
      }
  
      if (jobListings.length === 0) {
        const response = await fetchJobs(filters);
        if (Array.isArray(response.jobs)) {
          setJobListings(response.jobs);
          if (response.jobs.length > 0) {
            localStorage.setItem('jobListings', JSON.stringify(response.jobs));
  
            // Prepare the jobs data for insertion
            const jobsToInsert = response.jobs.map((job: any) => ({
              company: job.company,
              title: job.title,
              description: job.description,
              location: job.location,
              job_type: job.employmentType,
              salary_range: job.salaryRange,
              posted_date: job.datePosted,
              url: job.url
            }));
    
            // Insert all jobs at once
            const { data: jobData, error } = await supabase
              .from('Jobs')
              .upsert(jobsToInsert, { onConflict: 'job_id' })
              .select();
    
            if (error) {
              console.error('Error inserting jobs:', error);
            } else {
              console.log('Jobs inserted:', jobData);
              if (jobData && jobData.length === 0) {
                console.warn('No new jobs were inserted. They might already exist in the database.');
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }))
  }

  const handleGenerateResume = async (job: Job) => {
    setGeneratingResume(prev => ({ ...prev, [job.id]: true }));
    setGenerationProgress(prev => ({ ...prev, [job.id]: 0 }));

    try {
      console.log('generate resume for:', job.title)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => ({
          ...prev,
          [job.id]: Math.min((prev[job.id] || 0) + 10, 90)
        }));
      }, 500);

      const { data: userResumes, error } = await supabase
          .from('Resumes')
          .select('*')
          .eq('user_id', user?.id)
          .single()

      const jsonInput = userResumes.content
      console.log('job description: ', job.description)
      console.log('userResume content: ', jsonInput)
      const updatedJson = await customResume(jsonInput, job.description)
      console.log('updatedJson: ', updatedJson)
      const MyDocument = await generateResumePDF(updatedJson);
    
      // Generate PDF blob
      const blob = await pdf(<MyDocument />).toBlob();
    
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
    
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
    
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      clearInterval(progressInterval);
      setGenerationProgress(prev => ({ ...prev, [job.id]: 100 }));
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setTimeout(() => {
        setGeneratingResume(prev => ({ ...prev, [job.id]: false }));
        setGenerationProgress(prev => ({ ...prev, [job.id]: 0 }));
      }, 1000);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) return null 
  return (
    <div className="flex h-screen bg-gray-100">
      <SidePanel />
      <div className="flex-grow flex overflow-hidden">
        <main className="flex-grow p-6 overflow-y-auto relative">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">JOBS</h1>
            <div className="flex space-x-4">
              {["Recommended", "Liked", "Applied"].map((tab) => (
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
                {jobListings.length === 0 ? (
                  <div className="text-center py-4">No jobs found</div>
                ) : (
                  jobListings.map((job: Job) => (
                    <div key={job.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <img src={job.image} alt={job.company} className="w-12 h-12 rounded-full mr-4" />
                          <div>
                            <h2 
                              className="text-xl font-semibold text-gray-800 hover:text-purple-600 cursor-pointer underline"
                              onClick={() => window.open(job.url, '_blank')}
                            >
                              {job.title}
                            </h2>
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
                      
                      <div className="flex justify-end items-center">
                        {job.salaryRange && <p className="text-sm text-gray-500 mr-auto">{job.salaryRange}</p>}
                        <div className="flex space-x-2">
                          <Button variant="outline" className="text-gray-600">
                            <Heart className="w-4 h-4 mr-1" />
                          </Button>
                          <Button variant="outline" className="text-gray-600">
                            Ask JobAssist
                          </Button>
                          {generatingResume[job.id] ? (
                            <div className="flex items-center space-x-2">
                              <CircularProgressBar percentage={generationProgress[job.id] || 0} />
                              <span className="text-sm text-gray-600">Generating...</span>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="text-gray-600 hover:bg-purple-600 hover:text-white" 
                              onClick={() => handleGenerateResume(job)}
                              disabled={generatingResume[job.id]}
                            >
                              <FileText className="w-6 h-6" />  Download Custom Resume
                            </Button>
                          )}
                          <Button 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => window.open(job.url, '_blank')}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {showFilters && (
            <div 
              ref={filterPanelRef}
              className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-lg overflow-y-auto z-10"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Filters</h2>
              
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <Select
                      isMulti
                      options={[...filters.jobTitles.map(title => ({ value: title, label: title })), { value: 'add', label: '+ Add' }]}
                      onChange={(selected: any) => {
                        if (selected.some((option: any) => option.value === 'add')) {
                          const newTitle = prompt('Enter new job title:')
                          if (newTitle) {
                            handleFilterChange('jobTitles', [...filters.jobTitles, newTitle])
                          }
                        } else {
                          handleFilterChange('jobTitles', selected.map((option: any) => option.value))
                        }
                      }}
                      placeholder="Select or add job titles"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <div className="space-y-2">
                      {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                        <div key={type} className="flex items-center">
                          <Checkbox
                            checked={filters.jobType.includes(type)}
                            onCheckedChange={(checked: any) => {
                              if (checked) {
                                handleFilterChange('jobType', [...filters.jobType, type])
                              } else {
                                handleFilterChange('jobType', filters.jobType.filter(t => t !== type))
                              }
                            }}
                          />
                          <label className="ml-2 text-sm">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Model</label>
                    <div className="space-y-2">
                      {['Onsite', 'Remote', 'Hybrid'].map((model) => (
                        <div key={model} className="flex items-center">
                          <Checkbox
                            checked={filters.workModel.includes(model)}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) {
                                handleFilterChange('workModel', [...filters.workModel, model])
                              } else {
                                handleFilterChange('workModel', filters.workModel.filter(m => m !== model))
                              }
                            }}
                          />
                          <label className="ml-2 text-sm">{model}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/*<div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="Select a city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <div className="space-y-2">
                      {['Intern Level', 'Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'].map((level) => (
                        <Checkbox
                          key={level}
                          checked={filters.experienceLevel.includes(level)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('experienceLevel', [...filters.experienceLevel, level])
                            } else {
                              handleFilterChange('experienceLevel', filters.experienceLevel.filter(l => l !== level))
                            }
                          }}
                          label={level}
                        />
                      ))}
                    </div>
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Experience</label>
                    <Slider
                      min={0}
                      max={11}
                      step={1}
                      value={filters.requiredExperience}
                      onValueChange={(value) => handleFilterChange('requiredExperience', value)}
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{filters.requiredExperience[0]} years</span>
                      <span>{filters.requiredExperience[1]} years</span>
                    </div>
                  </div> 

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Posted</label>
                    <Select
                      options={[
                        { value: 'past24hours', label: 'Past 24 hours' },
                        { value: 'past3days', label: 'Past 3 days' },
                        { value: 'pastWeek', label: 'Past Week' },
                        { value: 'pastMonth', label: 'Past Month' },
                      ]}
                      value={filters.datePosted}
                      onChange={(value) => handleFilterChange('datePosted', value)}
                      placeholder="Select date range"
                    />
                  </div>*/}
                </div>

                <Button onClick={handleFetchJobs} className="w-full mt-6">Apply Filters</Button>
              </div>
            </div>
          )}
        </main>
        
        <div className="w-80 flex-shrink-0 border-l border-gray-200">
          <ChatBot />
        </div>
      </div>
    </div>
  )
}