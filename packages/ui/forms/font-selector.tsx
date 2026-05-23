"use client"

import React from 'react';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '@tinytask/utils';

interface FontSelectorProps {
    id?: string;
    label?: string;
    value: string;
    onChange: (font: string) => void;
    className?: string;
}

const FONTS = [
    { label: 'Sans Serif (Outfit)', value: 'var(--font-outfit)' },
    { label: 'Sans Serif (Inter)', value: 'var(--font-inter)' },
    { label: 'Serif (Playfair)', value: 'var(--font-playfair)' },
    { label: 'Headline (Oswald)', value: 'var(--font-oswald)' },
];

export function FontSelector({
    id = "font-selector",
    label = "Font Family",
    value,
    onChange,
    className
}: FontSelectorProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id={id}>
                    <SelectValue placeholder="Select font..." />
                </SelectTrigger>
                <SelectContent>
                    {FONTS.map(f => (
                        <SelectItem key={f.value} value={f.value}>
                            {f.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
