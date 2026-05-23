"use client"

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@tinytask/utils';

interface ToolLayoutProps {
    title: string;
    description: string;
    backUrl?: string;
    sidebarContent: React.ReactNode;
    previewContent: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

export function ToolLayout({
    title,
    description,
    backUrl = "/",
    sidebarContent,
    previewContent,
    actions,
    className
}: ToolLayoutProps) {
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
                </div>

                {/* Sidebar Body (Scrollable settings) */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto min-h-0 print:hidden">
                    {sidebarContent}
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
