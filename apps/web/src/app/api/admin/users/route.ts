import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Helper to verify ID token and confirm if requester is an admin
async function verifyAdmin(req: NextRequest): Promise<{ uid: string } | null> {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // Check user role in Firestore
        const userDoc = await adminDb.collection('users').doc(uid).get();
        if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
            return null;
        }

        return { uid };
    } catch (error) {
        console.error('Admin verification failed:', error);
        return null;
    }
}

// GET: Fetch all user records
export async function GET(req: NextRequest) {
    const adminCheck = await verifyAdmin(req);
    if (!adminCheck) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
        const usersSnap = await adminDb.collection('users').get();
        const users = usersSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || 'User',
                email: data.email || '',
                plan: data.plan || 'free',
                role: data.role || 'user',
                createdAt: data.createdAt || '',
                stripeCustomerId: data.stripeCustomerId || null,
                stripeSubscriptionId: data.stripeSubscriptionId || null,
            };
        });

        // Sort by creation date descending (in-memory to avoid requiring indexes)
        users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching admin users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Modify a target user's role or plan
export async function PATCH(req: NextRequest) {
    const adminCheck = await verifyAdmin(req);
    if (!adminCheck) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { targetUid, plan, role } = body;

        if (!targetUid) {
            return NextResponse.json({ error: 'Missing targetUid parameter' }, { status: 400 });
        }

        // Validate plan value if provided
        if (plan !== undefined && plan !== 'free' && plan !== 'pro') {
            return NextResponse.json({ error: 'Invalid plan value (must be free or pro)' }, { status: 400 });
        }

        // Validate role value if provided
        if (role !== undefined && role !== 'user' && role !== 'admin') {
            return NextResponse.json({ error: 'Invalid role value (must be user or admin)' }, { status: 400 });
        }

        const updateData: Record<string, string | null> = {
            updatedAt: new Date().toISOString()
        };

        if (plan !== undefined) {
            updateData.plan = plan;
            if (plan === 'free') {
                // If demoting to free, clear their subscription reference
                updateData.stripeSubscriptionId = null;
            }
        }
        
        if (role !== undefined) {
            updateData.role = role;
        }

        await adminDb.collection('users').doc(targetUid).update(updateData);
        
        return NextResponse.json({ success: true, targetUid, updated: updateData });
    } catch (error) {
        console.error('Error updating user as admin:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
