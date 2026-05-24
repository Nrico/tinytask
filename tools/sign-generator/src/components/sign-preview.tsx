"use client"

import React from 'react';
import { SignTemplate } from '../lib/sign-templates';
import { oswald, inter } from '@/lib/fonts';
import { cn } from '@tinytask/utils';
import { 
    TriangleAlert, 
    CircleAlert, 
    Info, 
    ShieldCheck, 
    Ban, 
    CircleParking, 
    Lock, 
    Clock, 
    CalendarX, 
    Sparkles, 
    Megaphone, 
    MapPin, 
    ArrowRight, 
    ArrowLeft 
} from 'lucide-react';

interface SignPreviewProps {
    template: SignTemplate;
    orientation: 'portrait' | 'landscape';
    headerText: string;
    headline: string;
    bodyText: string;
    icon?: string;
}

export function SignPreview({ 
    template, 
    orientation,
    headerText, 
    headline, 
    bodyText, 
    icon 
}: SignPreviewProps) {
    const renderIcon = () => {
        const iconProps = { className: "w-16 h-16 sm:w-24 sm:h-24 text-black" };
        switch (icon) {
            case 'triangle-alert': return <TriangleAlert {...iconProps} />;
            case 'circle-alert': return <CircleAlert {...iconProps} className="text-amber-500" />;
            case 'info': return <Info {...iconProps} className="text-blue-600" />;
            case 'shield-check': return <ShieldCheck {...iconProps} className="text-green-600" />;
            case 'ban': return <Ban {...iconProps} className="text-red-600" />;
            case 'parking': return <CircleParking {...iconProps} className="text-blue-700" />;
            case 'lock': return <Lock {...iconProps} className="text-slate-800" />;
            case 'clock': return <Clock {...iconProps} className="text-cyan-600" />;
            case 'calendar-x': return <CalendarX {...iconProps} className="text-rose-600" />;
            case 'sparkles': return <Sparkles {...iconProps} className="text-amber-500" />;
            case 'megaphone': return <Megaphone {...iconProps} className="text-teal-600" />;
            case 'map-pin': return <MapPin {...iconProps} className="text-rose-600" />;
            case 'arrow-right': return <ArrowRight {...iconProps} className="text-slate-700" />;
            case 'arrow-left': return <ArrowLeft {...iconProps} className="text-slate-700" />;
            default: return null;
        }
    };

    return (
        <div className="flex items-center justify-center p-4 bg-slate-100/40 rounded-xl border border-dashed border-slate-300 w-full min-h-[520px] print:p-0 print:border-none print:bg-white select-none">
            <div
                id="sign-print-area"
                className="flex items-center justify-center w-full h-full"
            >
                <div
                    className={cn(
                        "sign-sheet-box relative bg-white shadow-lg print:shadow-none flex flex-col border-8 transition-all",
                        orientation === 'portrait' 
                            ? "w-[300px] sm:w-[400px] aspect-[3/4]" 
                            : "w-[300px] sm:w-[500px] aspect-[4/3]"
                    )}
                    style={{ borderColor: template.borderColor }}
                >
                    {/* Header Banner */}
                    <div
                        className="sign-header-bar w-full p-4 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: template.headerColor }}
                    >
                        <h1
                            className={cn(oswald.className, "text-3xl sm:text-5xl font-bold tracking-tight uppercase text-center")}
                            style={{ color: template.headerTextColor }}
                        >
                            {headerText || template.headerText}
                        </h1>
                    </div>

                    {/* Body announcement space */}
                    <div className="sign-body-area flex-1 p-6 sm:p-10 flex flex-col items-center justify-center gap-4 sm:gap-6 text-center bg-white min-h-0 overflow-hidden">
                        {icon && icon !== 'none' && (
                            <div className="flex-shrink-0">
                                {renderIcon()}
                            </div>
                        )}

                        {headline && (
                            <h2 className={cn(oswald.className, "text-2xl sm:text-4xl font-extrabold uppercase leading-none tracking-tight text-slate-900")}>
                                {headline}
                            </h2>
                        )}

                        {bodyText && (
                            <p className={cn(inter.className, "text-base sm:text-xl font-semibold text-slate-600 whitespace-pre-wrap leading-normal mt-1")}>
                                {bodyText}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
