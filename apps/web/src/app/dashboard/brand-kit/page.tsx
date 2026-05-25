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
    useBrandKit,
    getContrastColor
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
    Globe,
    Plus,
    Mail,
    Phone,
    MapPin,
    Link2,
    FileText,
    Linkedin,
    Twitter,
    Github,
    Instagram
} from 'lucide-react';

const DEFAULT_BRAND_KIT = (id: string): BrandKit => ({
    id,
    name: 'New Brand Profile',
    colors: {
        primary: '#087b82',
        secondary: '#f2e4c8',
        accent: '#d7eeee',
        background: '#ffffff',
    },
    logos: {},
    font: 'var(--font-outfit)',
    email: '',
    phone: '',
    website: '',
    address: '',
    socials: {
        linkedin: '',
        twitter: '',
        github: '',
        instagram: '',
    },
    disclaimer: ''
});

const COLOR_PRESETS = [
    {
        name: 'Corporate Navy',
        colors: {
            primary: '#0f172a',
            secondary: '#38bdf8',
            accent: '#e2e8f0',
            background: '#ffffff',
        }
    },
    {
        name: 'Forest Moss',
        colors: {
            primary: '#064e3b',
            secondary: '#10b981',
            accent: '#d1fae5',
            background: '#f0fdf4',
        }
    },
    {
        name: 'Sunset Clay',
        colors: {
            primary: '#7c2d12',
            secondary: '#f97316',
            accent: '#ffedd5',
            background: '#fff7ed',
        }
    }
];

