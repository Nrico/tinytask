"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@tinytask/ui/buttons/button";
import { Label } from "@tinytask/ui/forms/label";
import { Slider } from "@tinytask/ui/forms/slider";
import { FontSelector } from "@tinytask/ui/forms/font-selector";
import { ColorPicker } from "@tinytask/ui/forms/color-picker";
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout";
import { useBrandKit } from "@tinytask/ui/brand/brand-context";
import { FileUploader } from "@tinytask/ui/forms/file-uploader";
import { Printer, ZoomIn, ZoomOut, Maximize2, Move, Image as ImageIcon } from "lucide-react";

export default function NameTentPage() {
    const { activeBrandKit, isBrandedSession } = useBrandKit();

    const [namesInput, setNamesInput] = useState("John Doe\nJane Smith");
    const [fontSize, setFontSize] = useState(100);
    const [fontFamily, setFontFamily] = useState("var(--font-outfit)");
    const [textColor, setTextColor] = useState("#0f172a");
    const [bgColor, setBgColor] = useState("#ffffff");

    // Logo & Back fold states
    const [logo, setLogo] = useState<string | null>(null);
    const [logoPosition, setLogoPosition] = useState<'none' | 'top' | 'bottom'>('none');
    const [differentBackText, setDifferentBackText] = useState(false);
    const [backText, setBackText] = useState(
        "# Today's Agenda\n" +
        "## Morning\n" +
        "- 09:00 AM - Welcome & Intros\n" +
        "- 10:30 AM - Product Architecture Roadmap\n" +
        "## Afternoon\n" +
        "- 12:00 PM - Lunch Break\n" +
        "- 01:30 PM - Interactive Q&A Session\n" +
        "- 03:00 PM - Closing Remarks"
    );

    // Sync logo, colors and fonts if branded session
    useEffect(() => {
        if (isBrandedSession && activeBrandKit) {
            setTextColor(activeBrandKit.colors.primary);
            if (activeBrandKit.font) {
                setFontFamily(activeBrandKit.font);
            }
            if (activeBrandKit.logos?.primary) {
                setLogo(activeBrandKit.logos.primary);
                setLogoPosition('top');
            }
        }
    }, [isBrandedSession, activeBrandKit]);

    // Viewport Size, Zoom & Pan State
    const viewportRef = useRef<HTMLDivElement>(null);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const [zoom, setZoom] = useState(60);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Parse names into array
    const names = namesInput.split('\n').filter(n => n.trim() !== '');

    // Track viewport size changes
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

    const handleFitSheet = () => {
        if (!viewportSize.width || !viewportSize.height) return;
        
        // Single A4 sheet width and height (at 96 DPI: 297mm -> ~1122px, 210mm -> ~794px)
        const canvasWidth = 1122;
        const canvasHeight = 794;
        
        const fitWidthScale = (viewportSize.width - 48) / canvasWidth;
        const fitHeightScale = (viewportSize.height - 48) / canvasHeight;
        
        const newZoom = Math.max(15, Math.min(200, Math.floor(Math.min(fitWidthScale, fitHeightScale) * 100)));
        setZoom(newZoom);
        setPan({ x: 0, y: 0 });
    };

    // Auto-fit on first load or when viewport size changes
    useEffect(() => {
        if (viewportSize.width > 0 && viewportSize.height > 0) {
            handleFitSheet();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportSize.width, viewportSize.height]);

    // Drag-to-pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('textarea')) {
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
        if (target.closest('button') || target.closest('input') || target.closest('textarea')) {
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
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
                    #printable-area, #printable-area * { visibility: visible !important; }
                    #printable-area {
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
                    .page-break {
                        page-break-after: always !important;
                        break-after: page !important;
                        height: 100vh !important;
                        width: 100vw !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
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

                        {/* Logo Section */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-rose-500" /> Card Logo
                            </h3>

                            {isBrandedSession ? (
                                <div className="text-xs text-slate-500 italic p-3 bg-slate-50 border rounded-lg flex items-center gap-4">
                                    {logo ? (
                                        <>
                                            <img src={logo} alt="Logo" className="max-h-10 max-w-[100px] object-contain border p-1 rounded bg-white" />
                                            <span>Locked to brand logo</span>
                                        </>
                                    ) : (
                                        <span>Locked to brand identity (No logo provided)</span>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {logo ? (
                                        <div className="flex items-center justify-between border p-2 rounded-lg bg-slate-50">
                                            <img src={logo} alt="Logo preview" className="max-h-10 max-w-[100px] object-contain rounded" />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-7"
                                                onClick={() => setLogo(null)}
                                            >
                                                Remove Logo
                                            </Button>
                                        </div>
                                    ) : (
                                        <FileUploader
                                            onFileSelect={(file) => {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setLogo(reader.result as string);
                                                    setLogoPosition('top');
                                                };
                                                reader.readAsDataURL(file);
                                            }}
                                            accept="image/*"
                                            allowedExtensions={['.png', '.jpg', '.jpeg', '.svg']}
                                            description="Max height 40px"
                                        />
                                    )}
                                </div>
                            )}

                            {logo && (
                                <div className="space-y-2">
                                    <Label htmlFor="logo-position">Logo Placement</Label>
                                    <select
                                        id="logo-position"
                                        value={logoPosition}
                                        onChange={(e) => setLogoPosition(e.target.value as any)}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="none">Do Not Show</option>
                                        <option value="top">Above Attendee Name</option>
                                        <option value="bottom">Below Attendee Name</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Back Fold Agenda */}
                        <div className="space-y-4 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="different-back-text" className="font-semibold text-slate-800 text-sm cursor-pointer select-none">
                                    Agenda / Info on Back Fold
                                </Label>
                                <input
                                    id="different-back-text"
                                    type="checkbox"
                                    checked={differentBackText}
                                    onChange={(e) => setDifferentBackText(e.target.checked)}
                                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                                />
                            </div>

                            {differentBackText && (
                                <div className="space-y-2">
                                    <textarea
                                        id="back-text-content"
                                        value={backText}
                                        onChange={(e) => setBackText(e.target.value)}
                                        className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-rose-500 outline-none h-40 font-mono text-xs bg-background text-foreground leading-normal"
                                        placeholder="Write agenda notes... supports # Header, ## Subhead, - Bullet points"
                                    />
                                    <p className="text-[10px] text-muted-foreground leading-normal">
                                        Use `# ` for major headers, `## ` for subheaders, and `- ` or `* ` for bulleted list items.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                }
                previewContent={
                    <div className="w-full h-full flex flex-col select-none overflow-hidden relative">
                        {/* Top Canvas Toolbar */}
                        <div className="flex-shrink-0 flex flex-wrap gap-3 items-center justify-between border-b pb-3 mb-4 select-none print:hidden">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name Tent Canvas</span>
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
                                    onClick={handleFitSheet}
                                    className="text-xs px-2.5 h-8 font-medium"
                                >
                                    Fit Page
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
                                id="printable-area"
                                className="flex flex-col gap-6 items-center flex-shrink-0"
                                style={{
                                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
                                    transformOrigin: 'center center',
                                    transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                }}
                            >
                                {names.length === 0 ? (
                                    <div className="text-muted-foreground italic mt-12 bg-white p-6 border rounded-xl shadow-sm">Enter names to see previews...</div>
                                ) : (
                                    names.map((name, index) => (
                                        <div
                                            key={index}
                                            className="bg-white shadow-lg print:shadow-none w-[297mm] h-[210mm] print:w-screen print:h-screen flex-shrink-0 flex flex-col overflow-hidden relative page-break rounded-xl border border-slate-200"
                                            style={{ 
                                                backgroundColor: bgColor
                                            }}
                                        >
                                            {/* Top Half (Inverted) */}
                                            <div className="flex-1 flex flex-col items-center justify-center border-b border-dashed border-slate-300 print:border-slate-100 p-8 transform rotate-180 select-text">
                                                {logo && logoPosition === 'top' && (
                                                    <img src={logo} alt="Logo" className="max-h-10 w-auto object-contain mb-4 flex-shrink-0" />
                                                )}
                                                
                                                {differentBackText ? (
                                                    <div 
                                                        className="w-full flex-1 flex flex-col justify-center px-12 text-left"
                                                        style={{
                                                            fontFamily: fontFamily,
                                                            color: textColor
                                                        }}
                                                    >
                                                        <div className="space-y-2 leading-relaxed max-h-full overflow-hidden select-text text-slate-700">
                                                            {backText ? (
                                                                backText.split('\n').map((line, lIdx) => {
                                                                    const trimmed = line.trim();
                                                                    if (trimmed.startsWith('# ')) {
                                                                        return <h2 key={lIdx} className="text-xl font-bold border-b pb-1 mb-2" style={{ color: textColor }}>{trimmed.replace('# ', '')}</h2>;
                                                                    }
                                                                    if (trimmed.startsWith('## ')) {
                                                                        return <h3 key={lIdx} className="text-sm font-semibold mt-2" style={{ color: textColor }}>{trimmed.replace('## ', '')}</h3>;
                                                                    }
                                                                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                                                                        return <li key={lIdx} className="ml-4 list-disc text-xs" style={{ color: textColor }}>{trimmed.substring(2)}</li>;
                                                                    }
                                                                    return <p key={lIdx} className="text-xs" style={{ color: textColor }}>{line}</p>;
                                                                })
                                                            ) : (
                                                                <div className="text-slate-400 italic text-center text-xs">
                                                                    Agenda / Info back fold
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
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
                                                )}

                                                {logo && logoPosition === 'bottom' && (
                                                    <img src={logo} alt="Logo" className="max-h-10 w-auto object-contain mt-4 flex-shrink-0" />
                                                )}
                                            </div>

                                            {/* Bottom Half (Normal) */}
                                            <div className="flex-1 flex flex-col items-center justify-center p-8 select-text">
                                                {logo && logoPosition === 'top' && (
                                                    <img src={logo} alt="Logo" className="max-h-10 w-auto object-contain mb-4 flex-shrink-0" />
                                                )}
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
                                                {logo && logoPosition === 'bottom' && (
                                                    <img src={logo} alt="Logo" className="max-h-10 w-auto object-contain mt-4 flex-shrink-0" />
                                                )}
                                            </div>

                                            {/* Fold Guides (Visual only, faint in print) */}
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono -rotate-90 print:hidden select-none">FOLD HERE</div>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono rotate-90 print:hidden select-none">FOLD HERE</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
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
