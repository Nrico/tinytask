"use client"

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Share2, ShieldCheck, HelpCircle, X, Play } from 'lucide-react';
import { cn } from '@tinytask/utils';
import { TOOL_HELP } from './tool-help';

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
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const pathname = usePathname();

    const helpData = TOOL_HELP[pathname || ''];

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    return (
        <div className={cn("flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-card/50", className)}>
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
                    {/* Privacy Badge */}
                    <div className="mt-3 flex items-start gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/80 rounded-lg p-2 text-[10px] font-medium leading-normal print:hidden select-none">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>100% Client-Side: Your data never leaves your computer. No servers, zero logs.</span>
                    </div>
                    {/* Share & Help Buttons */}
                    <div className="mt-4 flex items-center gap-4 print:hidden">
                        <button
                            onClick={handleShare}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer select-none transition-colors"
                            type="button"
                        >
                            <Share2 className="w-3.5 h-3.5" /> {shared ? "Link Copied!" : "Share this Tool"}
                        </button>
                        {helpData && (
                            <button
                                onClick={() => setIsHelpOpen(true)}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer select-none transition-colors"
                                type="button"
                            >
                                <HelpCircle className="w-3.5 h-3.5" /> How to Use
                            </button>
                        )}
                    </div>
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
                                    <details key={idx} className="group border border-border/50 rounded-lg bg-card/40 p-2 text-xs">
                                        <summary className="font-semibold text-slate-700 cursor-pointer list-none flex justify-between items-center group-open:text-indigo-600 transition-colors select-none">
                                            <span className="pr-2">{faq.question}</span>
                                            <span className="text-[9px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                                        </summary>
                                        <p className="mt-1.5 text-slate-500 leading-relaxed border-t pt-1.5 border-border/50">
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
                    <div className="p-6 border-t mt-auto flex-shrink-0 bg-card/25 print:hidden">
                        {actions}
                    </div>
                )}
            </aside>

            {/* Right/Middle Main Preview Content Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 flex flex-col items-center justify-center min-h-0 bg-card/30 print:p-0 print:bg-white print:block print:overflow-visible">
                {previewContent}
            </main>

            {/* Help Modal Portal */}
            {isHelpOpen && helpData && typeof document !== "undefined" && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setIsHelpOpen(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsHelpOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors z-50 backdrop-blur-sm cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Area */}
                        <div className="aspect-video bg-slate-100 relative flex items-center justify-center overflow-hidden">
                            <img
                                src={helpData.imageUrl}
                                alt={helpData.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <h2 className="text-white text-2xl font-bold shadow-sm">{helpData.title}</h2>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {helpData.description}
                            </p>

                            {helpData.videoUrl && (
                                <div className="flex gap-4">
                                    <a
                                        href={helpData.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1"
                                    >
                                        <button className="w-full gap-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center text-sm h-11 transition-colors cursor-pointer">
                                            <Play className="w-4 h-4 fill-current" /> Watch Tutorial
                                        </button>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
