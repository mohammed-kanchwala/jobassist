import { supabase } from '@/lib/supabaseClient';
import { Briefcase, FileText, User, HelpCircle, LogOut, Gift, LucideLoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation' 
import { logout } from '@/app/logout/action'

export default function SidePanel () {
  const router = useRouter();
  const pathname = usePathname()

  const handleFeedback = async () => {
    console.log('Feedback called')
  }

  const handleLogout = async () => {
    console.log('logout called')
    logout()
  }

  return (
    <aside className="w-16 bg-background border-r border-border flex flex-col items-center py-4 space-y-6">
      <nav className="flex flex-col items-center space-y-6">
        <Link href="/jobs" className={`${pathname === '/jobs' ? 'w-10 h-10 bg-primary rounded-full flex items-center justify-center' : 'text-foreground hover:text-primary'} `}>
          <Briefcase className="w-6 h-6" />
        </Link>
        <Link href="/resume" className={`${pathname === '/resume' ? 'w-10 h-10 bg-primary rounded-full flex items-center justify-center' : 'text-foreground hover:text-primary'} `}>
          <FileText className="w-6 h-6" />
        </Link>
        <Link href="/profile" className={`${pathname === '/profile' ? 'w-10 h-10 bg-primary rounded-full flex items-center justify-center' : 'text-foreground hover:text-primary'} `}>
          <User className="w-6 h-6" />
        </Link>
      </nav>

      <div className="flex-grow" />
      <Link href="#" className="text-foreground hover:text-primary">
        <Gift className="w-6 h-6" />
      </Link>
      <Link href="#" onClick={handleFeedback} className="text-foreground hover:text-primary">
        <HelpCircle className="w-6 h-6" />
      </Link>
      <Link href="/" onClick={handleLogout} className="text-foreground hover:text-primary">
        <LogOut className="w-6 h-6" />
      </Link>
    </aside>      
  );
}