"use client"

import React from 'react';
import { SignTemplate } from '@/lib/sign-templates';
import { oswald, inter } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { TriangleAlert, CircleAlert, Info, ShieldCheck, Ban } from 'lucide-react';

interface SignPreviewProps {
    template: SignTemplate;
    headline: string;
    bodyText: string;
    icon?: string;
}

export function SignPreview({ template, headline, bodyText, icon }: SignPreviewProps) {
    const renderIcon = () => {
        const iconProps = { className: "w-16 h-16 sm:w-24 sm:h-24 text-black" };
        switch (icon) {
            case 'triangle-alert': return <TriangleAlert {...iconProps} />;
            case 'circle-alert': return <CircleAlert {...iconProps} />;
            case 'info': return <Info {...iconProps} className="text-blue-600" />;
            case 'shield-check': return <ShieldCheck {...iconProps} className="text-green-600" />;
            case 'ban': return <Ban {...iconProps} className="text-red-600" />;
            default: return null;
        }
    };

    return (
        <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg border border-dashed min-h-[500px]">
            <div
                className="relative bg-white shadow-lg print:shadow-none w-[300px] sm:w-[500px] aspect-[3/4] sm:aspect-[4/3] flex flex-col border-4"
                style={{ borderColor: template.borderColor }}
            >
                {/* Header */}
                <div
                    className="w-full p-4 flex items-center justify-center"
                    style={{ backgroundColor: template.headerColor }}
                >
                    <h1
                        className={cn(oswald.className, "text-5xl sm:text-7xl font-bold tracking-tighter uppercase text-center")}
                        style={{ color: template.headerTextColor }}
                    >
                        {template.headerText}
                    </h1>
                </div>

                {/* Body */}
                <div className="flex-1 p-8 flex flex-col items-center justify-center gap-6 text-center bg-white">
                    {icon && (
                        <div className="mb-2">
                            {renderIcon()}
                        </div>
                    )}

                    {headline && (
                        <h2 className={cn(oswald.className, "text-3xl sm:text-5xl font-bold uppercase leading-tight")}>
                            {headline}
                        </h2>
                    )}

                    {bodyText && (
                        <p className={cn(inter.className, "text-lg sm:text-2xl font-medium whitespace-pre-wrap")}>
                            {bodyText}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
