"use client"

import React, { useState, useEffect, useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import JsBarcode from "jsbarcode"
import { Button } from "@tinytask/ui/buttons/button"
import { Input } from "@tinytask/ui/forms/input"
import { Label } from "@tinytask/ui/forms/label"
import { Card, CardContent, CardHeader, CardTitle } from "@tinytask/ui/cards/card"
import { Download, QrCode, ScanLine } from "lucide-react"

export default function QrGeneratorPage() {
    const [text, setText] = useState("https://example.com");
    const [size, setSize] = useState(256);
    const [color, setColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [codeType, setCodeType] = useState<'qr' | 'barcode'>('qr');

    const barcodeRef = useRef<HTMLCanvasElement>(null);

    // Draw barcode client-side when dependencies change
    useEffect(() => {
        if (codeType === 'barcode' && barcodeRef.current) {
            try {
                JsBarcode(barcodeRef.current, text || " ", {
                    format: "CODE128",
                    lineColor: color,
                    background: bgColor,
                    width: 2,
                    height: 80,
                    displayValue: true,
                    fontSize: 16,
                    margin: 10,
                });
            } catch (err) {
                console.error("Barcode rendering error:", err);
            }
        }
    }, [text, color, bgColor, codeType]);

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
            const canvas = barcodeRef.current;
            if (canvas) {
                const pngUrl = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `barcode_${Date.now()}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
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
                                    disabled={codeType === 'barcode'} // Barcode size is auto-fit
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Bar Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="h-10 w-12 p-1 cursor-pointer"
                                    />
                                    <Input
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="flex-1 font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bgColor">Background Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="bgColor"
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="h-10 w-12 p-1 cursor-pointer"
                                    />
                                    <Input
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="flex-1 font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-6">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle className="text-center">Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div 
                                className="relative flex items-center justify-center overflow-hidden rounded-lg border bg-white p-4 shadow-sm" 
                                style={{ backgroundColor: bgColor, minHeight: '200px', minWidth: '200px', width: '100%' }}
                            >
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
                                    <canvas
                                        id="barcode-canvas"
                                        ref={barcodeRef}
                                        className="max-w-full h-auto"
                                    />
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
