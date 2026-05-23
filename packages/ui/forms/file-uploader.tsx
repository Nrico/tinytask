"use client"

import React, { useCallback } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '@tinytask/utils';

interface FileUploaderProps {
    id?: string;
    onFileSelect: (file: File) => void;
    selectedFileName?: string | null;
    accept?: string;
    allowedExtensions?: string[]; // e.g. ['.xlsx', '.csv']
    description?: string;
    className?: string;
    icon?: React.ReactNode;
}

export function FileUploader({
    id = "file-upload",
    onFileSelect,
    selectedFileName,
    accept = "*",
    allowedExtensions = [],
    description = "Upload a file to begin",
    className,
    icon
}: FileUploaderProps) {
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (allowedExtensions.length > 0) {
                const matches = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext.toLowerCase()));
                if (!matches) {
                    alert(`Invalid file extension. Allowed extensions are: ${allowedExtensions.join(', ')}`);
                    return;
                }
            }
            onFileSelect(file);
        }
    }, [onFileSelect, allowedExtensions]);

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
                "border-2 border-dashed rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer bg-white",
                selectedFileName ? "border-primary bg-primary/5 hover:bg-primary/5" : "border-slate-300",
                className
            )}
        >
            <input
                type="file"
                id={id}
                className="hidden"
                accept={accept}
                onChange={handleChange}
            />
            <label htmlFor={id} className="cursor-pointer flex flex-col items-center gap-4">
                <div className={cn(
                    "p-4 rounded-full bg-slate-50 border border-slate-100 shadow-sm transition-transform duration-300",
                    selectedFileName && "bg-white text-primary scale-110"
                )}>
                    {selectedFileName ? (
                        <CheckCircle2 className="w-8 h-8 text-primary" />
					) : (
                        icon || <Upload className="w-8 h-8 text-slate-400" />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-sm text-slate-800">
                        {selectedFileName ? selectedFileName : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-slate-400">
                        {description}
                    </p>
                </div>
            </label>
        </div>
    );
}
