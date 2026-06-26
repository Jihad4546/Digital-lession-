import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) { // 👈 এখানে req প্যারামিটার যোগ করা হয়েছে
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // 💡 ফ্রন্টএন্ড থেকে পাঠানো userId এবং userEmail রিসিভ করা হচ্ছে
    const { userId, userEmail } = await req.json();

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      
      // 💡 ইউজারের ইমেইল অটো-সেট করার জন্য
      customer_email: userEmail, 

      line_items: [
        {
          // আপনার প্রোডাক্টের প্রাইস আইডি ঠিক আছে
          price: 'price_1TmQYzRvEfk8pTrQEtBWJn1J',
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      // 💡 পেমেন্ট পরবর্তীতে ট্র্যাক করার জন্য মেটাডাটা
      metadata: { 
        userId: userId, 
        userEmail: userEmail 
      },
      
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`, // ক্যানসেল করলে প্রাইসিং পেজে ফেরত যাবে
    });

    // ⚠️ NextResponse.redirect এর বদলে সরাসরি URL-টি রিটার্ন করুন
    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (err) {
    console.error("Next.js Stripe Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}