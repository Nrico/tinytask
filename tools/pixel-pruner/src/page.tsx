"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Label } from '@tinytask/ui/forms/label';
import { ToolLayout } from '@tinytask/ui/layouts/tool-layout';
import { FileUploader } from '@tinytask/ui/forms/file-uploader';
import { Slider } from '@tinytask/ui/forms/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tinytask/ui/forms/select';
import { Image as ImageIcon, Download, RefreshCw, Scale, Sparkles, Info } from 'lucide-react';
import { cn } from '@tinytask/utils';

export default function PixelPrunerPage() {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [processedSize, setProcessedSize] = useState(0);
    const [maxWidth, setMaxWidth] = useState(1200);
    const [quality, setQuality] = useState(80);
    const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
    const [previewMode, setPreviewMode] = useState<'optimized' | 'original'>('optimized');
    const [isProcessing, setIsProcessing] = useState(false);

    const [origWidth, setOrigWidth] = useState<number | null>(null);
    const [origHeight, setOrigHeight] = useState<number | null>(null);
    const [newWidth, setNewWidth] = useState<number | null>(null);
    const [newHeight, setNewHeight] = useState<number | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Revoke previous preview URL when previewUrl changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileSelect = (file: File) => {
        setImage(file);
        setOriginalSize(file.size);
        setPreviewUrl(URL.createObjectURL(file));
        // Reset processed details until processing completes
        setProcessedSize(0);
        setOrigWidth(null);
        setOrigHeight(null);
        setNewWidth(null);
        setNewHeight(null);
    };

    const processImage = () => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);

        const img = new Image();
        img.src = URL.createObjectURL(image);
        img.onload = () => {
            setOrigWidth(img.width);
            setOrigHeight(img.height);

            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d')!;

            // Calculate new dimensions
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            setNewWidth(width);
            setNewHeight(height);

            // Draw image
            ctx.drawImage(img, 0, 0, width, height);

            // Determine output mime-type and quality setting
            const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
            const qualityVal = format === 'png' ? undefined : quality / 100;

            // Compress
            canvas.toBlob((blob) => {
                if (blob) {
                    setProcessedSize(blob.size);
                    setIsProcessing(false);
                } else {
                    setIsProcessing(false);
                }
            }, mimeType, qualityVal);

            // Clean up temporary object URL
            URL.revokeObjectURL(img.src);
        };
        img.onerror = () => {
            setIsProcessing(false);
        };
    };

    // Auto-process when controls change
    useEffect(() => {
        if (image) {
            const timer = setTimeout(processImage, 500); // Debounce
            return () => clearTimeout(timer);
        }
    }, [image, maxWidth, quality, format]);

    const handleDownload = () => {
        if (!canvasRef.current || !image) return;
        const link = document.createElement('a');
        const ext = format === 'jpeg' ? 'jpg' : format;
        link.download = `optimized_${image.name.split('.')[0]}.${ext}`;
        
        const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
        const qualityVal = format === 'png' ? undefined : quality / 100;
        
        link.href = canvasRef.current.toDataURL(mimeType, qualityVal);
        link.click();
    };

    const sidebarContent = image ? (
        <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-2">
                <Label htmlFor="output-format">Output Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as 'jpeg' | 'png' | 'webp')}>
                    <SelectTrigger id="output-format" className="w-full bg-white">
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="jpeg">JPEG (Compressed)</SelectItem>
                        <SelectItem value="webp">WebP (Highly Compressed)</SelectItem>
                        <SelectItem value="png">PNG (Lossless)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Slider: Max Width */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label>Max Width</Label>
                    <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-muted-foreground">{maxWidth}px</span>
                </div>
                <Slider
                    value={[maxWidth]}
                    onValueChange={(v) => setMaxWidth(v[0])}
                    min={100}
                    max={4000}
                    step={50}
                    className="cursor-pointer"
                />
                <div className="text-[10px] text-muted-foreground flex justify-between">
                    <span>100px</span>
                    <span>Original: {origWidth ? `${origWidth}px` : 'loading...'}</span>
                    <span>4000px</span>
                </div>
            </div>

            {/* Slider: Quality (conditionally shown) */}
            {format !== 'png' ? (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label>Quality</Label>
                        <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-muted-foreground">{quality}%</span>
                    </div>
                    <Slider
                        value={[quality]}
                        onValueChange={(v) => setQuality(v[0])}
                        min={10}
                        max={100}
                        step={5}
                        className="cursor-pointer"
                    />
                    <div className="text-[10px] text-muted-foreground flex justify-between">
                        <span>10% (High compression)</span>
                        <span>100% (Best quality)</span>
                    </div>
                </div>
            ) : (
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed flex gap-2">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-slate-700">Lossless Compression</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">PNG uses lossless encoding, meaning image quality settings do not apply.</p>
                    </div>
                </div>
            )}

            {/* Stats Block */}
            <div className="pt-4 border-t border-slate-100 space-y-3.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" /> Compression Details
                </h3>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 border rounded-lg p-2.5 space-y-1">
                        <span className="text-slate-400 font-medium">Original</span>
                        <div className="font-bold text-slate-700 text-sm truncate">{formatSize(originalSize)}</div>
                        {origWidth && origHeight && (
                            <div className="text-[10px] text-slate-400 font-mono">{origWidth} × {origHeight}</div>
                        )}
                    </div>
                    <div className={cn(
                        "border rounded-lg p-2.5 space-y-1 transition-colors",
                        isProcessing ? "bg-slate-50 border-slate-200" : "bg-emerald-50/20 border-emerald-100"
                    )}>
                        <span className="text-slate-400 font-medium">Pruned</span>
                        <div className="font-bold text-emerald-700 text-sm truncate">
                            {isProcessing ? 'Calculating...' : formatSize(processedSize)}
                        </div>
                        {newWidth && newHeight && (
                            <div className="text-[10px] text-emerald-600 font-mono">{newWidth} × {newHeight}</div>
                        )}
                    </div>
                </div>

                {!isProcessing && processedSize > 0 && originalSize > processedSize && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 text-emerald-800 font-medium">
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Saved Space</span>
                        </div>
                        <span className="font-black text-xs text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                            {Math.round((1 - processedSize / originalSize) * 100)}% saved
                        </span>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500 space-y-2 leading-relaxed">
                <p className="font-semibold text-slate-700">How to use:</p>
                <ol className="list-decimal pl-4 space-y-1">
                    <li>Select or drop an image to optimize.</li>
                    <li>Adjust target dimensions and format in the sidebar.</li>
                    <li>Verify compression ratio and savings in real time.</li>
                    <li>Download your pruned file instantly.</li>
                </ol>
            </div>
        </div>
    );

    const actions = image ? (
        <div className="space-y-2">
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm flex items-center justify-center gap-2" onClick={handleDownload} disabled={isProcessing}>
                <Download className="w-4 h-4" /> Download Image
            </Button>
            <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-slate-600 py-1.5 h-auto" onClick={() => { setImage(null); setProcessedSize(0); setOrigWidth(null); setOrigHeight(null); setNewWidth(null); setNewHeight(null); setPreviewMode('optimized'); }}>
                Upload Different File
            </Button>
        </div>
    ) : null;

    const previewContent = image ? (
        <div className="flex flex-col h-full w-full bg-slate-900/5 rounded-xl border border-slate-200 overflow-hidden shadow-inner relative max-w-2xl">
            {/* Preview Toolbar */}
            <div className="p-3 border-b border-slate-200/80 bg-white flex justify-between items-center select-none flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview</span>
                    {!isProcessing && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 border rounded px-1.5 py-0.5 font-medium">
                            {previewMode === 'optimized' ? 'Pruned' : 'Original'}
                        </span>
                    )}
                </div>
                
                {/* Toggle tabs */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border">
                    <button
                        onClick={() => setPreviewMode('optimized')}
                        className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md font-medium transition-all",
                            previewMode === 'optimized' 
                                ? "bg-white text-slate-700 shadow-sm font-semibold" 
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Pruned
                    </button>
                    <button
                        onClick={() => setPreviewMode('original')}
                        className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md font-medium transition-all",
                            previewMode === 'original' 
                                ? "bg-white text-slate-700 shadow-sm font-semibold" 
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Original
                    </button>
                </div>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 relative min-h-[350px]">
                {previewMode === 'optimized' ? (
                    <canvas 
                        ref={canvasRef} 
                        className="max-w-full max-h-[500px] shadow-lg bg-white border border-slate-200 rounded-lg object-contain" 
                    />
                ) : (
                    <img 
                        src={previewUrl || ''} 
                        alt="Original Uploaded File" 
                        className="max-w-full max-h-[500px] shadow-lg bg-white border border-slate-200 rounded-lg object-contain" 
                    />
                )}
                
                {isProcessing && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm z-20">
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="w-7 h-7 animate-spin text-cyan-600" />
                            <span className="text-xs font-semibold text-slate-600">Optimizing...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div className="max-w-xl w-full">
            <FileUploader
                onFileSelect={handleFileSelect}
                selectedFileName={null}
                accept="image/png, image/jpeg, image/webp"
                allowedExtensions={['.png', '.jpg', '.jpeg', '.webp']}
                description="Supports PNG, JPEG, and WebP images"
                icon={<ImageIcon className="w-8 h-8 text-cyan-600" />}
            />
        </div>
    );

    return (
        <ToolLayout
            title="Pixel Pruner"
            description="Resize and compress images instantly in your browser."
            sidebarContent={sidebarContent}
            previewContent={previewContent}
            actions={actions}
        />
    );
}
