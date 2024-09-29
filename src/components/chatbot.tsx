'use client'

import { Briefcase } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatBot () {
  return (
    <aside className="w-80 bg-background border-l border-border flex flex-col h-screen">
      <div className="p-6 flex-grow overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-2">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Landingear</h2>
              <p className="text-sm text-primary">Your AI Copilot</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10">
            Quick Guide
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-foreground mb-2">Welcome back, User!</p>
          <p className="text-sm text-muted-foreground">It's great to see you again. Let's resume your journey towards your dream job.</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-2">Tasks I can assist you with:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="w-5 h-5 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mr-2">🔍</span>
              <span className="text-muted-foreground">Adjust current preferences</span>
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mr-2">⭐</span>
              <span className="text-muted-foreground">Top Match jobs</span>
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mr-2">💬</span>
              <span className="text-muted-foreground">Ask Landingear</span>
            </li>
          </ul>
        </div>

        {/* Chat messages would go here */}
        <div className="flex-grow">
          {/* Add your chat messages here */}
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <Input placeholder="Ask me anything..." className="mb-2 bg-secondary border-primary text-foreground placeholder-muted-foreground" />
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Send
        </Button>
      </div>
    </aside>
  )
}