'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, Minus, GripVertical } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { matchFields } from '@/app/resume/action'
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface ResumeData {
  personal_info: {
    first_name: string
    last_name: string
    full_name: string
  }
  contact_info: {
    email: string
    phone: string
    formatted_address: string
    linkedin: string
  }
  summary: string
  skills: string
  experience: Array<{
    title: string
    company: string
    formatted_address: string
    period: {
      start_date: string
      end_date: string
    }
    description: string
  }>
  education: Array<{
    title: string
    institution: string
    degree: string
    period: {
      start_date: string
      end_date: string
    }
  }>
  languages: Array<{
    name: string
    proficiency: string
  }>
}


export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>()
  const resumeRef = useRef<HTMLDivElement>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    checkUser()
  }, [supabase.auth])

  useEffect(() => {
    const fetchResumeData = async () => {
      if (!userId) return; // Exit if userId is not available

      // Try to get data from localStorage
      const storedData = localStorage.getItem(`resumeData_${userId}`)
      if (storedData) {
        setResumeData(JSON.parse(storedData))
        return
      }

      // If not in localStorage, fetch from DB
      try {
        const { data, error } = await supabase
          .from('Resumes')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (error) throw error

        if (data) {
          setResumeData(data)
          // Save to localStorage for future use
          localStorage.setItem(`resumeData_${userId}`, JSON.stringify(data))
        } else {
          console.log('No resume data found for this user')

        }
      } catch (error) {
        console.error('Error fetching resume data:', error)
      }
    }

    fetchResumeData()
  }, [userId, supabase])

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData))
  }, [resumeData])

  const handleInputChange = (section: keyof ResumeData, index: number | null, field: string, value: string) => {
    setResumeData(prevData => {
      if (!prevData) return prevData; // Return if prevData is undefined
      const newData = { ...prevData }
      if (index !== null && Array.isArray(newData[section])) {
        (newData[section] as any[])[index] = { ...(newData[section] as any[])[index], [field]: value }
      } else if (typeof newData[section] === 'object' && !Array.isArray(newData[section])) {
        (newData[section] as any)[field] = value
      } else {
        (newData as any)[field] = value
      }
      return newData
    })
  }

  const addItem = (section: 'experience' | 'education' | 'languages') => {
    setResumeData(prevData => {
      if (!prevData) return prevData;
      const newData = { ...prevData };
      if (section === 'experience') {
        newData.experience = [...newData.experience, {
          title: '',
          company: '',
          formatted_address: '',
          period: { start_date: '', end_date: '' },
          description: ''
        }];
      } else if (section === 'education') {
        newData.education = [...newData.education, {
          title: '',
          institution: '',
          degree: '',
          period: { start_date: '', end_date: '' }
        }];
      } else if (section === 'languages') {
        newData.languages = [...newData.languages, { name: '', proficiency: '' }];
      }
      return newData;
    });
  }

  const removeItem = (section: 'experience' | 'education' | 'languages', index: number) => {
    setResumeData(prevData => {
      if (!prevData) return prevData; // Ensure prevData is defined
      const newData = { ...prevData }
      newData[section].splice(index, 1)
      return newData; // Return the modified data
    })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const section = result.type as keyof ResumeData; 
    const items = Array.from(resumeData?.[section] as Array<any> || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setResumeData(prevData => {
      if (!prevData) return { personal_info: { first_name: '', last_name: '', full_name: '' }, contact_info: { email: '', phone: '', formatted_address: '', linkedin: '' }, summary: '', skills: '', experience: [], education: [], languages: [] }; // Default value
      return {
        ...prevData,
        [section]: items
      }
    })
  }

  const downloadResume = async () => {
    const jsonInput = `{
      "data": {
      "personal_info": {
      "first_name": "Mohammed",
      "last_name": "Kanchwala",
      "full_name": "Mohammed Kanchwala",
      "date_of_birth": "",
      "age": 0,
      "nationality": "British",
      "place_of_birth": ""
      },
      "driving_license": [],
      "contact_info": {
      "email": "mohammed.kanchwala@outlook.com",
      "website": "",
      "linkedin": "https://www.linkedin.com/in/mohammed-kanchwala-94256399/",
      "phone": "+44 744 321 1056",
      "formatted_address": "Glasgow, United Kingdom",
      "address_breakdown": {
      "formatted_address": "Glasgow, United Kingdom",
      "city": "Glasgow",
      "state_code": "",
      "state_name": "",
      "country_code": "GBR",
      "country_name": "United Kingdom",
      "postal_code": ""
      }
      },
      "summary": "Senior Software Engineer with 9+ years of experience. Specializing in developing and maintaining online banking platforms. Proven ability to design, implement, and test complex software solutions, with practical experience in low latency systems and cryptocurrency trading platforms.",
      "skills": [
      "Core Java",
      "JavaScript",
      "SQL",
      "Spring Boot",
      "Angular",
      "AWS",
      "Git",
      "Jira",
      "Confluence",
      "Database Programming",
      "Docker",
      "Hibernate",
      "Agile",
      "Low latency systems",
      "Cryptocurrency",
      "Digital Asset Trading"
      ],
      "other_social_media_links": [
      {
      "name": "GitHub",
      "url": "https://github.com/mohammed-kanchwala"
      }
      ],
      "experience": [
      {
      "title": "Software Engineer III",
      "subtitle": "",
      "description": "Worked with a team of engineers to improve the performance and scalability of the online banking platform, ensuring that it could handle a large volume of traffic and transactions. Collaborated with product managers and business analysts to gather requirements and design new features for the online banking platform, as well as to ensure that existing features met the needs of users. Kept up with the latest trends in online banking technology and security, and implemented new technologies and security measures to improve the user experience and protect the bank's customers. Worked with a team to deliver Database Migration without impacting Business and Client along with solving Technical challenges.",
      "company": "JP Morgan Chase & Co",
      "formatted_address": "Glasgow, UK",
      "work_type": "Office",
      "period": {
      "start_date": "2022-11-01",
      "end_date": "Present",
      "is_current": true,
      "length_days": 0
      },
      "military": {
      "service": "",
      "rank": "",
      "branch": ""
      },
      "meta": {
      "experience_level": "Senior",
      "url": "",
      "keywords": [],
      "industry": []
      }
      },
      {
      "title": "Software Developer",
      "subtitle": "",
      "description": "Developed major features for Banking Application mainly Apple Pay, Google Pay, Domestic and International Transfers and Payments. Managed full application development and production support including feature and story implementation. Responsible for Developing new solutions that increased scalability by 65%. Received Best Agile Squad award in the company. Gained practical experience working with low latency systems.",
      "company": "DP World",
      "formatted_address": "Dubai, UAE",
      "work_type": "Office",
      "period": {
      "start_date": "2020-04-01",
      "end_date": "2022-11-01",
      "is_current": false,
      "length_days": 208
      },
      "military": {
      "service": "",
      "rank": "",
      "branch": ""
      },
      "meta": {
      "experience_level": "Mid",
      "url": "",
      "keywords": [],
      "industry": []
      }
      },
      {
      "title": "Software Developer",
      "subtitle": "",
      "description": "Worked as a full-stack developer for the application to deliver the best solutions. Responsible for session management and security for the application. Developed and managed major feature changes and release process. Involved in requirement gathering and preparing technical document for the project. Engaged with cryptocurrency projects and digital asset trading systems.",
      "company": "Nagarro Middle East",
      "formatted_address": "Dubai, UAE",
      "work_type": "Office",
      "period": {
      "start_date": "2017-02-01",
      "end_date": "2020-02-01",
      "is_current": false,
      "length_days": 1095
      },
      "military": {
      "service": "",
      "rank": "",
      "branch": ""
      },
      "meta": {
      "experience_level": "Mid",
      "url": "",
      "keywords": [],
      "industry": []
      }
      },
      {
      "title": "Software Developer",
      "subtitle": "",
      "description": "",
      "company": "Gatesoft Solutions",
      "formatted_address": "Ahmedabad, India",
      "work_type": "Office",
      "period": {
      "start_date": "2014-09-01",
      "end_date": "2017-02-01",
      "is_current": false,
      "length_days": 873
      },
      "military": {
      "service": "",
      "rank": "",
      "branch": ""
      },
      "meta": {
      "experience_level": "Junior",
      "url": "",
      "keywords": [],
      "industry": []
      }
      }
      ],
      "education": [
      {
      "title": "Bachelor of Engineering (I.T.)",
      "subtitle": "",
      "description": "",
      "institution": "University of Pune",
      "degree": "Bachelor's Degree",
      "formatted_address": "",
      "period": {
      "start_date": "2007-01-01",
      "end_date": "2011-12-31",
      "is_current": false,
      "length_days": 1461
      },
      "meta": {
      "partial": false,
      "url": "",
      "keywords": []
      }
      }
      ],
      "certifications": [],
      "languages": [
      {
      "name": "English",
      "proficiency": ""
      },
      {
      "name": "Hindi",
      "proficiency": ""
      },
      {
      "name": "Gujarati",
      "proficiency": ""
      },
      {
      "name": "Arabic",
      "proficiency": ""
      }
      ]
      }
      }`;
    // const MyDocument = await generateResumePDF(jsonInput);
    
    // // Generate PDF blob
    // const blob = await pdf(<MyDocument />).toBlob();
    
    // // Create a URL for the blob
    // const url = URL.createObjectURL(blob);
    
    // // Create a temporary anchor element and trigger download
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'resume.pdf';
    // document.body.appendChild(link);
    // link.click();
    
    // // Clean up
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          onClick={downloadResume}
          className="mb-4 bg-purple-600 hover:bg-purple-700 text-white"
        >
          Download Resume
        </Button>
        <div ref={resumeRef} className="bg-white shadow-xl rounded-lg overflow-hidden p-8">
          <div className="mb-6">
            <Input
              value={resumeData?.personal_info?.full_name || ''}
              onChange={(e) => handleInputChange('personal_info', null, 'full_name', e.target.value)}
              className="text-3xl font-bold mb-2"
            />
            <div className="flex flex-wrap gap-2">
              <Input
                value={resumeData?.contact_info?.email || ''}
                onChange={(e) => handleInputChange('contact_info', null, 'email', e.target.value)}
                className="flex-grow"
              />
              <Input
                value={resumeData?.contact_info?.phone || ''}
                onChange={(e) => handleInputChange('contact_info', null, 'phone', e.target.value)}
                className="flex-grow"
              />
              <Input
                value={resumeData?.contact_info?.formatted_address || ''}
                onChange={(e) => handleInputChange('contact_info', null, 'formatted_address', e.target.value)}
                className="flex-grow"
              />
              <Input
                value={resumeData?.contact_info?.linkedin || ''}
                onChange={(e) => handleInputChange('contact_info', null, 'linkedin', e.target.value)}
                className="flex-grow"
              />
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resumeData?.summary || ''}
                onChange={(e) => handleInputChange('summary', null, 'summary', e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resumeData?.skills || ''}
                onChange={(e) => handleInputChange('skills', null, 'skills', e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          <DragDropContext onDragEnd={onDragEnd}>
            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Experience</CardTitle>
                <Button onClick={() => addItem('experience')} size="sm"><Plus className="w-4 h-4" /></Button>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="experience" type="experience">
                  {(provided: any) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {resumeData?.experience.map((exp, index) => (
                        <Draggable key={index} draggableId={`experience-${index}`} index={index}>
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="mb-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-5 h-5 text-gray-500" />
                                </div>
                                <Button onClick={() => removeItem('experience', index)} size="sm" variant="destructive">
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                              <Input
                                value={exp.title}
                                onChange={(e) => handleInputChange('experience', index, 'title', e.target.value)}
                                className="mb-2"
                                placeholder="Job Title"
                              />
                              <Input
                                value={exp.company}
                                onChange={(e) => handleInputChange('experience', index, 'company', e.target.value)}
                                className="mb-2"
                                placeholder="Company"
                              />
                              <Input
                                value={exp.formatted_address}
                                onChange={(e) => handleInputChange('experience', index, 'formatted_address', e.target.value)}
                                className="mb-2"
                                placeholder="Location"
                              />
                              <div className="flex gap-2 mb-2">
                                <Input
                                  value={exp.period.start_date}
                                  onChange={(e) => handleInputChange('experience', index, 'period.start_date', e.target.value)}
                                  placeholder="Start Date"
                                />
                                <Input
                                  value={exp.period.end_date}
                                  onChange={(e) => handleInputChange('experience', index, 'period.end_date', e.target.value)}
                                  placeholder="End Date"
                                />
                              </div>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => handleInputChange('experience', index, 'description', e.target.value)}
                                className="w-full"
                                placeholder="Job Description"
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Education</CardTitle>
                <Button onClick={() => addItem('education')} size="sm"><Plus className="w-4 h-4" /></Button>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="education" type="education">
                  {(provided: any) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {resumeData?.education.map((edu, index) => (
                        <Draggable key={index} draggableId={`education-${index}`} index={index}>
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="mb-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-5 h-5 text-gray-500" />
                                </div>
                                <Button onClick={() => removeItem('education', index)} size="sm" variant="destructive">
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                              <Input
                                value={edu.title}
                                onChange={(e) => handleInputChange('education', index, 'title', e.target.value)}
                                className="mb-2"
                                placeholder="Degree"
                              />
                              <Input
                                value={edu.institution}
                                onChange={(e) => handleInputChange('education', index, 'institution', e.target.value)}
                                className="mb-2"
                                placeholder="Institution"
                              />
                              <div className="flex gap-2">
                                <Input
                                  value={edu.period.start_date}
                                  onChange={(e) => handleInputChange('education', index, 'period.start_date', e.target.value)}
                                  placeholder="Start Date"
                                />
                                <Input
                                  value={edu.period.end_date}
                                  onChange={(e) => handleInputChange('education', index, 'period.end_date', e.target.value)}
                                  placeholder="End Date"
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Languages</CardTitle>
                <Button onClick={() => addItem('languages')} size="sm"><Plus className="w-4 h-4" /></Button>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="languages" type="languages">
                  {(provided: any) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {resumeData?.languages.map((lang, index) => (
                        <Draggable key={index} draggableId={`language-${index}`} index={index}>
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="mb-2 flex items-center gap-2"
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-5 h-5 text-gray-500" />
                              </div>
                              <Input
                                value={lang.name}
                                onChange={(e) => handleInputChange('languages', index, 'name', e.target.value)}
                                className="flex-grow"
                                placeholder="Language"
                              />
                              <Input
                                value={lang.proficiency}
                                onChange={(e) => handleInputChange('languages', index, 'proficiency', e.target.value)}
                                className="flex-grow"
                                placeholder="Proficiency"
                              />
                              <Button onClick={() => removeItem('languages', index)} size="sm" variant="destructive">
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}