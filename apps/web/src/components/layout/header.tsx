"use client"

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useBrandKit, encodeBrandKit } from "@tinytask/ui/brand/brand-context";
import { cn } from "@tinytask/utils";
import { 
    User, 
    LogOut, 
    ChevronDown, 
    FileText, 
    Globe, 
    Mail, 
    Image as ImageIcon, 
    BookOpen, 
    Heart, 
    Users, 
    Tent, 
    Table, 
    QrCode, 
    Tags, 
    FileSpreadsheet, 
    Zap,
    Search,
    Sparkles,
    Trash2,
    Minimize2,
    List,
    Type,
    RefreshCw,
    PenTool,
    Link2,
    Shield,
    Package,
    ShieldAlert,
    Grid
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HowToGuide } from "@/components/layout/how-to-guide";

interface ToolItem {
    slug: string;
    name: string;
    description: string;
    category: "print" | "data" | "text" | "digital";
    icon: React.ComponentType<{ className?: string }>;
    keywords: string[];
}

const ALL_TOOLS: ToolItem[] = [
    // Office & Print Docs
    {
        slug: "invoice-swift",
        name: "Invoice Swift",
        description: "Create professional PDF invoices instantly.",
        category: "print",
        icon: FileText,
        keywords: ["invoice", "pdf", "billing", "receipt", "payment"]
    },
    {
        slug: "brochure-builder",
        name: "Brochure Builder",
        description: "Design and print tri-fold and bi-fold brochures.",
        category: "print",
        icon: BookOpen,
        keywords: ["brochure", "flyer", "leaflet", "tri-fold", "bi-fold"]
    },
    {
        slug: "greeting-card",
        name: "Greeting Card Maker",
        description: "Create folded greeting cards (portrait/landscape).",
        category: "print",
        icon: Heart,
        keywords: ["greeting card", "card", "birthday", "christmas", "valentines", "holiday"]
    },
    {
        slug: "name-tent",
        name: "Name Tent Maker",
        description: "Create foldable name tents for meetings.",
        category: "print",
        icon: Tent,
        keywords: ["name tent", "tent", "meeting", "events", "conference"]
    },
    {
        slug: "jar-label-generator",
        name: "Jar Label Generator",
        description: "Design packaging jar and lid labels.",
        category: "print",
        icon: Package,
        keywords: ["jar", "label", "canning", "sticker", "avery"]
    },
    {
        slug: "label-creator",
        name: "Label Creator",
        description: "Design custom labels with Avery sheets.",
        category: "print",
        icon: Tags,
        keywords: ["label", "sticker", "address", "mailing", "envelope", "avery"]
    },
    {
        slug: "sign-generator",
        name: "Safety Sign Builder",
        description: "Create OSHA-compliant warning signs.",
        category: "print",
        icon: Shield,
        keywords: ["sign", "safety", "warning", "caution", "danger", "osha"]
    },

    // Data & Spreadsheets
    {
        slug: "excel-scrubber",
        name: "Excel Data Scrubber",
        description: "Clean, format, and manipulate Excel data.",
        category: "data",
        icon: FileSpreadsheet,
        keywords: ["excel", "csv", "scrub", "clean", "sheets", "rows", "columns"]
    },
    {
        slug: "string-integrity-preserver",
        name: "String Preserver",
        description: "Prevent Excel column auto-conversion bugs.",
        category: "data",
        icon: ShieldAlert,
        keywords: ["excel", "data integrity", "zero", "zip code", "dates", "scientific notation"]
    },
    {
        slug: "delimiter-matrix",
        name: "Delimiter Matrix",
        description: "Convert pipe/semicolon/tab text list files.",
        category: "data",
        icon: Grid,
        keywords: ["delimiter", "matrix", "csv", "tsv", "pipe", "semicolon", "table"]
    },
    {
        slug: "table-tuner",
        name: "Table Tuner",
        description: "Format CSV/Excel files to markdown/JSON/HTML.",
        category: "data",
        icon: Table,
        keywords: ["table", "markdown", "ascii", "json", "html", "export"]
    },

    // Clipboard & Text Cleaners
    {
        slug: "visual-style-purger",
        name: "Visual Style Purger",
        description: "Strip fonts, sizes, and colors from rich text.",
        category: "text",
        icon: Sparkles,
        keywords: ["purge", "styles", "clean font", "rich text", "copy-paste"]
    },
    {
        slug: "data-payload-sanitizer",
        name: "Payload Sanitizer",
        description: "Purge hidden MS Word styling tags to raw text.",
        category: "text",
        icon: Trash2,
        keywords: ["xml", "payload", "html tags", "office bloat", "clipboard", "plain text"]
    },
    {
        slug: "whitespace-compressor",
        name: "Whitespace Compressor",
        description: "Compress double spaces, line breaks, and tabs.",
        category: "text",
        icon: Minimize2,
        keywords: ["whitespace", "tabs", "double space", "zero width", "compress"]
    },
    {
        slug: "list-unbreaker",
        name: "List Un-breaker",
        description: "Align text list elements and clean bullet characters.",
        category: "text",
        icon: List,
        keywords: ["list", "bullets", "indentation", "margins", "unbreak"]
    },
    {
        slug: "word-formatter",
        name: "Word Formatter",
        description: "Format drafting documents into Markdown structure.",
        category: "text",
        icon: FileText,
        keywords: ["word", "formatting", "copywriting", "markdown", "draft"]
    },
    {
        slug: "case-engine",
        name: "Quick Case Engine",
        description: "Toggle text casings (Camel, Sentence, snake, etc.).",
        category: "text",
        icon: Type,
        keywords: ["case", "casing", "sentence case", "camelcase", "snake_case", "kebab-case"]
    },
    {
        slug: "pattern-replacer",
        name: "Pattern Replacer",
        description: "Find and replace text using words or regex patterns.",
        category: "text",
        icon: RefreshCw,
        keywords: ["replace", "regex", "search", "patterns", "wildcards"]
    },

    // Assets & Utilities
    {
        slug: "qr-generator",
        name: "QR & Barcode Generator",
        description: "Generate high-resolution barcodes and QR codes.",
        category: "digital",
        icon: QrCode,
        keywords: ["qr", "barcode", "url", "scan", "vector"]
    },
    {
        slug: "pixel-pruner",
        name: "Pixel Pruner",
        description: "Resize and compress images inside your browser.",
        category: "digital",
        icon: ImageIcon,
        keywords: ["compress", "image", "resize", "pixel", "png", "jpeg"]
    },
    {
        slug: "signature-smith",
        name: "Signature Smith",
        description: "Generate professional branded HTML email signatures.",
        category: "digital",
        icon: Mail,
        keywords: ["signature", "email", "smith", "brand kit", "outlook", "gmail"]
    },
    {
        slug: "signature-generator",
        name: "Email Signature Generator",
        description: "Build clean vertical/horizontal HTML email signatures.",
        category: "digital",
        icon: PenTool,
        keywords: ["signature", "email", "freelancer", "html signature", "outlook"]
    },
    {
        slug: "zone-zapper",
        name: "Zone Zapper",
        description: "Map timezone overlaps for remote team syncs.",
        category: "digital",
        icon: Globe,
        keywords: ["timezone", "meeting", "scheduler", "time difference", "sync"]
    },
    {
        slug: "team-taggler",
        name: "Team Taggler",
        description: "Pick raffle winners and split squads instantly.",
        category: "digital",
        icon: Users,
        keywords: ["squads", "winners", "draw", "raffle", "pick", "group"]
    },
    {
        slug: "link-unlinker",
        name: "Link Un-linker",
        description: "Purge UTM tracking parameters & anchor hyperlinks.",
        category: "digital",
        icon: Link2,
        keywords: ["link", "unlink", "hyperlink", "utm", "tracking", "tags"]
    }
];

