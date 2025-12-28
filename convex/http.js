import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import stripe from "../lib/stripe";

const http = httpRouter()

const clerkWebhook = httpAction(async (ctx, request) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
  if(!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable")
  }

  const svix_id = request.headers.get("svix-id")
  const svix_signature = request.headers.get("svix-signature")  
  const svix_timestamp = request.headers.get("svix-timestamp")

  if(!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  const payload = await request.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(webhookSecret)
  let evt
  
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error("Error verifying webhook", err)
    return new Response("Error occured -- invalid svix payload", {
      status: 400,
    })
  }

  const evertType = evt.type
  if(evertType === "user.created") {
    const {  id, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses[0]?.email_address
    const name = `${first_name || ""} ${last_name || ""}`.trim()

    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          clerkId: id,
        }
      })

      await ctx.runMutation(api.users.createUser, {
        email,
        name,
        clerkId: id,
        stripeCustomerId: customer.id,
      })

      // TODO: SEND WELCOME EMAIL
    } catch (error) {
      console.error("Error creating use in Convexr", error)
      return new Response("Error creating user", {
        status: 500,
      })
    }
  }

  return new Response("Webhook processed successfully", { status: 200 })
})

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook
})

export default http