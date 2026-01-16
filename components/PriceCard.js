import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card'
import { Check } from 'lucide-react'
import { Button } from './ui/button'
import { Loader2Icon } from 'lucide-react'

export default function PriceCard({ plan, handlePlanSelection, loadingPlan, userSubscription, isYearlySubscriptionActive, isUserLoaded }) {
  return (
    <Card key={plan.id} className={`
      flex flex-col transition-all duration-300 ${plan?.highlighted
        ? "border-purple-400 shadow-lg hover:shadow-xl"
        : "hover:border-purple-200 hover:shadow-md"
      }
    `}>
      <CardHeader className='grow'>
        <CardTitle className={`text-2xl ${plan?.highlighted ? 'text-purple-600!' : 'text-gray-800!'}`}>
          {plan.title}
        </CardTitle>

        <CardDescription className="mt-2">
          <span className='text-3xl font-bold text-gray-900'>{plan.price}</span>
          <span className='text-gray-600 ml-1'>{plan.period}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className='space-y-3'>
          {plan.features.map((feature, fidx) => (
            <li key={fidx} className='flex items-center'>
              <Check className={`h-5 w-5 ${plan?.highlighted ? "text-purple-500!" : "text-green-500!"} mr-2 shrink-0`} />
              <span className='text-gray-700'>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto">
          <Button className={`w-full py-6 text-lg ${
            plan?.highlighted
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50"
          }`}
            onClick={() => handlePlanSelection(plan.id)}
            disabled={
              userSubscription?.status === "active" && (userSubscription?.planType === plan.id || isYearlySubscriptionActive)
            }
          >
            {loadingPlan === plan.id ? (
              <>
                <Loader2Icon className='mr-2 size-4 animate-spin' />  
                Processing...
              </>
            ) : isUserLoaded && userSubscription?.status === "active" && userSubscription.planType === plan.id ? "Current Plan" : "Select a Plan" }
          </Button>
      </CardFooter>
    </Card>
  )
}
