import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID || 'price_placeholder',
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.nextUrl.origin}/dashboard?checkout_status=success`,
            cancel_url: `${req.nextUrl.origin}/pricing`,
            metadata: {
                firebaseUid: uid,
            },
            customer_email: email,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Stripe checkout error:', error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
