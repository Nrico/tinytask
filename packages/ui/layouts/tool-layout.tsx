"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { cn } from '@tinytask/utils';

export interface FAQItem {
    question: string;
    answer: string;
}

interface ToolLayoutProps {
    title: string;
    description: string;
    backUrl?: string;
    sidebarContent: React.ReactNode;
    previewContent: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    faqs?: FAQItem[];
}

export function ToolLayout({
    title,
    description,
    backUrl = "/",
    sidebarContent,
    previewContent,
    actions,
    className,
    faqs
}: ToolLayoutProps) {
    const [shared, setShared] = useState(false);

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    return (
        <div className={cn("flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-50/50", className)}>
            {/* Left Sidebar Settings Panel */}
            <aside className="w-full lg:w-80 bg-background border-r flex flex-col shadow-sm z-10 h-full">
                {/* Sidebar Header */}
                <div className="p-6 border-b flex-shrink-0">
                    <Link href={backUrl} className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 select-none print:hidden">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Suite
                    </Link>
                    <h2 className="font-bold text-xl tracking-tight text-slate-800 flex items-center gap-2">
                        {title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {description}
                    </p>
                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer select-none transition-colors print:hidden"
                        type="button"
                    >
                        <Share2 className="w-3.5 h-3.5" /> {shared ? "Link Copied!" : "Share this Tool"}
                    </button>
                </div>

                {/* Sidebar Body (Scrollable settings) */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto min-h-0 print:hidden">
                    {sidebarContent}

                    {/* Collapsible FAQ Section for SEO */}
                    {faqs && faqs.length > 0 && (
                        <div className="border-t pt-4 mt-6">
                            <h3 className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-3">Frequently Asked Questions</h3>
                            <div className="space-y-2">
                                {faqs.map((faq, idx) => (
                                    <details key={idx} className="group border border-slate-100 rounded-lg bg-slate-50/50 p-2 text-xs">
                                        <summary className="font-semibold text-slate-700 cursor-pointer list-none flex justify-between items-center group-open:text-indigo-600 transition-colors select-none">
                                            <span className="pr-2">{faq.question}</span>
                                            <span className="text-[9px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                                        </summary>
                                        <p className="mt-1.5 text-slate-500 leading-relaxed border-t pt-1.5 border-slate-100">
                                            {faq.answer}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Optional Bottom Actions Panel inside Sidebar */}
                {actions && (
                    <div className="p-6 border-t mt-auto flex-shrink-0 bg-slate-50/40 print:hidden">
                        {actions}
                    </div>
                )}
            </aside>

            {/* Right/Middle Main Preview Content Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 flex flex-col items-center justify-center min-h-0 bg-slate-100/30 print:p-0 print:bg-white print:block print:overflow-visible">
                {previewContent}
            </main>
        </div>
    );
}
