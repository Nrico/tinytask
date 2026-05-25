"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { ColorPicker } from '@tinytask/ui/forms/color-picker';
import { FontSelector } from '@tinytask/ui/forms/font-selector';
import { FileUploader } from '@tinytask/ui/forms/file-uploader';
import { 
    encodeBrandKit, 
    compressLogo, 
    BrandKit,
    useBrandKit
} from '@tinytask/ui/brand/brand-context';
import { 
    Crown, 
    Lock, 
    Copy, 
    Check, 
    Sparkles, 
    Image as ImageIcon, 
    Trash2, 
    ExternalLink, 
    ArrowLeft,
    Globe
} from 'lucide-react';

export default function BrandKitDashboardPage() {
    const { user, isLoading, upgradeToPro } = useAuth();
    const { setPreviewBrandKit } = useBrandKit();
    const router = useRouter();

    // Form State
    const [brandName, setBrandName] = useState('');
    const [colors, setColors] = useState({
        primary: '#4f46e5',
        secondary: '#f3f4f6',
        accent: '#f59e0b',
        background: '#ffffff',
    });
    const [logos, setLogos] = useState<{
        primary?: string;
        secondary?: string;
        icon?: string;
    }>({});
    const [font, setFont] = useState('var(--font-outfit)');

    // UI/Copy States
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [portalUrl, setPortalUrl] = useState('');

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    // Load saved brand kit on mount
    useEffect(() => {
        if (user && user.plan === 'pro') {
            const saved = localStorage.getItem(`tinytask_brand_kit_${user.id}`);
            if (saved) {
                try {
                    const kit = JSON.parse(saved) as BrandKit;
                    setBrandName(kit.name);
                    setColors(kit.colors);
                    setLogos(kit.logos);
                    setFont(kit.font);
                    
                    const encoded = encodeBrandKit(kit);
                    const origin = typeof window !== 'undefined' ? window.location.origin : '';
                    setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
                } catch (e) {
                    console.error("Failed to load saved brand kit", e);
                }
            }
        }
    }, [user]);

    // Apply colors temporarily to the preview in real-time
    useEffect(() => {
        if (user && user.plan === 'pro') {
            setPreviewBrandKit({
                name: brandName || 'My Brand',
                colors,
                logos,
                font
            });
        }
        // Cleanup function to clear preview styles when leaving the dashboard
        return () => {
            setPreviewBrandKit(null);
        };
    }, [brandName, colors, logos, font, user, setPreviewBrandKit]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const handleColorChange = (key: keyof typeof colors, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const handleLogoUpload = async (key: 'primary' | 'secondary' | 'icon', file: File) => {
        try {
            const compressed = await compressLogo(file);
            setLogos(prev => ({ ...prev, [key]: compressed }));
        } catch (e) {
            console.error("Logo compression failed", e);
            alert("Failed to process logo. Please try another image file.");
        }
    };

    const handleSave = () => {
        if (!brandName.trim()) {
            alert('Please enter a Brand Name');
            return;
        }

        const kit: BrandKit = {
            name: brandName,
            colors,
            logos,
            font
        };

        localStorage.setItem(`tinytask_brand_kit_${user.id}`, JSON.stringify(kit));
        
        const encoded = encodeBrandKit(kit);
        const origin = window.location.origin;
        setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedStates(prev => ({ ...prev, [id]: true }));
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [id]: false }));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Free plan locked page
    if (user.plan === 'free') {
        const mockColors = {
            primary: '#a855f7',
            secondary: '#f3e8ff',
            accent: '#e9d5ff',
            background: '#ffffff',
        };

        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => router.push('/dashboard')} className="gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                </div>

                <div className="relative overflow-hidden rounded-3xl border bg-card/100 p-8 md:p-12 shadow-xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-card0/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Paywall Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-background/80 backdrop-blur-md rounded-3xl">
                        <div className="p-4 rounded-full bg-purple-100 border border-purple-200 text-purple-600 mb-6 animate-pulse">
                            <Lock className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Unlock Subscriber Brand Kits
                        </h2>
                        <p className="mt-4 max-w-md text-base text-slate-600 leading-relaxed">
                            Maintain consistent branding across all TinyTask productivity tools. Elevate your workflows and share pre-branded tools with your team or clients.
                        </p>
                        
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button onClick={upgradeToPro} size="lg" className="px-8 bg-purple-600 hover:bg-purple-700 text-white gap-2 font-semibold shadow-lg shadow-purple-500/25">
                                <Crown className="w-5 h-5 text-yellow-300 fill-yellow-300" /> Upgrade to Pro
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => router.push('/pricing')}>
                                View Pricing Details
                            </Button>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-500 max-w-2xl">
                            <div className="p-3 bg-white/50 border rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Custom Colors
                            </div>
                            <div className="p-3 bg-white/50 border rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Logo Uploads
                            </div>
                            <div className="p-3 bg-white/50 border rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Premium Fonts
                            </div>
                            <div className="p-3 bg-white/50 border rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Shareable Links
                            </div>
                        </div>
                    </div>

                    {/* Paywall Background Mockup */}
                    <div className="grid gap-8 md:grid-cols-12 opacity-30 select-none pointer-events-none">
                        <div className="md:col-span-7 space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Brand Identity Manager</h1>
                                <p className="text-slate-500">Define your brand values, styles, and logos.</p>
                            </div>
                            <Card>
                                <CardHeader><CardTitle>Style Details</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="mock-brand-name">Brand Name</Label>
                                        <Input id="mock-brand-name" value="Acme Corp" disabled />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ColorPicker id="mock-primary-color" value={mockColors.primary} onChange={() => {}} label="Primary Color" />
                                        <ColorPicker id="mock-secondary-color" value={mockColors.secondary} onChange={() => {}} label="Secondary Color" />
                                    </div>
                                    <FontSelector value="var(--font-outfit)" onChange={() => {}} />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="md:col-span-5 flex flex-col justify-center">
                            <div className="p-6 border rounded-2xl bg-white shadow">
                                <div className="h-8 w-24 bg-slate-200 rounded mb-4" />
                                <div className="h-6 w-32 bg-slate-300 rounded mb-2" />
                                <div className="h-10 w-full bg-slate-100 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Pro User Active Brand Kit Creator
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.push('/dashboard')} className="gap-2 text-sm text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Brand Creator Panel */}
                <div className="w-full lg:w-7/12 space-y-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Brand Identity</h1>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 border border-purple-200 font-semibold gap-1 py-0.5">
                                <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> Subscriber
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                            Set up colors, logos, and fonts. Generate a custom portal to share pre-branded tools.
                        </p>
                    </div>

                    <Card className="shadow-md border bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Brand Settings</CardTitle>
                            <CardDescription>All fields will adapt client-side across the suite of tools.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Brand Name */}
                            <div className="space-y-2">
                                <Label htmlFor="brand-name">Brand Name</Label>
                                <Input 
                                    id="brand-name" 
                                    value={brandName} 
                                    onChange={e => setBrandName(e.target.value)} 
                                    placeholder="e.g. Acme Corporation" 
                                    className="bg-white"
                                />
                            </div>

                            {/* Brand Font */}
                            <FontSelector 
                                label="Brand Font Family" 
                                value={font} 
                                onChange={setFont} 
                                className="bg-white rounded-md p-1 border"
                            />

                            {/* Brand Colors */}
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold text-slate-800 text-sm">Brand Color Palette</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <ColorPicker 
                                        label="Primary (Buttons & Headers)" 
                                        value={colors.primary} 
                                        onChange={val => handleColorChange('primary', val)} 
                                    />
                                    <ColorPicker 
                                        label="Secondary (Muted / Panels)" 
                                        value={colors.secondary} 
                                        onChange={val => handleColorChange('secondary', val)} 
                                    />
                                    <ColorPicker 
                                        label="Accent (Highlights / Badges)" 
                                        value={colors.accent} 
                                        onChange={val => handleColorChange('accent', val)} 
                                    />
                                    <ColorPicker 
                                        label="Background Theme" 
                                        value={colors.background} 
                                        onChange={val => handleColorChange('background', val)} 
                                    />
                                </div>
                            </div>

                            {/* Brand Logos */}
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold text-slate-800 text-sm">Brand Logo Assets</h3>
                                <p className="text-xs text-muted-foreground">Logos are compressed to fit inside URL limits.</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Primary Logo */}
                                    <div className="space-y-2 flex flex-col">
                                        <Label className="text-xs font-semibold text-slate-600">Primary Logo (Horizontal)</Label>
                                        {logos.primary ? (
                                            <div className="border rounded-xl p-3 bg-white flex flex-col items-center justify-center gap-2 h-36 relative group">
                                                <img src={logos.primary} alt="Primary logo" className="max-h-16 max-w-full object-contain" />
                                                <button 
                                                    onClick={() => setLogos(p => ({ ...p, primary: undefined }))}
                                                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <FileUploader 
                                                onFileSelect={file => handleLogoUpload('primary', file)}
                                                accept="image/*"
                                                description="Header Logo"
                                                className="h-36 py-4 flex flex-col justify-center"
                                                icon={<ImageIcon className="w-6 h-6 text-slate-400" />}
                                            />
                                        )}
                                    </div>

                                    {/* Secondary Logo */}
                                    <div className="space-y-2 flex flex-col">
                                        <Label className="text-xs font-semibold text-slate-600">Secondary Logo (Dark Background)</Label>
                                        {logos.secondary ? (
                                            <div className="border rounded-xl p-3 bg-slate-900 flex flex-col items-center justify-center gap-2 h-36 relative group">
                                                <img src={logos.secondary} alt="Secondary logo" className="max-h-16 max-w-full object-contain" />
                                                <button 
                                                    onClick={() => setLogos(p => ({ ...p, secondary: undefined }))}
                                                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-800 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <FileUploader 
                                                onFileSelect={file => handleLogoUpload('secondary', file)}
                                                accept="image/*"
                                                description="Dark Theme Logo"
                                                className="h-36 py-4 flex flex-col justify-center"
                                                icon={<ImageIcon className="w-6 h-6 text-slate-400" />}
                                            />
                                        )}
                                    </div>

                                    {/* Icon Logo */}
                                    <div className="space-y-2 flex flex-col">
                                        <Label className="text-xs font-semibold text-slate-600">Brand Favicon / Icon</Label>
                                        {logos.icon ? (
                                            <div className="border rounded-xl p-3 bg-white flex flex-col items-center justify-center gap-2 h-36 relative group">
                                                <img src={logos.icon} alt="Icon logo" className="w-10 h-10 object-contain" />
                                                <button 
                                                    onClick={() => setLogos(p => ({ ...p, icon: undefined }))}
                                                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <FileUploader 
                                                onFileSelect={file => handleLogoUpload('icon', file)}
                                                accept="image/*"
                                                description="Square Icon Logo"
                                                className="h-36 py-4 flex flex-col justify-center"
                                                icon={<ImageIcon className="w-6 h-6 text-slate-400" />}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button 
                            onClick={handleSave} 
                            size="lg" 
                            className="bg-primary hover:bg-primary/90 text-white font-semibold flex-1 shadow-md shadow-primary/10"
                        >
                            {saveStatus === 'saved' ? 'Brand Kit Saved!' : 'Save Brand Configuration'}
                        </Button>
                    </div>

                    {/* Sharing links panel */}
                    {portalUrl && (
                        <Card className="shadow-md border border-emerald-100 bg-emerald-50/20">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-1.5 text-emerald-800">
                                    <Globe className="w-5 h-5" /> Shareable Branded Shortcut Links
                                </CardTitle>
                                <CardDescription className="text-emerald-700/80">
                                    These links encode your branding context in the URL. Accessing tools via these links restricts tool presets to your brand colors, font, and logos.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Brand Portal Link */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                                        Main Branded Tool Portal
                                        <span className="text-xs text-muted-foreground font-normal">Lists all tools with your branding</span>
                                    </Label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-white border border-emerald-200 p-2.5 rounded-lg text-xs font-mono select-all truncate max-w-full text-slate-600">
                                            {portalUrl}
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            className="border-emerald-200 text-emerald-800 hover:bg-emerald-100 flex-shrink-0" 
                                            onClick={() => copyToClipboard(portalUrl, 'portal')}
                                        >
                                            {copiedStates['portal'] ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            className="text-emerald-800 hover:bg-emerald-100 flex-shrink-0 gap-1.5" 
                                            onClick={() => window.open(portalUrl, '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4" /> Open
                                        </Button>
                                    </div>
                                </div>

                                {/* Tool Specific Links */}
                                <div className="space-y-3 border-t border-emerald-100 pt-4">
                                    <Label className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Direct Tool Shortcuts</Label>
                                    <div className="grid gap-2">
                                        {['invoice-swift', 'qr-generator', 'brochure-builder', 'signature-smith'].map(toolSlug => {
                                            const toolName = toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                            const encoded = encodeBrandKit({ name: brandName, colors, logos, font });
                                            const toolUrl = `${window.location.origin}/tools/${toolSlug}?brand_kit=${encoded}`;
                                            
                                            return (
                                                <div key={toolSlug} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-sm">
                                                    <span className="font-semibold text-slate-700">{toolName}</span>
                                                    <div className="flex gap-1.5">
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            className="h-8 text-xs text-slate-600 gap-1"
                                                            onClick={() => copyToClipboard(toolUrl, toolSlug)}
                                                        >
                                                            {copiedStates[toolSlug] ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5" /> Copy Link
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Mockup Preview Panel */}
                <div className="w-full lg:w-5/12 sticky top-24">
                    <h3 className="font-semibold text-slate-800 text-sm mb-4">Interactive Branding Preview</h3>
                    
                    <div 
                        style={{ 
                            fontFamily: font.includes('var(') ? font : 'inherit',
                            backgroundColor: colors.background,
                            color: colors.primary
                        }} 
                        className="rounded-3xl border border-slate-200/80 shadow-lg p-6 min-h-[480px] flex flex-col justify-between transition-colors duration-300"
                    >
                        {/* Mock Header */}
                        <div className="flex justify-between items-center border-b pb-4 mb-6" style={{ borderColor: `${colors.primary}20` }}>
                            <div className="flex items-center gap-2">
                                {logos.primary ? (
                                    <img src={logos.primary} alt="Brand Logo Mockup" className="max-h-8 max-w-[120px] object-contain" />
                                ) : (
                                    <div 
                                        style={{ backgroundColor: colors.primary }} 
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                                    >
                                        {brandName ? brandName.charAt(0).toUpperCase() : 'B'}
                                    </div>
                                )}
                                <span className="font-bold text-base tracking-tight text-slate-800" style={{ color: colors.primary }}>
                                    {brandName || 'Acme Corp'}
                                </span>
                            </div>
                            <span 
                                style={{ backgroundColor: `${colors.primary}12`, color: colors.primary }} 
                                className="text-2xs font-semibold px-2 py-0.5 rounded border"
                            >
                                Branded Session
                            </span>
                        </div>

                        {/* Mock Canvas Content */}
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: colors.primary }}>
                                    Headline Title
                                </h1>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    This is how your selected brand font and style palette render across the tools. Visitors will access the suite locked into these configurations.
                                </p>
                            </div>

                            {/* Colors demonstration circles */}
                            <div className="flex gap-3 justify-center py-4 bg-card/100 rounded-2xl border border-slate-100">
                                <div className="text-center">
                                    <div style={{ backgroundColor: colors.primary }} className="w-10 h-10 rounded-full border shadow-sm mx-auto" />
                                    <span className="text-3xs font-semibold text-slate-400 mt-1 block">Primary</span>
                                </div>
                                <div className="text-center">
                                    <div style={{ backgroundColor: colors.secondary }} className="w-10 h-10 rounded-full border shadow-sm mx-auto" />
                                    <span className="text-3xs font-semibold text-slate-400 mt-1 block">Secondary</span>
                                </div>
                                <div className="text-center">
                                    <div style={{ backgroundColor: colors.accent }} className="w-10 h-10 rounded-full border shadow-sm mx-auto" />
                                    <span className="text-3xs font-semibold text-slate-400 mt-1 block">Accent</span>
                                </div>
                                <div className="text-center">
                                    <div style={{ backgroundColor: colors.background }} className="w-10 h-10 rounded-full border shadow-sm mx-auto" />
                                    <span className="text-3xs font-semibold text-slate-400 mt-1 block">BG</span>
                                </div>
                            </div>

                            {/* Button Preview */}
                            <div className="space-y-2">
                                <Button 
                                    style={{ backgroundColor: colors.primary, color: 'white' }} 
                                    className="w-full font-semibold pointer-events-none border-none py-5"
                                >
                                    Sample Action Button
                                </Button>
                                <div className="flex gap-2">
                                    <Button 
                                        style={{ backgroundColor: colors.secondary, color: colors.primary }} 
                                        className="flex-1 font-semibold pointer-events-none border-none py-5"
                                    >
                                        Secondary Button
                                    </Button>
                                    <Button 
                                        style={{ backgroundColor: `${colors.accent}20`, color: colors.accent, borderColor: colors.accent }} 
                                        className="flex-1 font-semibold pointer-events-none py-5 border"
                                    >
                                        Accent Action
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mock Footer */}
                        <div className="mt-8 border-t pt-4 text-center text-3xs text-slate-400 uppercase tracking-wider" style={{ borderColor: `${colors.primary}20` }}>
                            Powered by TinyTask Suite
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
