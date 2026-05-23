"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from './firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    signInWithPopup, 
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export type UserPlan = 'free' | 'pro';

export interface User {
    id: string;
    name: string;
    email: string;
    plan: UserPlan;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, name: string) => Promise<void>;
    loginWithPassword: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    upgradeToPro: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sync Firestore document state in real-time
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userRef = doc(db, 'users', firebaseUser.uid);
                
                // Use onSnapshot to listen for real-time updates (e.g. when Stripe webhook completes checkout)
                const unsubscribeDoc = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUser({
                            id: firebaseUser.uid,
                            name: data.name || firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            plan: data.plan || 'free',
                        });
                    } else {
                        // Create baseline doc if not exists
                        const newDoc = {
                            name: firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            plan: 'free' as UserPlan,
                            createdAt: new Date().toISOString(),
                        };
                        await setDoc(userRef, newDoc);
                        setUser({
                            id: firebaseUser.uid,
                            name: newDoc.name,
                            email: newDoc.email,
                            plan: newDoc.plan,
                        });
                    }
                    setIsLoading(false);
                }, (error) => {
                    console.error("Error reading user document:", error);
                    setIsLoading(false);
                });

                return () => unsubscribeDoc();
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const loginWithPassword = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, name: string) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', credential.user.uid);
        await setDoc(userRef, {
            name,
            email,
            plan: 'free',
            createdAt: new Date().toISOString(),
        });
    };

    const loginWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider);
    };

    // Legacy mock login compatibility
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const login = async (email: string, _name: string) => {
        if (email === 'demo@tinytask.app') {
            try {
                await signInWithEmailAndPassword(auth, 'demo@tinytask.app', 'demoPassword123');
            } catch {
                // If demo account doesn't exist yet, we register it
                try {
                    await signUp('demo@tinytask.app', 'demoPassword123', 'Demo User');
                } catch {
                    // Fallback
                }
            }
        } else {
            throw new Error("Password required for standard accounts. Please use loginWithPassword or loginWithGoogle.");
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const upgradeToPro = async () => {
        setIsLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                window.location.href = '/login?plan=pro';
                return;
            }
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to initialize checkout.');
            }
        } catch (err) {
            console.error('Upgrade to Pro error:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            login, 
            loginWithPassword, 
            signUp, 
            loginWithGoogle, 
            logout, 
            upgradeToPro 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
