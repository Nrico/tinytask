"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Scale, Award, Coffee } from "lucide-react"

export default function TermsPage() {
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
                    <span className="paper-label">Terms of Service</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
                    Terms &amp; Conditions.
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl">
                    Last updated: May 24, 2026. Please read these terms carefully before using TinyTask. By accessing our site, you agree to be bound by these terms.
                </p>
            </div>

            {/* Core Pillars / Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="space-y-3 p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Scale className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-foreground">Fair Usage</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        Use our micro-utilities to get real work done. Please don&apos;t write bots to scrape or abuse our browser tools.
                    </p>
                </div>

                <div className="space-y-3 p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-foreground">As-Is Software</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        We build high-performance tools, but they are provided &quot;as-is&quot;. Verify final invoice and barcode values before print.
                    </p>
                </div>

                <div className="space-y-3 p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Coffee className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-foreground">Pro Subscriptions</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        Subscribing unlocks advanced tool parameters. Cancel anytime from your account settings with 1 click.
                    </p>
                </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-10 text-sm text-foreground/80 leading-relaxed border-t border-border/20 pt-10">
                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">1. Acceptance of Terms</h2>
                    <p>
                        By using the websites, tools, packages, and APIs associated with TinyTask (collectively, the &quot;Service&quot;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not access or use the Service.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">2. Description of Service</h2>
                    <p>
                        TinyTask offers a suite of browser-based utilities (e.g. delimiters, CSV scrubbers, safety signs, and greeting card templates) designed for local, private processing. We reserve the right to modify, suspend, or discontinue any tool or feature at any time without notice.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">3. User Responsibilities &amp; Acceptable Use</h2>
                    <p>
                        You are solely responsible for any content or files you process using our tools. You agree not to use the Service to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Violate any local, state, national, or international laws.</li>
                        <li>Attempt to interfere with or disrupt the operation of our infrastructure or networks.</li>
                        <li>Bulk-scrape pages, tools, or assets using automated scripts.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">4. Pro Subscriptions &amp; Billing</h2>
                    <p>
                        Some parts of the Service require a paid subscription (&quot;Pro Plan&quot;). Billing is handled through Stripe.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Subscriptions:</strong> Billed on a recurring monthly or annual basis.</li>
                        <li><strong>Cancellations:</strong> You can cancel your subscription at any time. You will continue to have access to Pro features until the end of your billing cycle.</li>
                        <li><strong>Refunds:</strong> If you are unhappy with the service, please contact us within 14 days of subscription renewal or signup for a full refund.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">5. Intellectual Property</h2>
                    <p>
                        TinyTask owns all code, custom graphics, styles, and branding associated with the Service. You retain full ownership and copyrights to all data, files, text, and images you input or compile using our tools.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">6. Disclaimer of Warranties</h2>
                    <p className="p-4 bg-muted/50 border-l-4 border-primary rounded-r-lg font-medium text-xs leading-normal">
                        🛡️ DISCLAIMER: THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. TINYTASK MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, REGARDING THE ACCURACY OF PROCESSED FILES, BARCODES, INVOICE MATH, OR DISPLAY CORRECTNESS. YOU USE THESE TOOLS AT YOUR OWN RISK.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">7. Limitation of Liability</h2>
                    <p>
                        In no event shall TinyTask or its developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools, even if notified of the possibility of such damage.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-extrabold text-foreground">8. Changes to Terms</h2>
                    <p>
                        We may revise these terms at any time. By continuing to use the Service after changes are posted, you agree to be bound by the updated terms.
                    </p>
                </section>
            </div>
        </div>
    )
}
