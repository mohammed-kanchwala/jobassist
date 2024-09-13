'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideLoaderCircle, Linkedin, FileUp, Download, Trash2, Gift } from 'lucide-react'
import ChatBot from '@/components/chatbot'
import SidePanel from '@/components/sidepanel'

export default function ProfilePage() {



  const [linkedinUrl, setLinkedinUrl] = useState('https://www.linkedin.com/in/johndoe')
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const handleLinkedinUpdate = () => {
    console.log('LinkedIn URL updated:', linkedinUrl)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0])
    }
  }

  const handleResumeUpload = () => {
    if (resumeFile) {
      console.log('Resume uploaded:', resumeFile.name)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <SidePanel />
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">PROFILE</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-600 mb-6">john.doe@example.com</p>
          
          {/* LinkedIn Section */}
          <div className="mb-8">
            <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
            <div className="mt-2 flex">
              <div className="relative flex-grow">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="linkedin-url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleLinkedinUpdate} className="ml-2">
                Update Your LinkedIn URL
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Tip: Providing your LinkedIn URL can help us find alumni or past colleagues from your target company who can provide valuable referrals.
            </p>
          </div>

          {/* Resume Section */}
          <div className="mb-8">
            <Label htmlFor="resume-upload">Resume</Label>
            <div className="mt-2 flex items-center">
              <div className="relative flex-grow">
                <FileUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="resume-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="pl-10"
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <Button onClick={handleResumeUpload} className="ml-2">
                Upload Your Resume
              </Button>
            </div>
            {resumeFile && (
              <div className="flex items-center justify-between mt-4 p-2 bg-gray-100 rounded">
                <span className="text-sm text-gray-600">{resumeFile.name}</span>
                <div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Download size={16} className="mr-1" /> Download
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setResumeFile(null)}>
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Tip: Upload your resume to help us understand your past experiences and provide improved job matching and resume writing services.
            </p>
          </div>

          {/* Delete Account */}
          <div className="mt-12">
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Delete My Account
            </Button>
          </div>
        </div>
      </main>

      {/* AI Assistant Sidebar */}
      <ChatBot />
    </div>
  )
}