export function Header() {
    const { user, logout } = useAuth();
    const { activeBrandKit, isBrandedSession, clearBrandKit } = useBrandKit();
    const router = useRouter();

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ToolItem[]>([]);
    const [searchFocused, setSearchFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

    // Fuzzy match search queries
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const query = searchQuery.toLowerCase();
        const filtered = ALL_TOOLS.filter(t => 
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            t.keywords.some(k => k.toLowerCase().includes(query))
        );
        setSearchResults(filtered);
        setSelectedIndex(0);
    }, [searchQuery]);

    // Handle clicks outside of search popover
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle search shortcuts / keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (searchResults.length === 0) return;
        
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % searchResults.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            const selected = searchResults[selectedIndex];
            if (selected) {
                router.push(`/tools/${selected.slug}`);
                setSearchQuery("");
                setSearchFocused(false);
            }
        } else if (e.key === "Escape") {
            setSearchFocused(false);
        }
    };

    // Split tools for Mega Menu Columns
    const printTools = ALL_TOOLS.filter(t => t.category === "print");
    const dataTools = ALL_TOOLS.filter(t => t.category === "data");
    const textTools = ALL_TOOLS.filter(t => t.category === "text");
    const digitalTools = ALL_TOOLS.filter(t => t.category === "digital");

    if (isBrandedSession && activeBrandKit) {
        const primaryColor = activeBrandKit.colors?.primary || '#4f46e5';
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => {
                            const encoded = encodeBrandKit(activeBrandKit);
                            router.push(`/brand-portal?brand_kit=${encoded}`);
                        }}>
                            {activeBrandKit.logos?.primary ? (
                                <img src={activeBrandKit.logos.primary} alt={activeBrandKit.name} className="max-h-8 max-w-[120px] object-contain" />
                            ) : (
                                <div 
                                    style={{ backgroundColor: primaryColor }} 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                                >
                                    {activeBrandKit.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="font-bold text-lg tracking-tight" style={{ color: primaryColor }}>
                                {activeBrandKit.name} Portal
                            </span>
                        </div>
                        <span className="text-2xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                            Branded Suite
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1 text-slate-500 hover:text-slate-800"
                            onClick={() => {
                                clearBrandKit();
                                router.push('/');
                            }}
                        >
                            <LogOut className="w-3.5 h-3.5" /> Exit Brand Mode
                        </Button>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
                
                {/* Left Brand and Navigation Dropdowns */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">TinyTask</span>
                    </Link>
                    
                    <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
                        {/* Tools Mega Menu */}
                        <DropdownMenu open={toolsMenuOpen} onOpenChange={setToolsMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 gap-1 hover:bg-slate-100/60 select-none cursor-pointer">
                                    Tools <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[700px] lg:w-[860px] p-6 max-h-[85vh] overflow-y-auto" align="start">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    
                                    {/* Column 1: Print & Design */}
                                    <div>
                                        <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5 border-b pb-1">
                                            <FileText className="w-3.5 h-3.5 text-rose-500" /> Office & Print
                                        </h3>
                                        <div className="space-y-1">
                                            {printTools.map(t => (
                                                <Link href={`/tools/${t.slug}`} key={t.slug} onClick={() => setToolsMenuOpen(false)} className="flex gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <t.icon className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-slate-800 truncate">{t.name}</div>
                                                        <div className="text-[10px] text-slate-400 line-clamp-1">{t.description}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 2: Data & Tables */}
                                    <div>
                                        <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5 border-b pb-1">
                                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Data & Sheets
                                        </h3>
                                        <div className="space-y-1">
                                            {dataTools.map(t => (
                                                <Link href={`/tools/${t.slug}`} key={t.slug} onClick={() => setToolsMenuOpen(false)} className="flex gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <t.icon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-slate-800 truncate">{t.name}</div>
                                                        <div className="text-[10px] text-slate-400 line-clamp-1">{t.description}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 3: Text & Formatting */}
                                    <div>
                                        <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5 border-b pb-1">
                                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Text Cleaners
                                        </h3>
                                        <div className="space-y-1">
                                            {textTools.map(t => (
                                                <Link href={`/tools/${t.slug}`} key={t.slug} onClick={() => setToolsMenuOpen(false)} className="flex gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <t.icon className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-slate-800 truncate">{t.name}</div>
                                                        <div className="text-[10px] text-slate-400 line-clamp-1">{t.description}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 4: Assets & Utils */}
                                    <div>
                                        <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5 border-b pb-1">
                                            <QrCode className="w-3.5 h-3.5 text-blue-500" /> Digital Assets
                                        </h3>
                                        <div className="space-y-1">
                                            {digitalTools.map(t => (
                                                <Link href={`/tools/${t.slug}`} key={t.slug} onClick={() => setToolsMenuOpen(false)} className="flex gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <t.icon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-slate-800 truncate">{t.name}</div>
                                                        <div className="text-[10px] text-slate-400 line-clamp-1">{t.description}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Collections menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 gap-1 hover:bg-slate-100/60 select-none cursor-pointer">
                                    Collections <ChevronDown className="h-3.5 h-3.5 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuLabel>Industry Portals</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/collections/florist" className="cursor-pointer w-full flex items-center gap-2">
                                            <Heart className="h-4 w-4 text-rose-500" /> Florist Suite
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/collections/productivity" className="cursor-pointer w-full flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-amber-500" /> General Productivity
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
                        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
                    </nav>
                </div>

                {/* Right Side: Global Fuzzy Search & Auth Actions */}
                <div className="flex items-center gap-4">
                    
                    {/* Header Fuzzy Search Bar */}
                    <div ref={searchContainerRef} className="relative w-full max-w-[140px] sm:max-w-[200px] md:max-w-[280px]">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search all 25 tools..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSearchFocused(true);
                                }}
                                onFocus={() => setSearchFocused(true)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400"
                            />
                        </div>

                        {/* Search dropdown popover overlay */}
                        {searchFocused && searchResults.length > 0 && (
                            <div className="absolute top-full right-0 left-0 md:left-auto md:w-[320px] mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-[360px] overflow-y-auto animate-in fade-in slide-in-from-top-1">
                                <div className="p-2 border-b bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Matches ({searchResults.length})
                                </div>
                                {searchResults.map((t, idx) => (
                                    <Link
                                        href={`/tools/${t.slug}`}
                                        key={t.slug}
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSearchFocused(false);
                                        }}
                                        className={cn(
                                            "flex items-start gap-2.5 p-2.5 text-left border-b last:border-0 transition-colors",
                                            idx === selectedIndex ? "bg-slate-50" : "hover:bg-slate-50/50"
                                        )}
                                    >
                                        <t.icon className={cn(
                                            "w-4 h-4 mt-0.5 flex-shrink-0",
                                            t.category === 'print' ? 'text-rose-500' :
                                            t.category === 'data' ? 'text-emerald-500' :
                                            t.category === 'text' ? 'text-indigo-500' : 'text-blue-500'
                                        )} />
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                                                <span className="truncate">{t.name}</span>
                                                <span className="text-[8px] px-1 py-0.2 bg-slate-100 rounded text-slate-500 uppercase tracking-wide flex-shrink-0">
                                                    {t.category === 'print' ? 'print' : t.category === 'data' ? 'sheets' : t.category === 'text' ? 'text' : 'assets'}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {searchFocused && searchQuery.trim() && searchResults.length === 0 && (
                            <div className="absolute top-full right-0 left-0 md:left-auto md:w-[320px] mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-4 text-center text-xs text-slate-400">
                                No tools found matching &quot;{searchQuery}&quot;
                            </div>
                        )}
                    </div>

                    <nav className="flex items-center gap-1">
                        <HowToGuide />
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                                        <User className="h-3.5 w-3.5" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0">
                                    <LogOut className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:inline-block">
                                    <Button variant="ghost" size="sm" className="text-xs">Sign In</Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="sm" className="text-xs h-8">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </nav>

                </div>

            </div>
        </header>
    );
}
