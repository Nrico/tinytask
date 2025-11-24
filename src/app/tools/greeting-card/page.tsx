"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, Printer, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function GreetingCardPage() {
    // Panels: 0=Front, 1=InsideTop, 2=InsideBottom, 3=Back
    const [panels, setPanels] = useState([
        { id: 0, title: "Front Cover", content: "Happy Birthday!", align: "center", bg: "#ffffff" },
        { id: 1, title: "Inside Top", content: "", align: "center", bg: "#ffffff" },
        { id: 2, title: "Inside Bottom", content: "Wishing you a fantastic day filled with joy and laughter.\n\nBest,\n[Your Name]", align: "center", bg: "#ffffff" },
        { id: 3, title: "Back Cover", content: "Designed with TinyTask", align: "center", bg: "#f8fafc" },
    ]);
    const [activePanelId, setActivePanelId] = useState(0);

    const handlePanelUpdate = (key: string, value: string) => {
        setPanels(panels.map(p => p.id === activePanelId ? { ...p, [key]: value } : p));
    };

    const activePanel = panels.find(p => p.id === activePanelId)!;

    const handlePrint = () => {
        window.print();
    };

    const renderPanel = (panelId: number, inverted: boolean = false) => {
        const p = panels.find(pan => pan.id === panelId)!;
        return (
            <div
                className={`h-full w-full p-8 flex flex-col overflow-hidden relative border-dashed border-slate-300 cursor-pointer hover:bg-slate-50 transition-colors
                    ${inverted ? 'transform rotate-180 border-b' : 'border-t-0'}
                `}
                style={{ backgroundColor: p.bg, textAlign: p.align as any }}
                onClick={() => setActivePanelId(panelId)}
            >
                <div className={`absolute inset-0 pointer-events-none border-4 transition-colors ${activePanelId === panelId ? 'border-blue-500/50' : 'border-transparent'}`}></div>
                <h3 className="font-bold text-xl mb-4 text-slate-800">{p.title}</h3>
                <div className="whitespace-pre-wrap text-sm text-slate-600 flex-1">{p.content}</div>
                <div className="mt-auto pt-4 text-xs text-slate-300 font-mono text-center uppercase tracking-widest select-none">
                    {panelId === 0 ? "Front Cover" : panelId === 3 ? "Back Cover" : "Inside Panel"}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl sm:px-6 lg:px-8 h-[calc(100vh-60px)] flex flex-col">
            <style>{`
        @media print {
          body * { visibility: hidden; }
          #card-print-area, #card-print-area * { visibility: visible; }
          #card-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print-sheet { width: 100vw; height: 100vh; page-break-after: always; display: flex; flex-direction: column; }
          .print-panel { flex: 1; width: 100%; border: none !important; padding: 1in; }
          /* Hide UI elements */
          nav, header, footer, .no-print { display: none !important; }
        }
      `}</style>

            <div className="mb-6 flex-shrink-0">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Greeting Card Builder</h1>
                        <p className="text-muted-foreground">Create a folded greeting card (Portrait).</p>
                    </div>
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="w-4 h-4" /> Print Card
                    </Button>
                </div>
            </div>

            <div className="flex-1 grid lg:grid-cols-3 gap-8 min-h-0">
                {/* Controls */}
                <div className="lg:col-span-1 flex flex-col min-h-0">
                    <Card className="flex-1 flex flex-col min-h-0">
                        <CardContent className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
                            {/* Panel Selector */}
                            <div className="grid grid-cols-2 gap-2">
                                {panels.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setActivePanelId(p.id)}
                                        className={`h-12 rounded-lg border text-xs flex items-center justify-center text-center p-1 transition-all
                                            ${activePanelId === p.id ? 'border-primary ring-1 ring-primary bg-primary/5 text-primary' : 'border-input hover:bg-accent text-muted-foreground'}
                                        `}
                                    >
                                        {p.title}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Panel Title</Label>
                                    <Input
                                        value={activePanel.title}
                                        onChange={(e) => handlePanelUpdate('title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 flex-1 flex flex-col">
                                    <Label>Content</Label>
                                    <Textarea
                                        value={activePanel.content}
                                        onChange={(e) => handlePanelUpdate('content', e.target.value)}
                                        className="flex-1 min-h-[150px]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Alignment</Label>
                                        <div className="flex border rounded-md overflow-hidden">
                                            {['left', 'center', 'right'].map((align) => (
                                                <button
                                                    key={align}
                                                    onClick={() => handlePanelUpdate('align', align)}
                                                    className={`flex-1 p-2 flex justify-center hover:bg-accent ${activePanel.align === align ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                                                >
                                                    {align === 'left' && <AlignLeft className="w-4 h-4" />}
                                                    {align === 'center' && <AlignCenter className="w-4 h-4" />}
                                                    {align === 'right' && <AlignRight className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Background</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                value={activePanel.bg}
                                                onChange={(e) => handlePanelUpdate('bg', e.target.value)}
                                                className="h-9 w-full p-1 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2 bg-slate-100 rounded-xl border border-slate-200 overflow-y-auto p-8 flex flex-col items-center gap-8">
                    <div id="card-print-area" className="flex flex-col gap-8 w-full items-center max-w-[500px]">

                        {/* Outside Sheet */}
                        <div className="flex flex-col items-center gap-2 w-full">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider print:hidden">Outside Sheet (Back / Front)</span>
                            <div className="print-sheet bg-white shadow-lg w-full aspect-[0.707] flex flex-col overflow-hidden print:shadow-none origin-top">
                                {/* Top: Back Cover (Panel 3) - Inverted */}
                                <div className="flex-1 w-full print-panel">{renderPanel(3, true)}</div>
                                {/* Bottom: Front Cover (Panel 0) */}
                                <div className="flex-1 w-full print-panel">{renderPanel(0)}</div>
                            </div>
                        </div>

                        {/* Inside Sheet */}
                        <div className="flex flex-col items-center gap-2 w-full">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider print:hidden">Inside Sheet (Top / Bottom)</span>
                            <div className="print-sheet bg-white shadow-lg w-full aspect-[0.707] flex flex-col overflow-hidden print:shadow-none origin-top">
                                {/* Top: Inside Top (Panel 1) - Inverted */}
                                <div className="flex-1 w-full print-panel">{renderPanel(1, true)}</div>
                                {/* Bottom: Inside Bottom (Panel 2) */}
                                <div className="flex-1 w-full print-panel">{renderPanel(2)}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
