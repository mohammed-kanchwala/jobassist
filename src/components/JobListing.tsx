import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const JobListing: React.FC = () => {
    const { data: user, status: userStatus } = useSession()
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState(user)
  
    useEffect(() => {
        setCurrentUser(user)
      }, [user])
    
      const handleLogout = async () => {
        await signOut()
        router.push('/page')
      }
    
      const handleGetStarted = () => {
        router.push('/page')
      }

      if (status === "loading") {
        return <div>Loading...</div>
      }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <Header 
        user={currentUser ? { name: currentUser.user?.name ?? '', image: currentUser.user?.image ?? '' } : undefined}
        onLogout={handleLogout} 
        onGetStarted={handleGetStarted}
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
        {/* Add your job listing content here */}
        <div className="grid gap-4">
          {/* Example job item */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold">Job Title</h2>
            <p className="text-gray-400">Company Name</p>
            <p className="mt-2">Job description goes here...</p>
          </div>
          {/* Add more job items as needed */}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default JobListing