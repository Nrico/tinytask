"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Label } from '@tinytask/ui/forms/label';
import { ColorPicker } from '@tinytask/ui/forms/color-picker';
import { FontSelector } from '@tinytask/ui/forms/font-selector';
import { ToolLayout } from '@tinytask/ui/layouts/tool-layout';
import { 
    Printer, 
    AlignLeft, 
    AlignCenter, 
    AlignRight, 
    ZoomIn, 
    ZoomOut, 
    Maximize2, 
    Move, 
    RotateCw, 
    BookOpen, 
    Layers, 
    Sparkles 
} from 'lucide-react';
import { cn } from '@tinytask/utils';

interface Panel {
    id: number;
    title: string;
    content: string; // HTML format content
    align: "left" | "center" | "right";
    bg: string;
    fontFamily: string;
}

interface Template {
    name: string;
    description: string;
    layout: 'book' | 'tent';
    panels: Omit<Panel, 'title'>[];
}

const TEMPLATES: Record<string, Template> = {
    birthday: {
        name: "🎉 Happy Birthday",
        description: "A bright and festive card with warm colors.",
        layout: "book",
        panels: [
            {
                id: 0,
                content: `<h1 style="color: #b45309; margin-top: 1rem; font-size: 1.8rem; font-weight: 800;">HAPPY BIRTHDAY!</h1>
                          <p style="font-size: 1.1rem; color: #d97706; margin-top: 0.5rem; font-weight: 600;">To Someone Extra Ordinary</p>
                          <div style="margin-top: 2rem; font-size: 2.5rem;">🎂🎈✨</div>`,
                align: "center",
                bg: "#fffbeb",
                fontFamily: "var(--font-oswald)"
            },
            {
                id: 1,
                content: `<h2 style="color: #b45309; margin-top: 1rem; font-size: 1.4rem; font-weight: 700;">Another Year of Awesome</h2>
                          <p style="margin-top: 0.75rem; line-height: 1.6;">May this birthday bring you as much happiness, laughter, and cheer as you bring to everyone around you.</p>
                          <p style="margin-top: 0.75rem; line-height: 1.6;">Here's to celebrating you and all the amazing things that make you so special!</p>`,
                align: "left",
                bg: "#ffffff",
                fontFamily: "var(--font-inter)"
            },
            {
                id: 2,
                content: `<p style="margin-top: 2rem; line-height: 1.6;">Wishing you a fantastic day and a wonderful year ahead filled with love, adventure, and success.</p>
                          <p style="margin-top: 2.5rem; font-weight: bold; color: #b45309; font-size: 1.1rem;">Cheers to you!</p>
                          <p style="margin-top: 1rem; line-height: 1.5;">With love,<br><strong>[Your Name]</strong></p>`,
                align: "left",
                bg: "#ffffff",
                fontFamily: "var(--font-inter)"
            },
            {
                id: 3,
                content: `<p style="color: #94a3b8; font-size: 0.85rem; margin-top: 5rem; font-family: var(--font-outfit);">Made with love using<br><strong>TinyTask Greeting Cards</strong></p>`,
                align: "center",
                bg: "#fffbeb",
                fontFamily: "var(--font-outfit)"
            }
        ]
    },
    thankyou: {
        name: "🌸 Elegant Thank You",
        description: "A soft, classic thank you card with serif headings.",
        layout: "book",
        panels: [
            {
                id: 0,
                content: `<h1 style="color: #166534; margin-top: 1.5rem; font-size: 2.4rem; font-style: italic; font-weight: 700;">Thank You</h1>
                          <p style="color: #15803d; font-size: 1.05rem; margin-top: 0.5rem;">For your warmth and kindness</p>
                          <div style="margin-top: 2.5rem; font-size: 2rem; color: #166534;">🌸</div>`,
                align: "center",
                bg: "#f0fdf4",
                fontFamily: "var(--font-playfair)"
            },
            {
                id: 1,
                content: `<h2 style="color: #166534; margin-top: 1rem; font-size: 1.4rem; font-weight: 700;">So Incredibly Grateful</h2>
                          <p style="margin-top: 0.75rem; line-height: 1.6;">I wanted to send a small note of appreciation for your incredible help. Your generosity and thoughtfulness have meant the world to me.</p>`,
                align: "left",
                bg: "#ffffff",
                fontFamily: "var(--font-inter)"
            },
            {
                id: 2,
                content: `<p style="margin-top: 1.5rem; line-height: 1.6;">Thank you once again for your support. People like you make the world a much brighter place.</p>
                          <p style="margin-top: 3rem; font-style: italic; color: #166534; font-size: 1.05rem;">Warmest regards,</p>
                          <p style="margin-top: 0.5rem;"><strong>[Your Name]</strong></p>`,
                align: "left",
                bg: "#ffffff",
                fontFamily: "var(--font-inter)"
            },
            {
                id: 3,
                content: `<p style="color: #94a3b8; font-size: 0.85rem; margin-top: 5rem;">Handcrafted for you</p>`,
                align: "center",
                bg: "#f0fdf4",
                fontFamily: "var(--font-outfit)"
            }
        ]
    },
    christmas: {
        name: "🎄 Holiday Cheer",
        description: "A cozy green and gold holiday card.",
        layout: "tent",
        panels: [
            {
                id: 0,
                content: `<h1 style="color: #fef08a; margin-top: 2rem; font-size: 2.2rem; font-weight: 800;">Merry & Bright</h1>
                          <p style="color: #a7f3d0; font-size: 1rem; margin-top: 0.5rem; font-family: var(--font-outfit);">Wishing you a beautiful holiday season</p>
                          <div style="margin-top: 2rem; font-size: 2.5rem;">🎄✨❄️</div>`,
                align: "center",
                bg: "#064e3b",
                fontFamily: "var(--font-playfair)"
            },
            {
                id: 1,
                content: `<h2 style="color: #064e3b; margin-top: 1.5rem; font-size: 1.4rem; font-weight: 700;">Peace & Joy</h2>
                          <p style="margin-top: 0.75rem; line-height: 1.6;">May the spirit of the holidays fill your home with warmth and your heart with peace.</p>`,
                align: "center",
                bg: "#ffffff",
                fontFamily: "var(--font-outfit)"
            },
            {
                id: 2,
                content: `<p style="margin-top: 1.5rem; line-height: 1.6;">Here's to a wonderful season and a happy, healthy New Year ahead!</p>
                          <p style="margin-top: 2rem; font-weight: bold; color: #064e3b; font-size: 1.1rem;">Merry Christmas!</p>
                          <p style="margin-top: 0.75rem;">Warmest wishes,<br><strong>[Your Name]</strong></p>`,
                align: "center",
                bg: "#ffffff",
                fontFamily: "var(--font-outfit)"
            },
            {
                id: 3,
                content: `<p style="color: #a7f3d0; font-size: 0.85rem; margin-top: 5rem;">Warm Holidays Edition</p>`,
                align: "center",
                bg: "#064e3b",
                fontFamily: "var(--font-outfit)"
            }
        ]
    },
    love: {
        name: "❤️ Sweet Hearts",
        description: "A cute card for Valentine's or anniversary.",
        layout: "book",
        panels: [
            {
                id: 0,
                content: `<h1 style="color: #be123c; margin-top: 1.5rem; font-size: 2rem; font-weight: 800;">You Have My Heart</h1>
                          <p style="color: #f43f5e; font-size: 1.05rem; margin-top: 0.5rem;">Today & Every Single Day</p>
                          <div style="margin-top: 2.5rem; font-size: 2.5rem;">❤️</div>`,
                align: "center",
                bg: "#fff1f2",
                fontFamily: "var(--font-outfit)"
            },
            {
                id: 1,
                content: `<h2 style="color: #be123c; margin-top: 1rem; font-size: 1.4rem; font-weight: 700;">To My Favorite Person</h2>
                          <p style="margin-top: 0.75rem; line-height: 1.6;">Thank you for your smiles, your laughs, and the endless ways you make my life brighter. I am so lucky to have you by my side.</p>`,
                align: "left",
                bg: "#ffffff",
                fontFamily: "var(--font-inter)"
            },
            {
                id: 2,
                content: `<p style="margin-top: 1.5rem; line-height: 1.6;">No matter where we go or what we do, I am happiest when I'm with you. Happy Valentine's Day!</p>
                          <p style="margin-top: 2.5rem; color: #be123c; font-weight: bold; font-size: 1.05rem;">Yours always,</p>
                          <p style="margin-top: 0.25rem;"><strong>[Your Name]</strong></p>`,
                align: "left",
                bg: "#ffffff",
                fontFamily: "var(--font-inter)"
            },
            {
                id: 3,
                content: `<p style="color: #fda4af; font-size: 0.85rem; margin-top: 5rem;">Made just for you • 2026</p>`,
                align: "center",
                bg: "#fff1f2",
                fontFamily: "var(--font-outfit)"
            }
        ]
    }
};

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
        { name: 'Pink', value: '#db2777' },
        { name: 'Gold', value: '#b45309' },
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

