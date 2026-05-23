import * as admin from 'firebase-admin';

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!admin.apps.length) {
    try {
        if (clientEmail && privateKey && projectId) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
        } else {
            // Fallback for development / mock environments
            admin.initializeApp({
                projectId: projectId || 'tinytask-dev',
            });
        }
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
    }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
