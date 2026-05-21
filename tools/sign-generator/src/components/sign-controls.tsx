"use client"

import React from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tinytask/ui/forms/select";
import { signTemplates, SignType } from '../lib/sign-templates';
import { Printer, TriangleAlert, CircleAlert, Info, ShieldCheck, Ban } from 'lucide-react';

interface SignControlsProps {
    templateId: SignType;
    onTemplateChange: (id: SignType) => void;
    headline: string;
    onHeadlineChange: (text: string) => void;
    bodyText: string;
    onBodyTextChange: (text: string) => void;
    icon: string;
    onIconChange: (icon: string) => void;
    onPrint: () => void;
}

export function SignControls({
    templateId,
    onTemplateChange,
    headline,
    onHeadlineChange,
    bodyText,
    onBodyTextChange,
    icon,
    onIconChange,
    onPrint
}: SignControlsProps) {
    return (
        <div className="flex flex-col gap-6 p-4 border rounded-lg bg-background h-full">
            <div className="space-y-4">
                <h3 className="font-semibold">Sign Settings</h3>

                <div className="space-y-2">
                    <Label>Sign Type</Label>
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

                <div className="space-y-2">
                    <Label>Icon</Label>
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { id: 'none', icon: <span className="text-xs">None</span> },
                            { id: 'triangle-alert', icon: <TriangleAlert className="w-4 h-4" /> },
                            { id: 'circle-alert', icon: <CircleAlert className="w-4 h-4" /> },
                            { id: 'ban', icon: <Ban className="w-4 h-4" /> },
                            { id: 'info', icon: <Info className="w-4 h-4" /> },
                            { id: 'shield-check', icon: <ShieldCheck className="w-4 h-4" /> },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                variant={icon === item.id ? "default" : "outline"}
                                size="icon"
                                onClick={() => onIconChange(item.id)}
                                className="w-10 h-10"
                                title={item.id}
                            >
                                {item.icon}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                        value={headline}
                        onChange={(e) => onHeadlineChange(e.target.value)}
                        placeholder="e.g. HIGH VOLTAGE"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Body Text</Label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={bodyText}
                        onChange={(e) => onBodyTextChange(e.target.value)}
                        placeholder="e.g. Authorized personnel only."
                    />
                </div>
            </div>

            <div className="mt-auto pt-4 border-t">
                <Button className="w-full" onClick={onPrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print Sign
                </Button>
            </div>
        </div>
    );
}
