"use client"

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Zap, Crown, Box, FileText, QrCode } from 'lucide-react';

export default function DashboardPage() {
    const { user, isLoading, upgradeToPro } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
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
                    {user.plan === 'free' ? (
                        <Button onClick={upgradeToPro} className="gap-2">
                            <Zap className="w-4 h-4" />
                            Upgrade to Pro
                        </Button>
                    ) : (
                        <Badge variant="secondary" className="px-4 py-2 text-sm gap-2">
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
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Current Plan</span>
                                <Badge variant={user.plan === 'pro' ? 'default' : 'outline'}>
                                    {user.plan === 'pro' ? 'Pro' : 'Free'}
                                </Badge>
                            </div>
                            {user.plan === 'free' && (
                                <p className="text-sm text-muted-foreground">
                                    Upgrade to unlock unlimited projects and premium templates.
                                </p>
                            )}
                        </div>
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
            </div>
        </div>
    );
}
