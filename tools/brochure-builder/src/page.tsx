"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@tinytask/ui/buttons/button";
import { Label } from "@tinytask/ui/forms/label";
import { ColorPicker } from "@tinytask/ui/forms/color-picker";
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout";
import { Printer, AlignLeft, AlignCenter, AlignRight, ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";
import { cn } from "@tinytask/utils";

interface Panel {
    id: number;
    title: string;
    content: string;
    align: "left" | "center" | "right";
    bg: string;
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [paletteOpen, setPaletteOpen] = useState(false);

    // Sync HTML from state to editor ref ONLY if they differ
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, valueStr: string = '') => {
        document.execCommand(command, false, valueStr);
        handleInput();
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const colors = [
        { name: 'Dark Slate', value: '#1e293b' },
        { name: 'Sky Blue', value: '#0284c7' },
        { name: 'Emerald', value: '#059669' },
        { name: 'Rose Red', value: '#e11d48' },
        { name: 'Amber', value: '#d97706' },
        { name: 'Purple', value: '#7c3aed' },
        { name: 'Coal Black', value: '#000000' }
    ];

    return (
        <div className="border rounded-lg overflow-hidden bg-background flex flex-col shadow-sm focus-within:ring-2 focus-within:ring-sky-500 transition-shadow">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b select-none items-center">
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className="p-1.5 rounded hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700 w-8 h-8 flex items-center justify-center cursor-pointer"
                    title="Bold (Ctrl+B)"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className="p-1.5 rounded hover:bg-slate-200 transition-colors text-xs italic text-slate-700 w-8 h-8 flex items-center justify-center cursor-pointer"
                    title="Italic (Ctrl+I)"
                >
                    I
                </button>
                
                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h1>')}
                    className="p-1 rounded hover:bg-slate-200 transition-colors text-[10px] font-black text-slate-700 h-8 px-1.5 cursor-pointer"
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h2>')}
                    className="p-1 rounded hover:bg-slate-200 transition-colors text-[10px] font-bold text-slate-700 h-8 px-1.5 cursor-pointer"
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<p>')}
                    className="p-1 rounded hover:bg-slate-200 transition-colors text-[10px] text-slate-500 h-8 px-1.5 cursor-pointer"
                    title="Paragraph Text"
                >
                    Body
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className="p-1 rounded hover:bg-slate-200 transition-colors text-[10px] text-slate-700 h-8 px-1.5 flex items-center justify-center font-bold cursor-pointer"
                    title="Bullet List"
                >
                    • List
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                {/* Color dropdown selector */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setPaletteOpen(!paletteOpen)}
                        className="p-1 rounded hover:bg-slate-200 transition-colors text-[10px] text-slate-700 h-8 px-1.5 flex items-center gap-1 font-semibold cursor-pointer"
                        title="Text Color"
                    >
                        <span className="w-3 h-3 rounded-full border border-slate-300 bg-red-500 inline-block" />
                        Color
                    </button>
                    {paletteOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setPaletteOpen(false)} />
                            <div className="absolute left-0 mt-1 bg-white border shadow-lg rounded-md p-1.5 grid grid-cols-4 gap-1 z-40 w-32">
                                {colors.map(c => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => {
                                            execCommand('foreColor', c.value);
                                            setPaletteOpen(false);
                                        }}
                                        className="w-6 h-6 rounded-full border border-slate-200 hover:scale-110 transition-transform cursor-pointer"
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Editable Content Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="w-full p-4 outline-none min-h-[160px] max-h-[300px] overflow-y-auto text-sm leading-relaxed bg-white prose prose-slate max-w-none prose-sm rich-editor-content"
            />
        </div>
    );
}

export default function BrochureBuilderPage() {
    const [layout, setLayout] = useState<'trifold' | 'bifold'>('trifold');

    // States for Tri-Fold Panels (6 panels) - Content initialized as clean HTML
    const [trifoldPanels, setTrifoldPanels] = useState<Panel[]>([
        { id: 0, title: "Front Cover", content: "<h1>Welcome to Our Services</h1><p>Professional Solutions for Your Needs</p>", align: "center", bg: "#ffffff" },
        { id: 1, title: "Inside Left", content: "<h1>Our Mission</h1><p>To provide high quality services efficiently.</p>", align: "left", bg: "#ffffff" },
        { id: 2, title: "Inside Center", content: "<h1>Core Values</h1><ul><li>Integrity</li><li>Innovation</li><li>Excellence</li></ul>", align: "left", bg: "#ffffff" },
        { id: 3, title: "Inside Right", content: "<h1>Contact Us</h1><p>123 Business Rd.<br>City, State 12345</p><p><strong>(555) 123-4567</strong></p>", align: "left", bg: "#ffffff" },
        { id: 4, title: "Back Cover", content: "<p>Visit our website at:</p><p><strong style=\"color:#0284c7;\">www.example.com</strong></p>", align: "center", bg: "#f8fafc" },
        { id: 5, title: "Inside Flap", content: "<h1>Why Choose Us?</h1><p>We have over 20 years of experience.</p>", align: "left", bg: "#f1f5f9" },
    ]);
    const [activeTrifoldId, setActiveTrifoldId] = useState(0);

    // States for Bi-Fold Panels (4 panels) - Content initialized as clean HTML
    const [bifoldPanels, setBifoldPanels] = useState<Panel[]>([
        { id: 0, title: "Front Cover", content: "<h1>Welcome to Our Event</h1><p>Join us for a special celebration.</p>", align: "center", bg: "#ffffff" },
        { id: 1, title: "Inside Left", content: "<h1>Schedule of Events</h1><ul><li>10:00 AM - Welcome</li><li>11:00 AM - Keynote</li><li>12:00 PM - Lunch</li></ul>", align: "left", bg: "#ffffff" },
        { id: 2, title: "Inside Right", content: "<h1>Guest Speakers</h1><p>- Jane Doe<br>- John Smith</p><p>Special thanks to our sponsors.</p>", align: "left", bg: "#ffffff" },
        { id: 3, title: "Back Cover", content: "<h1>Contact Us</h1><p>www.example.com<br><strong>(555) 123-4567</strong></p>", align: "center", bg: "#f8fafc" },
    ]);
    const [activeBifoldId, setActiveBifoldId] = useState(0);

    const activePanelId = layout === 'trifold' ? activeTrifoldId : activeBifoldId;
    const panels = layout === 'trifold' ? trifoldPanels : bifoldPanels;
    const activePanel = panels.find(p => p.id === activePanelId)!;

    // Viewport Size, Zoom & Pan State
    const viewportRef = useRef<HTMLDivElement>(null);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const [zoom, setZoom] = useState(60);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!viewportRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setViewportSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        observer.observe(viewportRef.current);
        return () => observer.disconnect();
    }, []);

    const focusActivePanelId = (panelId: number, currentZoom: number = zoom) => {
        const scale = currentZoom / 100;
        let targetPanX = 0;
        let targetPanY = 0;

        if (layout === 'trifold') {
            if ([0, 4, 5].includes(panelId)) {
                targetPanY = 309 * scale;
                if (panelId === 5) targetPanX = 280 * scale;
                if (panelId === 4) targetPanX = 0;
                if (panelId === 0) targetPanX = -280 * scale;
            } else {
                targetPanY = -309 * scale;
                if (panelId === 1) targetPanX = 280 * scale;
                if (panelId === 2) targetPanX = 0;
                if (panelId === 3) targetPanX = -280 * scale;
            }
        } else {
            if ([0, 3].includes(panelId)) {
                targetPanY = 309 * scale;
                if (panelId === 3) targetPanX = 210 * scale;
                if (panelId === 0) targetPanX = -210 * scale;
            } else {
                targetPanY = -309 * scale;
                if (panelId === 1) targetPanX = 210 * scale;
                if (panelId === 2) targetPanX = -210 * scale;
            }
        }

        setPan({ x: targetPanX, y: targetPanY });
    };

    const focusActivePanel = (currentZoom: number = zoom) => {
        focusActivePanelId(activePanelId, currentZoom);
    };

    const handleFitToScreen = () => {
        if (!viewportSize.width || !viewportSize.height) return;
        
        const canvasWidth = 840;
        const canvasHeight = 1212; // 594 * 2 + 24 gap
        
        const fitWidthScale = (viewportSize.width - 48) / canvasWidth;
        const fitHeightScale = (viewportSize.height - 48) / canvasHeight;
        
        const newZoom = Math.max(15, Math.min(200, Math.floor(Math.min(fitWidthScale, fitHeightScale) * 100)));
        setZoom(newZoom);
        setPan({ x: 0, y: 0 });
    };

    const handleFitSheet = () => {
        if (!viewportSize.width || !viewportSize.height) return;
        
        const canvasWidth = 840;
        const canvasHeight = 594;
        
        const fitWidthScale = (viewportSize.width - 48) / canvasWidth;
        const fitHeightScale = (viewportSize.height - 48) / canvasHeight;
        
        const newZoom = Math.max(15, Math.min(200, Math.floor(Math.min(fitWidthScale, fitHeightScale) * 100)));
        setZoom(newZoom);
        focusActivePanelId(activePanelId, newZoom);
    };

    // Auto-fit on first load or layout change
    useEffect(() => {
        if (viewportSize.width > 0 && viewportSize.height > 0) {
            handleFitToScreen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportSize.width, viewportSize.height, layout]);

    // Auto-slide to panel when activePanelId changes
    useEffect(() => {
        focusActivePanel(zoom);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePanelId]);

    // Drag-to-pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('[contenteditable="true"]')) {
            return;
        }
        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('[contenteditable="true"]')) {
            return;
        }
        if (e.touches.length === 1) {
            setIsDragging(true);
            dragStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        if (e.touches.length === 1) {
            setPan({
                x: e.touches[0].clientX - dragStart.current.x,
                y: e.touches[0].clientY - dragStart.current.y
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

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
                    "h-full w-full p-6 md:p-8 flex flex-col overflow-hidden relative border-r border-slate-200 last:border-r-0 cursor-pointer hover:bg-slate-50/10 transition-colors",
                    activePanelId === panelId ? "bg-slate-50/5" : ""
                )}
                style={{ backgroundColor: p.bg, textAlign: p.align }}
                onClick={() => {
                    if (layout === 'trifold') {
                        setActiveTrifoldId(panelId);
                    } else {
                        setActiveBifoldId(panelId);
                    }
                    focusActivePanelId(panelId, zoom);
                }}
            >
                {/* Active Highlight Border - Hiden on Print */}
                <div className={cn(
                    "absolute inset-0 pointer-events-none border-4 transition-colors print:hidden",
                    activePanelId === panelId ? 'border-sky-500/50' : 'border-transparent'
                )}></div>
                
                {/* Formatted Content Area */}
                <div 
                    className="brochure-rich-content text-xs md:text-sm text-slate-600 leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{ __html: p.content }}
                />

                {/* Tracking Footer - Hidden on Print */}
                <div className="mt-auto pt-4 text-[10px] text-slate-300 font-mono text-center uppercase tracking-widest select-none print:hidden">
                    {p.title === "Front Cover" ? "Front Cover" : p.title === "Back Cover" ? "Back Cover" : p.title === "Inside Flap" ? "Inside Flap" : "Inside Panel"}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Print & Rich Editor Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                /* Rich Text Styles inside panels */
                .rich-editor-content:empty::before {
                    content: "Enter panel text here...";
                    color: #94a3b8;
                    pointer-events: none;
                    display: block;
                }
                .brochure-rich-content h1 {
                    font-size: 1.4rem;
                    font-weight: 800;
                    margin-top: 0.25rem;
                    margin-bottom: 0.5rem;
                    line-height: 1.25;
                    color: #0f172a;
                }
                .brochure-rich-content h2 {
                    font-size: 1.15rem;
                    font-weight: 700;
                    margin-top: 0.25rem;
                    margin-bottom: 0.4rem;
                    line-height: 1.3;
                    color: #1e293b;
                }
                .brochure-rich-content p {
                    margin-bottom: 0.5rem;
                }
                .brochure-rich-content ul {
                    list-style-type: disc;
                    padding-left: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                .brochure-rich-content li {
                    margin-bottom: 0.25rem;
                }
                .brochure-rich-content strong {
                    font-weight: 700;
                    color: inherit;
                }
                .brochure-rich-content em {
                    font-style: italic;
                }

                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body * { visibility: hidden !important; }
                    #brochure-print-area, #brochure-print-area * { visibility: visible !important; }
                    #brochure-print-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        transform: none !important;
                        display: block !important;
                        gap: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print-sheet {
                        width: 100vw !important;
                        height: 100vh !important;
                        page-break-after: always !important;
                        display: flex !important;
                        flex-direction: row !important;
                        transform: none !important;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print-panel {
                        flex: 1 !important;
                        height: 100% !important;
                        border: none !important;
                        padding: 2.5rem !important;
                    }
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
                                            focusActivePanelId(p.id, zoom);
                                        }}
                                        className={cn(
                                            "h-12 rounded-lg border text-xs flex items-center justify-center text-center p-1 transition-all cursor-pointer",
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

                        {/* Rich Content Editor */}
                        <div className="space-y-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label>Panel Content Editor</Label>
                                <RichTextEditor
                                    value={activePanel.content}
                                    onChange={(val) => handlePanelUpdate('content', val)}
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
                                                "flex-1 p-2 flex justify-center hover:bg-slate-50 transition-colors cursor-pointer",
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
                    <div className="w-full h-full flex flex-col select-none overflow-hidden relative">
                        {/* Top Canvas Toolbar */}
                        <div className="flex-shrink-0 flex flex-wrap gap-3 items-center justify-between border-b pb-3 mb-4 select-none print:hidden">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brochure Canvas</span>
                                <span className="text-[10px] bg-slate-100 border text-slate-500 rounded px-1.5 py-0.5 font-mono flex items-center gap-1">
                                    <Move className="w-3 h-3 text-slate-400 animate-pulse" /> Drag to pan
                                </span>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setZoom(Math.max(15, zoom - 10))}
                                    className="p-1 rounded hover:bg-slate-200 border bg-white shadow-sm transition-colors text-slate-600 disabled:opacity-50 flex items-center justify-center w-7 h-7 cursor-pointer"
                                    disabled={zoom <= 15}
                                >
                                    <ZoomOut className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-mono font-bold w-12 text-center text-slate-700 bg-slate-100 px-2 py-0.5 rounded border select-none">
                                    {zoom}%
                                </span>
                                <button
                                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                                    className="p-1 rounded hover:bg-slate-200 border bg-white shadow-sm transition-colors text-slate-600 disabled:opacity-50 flex items-center justify-center w-7 h-7 cursor-pointer"
                                    disabled={zoom >= 200}
                                >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                </button>

                                <div className="h-4 w-px bg-slate-200 mx-1" />

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleFitToScreen}
                                    className="text-xs px-2.5 h-8 font-medium"
                                >
                                    Fit All
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleFitSheet}
                                    className="text-xs px-2.5 h-8 font-medium"
                                >
                                    Center Active
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setZoom(100); setPan({ x: 0, y: 0 }); }}
                                    className="text-xs px-2.5 h-8 font-medium"
                                >
                                    <Maximize2 className="w-3.5 h-3.5 mr-1" /> 100%
                                </Button>
                            </div>
                        </div>

                        {/* Viewport Frame */}
                        <div 
                            ref={viewportRef}
                            className="flex-1 w-full border border-slate-200 bg-slate-50/50 rounded-xl relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Inner Transformed Content Box */}
                            <div 
                                id="brochure-print-area"
                                className="flex flex-col gap-6 items-center flex-shrink-0"
                                style={{
                                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
                                    transformOrigin: 'center center',
                                    transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                }}
                            >
                                {/* Outside Sheet */}
                                <div className="flex flex-col items-center gap-2 w-[840px] select-none print:w-full print:h-full print:gap-0">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:hidden">
                                        {layout === 'trifold' ? "Outside Sheet (Flap / Back / Front)" : "Outside Sheet (Back / Front)"}
                                    </span>
                                    <div className="print-sheet bg-white shadow-lg w-[840px] h-[594px] flex flex-row overflow-hidden print:shadow-none rounded-xl border border-slate-200 select-none">
                                        {layout === 'trifold' ? (
                                            <>
                                                <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(5)}</div>
                                                <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(4)}</div>
                                                <div className="flex-1 h-full print-panel">{renderPanel(0)}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(3)}</div>
                                                <div className="flex-1 h-full print-panel">{renderPanel(0)}</div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Inside Sheet */}
                                <div className="flex flex-col items-center gap-2 w-[840px] select-none print:w-full print:h-full print:gap-0">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:hidden">
                                        {layout === 'trifold' ? "Inside Sheet (Left / Center / Right)" : "Inside Sheet (Left / Right)"}
                                    </span>
                                    <div className="print-sheet bg-white shadow-lg w-[840px] h-[594px] flex flex-row overflow-hidden print:shadow-none rounded-xl border border-slate-200 select-none">
                                        {layout === 'trifold' ? (
                                            <>
                                                <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(1)}</div>
                                                <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(2)}</div>
                                                <div className="flex-1 h-full print-panel">{renderPanel(3)}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(1)}</div>
                                                <div className="flex-1 h-full print-panel">{renderPanel(2)}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                actions={
                    <div className="w-full text-center space-y-2">
                        <Button onClick={handlePrint} className="w-full gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-sm" size="lg">
                            <Printer className="w-5 h-5" /> Print Brochure
                        </Button>
                        <p className="text-[10px] text-muted-foreground select-none">Prints 2 pages (Duplex/double-sided required)</p>
                    </div>
                }
            />
        </>
    );
}
