"use client"

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBrandKit, decodeBrandKit, encodeBrandKit } from '@tinytask/ui/brand/brand-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    FileText, 
    QrCode, 
    BookOpen, 
    Mail, 
    Tent, 
    Tags, 
    Table, 
    Image as ImageIcon,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';

interface ToolItem {
    name: string;
    description: string;
    slug: string;
    icon: React.ReactNode;
}

const AVAILABLE_TOOLS: ToolItem[] = [
    {
        name: "Invoice Swift",
        description: "Create and print professional invoices instantly pre-styled for your brand.",
        slug: "invoice-swift",
        icon: <FileText className="w-8 h-8 text-emerald-500" />
    },
    {
        name: "QR & Barcode Generator",
        description: "Generate customized QR codes matching your brand's color palette.",
        slug: "qr-generator",
        icon: <QrCode className="w-8 h-8 text-primary" />
    },
    {
        name: "Brochure Creator",
        description: "Design premium trifold brochures styled automatically in your branding.",
        slug: "brochure-builder",
        icon: <BookOpen className="w-8 h-8 text-primary" />
    },
    {
        name: "Signature Smith",
        description: "Format corporate email signatures utilizing your brand font and colors.",
        slug: "signature-smith",
        icon: <Mail className="w-8 h-8 text-pink-500" />
    },
    {
        name: "Name Tent Maker",
        description: "Print customized event name tents with matching brand identity styling.",
        slug: "name-tent",
        icon: <Tent className="w-8 h-8 text-rose-500" />
    },
    {
        name: "Label Creator",
        description: "Print custom product label sheets set to brand sizes and theme colors.",
        slug: "label-creator",
        icon: <Tags className="w-8 h-8 text-kraft" />
    },
    {
        name: "Table Tuner",
        description: "Clean up spreadsheet cells and view tables customized to your layout theme.",
        slug: "table-tuner",
        icon: <Table className="w-8 h-8 text-teal-600" />
    },
    {
        name: "Pixel Pruner",
        description: "Compress, crop and format digital assets for your brand library.",
        slug: "pixel-pruner",
        icon: <ImageIcon className="w-8 h-8 text-primary" />
    }
];

function PortalContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { activeBrandKit } = useBrandKit();
    
    const brandKitParam = searchParams.get('brand_kit');
    const brand = activeBrandKit || (brandKitParam ? decodeBrandKit(brandKitParam) : null);

    if (!brand) {
        return (
            <div className="container mx-auto px-4 py-16 text-center max-w-md">
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 mb-6">
                    <p className="font-semibold text-lg">Invalid Brand Link</p>
                    <p className="text-sm mt-1 text-red-500 dark:text-red-400">
                        This URL does not contain a valid brand configuration.
                    </p>
                </div>
                <Button onClick={() => router.push('/')} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Go to TinyTask Home
                </Button>
            </div>
        );
    }

    const brandFont = brand.font || 'var(--font-outfit)';
    const primaryColor = brand.colors?.primary || '#4f46e5';
    const backgroundTheme = brand.colors?.background || '#ffffff';

    const handleToolClick = (slug: string) => {
        const encoded = encodeBrandKit(brand);
        router.push(`/tools/${slug}?brand_kit=${encoded}`);
    };

    return (
        <div 
            style={{ 
                fontFamily: brandFont.includes('var(') ? brandFont : 'inherit',
                backgroundColor: backgroundTheme
            }} 
            className="min-h-[calc(100vh-3.5rem)] py-12 px-4 transition-colors duration-300"
        >
            <div className="container mx-auto max-w-5xl">
                
                {/* Header Banner */}
                <div className="text-center mb-12 space-y-6">
                    <div className="flex justify-center mb-4">
                        {brand.logos?.primary ? (
                            <img src={brand.logos.primary} alt={brand.name} className="max-h-20 max-w-full object-contain" />
                        ) : (
                            <div 
                                style={{ backgroundColor: primaryColor }} 
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
                            >
                                {brand.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <h1 
                            className="text-4xl font-extrabold tracking-tight sm:text-5xl" 
                            style={{ color: primaryColor }}
                        >
                            {brand.name} Portal
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                            Access our suite of tools customized with {brand.name}&apos;s brand parameters.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-card/100 text-xs font-semibold text-muted-foreground shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Active Brand Session
                    </div>
                </div>

                {/* Grid of Tools */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {AVAILABLE_TOOLS.map((tool) => (
                        <Card 
                            key={tool.slug} 
                            onClick={() => handleToolClick(tool.slug)}
                            className="group hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between bg-card/70 backdrop-blur-xs border shadow-sm"
                        >
                            <CardHeader className="p-6 pb-2">
                                <div className="p-3 bg-card border border-border/80 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                                    {tool.icon}
                                </div>
                                <CardTitle className="text-lg font-bold mt-4 group-hover:text-primary transition-colors">
                                    {tool.name}
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                    {tool.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 mt-auto flex justify-end">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="gap-1 p-0 group-hover:translate-x-1.5 transition-transform"
                                    style={{ color: primaryColor }}
                                >
                                    Launch Tool <ChevronRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer attribution */}
                <div className="mt-16 text-center text-xs text-muted-foreground">
                    <p>Powered by TinyTask Productivity Suite</p>
                </div>

            </div>
        </div>
    );
}

export default function BrandPortalPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading branded workspace...</div>}>
            <PortalContent />
        </Suspense>
    );
}
