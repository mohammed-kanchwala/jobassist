import { supabase } from '@/lib/supabaseClient';
import { Briefcase, FileText, User, HelpCircle, LogOut, Gift, LucideLoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation' 

export default function SidePanel () {
  const router = useRouter();
  const pathname = usePathname()

  const handleFeedback = async () => {
    console.log('Feedback called')
  }

  const handleLogout = async () => {
    
    const logout = async () => {
      await supabase.auth.signOut()
      router.push('/')
    } 

  }

  return (
    /* Left Sidebar */
    <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
      
      <nav className="flex flex-col items-center space-y-6">
      <Link href="/jobs" className={`${pathname === '/jobs' ? 'w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center' : 'text-gray-400 hover:text-purple-600'} `}>            <Briefcase className="w-6 h-6" />
        </Link>
        <Link href="/resume" className={`${pathname === '/resume' ? 'w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center' : 'text-gray-400 hover:text-purple-600'} `}>            <FileText className="w-6 h-6" />
        </Link>
        <Link href="/profile" className={`${pathname === '/profile' ? 'w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center' : 'text-gray-400 hover:text-purple-600'} `}>
          <User className="w-6 h-6" />
        </Link>
      </nav>

      <div className="flex-grow" />
      <Link href="#" className="text-gray-400 hover:text-purple-600">
        <Gift className="w-6 h-6" />
      </Link>
      <Link href="#" onClick={handleFeedback} className="text-gray-400 hover:text-purple-600">
        <HelpCircle className="w-6 h-6" />
      </Link>
      <Link href="#" onClick={handleLogout} className="text-gray-400 hover:text-purple-600">
        <LogOut className="w-6 h-6" />
      </Link>
    </aside>      
  );
}