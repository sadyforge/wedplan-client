import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe'
import { getSessions } from '@/lib/core/server'

export async function POST() {
  try {
    const userSession = await getSessions()
    const user = userSession?.user as
      | { id: string; email: string; role?: string; subscriptionPlan?: string; subscriptionStatus?: string }
      | undefined

    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ message: 'Only authenticated vendors can upgrade.' }, { status: 401 })
    }

    const plan = String(user.subscriptionPlan || 'free').toLowerCase()
    const status = String(user.subscriptionStatus || (plan === 'premium' ? 'active' : 'inactive')).toLowerCase()
    if (plan === 'premium' && status === 'active') {
      return NextResponse.json({ message: 'Your Premium subscription is already active.' }, { status: 409 })
    }

    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.BETTER_AUTH_URL || 'http://localhost:3000'

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
         price: 'price_1Udvy2FIgdFO9aeFEBoOgO1y',  
          quantity: 1,
        },
      ],
      mode: 'subscription',
         customer_email:user.email,
    metadata:{
        userId:user.id,
    },
    //   customer_email:userSessions?.user?.email,
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancel`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'Wed_Plan',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
      const error=err instanceof Error ? err : new Error(String(err))
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
