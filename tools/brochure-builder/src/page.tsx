"use client"

import React, { useState } from 'react';
import { Button } from "@tinytask/ui/buttons/button";
import { Input } from "@tinytask/ui/forms/input";
import { Label } from "@tinytask/ui/forms/label";
import { ArrowLeft, BookOpen, Printer } from "lucide-react";
import Link from "next/link";
import { cn } from "@tinytask/utils";

interface Panel {
    id: number;
    title: string;
    content: string;
    align: "left" | "center" | "right";
    bg: string;
}

export default function BrochureBuilderPage() {
    const [panels, setPanels] = useState<Panel[]>([
        { id: 0, title: "Front Cover", content: "Welcome to Our Services\n\nProfessional Solutions for Your Needs", align: "center", bg: "#ffffff" },
        { id: 1, title: "Inside Left", content: "Our Mission\n\nTo provide high quality services efficiently.", align: "left", bg: "#ffffff" },
        { id: 2, title: "Inside Center", content: "Core Values\n\n- Integrity\n- Innovation\n- Excellence", align: "left", bg: "#ffffff" },
        { id: 3, title: "Inside Right", content: "Contact Us\n\n123 Business Rd.\nCity, State 12345\n\n(555) 123-4567", align: "left", bg: "#ffffff" },
        { id: 4, title: "Back Cover", content: "Visit our website at:\nwww.example.com", align: "center", bg: "#f8fafc" },
        { id: 5, title: "Inside Flap", content: "Why Choose Us?\n\nWe have over 20 years of experience.", align: "left", bg: "#f1f5f9" },
    ]);
    const [activePanelId, setActivePanelId] = useState(0);

    const handlePanelUpdate = (key: keyof Panel, value: string) => {
        setPanels(panels.map(p => p.id === activePanelId ? { ...p, [key]: value } : p));
    };

    const activePanel = panels.find(p => p.id === activePanelId)!;

    const handlePrint = () => {
        window.print();
    };

    const renderPanel = (panelId: number) => {
        const p = panels.find(pan => pan.id === panelId)!;
        return (
            <div
                className="h-full w-full p-8 flex flex-col overflow-hidden relative border-r border-dashed border-slate-300 last:border-r-0"
                style={{ backgroundColor: p.bg, textAlign: p.align }}
                onClick={() => setActivePanelId(panelId)}
            >
                <div className={cn(
                    "absolute inset-0 pointer-events-none border-4 transition-colors",
                    activePanelId === panelId ? 'border-sky-500/50' : 'border-transparent'
                )}></div>
                <h3 className="font-bold text-xl mb-4 text-slate-800">{p.title}</h3>
                <div className="whitespace-pre-wrap text-sm text-slate-600">{p.content}</div>
                <div className="mt-auto pt-4 text-xs text-slate-300 font-mono text-center uppercase tracking-widest select-none">
                    {panelId === 0 ? "Front Cover" : panelId === 5 ? "Inside Flap" : panelId === 4 ? "Back Cover" : "Inside Panel"}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)]">
            <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #brochure-print-area, #brochure-print-area * { visibility: visible; }
          #brochure-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print-sheet { width: 100vw; height: 100vh; page-break-after: always; display: flex; flex-direction: row; }
          .print-panel { flex: 1; height: 100%; border: none !important; padding: 1in; }
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
                        <BookOpen className="w-5 h-5 text-sky-600" /> Brochure Builder
                    </h2>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Panel Selector */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {panels.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setActivePanelId(p.id)}
                                className={cn(
                                    "h-16 rounded-lg border text-xs flex items-center justify-center text-center p-1 transition-all",
                                    activePanelId === p.id
                                        ? 'border-sky-500 ring-1 ring-sky-500 bg-sky-50 text-sky-700'
                                        : 'border-border hover:bg-secondary text-muted-foreground'
                                )}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label>Panel Title</Label>
                            <Input
                                type="text"
                                value={activePanel.title}
                                onChange={(e) => handlePanelUpdate('title', e.target.value)}
                                className="focus:ring-sky-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Content</Label>
                            <textarea
                                value={activePanel.content}
                                onChange={(e) => handlePanelUpdate('content', e.target.value)}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-sky-500 outline-none h-40 text-sm bg-background"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="block mb-1">Alignment</Label>
                                <select
                                    value={activePanel.align}
                                    onChange={(e) => handlePanelUpdate('align', e.target.value as any)}
                                    className="w-full p-2 border rounded bg-background text-sm"
                                >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <Label className="block mb-1">Background</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={activePanel.bg}
                                        onChange={(e) => handlePanelUpdate('bg', e.target.value)}
                                        className="h-9 w-full rounded cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t mt-auto">
                    <Button onClick={handlePrint} className="w-full gap-2" size="lg">
                        <Printer className="w-5 h-5" /> Print Brochure
                    </Button>
                    <p className="text-xs text-center mt-2 text-muted-foreground">Prints 2 pages (Duplex required)</p>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-secondary/20 overflow-y-auto p-8 flex flex-col items-center gap-8">
                <div id="brochure-print-area" className="flex flex-col gap-8 w-full items-center">

                    {/* Outside Sheet */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider print:hidden">Outside Sheet (Front/Back/Flap)</span>
                        <div className="print-sheet bg-white shadow-lg w-[297mm] h-[210mm] flex flex-row overflow-hidden print:shadow-none origin-top scale-50 sm:scale-75 lg:scale-100 transition-transform" style={{ aspectRatio: '1.414' }}>
                            {/* Left 1/3: Inside Flap (Panel 5) - Folds IN */}
                            <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(5)}</div>
                            {/* Center 1/3: Back Cover (Panel 4) */}
                            <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(4)}</div>
                            {/* Right 1/3: Front Cover (Panel 0) */}
                            <div className="flex-1 h-full print-panel">{renderPanel(0)}</div>
                        </div>
                    </div>

                    {/* Inside Sheet */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider print:hidden">Inside Sheet</span>
                        <div className="print-sheet bg-white shadow-lg w-[297mm] h-[210mm] flex flex-row overflow-hidden print:shadow-none origin-top scale-50 sm:scale-75 lg:scale-100 transition-transform" style={{ aspectRatio: '1.414' }}>
                            {/* Left 1/3: Inside Left (Panel 1) */}
                            <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(1)}</div>
                            {/* Center 1/3: Inside Center (Panel 2) */}
                            <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(2)}</div>
                            {/* Right 1/3: Inside Right (Panel 3) */}
                            <div className="flex-1 h-full print-panel">{renderPanel(3)}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
