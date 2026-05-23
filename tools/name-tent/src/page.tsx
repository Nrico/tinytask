"use client"

import React, { useState } from 'react';
import { Button } from "@tinytask/ui/buttons/button";
import { Label } from "@tinytask/ui/forms/label";
import { Slider } from "@tinytask/ui/forms/slider";
import { FontSelector } from "@tinytask/ui/forms/font-selector";
import { ColorPicker } from "@tinytask/ui/forms/color-picker";
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout";
import { Printer, Tent } from "lucide-react";

export default function NameTentPage() {
    const [namesInput, setNamesInput] = useState("John Doe\nJane Smith");
    const [fontSize, setFontSize] = useState(100);
    const [fontFamily, setFontFamily] = useState("var(--font-outfit)");
    const [textColor, setTextColor] = useState("#0f172a");
    const [bgColor, setBgColor] = useState("#ffffff");

    // Parse names into array
    const names = namesInput.split('\n').filter(n => n.trim() !== '');

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden !important; }
                    #printable-area, #printable-area * { visibility: visible !important; }
                    #printable-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; }
                    .page-break { page-break-after: always !important; break-after: page !important; height: 100vh !important; }
                    header, footer, nav, aside { display: none !important; }
                }
            `}} />

            <ToolLayout
                title="Name Tent Maker"
                description="Design and print folding name tents for meetings, events, and classrooms."
                sidebarContent={
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="names-list">Names List</Label>
                            <textarea
                                id="names-list"
                                value={namesInput}
                                onChange={(e) => setNamesInput(e.target.value)}
                                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-rose-500 outline-none h-48 font-sans text-sm bg-background text-foreground"
                                placeholder="Enter names, one per line..."
                            />
                            <p className="text-xs text-muted-foreground">Each line generates a separate page.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="font-size">Font Size</Label>
                                <span className="text-xs font-mono text-muted-foreground">{fontSize}px</span>
                            </div>
                            <Slider
                                id="font-size"
                                min={40}
                                max={200}
                                step={1}
                                value={[fontSize]}
                                onValueChange={(value) => setFontSize(value[0])}
                                className="accent-rose-500"
                            />
                        </div>

                        <FontSelector
                            value={fontFamily}
                            onChange={setFontFamily}
                            label="Font Style"
                        />

                        <div className="space-y-4">
                            <ColorPicker
                                label="Text Color"
                                value={textColor}
                                onChange={setTextColor}
                            />
                            <ColorPicker
                                label="Background Color"
                                value={bgColor}
                                onChange={setBgColor}
                            />
                        </div>
                    </div>
                }
                previewContent={
                    <div id="printable-area" className="flex flex-col gap-8 print:gap-0 w-full items-center my-auto">
                        {names.length === 0 && (
                            <div className="text-muted-foreground italic mt-12">Enter names to see previews...</div>
                        )}

                        {names.map((name, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg print:shadow-none w-[297mm] h-[210mm] print:w-screen print:h-screen flex-shrink-0 flex flex-col overflow-hidden relative page-break origin-top scale-50 sm:scale-75 lg:scale-100 transition-transform"
                                style={{ 
                                    maxWidth: '100%', 
                                    aspectRatio: '1.414',
                                    backgroundColor: bgColor
                                }}
                            >
                                {/* Top Half (Inverted) */}
                                <div className="flex-1 flex items-center justify-center border-b border-dashed border-slate-300 print:border-slate-100 p-8 transform rotate-180">
                                    <h1 
                                        className="font-bold text-center leading-tight" 
                                        style={{ 
                                            fontSize: `${fontSize}px`,
                                            fontFamily: fontFamily,
                                            color: textColor
                                        }}
                                    >
                                        {name}
                                    </h1>
                                </div>

                                {/* Bottom Half (Normal) */}
                                <div className="flex-1 flex items-center justify-center p-8">
                                    <h1 
                                        className="font-bold text-center leading-tight" 
                                        style={{ 
                                            fontSize: `${fontSize}px`,
                                            fontFamily: fontFamily,
                                            color: textColor
                                        }}
                                    >
                                        {name}
                                    </h1>
                                </div>

                                {/* Fold Guides (Visual only, faint in print) */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono -rotate-90 print:hidden select-none">FOLD HERE</div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono rotate-90 print:hidden select-none">FOLD HERE</div>
                            </div>
                        ))}
                    </div>
                }
                actions={
                    <Button onClick={handlePrint} className="w-full gap-2 bg-rose-600 hover:bg-rose-700 text-white" size="lg">
                        <Printer className="w-5 h-5" /> Print All Pages
                    </Button>
                }
            />
        </>
    );
}
