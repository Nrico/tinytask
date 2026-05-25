"use client"

import React from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tinytask/ui/forms/select";
import { ColorPicker } from '@tinytask/ui/forms/color-picker';
import { signTemplates, SignType } from '../lib/sign-templates';
import { 
    Printer, 
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
    ArrowLeft,
    SquarePlay
} from 'lucide-react';

interface SignControlsProps {
    templateId: SignType;
    onTemplateChange: (id: SignType) => void;
    orientation: 'portrait' | 'landscape';
    onOrientationChange: (orient: 'portrait' | 'landscape') => void;
    headerText: string;
    onHeaderTextChange: (text: string) => void;
    headline: string;
    onHeadlineChange: (text: string) => void;
    bodyText: string;
    onBodyTextChange: (text: string) => void;
    icon: string;
    onIconChange: (icon: string) => void;

    // Custom colors (only shown for custom templateId)
    headerColor: string;
    onHeaderColorChange: (color: string) => void;
    headerTextColor: string;
    onHeaderTextColorChange: (color: string) => void;
    borderColor: string;
    onBorderColorChange: (color: string) => void;
    
    onPrint: () => void;
}

export function SignControls({
    templateId,
    onTemplateChange,
    orientation,
    onOrientationChange,
    headerText,
    onHeaderTextChange,
    headline,
    onHeadlineChange,
    bodyText,
    onBodyTextChange,
    icon,
    onIconChange,
    headerColor,
    onHeaderColorChange,
    headerTextColor,
    onHeaderTextColorChange,
    borderColor,
    onBorderColorChange,
    onPrint
}: SignControlsProps) {
    return (
        <div className="flex flex-col gap-6 p-4 border rounded-lg bg-background h-full max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 text-sm">Sign Settings</h3>

                {/* Sign Orientation */}
                <div className="space-y-2">
                    <Label>Sign Orientation</Label>
                    <div className="flex gap-2">
                        <Button
                            variant={orientation === 'portrait' ? 'default' : 'outline'}
                            onClick={() => onOrientationChange('portrait')}
                            className="flex-1 text-xs"
                            size="sm"
                        >
                            Portrait (Tall)
                        </Button>
                        <Button
                            variant={orientation === 'landscape' ? 'default' : 'outline'}
                            onClick={() => onOrientationChange('landscape')}
                            className="flex-1 text-xs"
                            size="sm"
                        >
                            Landscape (Wide)
                        </Button>
                    </div>
                </div>

                {/* Sign Template Selector */}
                <div className="space-y-2">
                    <Label>Sign Layout Preset</Label>
                    <Select
                        value={templateId}
                        onValueChange={(value) => onTemplateChange(value as SignType)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {signTemplates.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                    {t.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Custom Color Options */}
                {templateId === 'custom' && (
                    <div className="p-3 border rounded-lg bg-card/100 space-y-3 animate-in fade-in slide-in-from-top-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Colors</Label>
                        <ColorPicker
                            label="Header Background"
                            value={headerColor}
                            onChange={onHeaderColorChange}
                            className="text-xs"
                        />
                        <ColorPicker
                            label="Header Text Color"
                            value={headerTextColor}
                            onChange={onHeaderTextColorChange}
                            className="text-xs"
                        />
                        <ColorPicker
                            label="Border Color"
                            value={borderColor}
                            onChange={onBorderColorChange}
                            className="text-xs"
                        />
                    </div>
                )}

                {/* Editable Header Text */}
                <div className="space-y-2">
                    <Label>Header Banner Text</Label>
                    <Input
                        value={headerText}
                        onChange={(e) => onHeaderTextChange(e.target.value)}
                        placeholder="e.g. NOTICE"
                    />
                </div>

                {/* Expanded Icons list */}
                <div className="space-y-2">
                    <Label>Sign Symbol / Icon</Label>
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { id: 'none', title: 'None', icon: <span className="text-[10px]">None</span> },
                            { id: 'triangle-alert', title: 'Danger Alert', icon: <TriangleAlert className="w-4 h-4 text-red-500" /> },
                            { id: 'circle-alert', title: 'Warning Alert', icon: <CircleAlert className="w-4 h-4 text-amber-500" /> },
                            { id: 'info', title: 'Info', icon: <Info className="w-4 h-4 text-blue-500" /> },
                            { id: 'shield-check', title: 'Safety OK', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
                            { id: 'ban', title: 'Prohibited', icon: <Ban className="w-4 h-4 text-red-600" /> },
                            { id: 'parking', title: 'Parking', icon: <CircleParking className="w-4 h-4 text-primary" /> },
                            { id: 'lock', title: 'Security Lock', icon: <Lock className="w-4 h-4 text-slate-700" /> },
                            { id: 'clock', title: 'Time / Hours', icon: <Clock className="w-4 h-4 text-cyan-600" /> },
                            { id: 'calendar-x', title: 'Cancelled', icon: <CalendarX className="w-4 h-4 text-rose-500" /> },
                            { id: 'sparkles', title: 'Celebration', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
                            { id: 'megaphone', title: 'Announcement', icon: <Megaphone className="w-4 h-4 text-teal-600" /> },
                            { id: 'map-pin', title: 'Room / Location', icon: <MapPin className="w-4 h-4 text-rose-600" /> },
                            { id: 'arrow-right', title: 'Direction Right', icon: <ArrowRight className="w-4 h-4 text-slate-600" /> },
                            { id: 'arrow-left', title: 'Direction Left', icon: <ArrowLeft className="w-4 h-4 text-slate-600" /> },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                type="button"
                                variant={icon === item.id ? "default" : "outline"}
                                size="icon"
                                onClick={() => onIconChange(item.id)}
                                className="w-full h-10 flex items-center justify-center p-0.5 border cursor-pointer"
                                title={item.title}
                            >
                                {item.icon}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Headline Input */}
                <div className="space-y-2">
                    <Label>Main Headline</Label>
                    <Input
                        value={headline}
                        onChange={(e) => onHeadlineChange(e.target.value)}
                        placeholder="e.g. VISITOR REGISTRATION"
                    />
                </div>

                {/* Description Body Text */}
                <div className="space-y-2">
                    <Label>Sub-text Message</Label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={bodyText}
                        onChange={(e) => onBodyTextChange(e.target.value)}
                        placeholder="e.g. Please register at the office before entering."
                    />
                </div>
            </div>

            <div className="mt-auto pt-4 border-t">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm gap-2" onClick={onPrint}>
                    <Printer className="w-4 h-4" />
                    Print Sign
                </Button>
            </div>
        </div>
    );
}
