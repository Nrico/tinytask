import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature') || '';

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET || ''
            );
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'Unknown signature verification error';
            console.error(`Webhook signature verification failed:`, errMessage);
            return NextResponse.json({ error: `Webhook error: ${errMessage}` }, { status: 400 });
        }

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const firebaseUid = session.metadata?.firebaseUid;
                const stripeCustomerId = typeof session.customer === 'string' ? session.customer : '';
                const stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : '';

                if (firebaseUid) {
                    await adminDb.collection('users').doc(firebaseUid).set({
                        plan: 'pro',
                        stripeCustomerId,
                        stripeSubscriptionId,
                        updatedAt: new Date().toISOString(),
                    }, { merge: true });
                    console.log(`Successfully upgraded user ${firebaseUid} to Pro plan.`);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const stripeCustomerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
                const status = subscription.status;
                const plan = (status === 'active' || status === 'trialing') ? 'pro' : 'free';

                const usersQuery = await adminDb.collection('users')
                    .where('stripeCustomerId', '==', stripeCustomerId)
                    .get();

                if (!usersQuery.empty) {
                    const batch = adminDb.batch();
                    usersQuery.docs.forEach((doc) => {
                        batch.set(doc.ref, {
                            plan,
                            updatedAt: new Date().toISOString(),
                        }, { merge: true });
                    });
                    await batch.commit();
                    console.log(`Updated subscriptions associated with customer ${stripeCustomerId} to ${plan}.`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const stripeCustomerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

                const usersQuery = await adminDb.collection('users')
                    .where('stripeCustomerId', '==', stripeCustomerId)
                    .get();

                if (!usersQuery.empty) {
                    const batch = adminDb.batch();
                    usersQuery.docs.forEach((doc) => {
                        batch.set(doc.ref, {
                            plan: 'free',
                            stripeSubscriptionId: null,
                            updatedAt: new Date().toISOString(),
                        }, { merge: true });
                    });
                    await batch.commit();
                    console.log(`Downgraded subscriptions associated with customer ${stripeCustomerId} to Free.`);
                }
                break;
            }

            default:
                console.log(`Unhandled Stripe event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Stripe webhook processing error:', error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
