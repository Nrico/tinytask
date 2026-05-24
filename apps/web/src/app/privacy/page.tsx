"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Lock, EyeOff } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
                <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                </Link>
            </div>

            {/* Header */}
            <div className="text-left mb-12 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="paper-label">Privacy Policy</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
                    Your Privacy is Our Priority.
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl">
                    Last updated: May 24, 2026. We believe privacy is a fundamental right. TinyTask is designed from the ground up to respect your digital footprint.
                </p>
            </div>

            {/* Core Values / Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="space-y-3 p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <EyeOff className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-foreground">Zero Server Logs</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        Your text inputs, CSVs, PDF data, and images are processed completely in your browser. We never see it.
                    </p>
                </div>

                <div className="space-y-3 p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-foreground">Secure Payments</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        We partner with Stripe for secure billing. Your credit card information never touches our servers.
                    </p>
                </div>

                <div className="space-y-3 p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-foreground">GDPR & CCPA</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        You have full control over your account. Delete your account, brand kits, and invoice drafts at any time.
                    </p>
                </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-10 text-sm text-foreground/80 leading-relaxed border-t border-border/20 pt-10">
                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">1. Information We Do Not Collect (Local Processing)</h2>
                    <p>
                        Most tools in the TinyTask suite (including the CSV Scrubber, case transformers, list un-breakers, name tent creators, QR generators, and image optimizers) are **100% client-side**. All data transformations, text edits, and file processing occur locally on your machine via JavaScript. None of your data payloads are transmitted to our servers.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">2. Information We Collect</h2>
                    <p>
                        We only collect information that is strictly necessary to provide our services:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Account Information:</strong> If you sign up or log in, we store your email address and profile details using Google Firebase Authentication.
                        </li>
                        <li>
                            <strong>Billing Information:</strong> If you upgrade to Pro, payment processing is handled securely by Stripe. We do not store your credit card numbers.
                        </li>
                        <li>
                            <strong>Brand Kit Data:</strong> Branded suite settings, colors, and logo URLs (if uploaded) are saved in our database to synchronize across your authenticated sessions.
                        </li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">3. Analytics & Cookies</h2>
                    <p>
                        We do not use invasive tracking cookies. We may use privacy-respecting, aggregated analytics tools to monitor general site traffic, page views, and performance. Standard functional cookies are only used to maintain your logged-in session.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">4. Third-Party Services</h2>
                    <p>
                        TinyTask utilizes reliable third-party platforms to power specific functionality:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Stripe:</strong> Payment gateways and subscription management.</li>
                        <li><strong>Google Firebase:</strong> Authentication and data hosting for your settings/portals.</li>
                        <li><strong>Vercel / Cloudflare:</strong> Hosting infrastructure and CDN delivery.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">5. Data Retention & Deletion</h2>
                    <p>
                        You can delete your account and all associated brand data at any time from your account dashboard. Local state synced in your URL parameters or saved in `localStorage` can be cleared instantly by clearing your browser cache.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy or how we handle data, please contact us at <a href="mailto:privacy@tinytask.com" className="font-bold underline text-primary">privacy@tinytask.com</a>.
                    </p>
                </section>
            </div>
        </div>
    )
}
