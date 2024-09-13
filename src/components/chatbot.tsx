'use client'

import { Briefcase } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatBot () {
  return (
    <>
    {/* Right Sidebar - AI Chatbot */}
    <aside className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-2">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">JobAssist</h2>
              <p className="text-sm text-gray-600">Your AI Copilot</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Quick Guide
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-gray-800 mb-2">Welcome back, User!</p>
          <p className="text-sm text-gray-600">It's great to see you again. Let's resume your journey towards your dream job.</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Tasks I can assist you with:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-2">🔍</span>
              Adjust current preferences
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-2">⭐</span>
              Top Match jobs
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-2">💬</span>
              Ask JobAssist
            </li>
          </ul>
        </div>

        <div className="flex-grow">
          <Input placeholder="Ask me anything..." className="mb-2" />
          <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
            Send
          </Button>
        </div>
      </aside>
    </>
  )
}