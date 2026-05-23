"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function PricingPage() {
    const { user, upgradeToPro, isLoading } = useAuth();
    const isPro = user?.plan === 'pro';

    const handleProAction = () => {
        if (isPro) {
            window.location.href = '/dashboard';
        } else {
            upgradeToPro();
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Simple, Transparent Pricing</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Start for free, upgrade for power. No hidden fees, cancel anytime.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <Card className="flex flex-col border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free</CardTitle>
                        <CardDescription>Essential tools for everyday tasks.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Access to all 12+ tools</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited exports</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> No ads</li>
                            <li className="flex items-center gap-2 text-muted-foreground"><X className="w-4 h-4" /> Save projects</li>
                            <li className="flex items-center gap-2 text-muted-foreground"><X className="w-4 h-4" /> Share designs</li>
                            <li className="flex items-center gap-2 text-muted-foreground"><X className="w-4 h-4" /> Cloud storage</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full" size="lg">Get Started</Button>
                        </Link>
                    </CardFooter>
                </Card>

                {/* Pro Tier */}
                <Card className="flex flex-col border-2 border-primary shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                    <CardHeader>
                        <CardTitle className="text-2xl">Pro</CardTitle>
                        <CardDescription>For power users who need to organize work.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-4xl font-bold mb-6">$9<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <strong>Everything in Free</strong></li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Save unlimited projects</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Share designs via link</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Cloud storage & sync</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority support</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Early access to new tools</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg" 
                            onClick={handleProAction}
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-16 text-center">
                <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                    <div>
                        <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
                        <p className="text-sm text-muted-foreground">Yes, you can cancel your subscription at any time. You will retain access until the end of your billing period.</p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                        <p className="text-sm text-muted-foreground">We offer a 14-day money-back guarantee if you are not satisfied with the Pro features.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
