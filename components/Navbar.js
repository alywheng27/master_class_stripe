import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { BookOpenIcon, CreditCard, GraduationCap, LogIn, LogOut, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center p-4 px-6 bg-background border-b'>
      <Link href="/" className='text-xl font-extrabold text-primary flex items-center gap-2'>
      MasterClass <GraduationCap className='w-6 h-6' />
      </Link>

      <div className='flex items-center space-x-1 sm:space-x-4'>
        <Link href="/courses" className='flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors'>
          <BookOpenIcon className='size-4' />
          <span className='hiddem sm:inline'>Courses</span>
        </Link>

        <Link href="/pro" className='flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors'>
          <Zap className='size-4' />
          <span className='hiddem sm:inline'>Pro</span>
        </Link>

        <SignedIn>
          <Link href="/billing">
            <Button variant='outline' size='sm' className="flex items-center gap-2 text-gray-500">
              <CreditCard className='size-4' />
              <span className='hiddem sm:inline'>Billing</span>
            </Button>
          </Link>
        </SignedIn>

        {/* This will only show when signedin */}
        <UserButton />

        <SignedIn>
          <SignOutButton mode='modal'>
            <Button variant='outline' size='sm' className="flex items-center gap-2 text-gray-500">
              <LogOut className='size-4' />
              <span className='hiddem sm:inline'>Log out</span>
            </Button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <SignInButton mode='modal'>
            <Button variant='outline' size='sm' className="flex items-center gap-2"> 
              <LogIn className='size-4' />
              <span className='hiddem sm:inline'>Log in</span>
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedOut>
          <SignUpButton mode='modal'>
            <Button variant='outline' size='sm' className="flex items-center gap-2"> 
              <span className='hiddem sm:inline'>Sign up</span>
            </Button>
          </SignUpButton>
        </SignedOut>
      </div>
    </nav>
  )
}