export default function GreetingCardPage() {
    const [layout, setLayout] = useState<'book' | 'tent'>('book');
    const [viewMode, setViewMode] = useState<'canvas' | '3d'>('canvas');

    // Panels: 0=Front, 1=Inside Left/Top, 2=Inside Right/Bottom, 3=Back
    const [panels, setPanels] = useState<Panel[]>([
        { id: 0, title: "Front Cover", content: TEMPLATES.birthday.panels[0].content, align: "center", bg: TEMPLATES.birthday.panels[0].bg, fontFamily: TEMPLATES.birthday.panels[0].fontFamily },
        { id: 1, title: "Inside Left / Top", content: TEMPLATES.birthday.panels[1].content, align: "left", bg: TEMPLATES.birthday.panels[1].bg, fontFamily: TEMPLATES.birthday.panels[1].fontFamily },
        { id: 2, title: "Inside Right / Bottom", content: TEMPLATES.birthday.panels[2].content, align: "left", bg: TEMPLATES.birthday.panels[2].bg, fontFamily: TEMPLATES.birthday.panels[2].fontFamily },
        { id: 3, title: "Back Cover", content: TEMPLATES.birthday.panels[3].content, align: "center", bg: TEMPLATES.birthday.panels[3].bg, fontFamily: TEMPLATES.birthday.panels[3].fontFamily },
    ]);
    const [activePanelId, setActivePanelId] = useState(0);

    // Viewport Size, Zoom & Pan State (for Canvas layout)
    const viewportRef = useRef<HTMLDivElement>(null);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const [zoom, setZoom] = useState(50);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // 3D Scene rotation states
    const [yaw, setYaw] = useState(-25);
    const [pitch, setPitch] = useState(-15);
    const [foldProgress, setFoldProgress] = useState(65); // starts partially folded to show 3D nature
    const [isDraggingScene, setIsDraggingScene] = useState(false);
    const dragSceneStart = useRef({ x: 0, y: 0 });
    const currentRotations = useRef({ yaw: -25, pitch: -15 });

    // Track scene resizing
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

    // Center active panel helper
    const focusActivePanelId = (panelId: number, currentZoom: number = zoom) => {
        const scale = currentZoom / 100;
        let targetPanX = 0;
        let targetPanY = 0;

        if (layout === 'book') {
            // Book Fold: Landscape sheet (840x594)
            // Left leaf (Panels 1, 3) vs Right leaf (Panels 0, 2)
            const isLeftLeaf = [1, 3].includes(panelId);
            const isOutsideSheet = [0, 3].includes(panelId);

            targetPanX = isLeftLeaf ? 210 * scale : -210 * scale;
            targetPanY = isOutsideSheet ? 309 * scale : -309 * scale;
        } else {
            // Tent Fold: Portrait sheet (594x840)
            // Top panel (Panels 1, 3) vs Bottom panel (Panels 0, 2)
            const isTopPanel = [1, 3].includes(panelId);
            const isOutsideSheet = [0, 3].includes(panelId);

            targetPanX = 0;
            if (isOutsideSheet) {
                targetPanY = isTopPanel ? 642 * scale : 222 * scale;
            } else {
                targetPanY = isTopPanel ? -222 * scale : -642 * scale;
            }
        }

        setPan({ x: targetPanX, y: targetPanY });
    };

    const focusActivePanel = (currentZoom: number = zoom) => {
        focusActivePanelId(activePanelId, currentZoom);
    };

    const handleFitToScreen = () => {
        if (!viewportSize.width || !viewportSize.height) return;
        
        const canvasWidth = layout === 'book' ? 840 : 594;
        const canvasHeight = layout === 'book' ? 1212 : 1704; // 2 sheets + gaps
        
        const fitWidthScale = (viewportSize.width - 48) / canvasWidth;
        const fitHeightScale = (viewportSize.height - 48) / canvasHeight;
        
        const newZoom = Math.max(10, Math.min(150, Math.floor(Math.min(fitWidthScale, fitHeightScale) * 100)));
        setZoom(newZoom);
        setPan({ x: 0, y: 0 });
    };

    const handleFitSheet = () => {
        if (!viewportSize.width || !viewportSize.height) return;
        
        const canvasWidth = layout === 'book' ? 840 : 594;
        const canvasHeight = layout === 'book' ? 594 : 840;
        
        const fitWidthScale = (viewportSize.width - 48) / canvasWidth;
        const fitHeightScale = (viewportSize.height - 48) / canvasHeight;
        
        const newZoom = Math.max(10, Math.min(150, Math.floor(Math.min(fitWidthScale, fitHeightScale) * 100)));
        setZoom(newZoom);
        focusActivePanelId(activePanelId, newZoom);
    };

    // Auto-fit on first load or layout change
    useEffect(() => {
        if (viewportSize.width > 0 && viewportSize.height > 0 && viewMode === 'canvas') {
            handleFitToScreen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportSize.width, viewportSize.height, layout, viewMode]);

    // Auto-slide to panel when activePanelId changes
    useEffect(() => {
        if (viewMode === 'canvas') {
            focusActivePanel(zoom);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePanelId]);

    // Drag-to-pan handlers for canvas
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

    // 3D Scene Mouse Rotation Handlers
    const handleSceneMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input')) return;
        setIsDraggingScene(true);
        dragSceneStart.current = { x: e.clientX, y: e.clientY };
        currentRotations.current = { yaw, pitch };
    };

    const handleSceneMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingScene) return;
        const deltaX = e.clientX - dragSceneStart.current.x;
        const deltaY = e.clientY - dragSceneStart.current.y;
        setYaw(currentRotations.current.yaw + deltaX * 0.6);
        setPitch(Math.max(-50, Math.min(50, currentRotations.current.pitch - deltaY * 0.6)));
    };

    const handleSceneMouseUp = () => {
        setIsDraggingScene(false);
    };

    const handleSceneTouchStart = (e: React.TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input')) return;
        if (e.touches.length === 1) {
            setIsDraggingScene(true);
            dragSceneStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            currentRotations.current = { yaw, pitch };
        }
    };

    const handleSceneTouchMove = (e: React.TouchEvent) => {
        if (!isDraggingScene) return;
        if (e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - dragSceneStart.current.x;
            const deltaY = e.touches[0].clientY - dragSceneStart.current.y;
            setYaw(currentRotations.current.yaw + deltaX * 0.6);
            setPitch(Math.max(-50, Math.min(50, currentRotations.current.pitch - deltaY * 0.6)));
        }
    };

    const handleSceneTouchEnd = () => {
        setIsDraggingScene(false);
    };

    const handlePanelUpdate = (key: keyof Panel, value: string) => {
        setPanels(panels.map(p => p.id === activePanelId ? { ...p, [key]: value } : p));
    };

    const handleApplyPreset = (presetName: string) => {
        const preset = TEMPLATES[presetName];
        if (!preset) return;

        setLayout(preset.layout);
        setPanels(panels.map((p, idx) => ({
            ...p,
            content: preset.panels[idx].content,
            bg: preset.panels[idx].bg,
            fontFamily: preset.panels[idx].fontFamily,
            align: preset.panels[idx].align as any
        })));
        setActivePanelId(0);
    };

    const handlePrint = () => {
        window.print();
    };

    const activePanel = panels.find(p => p.id === activePanelId)!;

    // Render interactive canvas panel
    const renderPanel = (panelId: number, inverted: boolean = false) => {
        const p = panels.find(pan => pan.id === panelId)!;
        // Panel labels depend on orientation
        let subTitle = "Inside Panel";
        if (panelId === 0) {
            subTitle = "Front Cover";
        } else if (panelId === 3) {
            subTitle = "Back Cover";
        } else if (panelId === 1) {
            subTitle = layout === 'book' ? "Inside Left" : "Inside Top";
        } else if (panelId === 2) {
            subTitle = layout === 'book' ? "Inside Right" : "Inside Bottom";
        }

        return (
            <div
                className={cn(
                    "h-full w-full p-8 flex flex-col overflow-hidden relative cursor-pointer hover:bg-slate-50/10 transition-colors",
                    inverted ? "transform rotate-180" : ""
                )}
                style={{ backgroundColor: p.bg, textAlign: p.align, fontFamily: p.fontFamily }}
                onClick={() => {
                    setActivePanelId(panelId);
                    focusActivePanelId(panelId, zoom);
                }}
            >
                {/* Active Highlight Border - Hidden on print */}
                <div className={cn(
                    "absolute inset-0 pointer-events-none border-4 transition-colors print:hidden",
                    activePanelId === panelId ? 'border-sky-500/50' : 'border-transparent'
                )}></div>
                
                {/* Rich Content Area */}
                <div 
                    className="card-rich-content text-xs md:text-sm text-slate-700 leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{ __html: p.content }}
                />

                {/* Subtitle Footer - Hidden on print */}
                <div className="mt-auto pt-4 text-[10px] text-slate-400/80 font-mono text-center uppercase tracking-widest select-none print:hidden border-t border-dashed border-slate-200/40">
                    {subTitle}
                </div>
            </div>
        );
    };

    // Calculate open angle for 3D card leaves
    const openAngle = (foldProgress / 100) * 180; // 0 = closed, 180 = flat open

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                /* CSS Styles for Rich Content inside Panels */
                .rich-editor-content:empty::before {
                    content: "Type card message here...";
                    color: #94a3b8;
                    pointer-events: none;
                    display: block;
                }
                .card-rich-content h1 {
                    font-size: 1.6rem;
                    font-weight: 800;
                    margin-top: 0.25rem;
                    margin-bottom: 0.6rem;
                    line-height: 1.25;
                    color: inherit;
                }
                .card-rich-content h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-top: 0.25rem;
                    margin-bottom: 0.5rem;
                    line-height: 1.3;
                    color: inherit;
                }
                .card-rich-content p {
                    margin-bottom: 0.6rem;
                    line-height: 1.5;
                }
                .card-rich-content ul {
                    list-style-type: disc;
                    padding-left: 1.25rem;
                    margin-bottom: 0.6rem;
                }
                .card-rich-content li {
                    margin-bottom: 0.3rem;
                }
                .card-rich-content strong {
                    font-weight: 700;
                    color: inherit;
                }
                .card-rich-content em {
                    font-style: italic;
                }

                /* 3D Scene and Object styles */
                .scene-container {
                    perspective: 1500px;
                    perspective-origin: center center;
                    width: 100%;
                    height: 520px;
                    background: radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%);
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: grab;
                    box-shadow: inset 0 2px 8px rgba(0,0,0,0.02);
                }
                .scene-container:active {
                    cursor: grabbing;
                }
                .card-3d-object {
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.1s ease-out;
                }
                .card-leaf {
                    position: absolute;
                    transform-style: preserve-3d;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02);
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .card-leaf-left {
                    width: 250px;
                    height: 350px;
                    right: 50%;
                    transform-origin: right center;
                }
                .card-leaf-right {
                    width: 250px;
                    height: 350px;
                    left: 50%;
                    transform-origin: left center;
                }
                .card-leaf-top {
                    width: 350px;
                    height: 250px;
                    bottom: 50%;
                    transform-origin: bottom center;
                }
                .card-leaf-bottom {
                    width: 350px;
                    height: 250px;
                    top: 50%;
                    transform-origin: top center;
                }
                .card-face {
                    position: absolute;
                    inset: 0;
                    backface-visibility: hidden;
                    padding: 24px;
                    box-shadow: inset 0 0 30px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.06);
                    border-radius: 6px;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }
                .card-face::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%);
                    pointer-events: none;
                }
                
                /* Spine creases */
                .card-fold-shadow {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 16px;
                    left: calc(50% - 8px);
                    background: linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.08) 100%);
                    pointer-events: none;
                    z-index: 10;
                }
                .card-fold-shadow-horizontal {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 16px;
                    top: calc(50% - 8px);
                    background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.08) 100%);
                    pointer-events: none;
                    z-index: 10;
                }

                /* Print overrides */
                @media print {
                    @page {
                        size: auto;
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
                    #card-print-area, #card-print-area * { visibility: visible !important; }
                    #card-print-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        transform: none !important;
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print-sheet {
                        width: 100vw !important;
                        height: 100vh !important;
                        page-break-after: always !important;
                        display: flex !important;
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
                        padding: 2in !important;
                    }
                    header, footer, nav, aside, .no-print { display: none !important; }
                }
            `}} />

            <ToolLayout
                title="Greeting Card Maker"
                description="Design folded greeting cards (Vertical Book Fold or Horizontal Tent Fold) with high-quality styling."
                sidebarContent={
                    <div className="space-y-6">
                        {/* Preset templates */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                                <Sparkles className="w-4 h-4 text-sky-500" /> Card Templates
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(TEMPLATES).map(([key, template]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleApplyPreset(key)}
                                        className="h-10 text-[11px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all font-medium text-slate-600 flex items-center justify-center cursor-pointer px-2 text-center"
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Layout Selectors */}
                        <div className="space-y-2 border-t pt-4">
                            <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                                <Layers className="w-4 h-4 text-indigo-500" /> Folding Layout
                            </Label>
                            <div className="flex gap-2">
                                <Button
                                    variant={layout === 'book' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setLayout('book');
                                        // Update titles for panels to fit book
                                        setPanels(prev => prev.map(p => {
                                            if (p.id === 1) return { ...p, title: "Inside Left" };
                                            if (p.id === 2) return { ...p, title: "Inside Right" };
                                            return p;
                                        }));
                                    }}
                                    className="flex-1 text-xs"
                                    size="sm"
                                >
                                    Book Fold (Vertical)
                                </Button>
                                <Button
                                    variant={layout === 'tent' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setLayout('tent');
                                        // Update titles for panels to fit tent
                                        setPanels(prev => prev.map(p => {
                                            if (p.id === 1) return { ...p, title: "Inside Top" };
                                            if (p.id === 2) return { ...p, title: "Inside Bottom" };
                                            return p;
                                        }));
                                    }}
                                    className="flex-1 text-xs"
                                    size="sm"
                                >
                                    Tent Fold (Horizontal)
                                </Button>
                            </div>
                        </div>

                        {/* Panel Selector */}
                        <div className="space-y-2 border-t pt-4">
                            <Label className="text-slate-700 font-semibold">Select Panel to Edit</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {panels.map(p => {
                                    let label = p.title;
                                    if (p.id === 1) label = layout === 'book' ? "Inside Left" : "Inside Top";
                                    if (p.id === 2) label = layout === 'book' ? "Inside Right" : "Inside Bottom";
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                setActivePanelId(p.id);
                                                if (viewMode === 'canvas') {
                                                    focusActivePanelId(p.id, zoom);
                                                }
                                            }}
                                            className={cn(
                                                "h-12 rounded-lg border text-xs flex items-center justify-center text-center p-1 transition-all cursor-pointer",
                                                activePanelId === p.id
                                                    ? 'border-sky-500 ring-1 ring-sky-500 bg-sky-50 text-sky-700 font-semibold'
                                                    : 'border-border hover:bg-slate-50 text-muted-foreground'
                                            )}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rich Content Editor */}
                        <div className="space-y-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Panel Text Editor</Label>
                                <RichTextEditor
                                    value={activePanel.content}
                                    onChange={(val) => handlePanelUpdate('content', val)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Text Alignment</Label>
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

                            <FontSelector
                                value={activePanel.fontFamily}
                                onChange={(val) => handlePanelUpdate('fontFamily', val)}
                            />

                            <ColorPicker
                                label="Panel Background Color"
                                value={activePanel.bg}
                                onChange={(val) => handlePanelUpdate('bg', val)}
                            />
                        </div>
                    </div>
                }
                previewContent={
                    <div className="w-full h-full flex flex-col select-none overflow-hidden relative">
                        {/* Top View Toggle Toolbar */}
                        <div className="flex-shrink-0 flex flex-wrap gap-4 items-center justify-between border-b pb-4 mb-4 select-none print:hidden">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'canvas' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('canvas')}
                                    className="text-xs gap-1.5 h-8"
                                >
                                    <Layers className="w-3.5 h-3.5" /> Edit Sheets
                                </Button>
                                <Button
                                    variant={viewMode === '3d' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('3d')}
                                    className="text-xs gap-1.5 h-8 bg-gradient-to-r from-indigo-500/10 to-sky-500/10 border-indigo-200 text-indigo-700 hover:from-indigo-500 hover:to-sky-500 hover:text-white"
                                >
                                    <BookOpen className="w-3.5 h-3.5 animate-pulse" /> 3D Fold Preview
                                </Button>
                            </div>

                            {/* Controls for Canvas Mode */}
                            {viewMode === 'canvas' && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-slate-100 border text-slate-500 rounded px-1.5 py-0.5 font-mono flex items-center gap-1">
                                        <Move className="w-3 h-3 text-slate-400" /> Drag to pan
                                    </span>
                                    <div className="h-4 w-px bg-slate-200 mx-1" />
                                    <button
                                        onClick={() => setZoom(Math.max(10, zoom - 10))}
                                        className="p-1 rounded hover:bg-slate-200 border bg-white shadow-sm transition-colors text-slate-600 disabled:opacity-50 flex items-center justify-center w-7 h-7 cursor-pointer"
                                        disabled={zoom <= 10}
                                    >
                                        <ZoomOut className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-xs font-mono font-bold w-12 text-center text-slate-700 bg-slate-100 px-2 py-0.5 rounded border select-none">
                                        {zoom}%
                                    </span>
                                    <button
                                        onClick={() => setZoom(Math.min(150, zoom + 10))}
                                        className="p-1 rounded hover:bg-slate-200 border bg-white shadow-sm transition-colors text-slate-600 disabled:opacity-50 flex items-center justify-center w-7 h-7 cursor-pointer"
                                        disabled={zoom >= 150}
                                    >
                                        <ZoomIn className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="h-4 w-px bg-slate-200 mx-1" />

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleFitToScreen}
                                        className="text-xs px-2 h-8 font-medium"
                                    >
                                        Fit All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleFitSheet}
                                        className="text-xs px-2 h-8 font-medium"
                                    >
                                        Center Active
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { setZoom(100); setPan({ x: 0, y: 0 }); }}
                                        className="text-xs px-2 h-8 font-medium"
                                    >
                                        <Maximize2 className="w-3.5 h-3.5 mr-1" /> 100%
                                    </Button>
                                </div>
                            )}

                            {/* Slider for 3D Mode */}
                            {viewMode === '3d' && (
                                <div className="flex items-center gap-4 flex-1 max-w-sm ml-4">
                                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Fold Card:</span>
                                    <input 
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={foldProgress}
                                        onChange={(e) => setFoldProgress(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <span className="text-xs font-mono font-bold text-slate-600 w-10 text-right">
                                        {foldProgress === 0 ? "Closed" : foldProgress === 100 ? "Open" : `${foldProgress}%`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Main View Area */}
                        <div className="flex-1 w-full relative min-h-0">
                            {viewMode === 'canvas' ? (
                                /* Canvas Mode: Flat sheet layout */
                                <div 
                                    ref={viewportRef}
                                    className="w-full h-full border border-slate-200 bg-slate-50/50 rounded-xl relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <div 
                                        id="card-print-area"
                                        className="flex flex-col gap-6 items-center flex-shrink-0"
                                        style={{
                                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
                                            transformOrigin: 'center center',
                                            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                        }}
                                    >
                                        {layout === 'book' ? (
                                            /* Book Fold Flat Sheets (Horizontal landscape layout) */
                                            <>
                                                {/* Outside Sheet (Back / Front) */}
                                                <div className="flex flex-col items-center gap-2 w-[840px] select-none print:w-full print:h-full print:gap-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:hidden">Outside Sheet (Back / Front)</span>
                                                    <div className="print-sheet bg-white shadow-lg w-[840px] h-[594px] flex flex-row overflow-hidden print:shadow-none rounded-xl border border-slate-200 select-none">
                                                        <div className="flex-1 h-full border-r border-slate-200/60 print-panel">{renderPanel(3)}</div>
                                                        <div className="flex-1 h-full print-panel">{renderPanel(0)}</div>
                                                    </div>
                                                </div>

                                                {/* Inside Sheet (Left / Right) */}
                                                <div className="flex flex-col items-center gap-2 w-[840px] select-none print:w-full print:h-full print:gap-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:hidden">Inside Sheet (Left / Right)</span>
                                                    <div className="print-sheet bg-white shadow-lg w-[840px] h-[594px] flex flex-row overflow-hidden print:shadow-none rounded-xl border border-slate-200 select-none">
                                                        <div className="flex-1 h-full border-r border-slate-200/60 print-panel">{renderPanel(1)}</div>
                                                        <div className="flex-1 h-full print-panel">{renderPanel(2)}</div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            /* Tent Fold Flat Sheets (Vertical portrait layout) */
                                            <>
                                                {/* Outside Sheet (Back Cover [rotated] / Front Cover) */}
                                                <div className="flex flex-col items-center gap-2 w-[594px] select-none print:w-full print:h-full print:gap-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:hidden">Outside Sheet (Back Cover [rotated 180°] / Front Cover)</span>
                                                    <div className="print-sheet bg-white shadow-lg w-[594px] h-[840px] flex flex-col overflow-hidden print:shadow-none rounded-xl border border-slate-200 select-none">
                                                        <div className="flex-1 w-full border-b border-slate-200/60 print-panel">{renderPanel(3, true)}</div>
                                                        <div className="flex-1 w-full print-panel">{renderPanel(0)}</div>
                                                    </div>
                                                </div>

                                                {/* Inside Sheet (Inside Top [rotated] / Inside Bottom) */}
                                                <div className="flex flex-col items-center gap-2 w-[594px] select-none print:w-full print:h-full print:gap-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:hidden">Inside Sheet (Inside Top [rotated 180°] / Inside Bottom)</span>
                                                    <div className="print-sheet bg-white shadow-lg w-[594px] h-[840px] flex flex-col overflow-hidden print:shadow-none rounded-xl border border-slate-200 select-none">
                                                        <div className="flex-1 w-full border-b border-slate-200/60 print-panel">{renderPanel(1, true)}</div>
                                                        <div className="flex-1 w-full print-panel">{renderPanel(2)}</div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* 3D Fold Preview Mode */
                                <div 
                                    className="scene-container"
                                    onMouseDown={handleSceneMouseDown}
                                    onMouseMove={handleSceneMouseMove}
                                    onMouseUp={handleSceneMouseUp}
                                    onMouseLeave={handleSceneMouseUp}
                                    onTouchStart={handleSceneTouchStart}
                                    onTouchMove={handleSceneTouchMove}
                                    onTouchEnd={handleSceneTouchEnd}
                                >
                                    {/* Mouse rotation hints */}
                                    <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200/90 font-mono flex items-center gap-1.5 select-none pointer-events-none">
                                        <RotateCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} /> Click & Drag to Rotate Card
                                    </div>

                                    {layout === 'book' ? (
                                        /* 3D Vertical Book Fold Card object */
                                        <div 
                                            className="card-3d-object"
                                            style={{
                                                width: '500px',
                                                height: '350px',
                                                transform: `rotateX(${pitch}deg) rotateY(${yaw}deg)`,
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            {/* Left Leaf (Inside Left, Back Cover) */}
                                            <div 
                                                className="card-leaf card-leaf-left"
                                                style={{
                                                    transform: `rotateY(${openAngle / 2}deg)`,
                                                }}
                                            >
                                                {/* Front Face: Inside Left */}
                                                <div 
                                                    className="card-face card-face-front card-rich-content"
                                                    style={{ 
                                                        backgroundColor: panels[1].bg, 
                                                        textAlign: panels[1].align,
                                                        fontFamily: panels[1].fontFamily 
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: panels[1].content }}
                                                />
                                                {/* Back Face: Back Cover */}
                                                <div 
                                                    className="card-face card-face-back card-rich-content"
                                                    style={{ 
                                                        backgroundColor: panels[3].bg, 
                                                        textAlign: panels[3].align,
                                                        fontFamily: panels[3].fontFamily,
                                                        transform: 'rotateY(-180deg)'
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: panels[3].content }}
                                                />
                                            </div>

                                            {/* Right Leaf (Inside Right, Front Cover) */}
                                            <div 
                                                className="card-leaf card-leaf-right"
                                                style={{
                                                    transform: `rotateY(${-openAngle / 2}deg)`,
                                                }}
                                            >
                                                {/* Front Face: Inside Right */}
                                                <div 
                                                    className="card-face card-face-front card-rich-content"
                                                    style={{ 
                                                        backgroundColor: panels[2].bg, 
                                                        textAlign: panels[2].align,
                                                        fontFamily: panels[2].fontFamily 
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: panels[2].content }}
                                                />
                                                {/* Back Face: Front Cover */}
                                                <div 
                                                    className="card-face card-face-back card-rich-content"
                                                    style={{ 
                                                        backgroundColor: panels[0].bg, 
                                                        textAlign: panels[0].align,
                                                        fontFamily: panels[0].fontFamily,
                                                        transform: 'rotateY(180deg)'
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: panels[0].content }}
                                                />
                                            </div>
                                            
                                            {/* Crease fold lines shadow */}
                                            <div className="card-fold-shadow" />
                                        </div>
                                    ) : (
                                        /* 3D Horizontal Tent Fold Card object */
                                        <div 
                                            className="card-3d-object"
                                            style={{
                                                width: '350px',
                                                height: '500px',
                                                transform: `rotateX(${pitch}deg) rotateY(${yaw}deg)`,
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            {/* Bottom Leaf (Inside Bottom, Back Cover) */}
                                            <div 
                                                className="card-leaf card-leaf-bottom"
                                                style={{
                                                    transform: `rotateX(${-openAngle / 2}deg)`,
                                                }}
                                            >
                                                {/* Front Face: Inside Bottom */}
                                                <div 
                                                    className="card-face card-face-front card-rich-content"
                                                    style={{ 
                                                        backgroundColor: panels[2].bg, 
                                                        textAlign: panels[2].align,
                                                        fontFamily: panels[2].fontFamily 
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: panels[2].content }}
                                                />
                                                {/* Back Face: Back Cover */}
                                                <div 
                                                    className="card-face card-face-back card-rich-content"
                                                    style={{ 
                                                        backgroundColor: panels[3].bg, 
                                                        textAlign: panels[3].align,
                                                        fontFamily: panels[3].fontFamily,
                                                        transform: 'rotateX(180deg)'
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: panels[3].content }}
                                                />
                                            </div>

                                            {/* Top Leaf (Inside Top, Front Cover) */}
                                            <div 
                                                className="card-leaf card-leaf-top"
                                                style={{
                                                    transform: `rotateX(${openAngle / 2}deg)`,
                                                }}
                                            >
                                                {/* Front Face: Inside Top */}
                                                <div 
                                                    className="card-face card-face-front card-rich-content"
                                                    style={{ 
                                                        backgroundColor: panels[1].bg, 
                                                        textAlign: panels[1].align,
                                                        fontFamily: panels[1].fontFamily 
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: panels[1].content }}
                                                />
                                                {/* Back Face: Front Cover */}
                                                <div 
                                                    className="card-face card-face-back card-rich-content"
                                                    style={{ 
                                                        backgroundColor: panels[0].bg, 
                                                        textAlign: panels[0].align,
                                                        fontFamily: panels[0].fontFamily,
                                                        transform: 'rotateX(-180deg)'
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: panels[0].content }}
                                                />
                                            </div>
                                            
                                            {/* Crease fold lines shadow */}
                                            <div className="card-fold-shadow-horizontal" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                }
                actions={
                    <div className="w-full text-center space-y-2">
                        <Button onClick={handlePrint} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" size="lg">
                            <Printer className="w-5 h-5" /> Print Card
                        </Button>
                        <p className="text-[10px] text-muted-foreground select-none">
                            {layout === 'book' 
                                ? "Prints 2 Landscape pages (fold vertically)" 
                                : "Prints 2 Portrait pages (fold horizontally)"
                            }
                        </p>
                    </div>
                }
            />
        </>
    );
}
