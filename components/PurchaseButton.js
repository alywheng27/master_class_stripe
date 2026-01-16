'use client'

import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useAction, useQuery } from 'convex/react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { ArrowRight, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

export default function PurchaseButton({ courseId }) {
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useUser()
  const userData = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : "skip")

  const createCheckoutSession = useAction(api.stripe.createCheckoutSession)

  const userAccess = useQuery(api.users.getUserAccess, userData ? {
    userId: userData?._id,
    courseId,
  } : "skip") || { hasAccess: false }
  
  const handlePurchase = async () => {
    if(!user) {
      toast.error("Please Login to purchase.", { id: "login-error" })
      return false
    }
    
    setIsLoading(true)

    try {
      const { checkoutUrl } = await createCheckoutSession({ courseId })

      if(checkoutUrl) {
        window.location.href = checkoutUrl
      }else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      if(error.message.includes("Rate limit exceeded")) {
        toast.error("You've tried too many times. Please try again later.")
      } else {
        toast.error(error.message || "An error occurred. Please try again.")
      }
      console.log(error)
    }finally {
      setIsLoading(false)
    }
  }

  if(!userAccess.hasAccess) {
    return <Button variant='outline' onClick={handlePurchase} disabled={isLoading}>Enroll Now <ArrowRight className='size-4' /></Button>
  }

  if(userAccess.hasAccess) {
    return <Button variant='outline'>Enrolled</Button>
  }

  if(isLoading) {
    return <Button>
      <Loader2Icon className='mr-2 size-4 animate-spin' />
      Processing...
    </Button>
  }
}
