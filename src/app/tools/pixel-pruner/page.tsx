"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Upload, Image as ImageIcon, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Slider } from "@/components/ui/slider"

export default function PixelPrunerPage() {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [processedSize, setProcessedSize] = useState(0);
    const [maxWidth, setMaxWidth] = useState(1200);
    const [quality, setQuality] = useState(80);
    const [isProcessing, setIsProcessing] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setOriginalSize(file.size);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const processImage = () => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);

        const img = new Image();
        img.src = URL.createObjectURL(image);
        img.onload = () => {
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

            // Draw image
            ctx.drawImage(img, 0, 0, width, height);

            // Compress
            canvas.toBlob((blob) => {
                if (blob) {
                    setProcessedSize(blob.size);
                    setIsProcessing(false);
                }
            }, 'image/jpeg', quality / 100);
        };
    };

    // Auto-process when controls change
    useEffect(() => {
        if (image) {
            const timer = setTimeout(processImage, 500); // Debounce
            return () => clearTimeout(timer);
        }
    }, [image, maxWidth, quality]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `optimized_${image?.name.split('.')[0]}.jpg`;
        link.href = canvasRef.current.toDataURL('image/jpeg', quality / 100);
        link.click();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pixel Pruner</h1>
                        <p className="text-muted-foreground">Resize and compress images instantly in your browser.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8">
                {!image ? (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-6">
                                <ImageIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">Drag and drop or click to upload. Supports JPEG and PNG.</p>
                            <div className="relative">
                                <Button size="lg">Choose File</Button>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/png, image/jpeg"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Controls */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label>Max Width</Label>
                                            <span className="text-sm font-mono text-muted-foreground">{maxWidth}px</span>
                                        </div>
                                        <Slider
                                            value={[maxWidth]}
                                            onValueChange={(v) => setMaxWidth(v[0])}
                                            min={100}
                                            max={4000}
                                            step={50}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label>Quality</Label>
                                            <span className="text-sm font-mono text-muted-foreground">{quality}%</span>
                                        </div>
                                        <Slider
                                            value={[quality]}
                                            onValueChange={(v) => setQuality(v[0])}
                                            min={10}
                                            max={100}
                                            step={5}
                                        />
                                    </div>

                                    <div className="pt-4 border-t space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Original:</span>
                                            <span className="font-medium">{formatSize(originalSize)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">New Size:</span>
                                            <span className="font-bold text-green-600">
                                                {isProcessing ? 'Calculating...' : formatSize(processedSize)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Savings:</span>
                                            <span>
                                                {processedSize > 0 ? Math.round((1 - processedSize / originalSize) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>

                                    <Button className="w-full" onClick={handleDownload} disabled={isProcessing}>
                                        <Download className="w-4 h-4 mr-2" /> Download Image
                                    </Button>

                                    <Button variant="ghost" className="w-full" onClick={() => { setImage(null); setProcessedSize(0); }}>
                                        Upload Another
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview */}
                        <div className="lg:col-span-2 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center p-8 relative overflow-hidden min-h-[400px]">
                            <canvas ref={canvasRef} className="max-w-full max-h-[600px] shadow-lg bg-white" />
                            {isProcessing && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm">
                                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
