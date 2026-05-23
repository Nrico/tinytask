import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

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

        // Fetch the user document from Firestore to find the Stripe Customer ID
        const userDoc = await adminDb.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        const stripeCustomerId = userData?.stripeCustomerId;

        if (!stripeCustomerId) {
            return NextResponse.json({ 
                error: 'No active Stripe billing profile found. Please subscribe to Pro first.' 
            }, { status: 400 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${req.nextUrl.origin}/dashboard`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Stripe billing portal error:', error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
