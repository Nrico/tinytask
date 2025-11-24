"use client"

import React, { useState, useEffect } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, QrCode, ScanLine, Loader2 } from "lucide-react"

export default function QrGeneratorPage() {
    const [text, setText] = useState("https://example.com");
    const [size, setSize] = useState(256);
    const [color, setColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [codeType, setCodeType] = useState<'qr' | 'barcode'>('qr');
    const [loading, setLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState('');

    // Debounce generation
    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            if (codeType === 'qr') {
                setLoading(false);
            } else {
                // BWIP-JS API for Barcode 128
                const bgHex = bgColor.replace('#', '');
                setImgUrl(`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(text)}&scale=3&includetext&backgroundcolor=${bgHex}`);
                setLoading(false);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [text, size, color, bgColor, codeType]);

    const downloadCode = () => {
        if (codeType === 'qr') {
            const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
            if (canvas) {
                const pngUrl = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = "qr-code.png";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        } else {
            // For barcode API image
            const link = document.createElement('a');
            link.href = imgUrl;
            link.download = `barcode_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Code Baker</h1>
                        <p className="text-muted-foreground">
                            Generate QR codes and barcodes instantly.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <Button
                                variant={codeType === 'qr' ? 'default' : 'outline'}
                                onClick={() => setCodeType('qr')}
                                className="flex-1 gap-2"
                            >
                                <QrCode className="w-4 h-4" /> QR Code
                            </Button>
                            <Button
                                variant={codeType === 'barcode' ? 'default' : 'outline'}
                                onClick={() => setCodeType('barcode')}
                                className="flex-1 gap-2"
                            >
                                <ScanLine className="w-4 h-4" /> Barcode
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Input
                                id="content"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={codeType === 'qr' ? "https://example.com" : "123456789"}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="size">Size (px)</Label>
                                <Input
                                    id="size"
                                    type="number"
                                    value={size}
                                    onChange={(e) => setSize(Number(e.target.value))}
                                    min={128}
                                    max={1024}
                                />
                            </div>
                            {codeType === 'qr' && (
                                <div className="space-y-2">
                                    <Label htmlFor="color">Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="color"
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="h-10 w-12 p-1"
                                        />
                                        <Input
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-6">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle className="text-center">Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="relative flex items-center justify-center overflow-hidden rounded-lg border bg-white p-4 shadow-sm" style={{ backgroundColor: bgColor, minHeight: '200px', minWidth: '200px' }}>
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                )}
                                {codeType === 'qr' ? (
                                    <QRCodeCanvas
                                        id="qr-code"
                                        value={text}
                                        size={size}
                                        fgColor={color}
                                        bgColor={bgColor}
                                        level={"H"}
                                        includeMargin={true}
                                        style={{ width: "100%", height: "auto", maxWidth: "256px" }}
                                    />
                                ) : (
                                    imgUrl && <img src={imgUrl} alt="Barcode" className="max-w-full" />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Button onClick={downloadCode} className="w-full max-w-sm" size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                    </Button>
                </div>
            </div>
        </div>
    )
}
