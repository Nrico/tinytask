"use client"

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { loginWithPassword, signUp, loginWithGoogle, login } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            if (isSignUp) {
                await signUp(email, password, name || 'User');
            } else {
                await loginWithPassword(email, password);
            }
            router.push('/dashboard');
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
            console.error(err);
            setError(errMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            await loginWithGoogle();
            router.push('/dashboard');
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'Google Sign-In failed.';
            console.error(err);
            setError(errMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            await login('demo@tinytask.app', 'Demo User');
            router.push('/dashboard');
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'Demo Sign-In failed.';
            console.error(err);
            setError(errMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center px-4">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {isSignUp ? 'Create an account' : 'Welcome back'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isSignUp 
                            ? 'Enter details to register your new account' 
                            : 'Enter your credentials to sign in to your account'
                        }
                    </p>
                </div>

                <div className="grid gap-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            {error && (
                                <div className="p-3 text-xs bg-red-50 border border-red-200 rounded text-red-600 font-medium">
                                    {error}
                                </div>
                            )}

                            {isSignUp && (
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        type="text"
                                        disabled={isSubmitting}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={isSignUp}
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isSubmitting}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    disabled={isSubmitting}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isSignUp ? 'Create Account' : 'Sign In with Email'}
                            </Button>
                        </div>
                    </form>

                    <div className="flex justify-center text-xs">
                        <button 
                            type="button" 
                            onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
                            className="text-primary hover:underline font-semibold"
                        >
                            {isSignUp 
                                ? 'Already have an account? Sign In' 
                                : "Don't have an account? Create one"
                            }
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <Button variant="outline" type="button" disabled={isSubmitting} onClick={handleGoogleLogin}>
                            Sign In with Google
                        </Button>
                        
                        <Button variant="outline" type="button" disabled={isSubmitting} onClick={handleDemoLogin} className="text-slate-500">
                            Use Demo Account
                        </Button>
                    </div>
                </div>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
