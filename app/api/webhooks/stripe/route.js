import { api } from "@/convex/_generated/api"
import stripe from "@/lib/stripe"
import { ConvexHttpClient } from "convex/browser"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error("Error verifying webhook", error.message)
    return new Response("Error verifying webhook", { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object)
        break;
    
      default:
        console.error("Unhandled event type", event.type)
        break;
    }
  } catch (error) {
    console.error("Error processing webhook", error)
    return new Response("Error processing webhook", { status: 500 })
  }

  return new Response("Webhook processed successfully", { status: 200 })
}

async function handleCheckoutSessionCompleted(session) {
  const courseId = session.metadata.courseId
  const stripeCustomerId = session.customer

  if(!courseId || !stripeCustomerId) {
    throw new Error("Missing courseId or stripeCustomerId")
  }

  const user = await convex.query(api.users.getUserByStripeCustomerId, { stripeCustomerId })

  if(!user) {
    throw new Error("User not found")
  }

  await convex.mutation(api.purchases.recordPurchase, {
    userId: user._id,
    courseId,
    amount: session.amount_total / 100,
    stripePurchaseId: session.id,
  })

  // todo: send a success email to the user
}