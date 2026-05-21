"use client"

import React, { useState } from 'react';
import { Button } from "@tinytask/ui/buttons/button";
import { Input } from "@tinytask/ui/forms/input";
import { Label } from "@tinytask/ui/forms/label";
import { Slider } from "@tinytask/ui/forms/slider";
import { ArrowLeft, Printer, Tent } from "lucide-react";
import Link from "next/link";

export default function NameTentPage() {
    const [namesInput, setNamesInput] = useState("John Doe\nJane Smith");
    const [fontSize, setFontSize] = useState(100);

    // Parse names into array
    const names = namesInput.split('\n').filter(n => n.trim() !== '');

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)]">
            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
          .page-break { page-break-after: always; break-after: page; height: 100vh; }
          /* Hide header/footer/sidebar in print */
          header, footer, nav, aside { display: none !important; }
        }
      `}</style>

            {/* Sidebar */}
            <div className="w-full lg:w-80 bg-background border-r flex flex-col shadow-sm z-10 h-full">
                <div className="p-6 border-b">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h2 className="font-bold text-xl flex items-center gap-2">
                        <Tent className="w-5 h-5 text-rose-500" /> Name Tent Maker
                    </h2>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        <Label>Names List</Label>
                        <textarea
                            value={namesInput}
                            onChange={(e) => setNamesInput(e.target.value)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-rose-500 outline-none h-48 font-sans text-sm bg-background"
                            placeholder="Enter names, one per line..."
                        />
                        <p className="text-xs text-muted-foreground">Each line generates a separate page.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Font Size</Label>
                            <span className="text-xs font-mono text-muted-foreground">{fontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="40"
                            max="200"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                    </div>
                </div>

                <div className="p-6 border-t mt-auto">
                    <Button onClick={handlePrint} className="w-full gap-2" size="lg">
                        <Printer className="w-5 h-5" /> Print All Pages
                    </Button>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 bg-secondary/20 overflow-y-auto p-8 flex flex-col items-center gap-8 relative">
                <div id="printable-area" className="flex flex-col gap-8 print:gap-0 w-full items-center">
                    {names.length === 0 && (
                        <div className="text-muted-foreground italic mt-12">Enter names to see previews...</div>
                    )}

                    {names.map((name, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg print:shadow-none w-[297mm] h-[210mm] print:w-screen print:h-screen flex-shrink-0 flex flex-col overflow-hidden relative page-break origin-top scale-50 sm:scale-75 lg:scale-100 transition-transform"
                            style={{ maxWidth: '100%', aspectRatio: '1.414' }} // A4 Landscape approx
                        >
                            {/* Top Half (Inverted) */}
                            <div className="flex-1 flex items-center justify-center border-b border-dashed border-slate-300 print:border-slate-100 p-8 transform rotate-180">
                                <h1 className="font-bold text-slate-900 text-center leading-tight" style={{ fontSize: `${fontSize}px` }}>
                                    {name}
                                </h1>
                            </div>

                            {/* Bottom Half (Normal) */}
                            <div className="flex-1 flex items-center justify-center p-8">
                                <h1 className="font-bold text-slate-900 text-center leading-tight" style={{ fontSize: `${fontSize}px` }}>
                                    {name}
                                </h1>
                            </div>

                            {/* Fold Guides (Visual only, faint in print) */}
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono -rotate-90 print:hidden">FOLD HERE</div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono rotate-90 print:hidden">FOLD HERE</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
