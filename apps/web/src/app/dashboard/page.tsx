"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Zap, Crown, Box, FileText, QrCode, Loader2, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
    const { user, isLoading, upgradeToPro } = useAuth();
    const router = useRouter();
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (!isLoading && user) {
            const params = new URLSearchParams(window.location.search);
            if (params.get('upgrade') === 'true') {
                router.replace('/dashboard');
                upgradeToPro();
            }
        }
    }, [user, isLoading, router, upgradeToPro]);

    const handleManageBilling = async () => {
        setIsPortalLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                router.push('/login');
                return;
            }
            const res = await fetch('/api/portal', {
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
                alert(data.error || 'Failed to initialize customer portal.');
            }
        } catch (err) {
            console.error('Portal redirect error:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsPortalLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user.name}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {user.role === 'admin' && (
                        <Button onClick={() => router.push('/dashboard/admin')} variant="outline" className="gap-2 font-semibold border-rose-200 bg-rose-50/30 text-rose-700 hover:bg-rose-50/50">
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                            Admin Panel
                        </Button>
                    )}
                    {user.plan === 'free' ? (
                        <Button onClick={upgradeToPro} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-xs font-semibold cursor-pointer">
                            <Zap className="w-4 h-4" />
                            Upgrade to Pro
                        </Button>
                    ) : (
                        <Badge variant="secondary" className="px-4 py-2 text-sm gap-2 bg-slate-100 text-slate-800 border-none font-semibold shadow-xs">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            Pro Plan Active
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Subscription Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Your current plan details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Current Plan</span>
                            <Badge variant={user.plan === 'pro' ? 'default' : 'outline'}>
                                {user.plan === 'pro' ? 'Pro' : 'Free'}
                            </Badge>
                        </div>
                        {user.plan === 'free' ? (
                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Upgrade to unlock unlimited projects, custom brand kits, offline barcode options, and priority email support.
                                </p>
                                <Button onClick={upgradeToPro} className="w-full text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-xs font-semibold gap-1 cursor-pointer">
                                    <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    You have full access to TinyTask Pro. Manage invoices, download logs, and update payment terms.
                                </p>
                                <Button 
                                    onClick={handleManageBilling} 
                                    disabled={isPortalLoading}
                                    variant="outline" 
                                    className="w-full text-xs h-9 font-semibold"
                                >
                                    {isPortalLoading && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}
                                    Manage Subscription & Invoices
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Usage Stats (Mocked) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usage</CardTitle>
                        <CardDescription>Tools used this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">QR Codes Generated</span>
                                <span className="font-medium">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Labels Printed</span>
                                <span className="font-medium">4 Sheets</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Files Scrubbed</span>
                                <span className="font-medium">2</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold mt-12 mb-6">Quick Access</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2" onClick={() => router.push('/tools/qr-generator')}>
                    <QrCode className="w-6 h-6" />
                    QR Generator
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2" onClick={() => router.push('/tools/label-creator')}>
                    <Box className="w-6 h-6" />
                    Label Creator
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2" onClick={() => router.push('/tools/word-formatter')}>
                    <FileText className="w-6 h-6" />
                    Word Formatter
                </Button>
                {user.role === 'admin' && (
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-rose-200 bg-rose-50/10 text-rose-800 hover:bg-rose-50/20" onClick={() => router.push('/dashboard/admin')}>
                        <ShieldAlert className="w-6 h-6 text-rose-600" />
                        Admin Support Panel
                    </Button>
                )}
            </div>
        </div>
    );
}