export default function BrandKitDashboardPage() {
    const { user, isLoading, upgradeToPro } = useAuth();
    const { setPreviewBrandKit, updateActiveBrandKit } = useBrandKit();
    const router = useRouter();

    const applyColorPreset = (presetColors: { primary: string; secondary: string; accent: string; background: string }) => {
        setProfiles(prev => prev.map(p => {
            if (p.id === activeProfileId) {
                return {
                    ...p,
                    colors: presetColors
                };
            }
            return p;
        }));
    };


    // Tab state
    const [activeTab, setActiveTab] = useState<'design' | 'logos' | 'contact' | 'socials'>('design');

    // Profiles List State
    const [profiles, setProfiles] = useState<BrandKit[]>([]);
    const [activeProfileId, setActiveProfileId] = useState<string>('default');

    // UI/Copy States
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [portalUrl, setPortalUrl] = useState('');

    const activeProfile = profiles.find(p => p.id === activeProfileId) || DEFAULT_BRAND_KIT('default');

    // Load saved brand kits on mount
    useEffect(() => {
        if (user && user.plan === 'pro') {
            const savedKits = localStorage.getItem(`tinytask_brand_kits_${user.id}`);
            const activeId = localStorage.getItem(`tinytask_active_brand_kit_id_${user.id}`);
            
            if (savedKits) {
                try {
                    const parsedKits = JSON.parse(savedKits) as BrandKit[];
                    if (parsedKits.length > 0) {
                        setProfiles(parsedKits);
                        const selectedId = activeId && parsedKits.some(k => k.id === activeId) 
                            ? activeId 
                            : parsedKits[0].id;
                        setActiveProfileId(selectedId);
                        
                        const selectedKit = parsedKits.find(k => k.id === selectedId) || parsedKits[0];
                        const encoded = encodeBrandKit(selectedKit);
                        const origin = typeof window !== 'undefined' ? window.location.origin : '';
                        setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
                    } else {
                        const defaultKit = DEFAULT_BRAND_KIT('default');
                        setProfiles([defaultKit]);
                        setActiveProfileId('default');
                        localStorage.setItem(`tinytask_brand_kits_${user.id}`, JSON.stringify([defaultKit]));
                        localStorage.setItem(`tinytask_active_brand_kit_id_${user.id}`, 'default');
                        
                        const encoded = encodeBrandKit(defaultKit);
                        const origin = typeof window !== 'undefined' ? window.location.origin : '';
                        setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
                    }
                } catch (e) {
                    console.error("Failed to load saved brand kits", e);
                }
            } else {
                // Check legacy single brand kit
                const legacy = localStorage.getItem(`tinytask_brand_kit_${user.id}`);
                if (legacy) {
                    try {
                        const kit = JSON.parse(legacy) as BrandKit;
                        if (!kit.id) kit.id = 'default';
                        
                        const kits = [kit];
                        setProfiles(kits);
                        setActiveProfileId('default');
                        localStorage.setItem(`tinytask_brand_kits_${user.id}`, JSON.stringify(kits));
                        localStorage.setItem(`tinytask_active_brand_kit_id_${user.id}`, 'default');
                        
                        const encoded = encodeBrandKit(kit);
                        const origin = typeof window !== 'undefined' ? window.location.origin : '';
                        setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
                    } catch (e) {
                        console.error("Failed to parse legacy brand kit", e);
                    }
                } else {
                    const defaultKit = DEFAULT_BRAND_KIT('default');
                    setProfiles([defaultKit]);
                    setActiveProfileId('default');
                    localStorage.setItem(`tinytask_brand_kits_${user.id}`, JSON.stringify([defaultKit]));
                    localStorage.setItem(`tinytask_active_brand_kit_id_${user.id}`, 'default');
                    
                    const encoded = encodeBrandKit(defaultKit);
                    const origin = typeof window !== 'undefined' ? window.location.origin : '';
                    setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
                }
            }
        } else {
            // Load local brand kit for free/guest users
            const localStored = localStorage.getItem('tinytask_active_brand_kit');
            if (localStored) {
                try {
                    const decoded = JSON.parse(localStored) as BrandKit;
                    if (decoded && !decoded.id) {
                        decoded.id = 'default';
                    }
                    setProfiles([decoded]);
                    setActiveProfileId(decoded.id);
                    
                    const encoded = encodeBrandKit(decoded);
                    const origin = typeof window !== 'undefined' ? window.location.origin : '';
                    setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
                } catch (e) {
                    console.error("Failed to parse localStored brand kit for free/guest", e);
                    const defaultKit = DEFAULT_BRAND_KIT('default');
                    setProfiles([defaultKit]);
                    setActiveProfileId('default');
                    
                    const encoded = encodeBrandKit(defaultKit);
                    const origin = typeof window !== 'undefined' ? window.location.origin : '';
                    setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
                }
            } else {
                const defaultKit = DEFAULT_BRAND_KIT('default');
                setProfiles([defaultKit]);
                setActiveProfileId('default');
                
                const encoded = encodeBrandKit(defaultKit);
                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
            }
        }
    }, [user]);

    // Apply colors temporarily to the preview in real-time
    useEffect(() => {
        setPreviewBrandKit(activeProfile);
        
        // Re-generate portalUrl as values change
        const encoded = encodeBrandKit(activeProfile);
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);

        return () => {
            setPreviewBrandKit(null);
        };
    }, [activeProfile, setPreviewBrandKit]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    // Helper functions to update current profile in state list
    const updateActiveProfile = (field: string, value: any) => {
        setProfiles(prev => prev.map(p => {
            if (p.id === activeProfileId) {
                return {
                    ...p,
                    [field]: value
                };
            }
            return p;
        }));
    };
    
    const updateActiveProfileColors = (key: string, value: string) => {
        setProfiles(prev => prev.map(p => {
            if (p.id === activeProfileId) {
                return {
                    ...p,
                    colors: {
                        ...p.colors,
                        [key]: value
                    }
                };
            }
            return p;
        }));
    };

    const updateActiveProfileLogos = (key: string, value: string | undefined) => {
        setProfiles(prev => prev.map(p => {
            if (p.id === activeProfileId) {
                return {
                    ...p,
                    logos: {
                        ...p.logos,
                        [key]: value
                    }
                };
            }
            return p;
        }));
    };

    const updateActiveProfileSocials = (key: string, value: string) => {
        setProfiles(prev => prev.map(p => {
            if (p.id === activeProfileId) {
                const currentSocials = p.socials || {};
                return {
                    ...p,
                    socials: {
                        ...currentSocials,
                        [key]: value
                    }
                };
            }
            return p;
        }));
    };

    const handleCreateProfile = () => {
        const newId = crypto.randomUUID();
        const newKit = DEFAULT_BRAND_KIT(newId);
        setProfiles(prev => [...prev, newKit]);
        setActiveProfileId(newId);
        
        const encoded = encodeBrandKit(newKit);
        const origin = window.location.origin;
        setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
    };

    const handleDeleteProfile = () => {
        if (profiles.length <= 1) {
            alert("You must keep at least one brand profile.");
            return;
        }
        
        if (confirm(`Are you sure you want to delete "${activeProfile.name}"?`)) {
            const remaining = profiles.filter(p => p.id !== activeProfileId);
            setProfiles(remaining);
            const nextId = remaining[0].id;
            setActiveProfileId(nextId);
            
            const nextKit = remaining[0];
            const encoded = encodeBrandKit(nextKit);
            const origin = window.location.origin;
            setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
        }
    };

    const handleProfileChange = (id: string) => {
        setActiveProfileId(id);
        const selected = profiles.find(p => p.id === id);
        if (selected) {
            const encoded = encodeBrandKit(selected);
            const origin = window.location.origin;
            setPortalUrl(`${origin}/brand-portal?brand_kit=${encoded}`);
        }
    };

    const handleLogoUpload = async (key: 'primary' | 'secondary' | 'icon', file: File) => {
        try {
            const compressed = await compressLogo(file);
            updateActiveProfileLogos(key, compressed);
        } catch (e) {
            console.error("Logo compression failed", e);
            alert("Failed to process logo. Please try another image file.");
        }
    };

    const handleSave = () => {
        if (!activeProfile.name.trim()) {
            alert('Please enter a Brand Name');
            return;
        }

        // Save list of profiles and active ID
        if (user && user.plan === 'pro') {
            localStorage.setItem(`tinytask_brand_kits_${user.id}`, JSON.stringify(profiles));
            localStorage.setItem(`tinytask_active_brand_kit_id_${user.id}`, activeProfileId);
        } else {
            localStorage.setItem('tinytask_active_brand_kit', JSON.stringify(activeProfile));
        }
        
        // Update active brand kit context immediately
        updateActiveBrandKit(activeProfile);

        // Store business name and contact information in cookies
        const setCookie = (name: string, value: string) => {
            if (typeof document !== 'undefined') {
                document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
            }
        };

        setCookie('tinytask_biz_name', activeProfile.name);
        setCookie('tinytask_biz_email', activeProfile.email || '');
        setCookie('tinytask_biz_phone', activeProfile.phone || '');
        setCookie('tinytask_biz_website', activeProfile.website || '');

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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">Brand Identity</h1>
                                {user?.plan === 'pro' ? (
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 font-semibold gap-1 py-0.5">
                                        <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> Subscriber
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-muted-foreground font-semibold gap-1 py-0.5">
                                        {user ? 'Free Account' : 'Guest Mode'}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm mt-1">
                                {user?.plan === 'pro' 
                                    ? 'Create and switch between profiles. Pre-populate your team tools instantly.'
                                    : 'Customize your layout and colors to see your brand applied instantly in local tools.'
                                }
                            </p>
                        </div>
                    </div>

                    {!user && (
                        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/10 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-sm">
                                <span className="font-bold">Recommendation:</span> Create a free account or upgrade to Pro to save multiple brand profiles securely in the cloud and unlock remote sharing.
                            </div>
                            <Button 
                                size="sm" 
                                className="bg-amber-800 hover:bg-amber-900 text-white shrink-0 border-none font-semibold cursor-pointer"
                                onClick={() => router.push('/login?redirect=/dashboard/brand-kit')}
                            >
                                Create Account
                            </Button>
                        </div>
                    )}
                    {user && user.plan === 'free' && (
                        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-sm">
                                <span className="font-bold">Upgrade Suggestion:</span> You are on a Free account. Upgrade to Pro to manage multiple brand profiles and share links that maintain your branding.
                            </div>
                            <Button 
                                size="sm" 
                                className="bg-primary hover:bg-primary/95 text-white shrink-0 gap-1.5 border-none font-semibold cursor-pointer"
                                onClick={upgradeToPro}
                            >
                                <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" /> Upgrade to Pro
                            </Button>
                        </div>
                    )}

                    {/* Profile Selector Toolbar */}
                    {user?.plan === 'pro' ? (
                        <Card className="border border-border/80 bg-card/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Label htmlFor="active-profile-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Profile:</Label>
                                <select
                                    id="active-profile-select"
                                    value={activeProfileId}
                                    onChange={e => handleProfileChange(e.target.value)}
                                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-48 font-medium"
                                >
                                    {profiles.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <Button variant="outline" size="sm" onClick={handleCreateProfile} className="gap-1.5 h-9 font-semibold flex-1 sm:flex-none">
                                    <Plus className="w-4 h-4" /> New Profile
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleDeleteProfile} 
                                    disabled={profiles.length <= 1}
                                    className="text-destructive hover:bg-destructive/10 border-destructive/20 h-9 font-semibold gap-1.5 flex-1 sm:flex-none"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card className="border border-border/80 bg-card/40 p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Profile:</span>
                                <Badge variant="outline" className="font-semibold text-sm py-1 bg-background text-foreground">
                                    {activeProfile.name || 'Default Brand Profile'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                                <Lock className="w-3.5 h-3.5" /> Multiple profiles require Pro
                            </div>
                        </Card>
                    )}

                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-200 text-xs font-bold gap-1">
                        {[
                            { id: 'design', name: 'Design & Colors', icon: Sparkles },
                            { id: 'logos', name: 'Logos', icon: ImageIcon },
                            { id: 'contact', name: 'Contact Info', icon: Mail },
                            { id: 'socials', name: 'Socials & Legal', icon: Link2 },
                        ].map(tab => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`pb-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
                                        activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <IconComponent className="w-3.5 h-3.5" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>

                    <Card className="shadow-sm border bg-card/60">
                        <CardContent className="p-6">
                            {/* TAB 1: DESIGN & STYLES */}
                            {activeTab === 'design' && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="brand-name">Brand / Organization Name</Label>
                                        <Input 
                                            id="brand-name" 
                                            value={activeProfile.name} 
                                            onChange={e => updateActiveProfile('name', e.target.value)} 
                                            placeholder="e.g. Acme Corporation" 
                                            className="bg-background"
                                        />
                                    </div>

                                    <FontSelector 
                                        label="Brand Font Family" 
                                        value={activeProfile.font} 
                                        onChange={val => updateActiveProfile('font', val)} 
                                        className="bg-background rounded-md p-1 border"
                                    />

                                    <div className="space-y-4 border-t pt-4">
                                        <h3 className="font-semibold text-slate-800 text-sm">Theme Palette</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <ColorPicker 
                                                label="Primary (Buttons & Headers)" 
                                                value={activeProfile.colors.primary} 
                                                onChange={val => updateActiveProfileColors('primary', val)} 
                                            />
                                            <ColorPicker 
                                                label="Secondary (Muted / Panels)" 
                                                value={activeProfile.colors.secondary} 
                                                onChange={val => updateActiveProfileColors('secondary', val)} 
                                            />
                                            <ColorPicker 
                                                label="Accent (Highlights / Badges)" 
                                                value={activeProfile.colors.accent} 
                                                onChange={val => updateActiveProfileColors('accent', val)} 
                                            />
                                            <ColorPicker 
                                                label="Background Theme" 
                                                value={activeProfile.colors.background} 
                                                onChange={val => updateActiveProfileColors('background', val)} 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-4">
                                        <h3 className="font-semibold text-slate-800 text-sm">Quick Theme Presets</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {COLOR_PRESETS.map(preset => (
                                                <button
                                                    key={preset.name}
                                                    type="button"
                                                    onClick={() => applyColorPreset(preset.colors)}
                                                    className="flex flex-col items-start p-3 rounded-xl border border-border bg-background hover:bg-slate-50 transition-all text-left shadow-2xs hover:shadow-xs group cursor-pointer"
                                                >
                                                    <span className="text-xs font-bold text-slate-700 mb-2 group-hover:text-primary transition-colors">
                                                        {preset.name}
                                                    </span>
                                                    <div className="flex gap-1.5 w-full">
                                                        <div 
                                                            style={{ backgroundColor: preset.colors.primary }} 
                                                            className="h-6 flex-1 rounded border border-black/5" 
                                                            title="Primary"
                                                        />
                                                        <div 
                                                            style={{ backgroundColor: preset.colors.secondary }} 
                                                            className="h-6 flex-1 rounded border border-black/5" 
                                                            title="Secondary"
                                                        />
                                                        <div 
                                                            style={{ backgroundColor: preset.colors.accent }} 
                                                            className="h-6 flex-1 rounded border border-black/5" 
                                                            title="Accent"
                                                        />
                                                        <div 
                                                            style={{ backgroundColor: preset.colors.background }} 
                                                            className="h-6 flex-1 rounded border border-black/5" 
                                                            title="Background"
                                                        />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: BRAND LOGOS */}
                            {activeTab === 'logos' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-sm mb-1">Brand Logo Assets</h3>
                                        <p className="text-xs text-muted-foreground">Logos are compressed client-side to fit inside URL sharing limits.</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {/* Primary Logo */}
                                        <div className="space-y-2 flex flex-col">
                                            <Label className="text-xs font-bold text-slate-600">Primary Logo (Horizontal)</Label>
                                            {activeProfile.logos?.primary ? (
                                                <div className="border rounded-xl p-3 bg-white flex flex-col items-center justify-center gap-2 h-36 relative group">
                                                    <img src={activeProfile.logos.primary} alt="Primary logo" className="max-h-16 max-w-full object-contain" />
                                                    <button 
                                                        onClick={() => updateActiveProfileLogos('primary', undefined)}
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
                                            <Label className="text-xs font-bold text-slate-600">Secondary Logo (Dark Background)</Label>
                                            {activeProfile.logos?.secondary ? (
                                                <div className="border rounded-xl p-3 bg-slate-900 flex flex-col items-center justify-center gap-2 h-36 relative group">
                                                    <img src={activeProfile.logos.secondary} alt="Secondary logo" className="max-h-16 max-w-full object-contain" />
                                                    <button 
                                                        onClick={() => updateActiveProfileLogos('secondary', undefined)}
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
                                            <Label className="text-xs font-bold text-slate-600">Brand Favicon / Icon</Label>
                                            {activeProfile.logos?.icon ? (
                                                <div className="border rounded-xl p-3 bg-white flex flex-col items-center justify-center gap-2 h-36 relative group">
                                                    <img src={activeProfile.logos.icon} alt="Icon logo" className="w-10 h-10 object-contain" />
                                                    <button 
                                                        onClick={() => updateActiveProfileLogos('icon', undefined)}
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
                            )}

                            {/* TAB 3: CONTACT INFO */}
                            {activeTab === 'contact' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="brand-email" className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> Corporate Email</Label>
                                            <Input 
                                                id="brand-email" 
                                                type="email"
                                                value={activeProfile.email || ''} 
                                                onChange={e => updateActiveProfile('email', e.target.value)} 
                                                placeholder="info@mycompany.com" 
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="brand-phone" className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> Default Phone</Label>
                                            <Input 
                                                id="brand-phone" 
                                                type="tel"
                                                value={activeProfile.phone || ''} 
                                                onChange={e => updateActiveProfile('phone', e.target.value)} 
                                                placeholder="+1 (555) 019-2834" 
                                                className="bg-background"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="brand-website" className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-primary" /> Corporate Website</Label>
                                        <Input 
                                            id="brand-website" 
                                            value={activeProfile.website || ''} 
                                            onChange={e => updateActiveProfile('website', e.target.value)} 
                                            placeholder="www.mycompany.com" 
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="brand-address" className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> Physical Address</Label>
                                        <textarea
                                            id="brand-address"
                                            className="w-full min-h-[96px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={activeProfile.address || ''}
                                            onChange={e => updateActiveProfile('address', e.target.value)}
                                            placeholder="Suite 100, 123 Business Avenue&#10;San Francisco, CA 94107"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: SOCIALS & FOOTER */}
                            {activeTab === 'socials' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-slate-800 text-sm">Social Media Channels</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="social-linkedin" className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-[#0077b5]" /> LinkedIn Username</Label>
                                                <Input 
                                                    id="social-linkedin" 
                                                    value={activeProfile.socials?.linkedin || ''} 
                                                    onChange={e => updateActiveProfileSocials('linkedin', e.target.value)} 
                                                    placeholder="username" 
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="social-twitter" className="flex items-center gap-1.5"><Twitter className="w-3.5 h-3.5 text-[#1da1f2]" /> Twitter (X) Username</Label>
                                                <Input 
                                                    id="social-twitter" 
                                                    value={activeProfile.socials?.twitter || ''} 
                                                    onChange={e => updateActiveProfileSocials('twitter', e.target.value)} 
                                                    placeholder="username" 
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="social-github" className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-foreground" /> GitHub Username</Label>
                                                <Input 
                                                    id="social-github" 
                                                    value={activeProfile.socials?.github || ''} 
                                                    onChange={e => updateActiveProfileSocials('github', e.target.value)} 
                                                    placeholder="username" 
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="social-instagram" className="flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5 text-[#e1306c]" /> Instagram Username</Label>
                                                <Input 
                                                    id="social-instagram" 
                                                    value={activeProfile.socials?.instagram || ''} 
                                                    onChange={e => updateActiveProfileSocials('instagram', e.target.value)} 
                                                    placeholder="username" 
                                                    className="bg-background"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 border-t pt-4">
                                        <Label htmlFor="brand-disclaimer" className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-primary" /> Default Invoice Terms / Legal Disclaimers</Label>
                                        <textarea
                                            id="brand-disclaimer"
                                            className="w-full min-h-[96px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={activeProfile.disclaimer || ''}
                                            onChange={e => updateActiveProfile('disclaimer', e.target.value)}
                                            placeholder="e.g. Payment is due within 30 days. Confidentiality Notice: The contents of this document..."
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button 
                            onClick={handleSave} 
                            size="lg" 
                            className="bg-primary hover:bg-primary/90 text-white font-bold flex-1 shadow-md shadow-primary/10"
                        >
                            {saveStatus === 'saved' ? 'Brand Settings Saved!' : 'Save Brand Settings'}
                                        </Button>
                    </div>

                    {/* Sharing links panel */}
                    {portalUrl && (
                        user?.plan === 'pro' ? (
                            <Card className="shadow-md border border-emerald-100 bg-emerald-50/20">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-1.5 text-emerald-800">
                                        <Globe className="w-5 h-5" /> Shareable Branded Shortcut Links
                                    </CardTitle>
                                    <CardDescription className="text-emerald-700/80">
                                        Access tools via these links to automatically lock tool settings into this specific brand profile.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Brand Portal Link */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-foreground flex items-center justify-between">
                                            Main Branded Tool Portal
                                            <span className="text-xs text-muted-foreground font-normal">Lists all tools with your branding</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-background border border-emerald-200/50 p-2.5 rounded-lg text-xs font-mono select-all truncate max-w-full text-foreground/80">
                                                {portalUrl}
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                className="border-emerald-200/40 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100/10 flex-shrink-0" 
                                                onClick={() => copyToClipboard(portalUrl, 'portal')}
                                            >
                                                {copiedStates['portal'] ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                className="text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100/10 flex-shrink-0 gap-1.5" 
                                                onClick={() => window.open(portalUrl, '_blank')}
                                            >
                                                <ExternalLink className="w-4 h-4" /> Open
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Tool Specific Links */}
                                     <div className="space-y-3 border-t border-emerald-100/30 pt-4">
                                         <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Direct Tool Shortcuts</Label>
                                         <div className="grid gap-2">
                                             {['invoice-swift', 'qr-generator', 'brochure-builder', 'signature-smith'].map(toolSlug => {
                                                 const toolName = toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                                 const encoded = encodeBrandKit(activeProfile);
                                                 const toolUrl = `${window.location.origin}/tools/${toolSlug}?brand_kit=${encoded}`;
                                                 
                                                 return (
                                                     <div key={toolSlug} className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border shadow-sm text-sm">
                                                         <span className="font-semibold text-foreground/80">{toolName}</span>
                                                         <div className="flex gap-1.5">
                                                             <Button 
                                                                 size="sm" 
                                                                 variant="ghost" 
                                                                 className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
                                                                 onClick={() => copyToClipboard(toolUrl, toolSlug)}
                                                             >
                                                                 {copiedStates[toolSlug] ? (
                                                                     <>
                                                                         <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Copied
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
                        ) : (
                            <Card className="shadow-md border border-slate-200 bg-slate-50/50 dark:bg-slate-900/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                                            <Globe className="w-5 h-5 text-muted-foreground" /> Shareable Branded Shortcut Links
                                        </CardTitle>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 flex gap-1 items-center font-bold">
                                            <Lock className="w-3.5 h-3.5" /> Pro Feature
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Share pre-configured links containing your primary and secondary colors, brand logo, and default business contact details with your team or clients.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pb-6">
                                    <div className="rounded-xl border bg-background/80 backdrop-blur-xs p-5 text-center flex flex-col items-center justify-center">
                                        <p className="text-sm text-muted-foreground max-w-md mb-4 leading-relaxed">
                                            Sharing pre-designed brand kits requires a paid account. With Pro, anyone using your custom link will automatically load your presets.
                                        </p>
                                        {user ? (
                                            <Button 
                                                onClick={upgradeToPro} 
                                                className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-sm border-none cursor-pointer"
                                            >
                                                <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300" /> Upgrade to Pro to Share
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={() => router.push('/login?redirect=/dashboard/brand-kit')} 
                                                className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-sm border-none cursor-pointer"
                                            >
                                                Create Account to Share
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                 </div>

                 {/* Mockup Preview Panel */}
                 <div className="w-full lg:w-5/12 sticky top-24">
                     <h3 className="font-semibold text-foreground/80 text-sm mb-4">Interactive Branding Preview</h3>
                     
                     <div 
                         style={{ 
                             fontFamily: activeProfile.font.includes('var(') ? activeProfile.font : 'inherit',
                             backgroundColor: activeProfile.colors.background,
                             color: activeProfile.colors.primary
                         }} 
                         className="rounded-3xl border border-border shadow-lg p-6 min-h-[480px] flex flex-col justify-between transition-colors duration-300"
                     >
                         {/* Mock Header */}
                         <div className="flex justify-between items-center border-b pb-4 mb-6" style={{ borderColor: `${activeProfile.colors.primary}20` }}>
                             <div className="flex items-center gap-2">
                                 {activeProfile.logos?.primary ? (
                                     <img src={activeProfile.logos.primary} alt="Brand Logo Mockup" className="max-h-8 max-w-[120px] object-contain" />
                                 ) : (
                                     <div 
                                         style={{ 
                                             backgroundColor: activeProfile.colors.primary,
                                             color: getContrastColor(activeProfile.colors.primary)
                                         }} 
                                         className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                                     >
                                         {activeProfile.name ? activeProfile.name.charAt(0).toUpperCase() : 'B'}
                                     </div>
                                 )}
                                 <span className="font-bold text-base tracking-tight text-foreground" style={{ color: activeProfile.colors.primary }}>
                                     {activeProfile.name || 'Acme Corp'}
                                 </span>
                             </div>
                             <span 
                                 style={{ backgroundColor: `${activeProfile.colors.primary}12`, color: activeProfile.colors.primary }} 
                                 className="text-2xs font-semibold px-2 py-0.5 rounded border"
                             >
                                 Branded Session
                             </span>
                         </div>

                         {/* Mock Canvas Content */}
                         <div className="flex-1 flex flex-col justify-center space-y-6">
                             <div className="space-y-2">
                                 <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: activeProfile.colors.primary }}>
                                     Headline Title
                                 </h1>
                                 <p className="text-sm text-slate-600 leading-relaxed">
                                     This is how your selected brand font and style palette render across the tools. Visitors will access the suite locked into these configurations.
                                 </p>
                             </div>

                             {/* Colors demonstration circles */}
                             <div className="flex gap-3 justify-center py-4 bg-card/100 rounded-2xl border border-slate-100">
                                 <div className="text-center">
                                     <div style={{ backgroundColor: activeProfile.colors.primary }} className="w-10 h-10 rounded-full border shadow-sm mx-auto" />
                                     <span className="text-3xs font-semibold text-slate-400 mt-1 block">Primary</span>
                                 </div>
                                 <div className="text-center">
                                     <div style={{ backgroundColor: activeProfile.colors.secondary }} className="w-10 h-10 rounded-full border shadow-sm mx-auto" />
                                     <span className="text-3xs font-semibold text-slate-400 mt-1 block">Secondary</span>
                                 </div>
                                 <div className="text-center">
                                     <div style={{ backgroundColor: activeProfile.colors.accent }} className="w-10 h-10 rounded-full border shadow-sm mx-auto" />
                                     <span className="text-3xs font-semibold text-slate-400 mt-1 block">Accent</span>
                                 </div>
                                 <div className="text-center">
                                     <div style={{ backgroundColor: activeProfile.colors.background }} className="w-10 h-10 rounded-full border shadow-sm mx-auto" />
                                     <span className="text-3xs font-semibold text-slate-400 mt-1 block">BG</span>
                                 </div>
                             </div>

                             {/* Button Preview */}
                             <div className="space-y-2">
                                 <Button 
                                     style={{ 
                                         backgroundColor: activeProfile.colors.primary, 
                                         color: getContrastColor(activeProfile.colors.primary) 
                                     }} 
                                     className="w-full font-semibold pointer-events-none border-none py-5"
                                 >
                                     Sample Action Button
                                 </Button>
                                 <div className="flex gap-2">
                                     <Button 
                                         style={{ 
                                             backgroundColor: activeProfile.colors.secondary, 
                                             color: getContrastColor(activeProfile.colors.secondary) 
                                         }} 
                                         className="flex-1 font-semibold pointer-events-none border-none py-5"
                                     >
                                         Secondary Button
                                     </Button>
                                     <Button 
                                         style={{ backgroundColor: `${activeProfile.colors.accent}20`, color: activeProfile.colors.accent, borderColor: activeProfile.colors.accent }} 
                                         className="flex-1 font-semibold pointer-events-none py-5 border"
                                     >
                                         Accent Action
                                     </Button>
                                 </div>
                             </div>
                         </div>

                         {/* Mock Footer */}
                         <div className="mt-8 border-t pt-4 text-center text-3xs text-slate-400 uppercase tracking-wider" style={{ borderColor: `${activeProfile.colors.primary}20` }}>
                             Powered by TinyTask Suite
                         </div>
                     </div>
                 </div>

             </div>
         </div>
     );
}
