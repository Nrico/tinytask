"use client"

import React from 'react';
import { DocStyle } from '@/lib/word-utils';
import { cn } from '@/lib/utils';
import { FileText, BookOpen, Scale } from 'lucide-react';

interface StyleSelectorProps {
    selectedStyle: DocStyle;
    onSelect: (style: DocStyle) => void;
}

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
    const styles: { id: DocStyle; label: string; description: string; icon: React.ReactNode }[] = [
        {
            id: 'modern',
            label: 'Modern Report',
            description: 'Clean sans-serif font (Calibri), 1.15 spacing. Great for business reports.',
            icon: <FileText className="w-6 h-6" />,
        },
        {
            id: 'apa',
            label: 'APA Style',
            description: 'Times New Roman, double spaced, indented paragraphs. Standard for academic papers.',
            icon: <BookOpen className="w-6 h-6" />,
        },
        {
            id: 'legal',
            label: 'Legal Document',
            description: 'Arial, single spaced, justified text. Professional look for contracts.',
            icon: <Scale className="w-6 h-6" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {styles.map((style) => (
                <div
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    className={cn(
                        "cursor-pointer rounded-lg border-2 p-4 hover:bg-muted/50 transition-all",
                        selectedStyle === style.id ? "border-primary bg-primary/5" : "border-muted"
                    )}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                            "p-2 rounded-full",
                            selectedStyle === style.id ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                            {style.icon}
                        </div>
                        <h3 className="font-semibold">{style.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {style.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
