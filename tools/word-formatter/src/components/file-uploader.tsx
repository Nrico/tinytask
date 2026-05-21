"use client"

import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { cn } from '@tinytask/utils';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
}

export function FileUploader({ onFileSelect, selectedFile }: FileUploaderProps) {
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.docx')) {
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer",
                selectedFile ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            )}
        >
            <input
                type="file"
                id="word-upload"
                className="hidden"
                accept=".docx"
                onChange={handleChange}
            />
            <label htmlFor="word-upload" className="cursor-pointer flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-background shadow-sm">
                    {selectedFile ? (
                        <FileText className="w-8 h-8 text-primary" />
                    ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="font-medium">
                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Supports .docx files
                    </p>
                </div>
            </label>
        </div>
    );
}
