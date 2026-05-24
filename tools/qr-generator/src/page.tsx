"use client"

import React, { useState, useEffect, useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import JsBarcode from "jsbarcode"
import { Button } from "@tinytask/ui/buttons/button"
import { Input } from "@tinytask/ui/forms/input"
import { Label } from "@tinytask/ui/forms/label"
import { Card, CardContent } from "@tinytask/ui/cards/card"
import { ColorPicker } from "@tinytask/ui/forms/color-picker"
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout"
import { useBrandKit } from "@tinytask/ui/brand/brand-context"
import { Download, QrCode, ScanLine } from "lucide-react"

export default function QrGeneratorPage() {
    const { activeBrandKit, isBrandedSession } = useBrandKit();

    const [text, setText] = useState("https://example.com");
    const [size, setSize] = useState(256);
    const [color, setColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [codeType, setCodeType] = useState<'qr' | 'barcode'>('qr');

    const [isLoaded, setIsLoaded] = useState(false);

    // Load initial state on mount from URL or LocalStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const urlText = params.get("text");
            const urlSize = params.get("size");
            const urlColor = params.get("color");
            const urlBgColor = params.get("bgColor");
            const urlCodeType = params.get("codeType") as 'qr' | 'barcode' | null;

            const cachedData = localStorage.getItem("tinytask:qr-generator");
            let cached: any = {};
            if (cachedData) {
                try {
                    cached = JSON.parse(cachedData);
                } catch (e) {
                    console.error(e);
                }
            }

            if (urlText !== null) setText(urlText);
            else if (cached.text !== undefined) setText(cached.text);

            if (urlSize !== null) setSize(Number(urlSize));
            else if (cached.size !== undefined) setSize(cached.size);

            if (urlColor !== null) setColor(urlColor);
            else if (cached.color !== undefined) setColor(cached.color);

            if (urlBgColor !== null) setBgColor(urlBgColor);
            else if (cached.bgColor !== undefined) setBgColor(cached.bgColor);

            if (urlCodeType && ["qr", "barcode"].includes(urlCodeType)) {
                setCodeType(urlCodeType);
            } else if (cached.codeType !== undefined) {
                setCodeType(cached.codeType);
            }

            setIsLoaded(true);
        }
    }, []);

    // Sync state changes back to LocalStorage and URL search params
    useEffect(() => {
        if (!isLoaded) return;

        if (typeof window !== "undefined") {
            const dataToSave = {
                text,
                size,
                color,
                bgColor,
                codeType
            };
            localStorage.setItem("tinytask:qr-generator", JSON.stringify(dataToSave));

            const params = new URLSearchParams();
            if (text && text !== "https://example.com") {
                params.set("text", text);
            }
            if (size !== 256) {
                params.set("size", String(size));
            }
            if (color !== "#000000") {
                params.set("color", color);
            }
            if (bgColor !== "#ffffff") {
                params.set("bgColor", bgColor);
            }
            if (codeType !== "qr") {
                params.set("codeType", codeType);
            }

            const newSearch = params.toString();
            const newUrl = newSearch 
                ? `${window.location.pathname}?${newSearch}`
                : window.location.pathname;
                
            window.history.replaceState({ ...window.history.state }, "", newUrl);
        }
    }, [text, size, color, bgColor, codeType, isLoaded]);

    // Override colors if in branded session
    useEffect(() => {
        if (isBrandedSession && activeBrandKit) {
            setColor(activeBrandKit.colors.primary);
            setBgColor(activeBrandKit.colors.background);
        }
    }, [isBrandedSession, activeBrandKit]);

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
        <ToolLayout
            title="QR & Barcode Generator"
            description="Generate QR codes and barcodes instantly."
            faqs={[
                {
                    question: "Are my generated QR codes and barcodes safe and secure?",
                    answer: "Absolutely. All code generation runs 100% client-side inside your browser. No contents or URLs are sent to external servers, protecting your privacy."
                },
                {
                    question: "What kinds of content can I encode in a QR code?",
                    answer: "You can encode website URLs, plain text, contact information, email addresses, phone numbers, or Wi-Fi login credentials."
                },
                {
                    question: "Can I customize the colors of the QR code or barcode?",
                    answer: "Yes. You can change both the foreground and background colors to match your brand kit or design preferences. Just ensure there is enough contrast for scanners to read them properly."
                }
            ]}
            sidebarContent={
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Code Type</Label>
                        <div className="flex gap-2">
                            <Button
                                variant={codeType === 'qr' ? 'default' : 'outline'}
                                onClick={() => setCodeType('qr')}
                                className="flex-1 gap-2 text-xs"
                                size="sm"
                            >
                                <QrCode className="w-3.5 h-3.5" /> QR Code
                            </Button>
                            <Button
                                variant={codeType === 'barcode' ? 'default' : 'outline'}
                                onClick={() => setCodeType('barcode')}
                                className="flex-1 gap-2 text-xs"
                                size="sm"
                            >
                                <ScanLine className="w-3.5 h-3.5" /> Barcode
                            </Button>
                        </div>
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

                    {codeType === 'qr' && (
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
                    )}

                    {isBrandedSession ? (
                        <div className="space-y-2 border-t pt-4 text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border">
                            Colors locked by Brand Identity:
                            <div className="flex gap-2 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded border shadow-2xs" style={{ backgroundColor: color }} />
                                    <span>Foreground</span>
                                </div>
                                <div className="flex items-center gap-1.5 ml-4">
                                    <div className="w-4 h-4 rounded border shadow-2xs" style={{ backgroundColor: bgColor }} />
                                    <span>Background</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 border-t pt-4">
                            <ColorPicker
                                id="fg-color"
                                label="Foreground Color"
                                value={color}
                                onChange={setColor}
                            />
                            <ColorPicker
                                id="bg-color"
                                label="Background Color"
                                value={bgColor}
                                onChange={setBgColor}
                            />
                        </div>
                    )}
                </div>
            }
            previewContent={
                <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm">
                    <Card className="w-full">
                        <CardContent className="flex flex-col items-center justify-center p-8 bg-slate-50/50">
                            <div 
                                className="relative flex items-center justify-center overflow-hidden rounded-xl border bg-white p-6 shadow-sm" 
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
                                        style={{ width: "100%", height: "auto", maxWidth: "220px" }}
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

                    <Button onClick={downloadCode} className="w-full" size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                    </Button>
                </div>
            }
        />
    );
}
