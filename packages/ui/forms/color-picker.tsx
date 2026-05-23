"use client"

import React from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@tinytask/utils';

interface ColorPickerProps {
    id?: string;
    label?: string;
    value: string;
    onChange: (color: string) => void;
    className?: string;
}

export function ColorPicker({
    id = "color-picker",
    label,
    value,
    onChange,
    className
}: ColorPickerProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <div className="flex gap-2">
                <input
                    id={id}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-12 p-1 border rounded-md cursor-pointer bg-white"
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 font-mono text-xs uppercase"
                />
            </div>
        </div>
    );
}
