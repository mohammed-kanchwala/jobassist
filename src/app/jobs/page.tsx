'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, MapPin, Clock, Building2, Calendar, CheckCircle, Filter, FileText, Heart, X } from 'lucide-react'
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
import { flushSync } from 'react-dom';
import { Textarea } from "@/components/ui/textarea"

// Styles for PDF
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { 
    fontSize: 24, 
    marginBottom: 10, 
    fontWeight: 'bold', 
    color: 'black', 
    textAlign: 'center' 
  },
  contactInfo: {
    fontSize: 10,
    color: 'black',
    textAlign: 'center',
    marginBottom: 15,
  },
  section: { 
    marginBottom: 10,
    borderBottom: '1 solid #000',
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  subsection: { 
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '70%',
  },
  rightColumn: {
    width: '30%',
    textAlign: 'right',
  },
  institutionName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  degreeInfo: {
    fontSize: 11,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 10,
  },
  text: { 
    fontSize: 10, 
    marginBottom: 3, 
    color: 'black' 
  },
});


// Main function to generate PDF
export async function generateResumePDF(jsonInput: any) {
  const matchedData = jsonInput;

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{matchedData.personal_info.full_name}</Text>
          <Text style={styles.contactInfo}>
            {matchedData.contact_info.email} | {matchedData.contact_info.phone} | {matchedData.contact_info.formatted_address} | {matchedData.contact_info.linkedin}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.text}>{matchedData.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {matchedData.education.map((edu: any, index: number) => (
            <View key={index} style={styles.subsection}>
              <View style={styles.leftColumn}>
                <Text style={styles.institutionName}>{edu.institution}</Text>
                <Text style={styles.degreeInfo}>{edu.degree}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.text}>{`${edu.period.start_date} - ${edu.period.end_date}`}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {matchedData.experience.map((exp: any, index: number) => (
            <View key={index} style={styles.subsection}>
              <View style={styles.leftColumn}>
                <Text style={styles.jobTitle}>{exp.title}</Text>
                <Text style={styles.companyName}>{exp.company}</Text>
                <Text style={styles.text}>{exp.formatted_address}</Text>
                {exp.description.split('. ').map((sentence: string, i: number) => (
                  <Text key={i} style={styles.bulletPoint}>• {sentence.trim()}</Text>
                ))}
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.text}>{`${exp.period.start_date} - ${exp.period.end_date}`}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.text}>{matchedData.skills.join(', ')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
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
  company_image?: string;
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
    locations: string[];
    datePosted: string;
  }>({
    jobTitles: [],
    jobType: [],
    workModel: [],
    locations: [],
    datePosted: '',
  })
  const supabase = createClient()
  const [generatingResume, setGeneratingResume] = useState<{ [key: string]: boolean }>({});
  const [generationProgress, setGenerationProgress] = useState<{ [key: string]: number }>({});
  const filterPanelRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(true);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const [contactingRecruiter, setContactingRecruiter] = useState<{ [key: string]: boolean }>({});
  const [recruiterMessage, setRecruiterMessage] = useState<{ [key: string]: string }>({});

  // Create memoized lists of unique job titles and locations
  const uniqueJobTitles = useMemo(() => {
    const titles = Array.from(new Set(jobListings.map(job => job.title)));
    return titles.map(title => ({ value: title, label: title }));
  }, [jobListings]);

  const uniqueLocations = useMemo(() => {
    let locations;
    if (filters.jobTitles.length > 0) {
      locations = Array.from(new Set(jobListings
        .filter(job => filters.jobTitles.includes(job.title))
        .map(job => job.location)));
    } else {
      locations = Array.from(new Set(jobListings.map(job => job.location)));
    }
    return locations.map(location => ({ value: location, label: location }));
  }, [jobListings, filters.jobTitles]);

  useEffect(() => {
    const fetchUserAndPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Fetch user preferences
        const { data: preferences, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (preferences && !error) {
          // Update filters based on user preferences
          setFilters(prevFilters => ({
            ...prevFilters,
            jobTitles: preferences.preferred_job_titles || [],
            locations: preferences.preferred_locations || [],
            // Add other preferences as needed
          }))
        }

        // Fetch jobs based on user preferences
        handleApplyFilters()
      } else {
        router.push('/login')
      }
    }

    fetchUserAndPreferences()
  }, [])

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    console.log('useEffect for fetching jobs triggered');
    let isCancelled = false;
    
    const fetchJobs = async () => {
      if (!isCancelled) {
        await handleFetchJobs();
      }
    };

    fetchJobs();

    return () => {
      isCancelled = true;
    };
  }, [filters]);

  const handleFetchJobs = async () => {
    console.log('handleFetchJobs called');
    if (!isMounted) return;
    setIsLoading(true);
    console.log('isLoading set to true');
    try {
      let jobs: Job[] = [];

      // First, try to fetch from Supabase
      const { data: jobsFromDB, error } = await supabase
        .from('Jobs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (isMounted) {
        console.log('Supabase query result:', { jobsFromDB, error });

        if (jobsFromDB && jobsFromDB.length > 0 && !error) {
          jobs = jobsFromDB;
          console.log('Jobs fetched from Supabase:', jobs);
        } else {
          console.log('No jobs found in Supabase or an error occurred. Fetching from API...');
          // If no jobs in Supabase, fetch from API
          const response = await fetchJobs(filters);
          if (Array.isArray(response.jobs)) {
            jobs = response.jobs.sort((a, b) => 
              new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
            );

            // Insert fetched jobs into Supabase
            if (isMounted) {
              const jobsToInsert = jobs.map((job: Job) => ({
                company: job.company,
                title: job.title,
                description: job.description,
                location: job.location,
                job_type: job.job_type,
                salary_range: job.salary_range,
                posted_date: job.posted_date,
                url: job.url,
                company_image: job.company_image,
                id: job.id
              }));

              const { error: insertError } = await supabase
                .from('Jobs')
                .upsert(jobsToInsert, { onConflict: 'id' });

              if (insertError) {
                console.error('Error inserting jobs:', insertError);
              }
            }
          }
        }

        if (isMounted) {
          flushSync(() => {
            setJobListings(jobs);
            setIsLoading(false);
          });
          console.log('isLoading set to false');
          localStorage.setItem('jobListings', JSON.stringify(jobs));
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (isMounted) {
        setJobListings([]);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
        console.log('isLoading set to false');
      }
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [key]: value };
      
      // If job titles changed, reset locations
      if (key === 'jobTitles') {
        newFilters.locations = [];
      }
      // If locations changed, reset job titles
      if (key === 'locations') {
        newFilters.jobTitles = [];
      }
      
      return newFilters;
    });
  }

  const handleClearFilters = () => {
    setFilters({
      jobTitles: [],
      jobType: [],
      workModel: [],
      locations: [],
      datePosted: '',
    });
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
      link.download = `${updatedJson.personal_info.full_name}_${job.title}_${job.company}_resume.pdf`;
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

  const handleApplyFilters = async () => {
    setIsLoading(true);
    try {
      let jobs: Job[] = [];

      // First, try to fetch from Supabase
      const { data: jobsFromDB, error } = await supabase
        .from('Jobs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (jobsFromDB && jobsFromDB.length > 0 && !error) {
        jobs = jobsFromDB;
        console.log('Jobs fetched from Supabase:', jobs);
      } else {
        console.log('No jobs found in Supabase or an error occurred. Fetching from API...');
        // If no jobs in Supabase, fetch from API
        const response = await fetchJobs(filters);
        if (Array.isArray(response.jobs)) {
          jobs = response.jobs;
        }
      }

      // Apply filters
      const filteredJobs = jobs.filter(job => {
        return (
          (filters.jobTitles.length === 0 || filters.jobTitles.includes(job.title)) &&
          (filters.jobType.length === 0 || filters.jobType.includes(job.job_type)) &&
          (filters.workModel.length === 0 || filters.workModel.some(model => job.description.toLowerCase().includes(model.toLowerCase()))) &&
          (filters.locations.length === 0 || filters.locations.includes(job.location))
        );
      });

      const sortedJobs = filteredJobs.sort((a, b) => 
        new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
      );

      console.log('Filtered and sorted jobs:', sortedJobs);

      setJobListings(sortedJobs);
      localStorage.setItem('jobListings', JSON.stringify(sortedJobs));
    } catch (error) {
      console.error('Error fetching or filtering jobs:', error);
      setJobListings([]);
    } finally {
      setIsLoading(false);
      setShowFilters(false);
    }
  };

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

  const handleContactRecruiter = (jobId: string) => {
    setContactingRecruiter(prev => ({ ...prev, [jobId]: true }));
    setRecruiterMessage(prev => ({ ...prev, [jobId]: '' }));
  };

  const handleCancelContact = (jobId: string) => {
    setContactingRecruiter(prev => ({ ...prev, [jobId]: false }));
    setRecruiterMessage(prev => ({ ...prev, [jobId]: '' }));
  };

  const handleSendMessage = (jobId: string) => {
    // Implement the logic to send the message here
    console.log(`Sending message for job ${jobId}: ${recruiterMessage[jobId]}`);
    // After sending, close the text box
    handleCancelContact(jobId);
  };

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
                          {((job.image || job.company_image) && !imageError[job.id]) ? (
                            <img 
                              src={job.image || job.company_image} 
                              alt={job.company} 
                              className="w-12 h-12 rounded-full mr-4 object-cover"
                              onError={(e) => {
                                console.error('Image load error:', e);
                                setImageError(prev => ({ ...prev, [job.id]: true }));
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full mr-4 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 font-bold text-lg">
                                {job.company.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
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
                          {job.job_type}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {job.posted_date}
                        </div>
                      </div>
                      
                      <div className="flex justify-end items-center">
                        {job.salary_range && <p className="text-sm text-gray-500 mr-auto">{job.salary_range}</p>}
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
                              <FileText className="w-6 h-6" /> Download Custom Resume
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            className="text-gray-600 hover:bg-purple-600 hover:text-white"
                            onClick={() => handleContactRecruiter(job.id)}
                          >
                            Insider Connection
                          </Button>
                          <Button 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => window.open(job.url, '_blank')}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                      {contactingRecruiter[job.id] && (
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">Insider Connection</h3>
                            <Button variant="ghost" onClick={() => handleCancelContact(job.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Type your message here..."
                            value={recruiterMessage[job.id] || ''}
                            onChange={(e) => setRecruiterMessage(prev => ({ ...prev, [job.id]: e.target.value }))}
                            className="mb-2"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => handleCancelContact(job.id)}>Cancel</Button>
                            <Button 
                              className="bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleSendMessage(job.id)}
                            >
                              Send Message
                            </Button>
                          </div>
                        </div>
                      )}
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button variant="ghost" onClick={handleClearFilters}>Clear All</Button>
                </div>
              
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <Select
                      isMulti
                      options={uniqueJobTitles}
                      value={filters.jobTitles.map(title => ({ value: title, label: title }))}
                      onChange={(selected) => {
                        handleFilterChange('jobTitles', selected.map(option => option.value))
                      }}
                      placeholder="Select job titles"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Select
                      isMulti
                      options={uniqueLocations}
                      value={filters.locations.map(location => ({ value: location, label: location }))}
                      onChange={(selected) => {
                        handleFilterChange('locations', selected.map(option => option.value))
                      }}
                      placeholder="Select locations"
                    />
                  </div>
                </div>

                <Button onClick={handleApplyFilters} className="w-full mt-6">Apply Filters</Button>
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