"use client"

import React, { useState } from 'react';
import { Button } from "@tinytask/ui/buttons/button";
import { Input } from "@tinytask/ui/forms/input";
import { Label } from "@tinytask/ui/forms/label";
import { ColorPicker } from "@tinytask/ui/forms/color-picker";
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout";
import { BookOpen, Printer, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@tinytask/utils";

interface Panel {
    id: number;
    title: string;
    content: string;
    align: "left" | "center" | "right";
    bg: string;
}

export default function BrochureBuilderPage() {
    const [layout, setLayout] = useState<'trifold' | 'bifold'>('trifold');

    // States for Tri-Fold Panels (6 panels)
    const [trifoldPanels, setTrifoldPanels] = useState<Panel[]>([
        { id: 0, title: "Front Cover", content: "Welcome to Our Services\n\nProfessional Solutions for Your Needs", align: "center", bg: "#ffffff" },
        { id: 1, title: "Inside Left", content: "Our Mission\n\nTo provide high quality services efficiently.", align: "left", bg: "#ffffff" },
        { id: 2, title: "Inside Center", content: "Core Values\n\n- Integrity\n- Innovation\n- Excellence", align: "left", bg: "#ffffff" },
        { id: 3, title: "Inside Right", content: "Contact Us\n\n123 Business Rd.\nCity, State 12345\n\n(555) 123-4567", align: "left", bg: "#ffffff" },
        { id: 4, title: "Back Cover", content: "Visit our website at:\nwww.example.com", align: "center", bg: "#f8fafc" },
        { id: 5, title: "Inside Flap", content: "Why Choose Us?\n\nWe have over 20 years of experience.", align: "left", bg: "#f1f5f9" },
    ]);
    const [activeTrifoldId, setActiveTrifoldId] = useState(0);

    // States for Bi-Fold Panels (4 panels)
    const [bifoldPanels, setBifoldPanels] = useState<Panel[]>([
        { id: 0, title: "Front Cover", content: "Welcome to Our Event\n\nJoin us for a special celebration.", align: "center", bg: "#ffffff" },
        { id: 1, title: "Inside Left", content: "Schedule of Events\n\n10:00 AM - Welcome\n11:00 AM - Keynote\n12:00 PM - Lunch", align: "left", bg: "#ffffff" },
        { id: 2, title: "Inside Right", content: "Guest Speakers\n\n- Jane Doe\n- John Smith\n\nSpecial thanks to our sponsors.", align: "left", bg: "#ffffff" },
        { id: 3, title: "Back Cover", content: "Contact Us\n\nwww.example.com\n(555) 123-4567", align: "center", bg: "#f8fafc" },
    ]);
    const [activeBifoldId, setActiveBifoldId] = useState(0);

    const activePanelId = layout === 'trifold' ? activeTrifoldId : activeBifoldId;
    const panels = layout === 'trifold' ? trifoldPanels : bifoldPanels;
    const activePanel = panels.find(p => p.id === activePanelId)!;

    const handlePanelUpdate = (key: keyof Panel, value: string) => {
        if (layout === 'trifold') {
            setTrifoldPanels(trifoldPanels.map(p => p.id === activeTrifoldId ? { ...p, [key]: value } : p));
        } else {
            setBifoldPanels(bifoldPanels.map(p => p.id === activeBifoldId ? { ...p, [key]: value } : p));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const renderPanel = (panelId: number) => {
        const p = panels.find(pan => pan.id === panelId)!;
        return (
            <div
                className={cn(
                    "h-full w-full p-6 md:p-8 flex flex-col overflow-hidden relative border-r border-dashed border-slate-300 last:border-r-0 cursor-pointer hover:bg-slate-50/10 transition-colors",
                    activePanelId === panelId ? "bg-slate-50/5" : ""
                )}
                style={{ backgroundColor: p.bg, textAlign: p.align }}
                onClick={() => {
                    if (layout === 'trifold') {
                        setActiveTrifoldId(panelId);
                    } else {
                        setActiveBifoldId(panelId);
                    }
                }}
            >
                <div className={cn(
                    "absolute inset-0 pointer-events-none border-4 transition-colors",
                    activePanelId === panelId ? 'border-sky-500/50' : 'border-transparent'
                )}></div>
                <h3 className="font-bold text-lg md:text-xl mb-4 text-slate-800 leading-tight">{p.title}</h3>
                <div className="whitespace-pre-wrap text-xs md:text-sm text-slate-600 leading-relaxed flex-1">{p.content}</div>
                <div className="mt-auto pt-4 text-[10px] text-slate-300 font-mono text-center uppercase tracking-widest select-none">
                    {p.title === "Front Cover" ? "Front Cover" : p.title === "Back Cover" ? "Back Cover" : p.title === "Inside Flap" ? "Inside Flap" : "Inside Panel"}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden !important; }
                    #brochure-print-area, #brochure-print-area * { visibility: visible !important; }
                    #brochure-print-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; }
                    .print-sheet { width: 100vw !important; height: 100vh !important; page-break-after: always !important; display: flex !important; flex-direction: row !important; }
                    .print-panel { flex: 1 !important; height: 100% !important; border: none !important; padding: 1in !important; }
                    header, footer, nav, aside { display: none !important; }
                }
            `}} />

            <ToolLayout
                title="Brochure Creator"
                description="Design and print beautiful bi-fold and tri-fold brochures."
                sidebarContent={
                    <div className="space-y-6">
                        {/* Layout Type Selection */}
                        <div className="space-y-2">
                            <Label>Brochure Layout</Label>
                            <div className="flex gap-2">
                                <Button
                                    variant={layout === 'trifold' ? 'default' : 'outline'}
                                    onClick={() => setLayout('trifold')}
                                    className="flex-1 text-xs"
                                    size="sm"
                                >
                                    Tri-Fold (6 panels)
                                </Button>
                                <Button
                                    variant={layout === 'bifold' ? 'default' : 'outline'}
                                    onClick={() => setLayout('bifold')}
                                    className="flex-1 text-xs"
                                    size="sm"
                                >
                                    Bi-Fold (4 panels)
                                </Button>
                            </div>
                        </div>

                        {/* Panel Selector */}
                        <div className="space-y-2 border-t pt-4">
                            <Label>Select Panel to Edit</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {panels.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            if (layout === 'trifold') {
                                                setActiveTrifoldId(p.id);
                                            } else {
                                                setActiveBifoldId(p.id);
                                            }
                                        }}
                                        className={cn(
                                            "h-12 rounded-lg border text-xs flex items-center justify-center text-center p-1 transition-all",
                                            activePanelId === p.id
                                                ? 'border-sky-500 ring-1 ring-sky-500 bg-sky-50 text-sky-700 font-semibold'
                                                : 'border-border hover:bg-slate-50 text-muted-foreground'
                                        )}
                                    >
                                        {p.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Panel Editor Controls */}
                        <div className="space-y-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="panel-title">Panel Title</Label>
                                <Input
                                    id="panel-title"
                                    type="text"
                                    value={activePanel.title}
                                    onChange={(e) => handlePanelUpdate('title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="panel-content">Content</Label>
                                <textarea
                                    id="panel-content"
                                    value={activePanel.content}
                                    onChange={(e) => handlePanelUpdate('content', e.target.value)}
                                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-sky-500 outline-none h-40 text-sm bg-background text-foreground leading-relaxed"
                                    placeholder="Enter panel text..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Text Alignment</Label>
                                <div className="flex border rounded-md overflow-hidden bg-background">
                                    {(['left', 'center', 'right'] as const).map((align) => (
                                        <button
                                            key={align}
                                            onClick={() => handlePanelUpdate('align', align)}
                                            className={cn(
                                                "flex-1 p-2 flex justify-center hover:bg-slate-50 transition-colors",
                                                activePanel.align === align ? 'bg-slate-100 text-slate-800 font-semibold' : 'text-slate-400'
                                            )}
                                        >
                                            {align === 'left' && <AlignLeft className="w-4 h-4" />}
                                            {align === 'center' && <AlignCenter className="w-4 h-4" />}
                                            {align === 'right' && <AlignRight className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ColorPicker
                                label="Panel Background"
                                value={activePanel.bg}
                                onChange={(val) => handlePanelUpdate('bg', val)}
                            />
                        </div>
                    </div>
                }
                previewContent={
                    <div id="brochure-print-area" className="flex flex-col gap-10 w-full items-center my-auto">
                        
                        {/* Outside Sheet */}
                        <div className="flex flex-col items-center gap-2.5 w-full max-w-4xl">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest print:hidden">
                                {layout === 'trifold' ? "Outside Sheet (Flap / Back / Front)" : "Outside Sheet (Back / Front)"}
                            </span>
                            <div className="print-sheet bg-white shadow-lg w-full aspect-[1.414] flex flex-row overflow-hidden print:shadow-none rounded-xl border border-slate-100">
                                {layout === 'trifold' ? (
                                    <>
                                        {/* Left 1/3: Inside Flap (Panel 5) */}
                                        <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(5)}</div>
                                        {/* Center 1/3: Back Cover (Panel 4) */}
                                        <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(4)}</div>
                                        {/* Right 1/3: Front Cover (Panel 0) */}
                                        <div className="flex-1 h-full print-panel">{renderPanel(0)}</div>
                                    </>
                                ) : (
                                    <>
                                        {/* Left: Back Cover (Panel 3) */}
                                        <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(3)}</div>
                                        {/* Right: Front Cover (Panel 0) */}
                                        <div className="flex-1 h-full print-panel">{renderPanel(0)}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Inside Sheet */}
                        <div className="flex flex-col items-center gap-2.5 w-full max-w-4xl">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest print:hidden">
                                {layout === 'trifold' ? "Inside Sheet (Left / Center / Right)" : "Inside Sheet (Left / Right)"}
                            </span>
                            <div className="print-sheet bg-white shadow-lg w-full aspect-[1.414] flex flex-row overflow-hidden print:shadow-none rounded-xl border border-slate-100">
                                {layout === 'trifold' ? (
                                    <>
                                        {/* Left 1/3: Inside Left (Panel 1) */}
                                        <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(1)}</div>
                                        {/* Center 1/3: Inside Center (Panel 2) */}
                                        <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(2)}</div>
                                        {/* Right 1/3: Inside Right (Panel 3) */}
                                        <div className="flex-1 h-full print-panel">{renderPanel(3)}</div>
                                    </>
                                ) : (
                                    <>
                                        {/* Left: Inside Left (Panel 1) */}
                                        <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(1)}</div>
                                        {/* Right: Inside Right (Panel 2) */}
                                        <div className="flex-1 h-full print-panel">{renderPanel(2)}</div>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                }
                actions={
                    <div className="w-full text-center space-y-2">
                        <Button onClick={handlePrint} className="w-full gap-2 bg-sky-600 hover:bg-sky-700 text-white" size="lg">
                            <Printer className="w-5 h-5" /> Print Brochure
                        </Button>
                        <p className="text-[10px] text-muted-foreground select-none">Prints 2 pages (Duplex/double-sided required)</p>
                    </div>
                }
            />
        </>
    );
}
