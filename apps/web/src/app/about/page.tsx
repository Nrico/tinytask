"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Heart } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl sm:px-6 lg:px-8">
            {/* Hero */}
            <div className="text-center mb-20 space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">We build tiny tools for <span className="text-primary">big ideas</span>.</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    TinyTask is a collection of premium, no-nonsense productivity tools designed to help you get work done faster.
                </p>
            </div>

            {/* Mission */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="space-y-4 p-6 bg-card rounded-xl border border-border/80">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">Speed First</h3>
                    <p className="text-muted-foreground text-sm">
                        We believe tools should be instant. No loading screens, no complex setups. Just click and go.
                    </p>
                </div>
                <div className="space-y-4 p-6 bg-card rounded-xl border border-border/80">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">Privacy Focused</h3>
                    <p className="text-muted-foreground text-sm">
                        Most of our tools run entirely in your browser. Your data stays on your device, where it belongs.
                    </p>
                </div>
                <div className="space-y-4 p-6 bg-card rounded-xl border border-border/80">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">User Centric</h3>
                    <p className="text-muted-foreground text-sm">
                        We build what you need. No bloat, no unnecessary features. Just simple, effective utilities.
                    </p>
                </div>
            </div>

            {/* Story */}
            <div className="prose prose-slate max-w-none mb-20">
                <h2 className="text-3xl font-bold tracking-tight mb-6">Our Story</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    TinyTask started as a simple idea: why are most online tools so complicated? You just want to crop an image, generate a QR code, or clean up some text. You shouldn&apos;t have to sign up, navigate through ads, or deal with slow servers.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    We decided to build a suite of &quot;micro-tools&quot; that do one thing and do it well. We focused on performance, privacy, and design. What began as a single script has grown into a comprehensive toolkit used by thousands of people every day.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Today, TinyTask is dedicated to making your digital life a little bit easier, one task at a time.
                </p>
            </div>

            {/* CTA */}
            <div className="bg-[#231d19] text-white rounded-2xl p-12 text-center space-y-6">
                <h2 className="text-3xl font-bold">Ready to get to work?</h2>
                <p className="text-slate-300 max-w-xl mx-auto">
                    Explore our suite of tools and see how much time you can save today.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/">
                        <Button size="lg" variant="secondary" className="gap-2">
                            Explore Tools <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
