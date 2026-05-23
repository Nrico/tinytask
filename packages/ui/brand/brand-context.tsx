"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BrandKit {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
    logos: {
        primary?: string; // compressed base64
        secondary?: string; // compressed base64
        icon?: string; // compressed base64
    };
    font: string;
}

interface BrandKitContextType {
    activeBrandKit: BrandKit | null;
    isBrandedSession: boolean;
    clearBrandKit: () => void;
    setPreviewBrandKit: (kit: BrandKit | null) => void;
}

const BrandKitContext = createContext<BrandKitContextType | undefined>(undefined);

function safeBtoa(str: string): string {
    if (typeof window !== 'undefined') {
        return window.btoa(str);
    }
    return Buffer.from(str, 'binary').toString('base64');
}

function safeAtob(str: string): string {
    if (typeof window !== 'undefined') {
        return window.atob(str);
    }
    return Buffer.from(str, 'base64').toString('binary');
}

export function encodeBrandKit(kit: BrandKit): string {
    try {
        const jsonStr = JSON.stringify(kit);
        const utf8Str = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        });
        const base64 = safeBtoa(utf8Str);
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
        console.error("Failed to encode brand kit", e);
        return "";
    }
}

export function decodeBrandKit(str: string): BrandKit | null {
    if (!str) return null;
    try {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        const binaryStr = safeAtob(base64);
        const jsonStr = decodeURIComponent(
            Array.prototype.map.call(binaryStr, (c: string) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );
        return JSON.parse(jsonStr) as BrandKit;
    } catch (e) {
        console.error("Failed to decode brand kit", e);
        return null;
    }
}

export function compressLogo(file: File, maxWidth = 150, maxHeight = 150): Promise<string> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            return reject(new Error("Cannot compress logo on server side"));
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                }
                
                try {
                    const dataUrl = canvas.toDataURL('image/webp', 0.6);
                    resolve(dataUrl);
                } catch (e) {
                    resolve(canvas.toDataURL('image/png'));
                }
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

function getContrastColor(hexColor: string): string {
    let rgb = { r: 255, g: 255, b: 255 };
    const hex = hexColor.replace('#', '');
    if (hex.length === 3) {
        rgb.r = parseInt(hex[0] + hex[0], 16);
        rgb.g = parseInt(hex[1] + hex[1], 16);
        rgb.b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        rgb.r = parseInt(hex.substring(0, 2), 16);
        rgb.g = parseInt(hex.substring(2, 4), 16);
        rgb.b = parseInt(hex.substring(4, 6), 16);
    }
    const brightness = Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
    return brightness > 128 ? '#0f172a' : '#ffffff'; // Slate-900 or White
}

function applyBrandStyles(kit: BrandKit | null) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    
    if (!kit) {
        // Remove style overrides
        root.style.removeProperty('--primary');
        root.style.removeProperty('--primary-foreground');
        root.style.removeProperty('--secondary');
        root.style.removeProperty('--secondary-foreground');
        root.style.removeProperty('--accent');
        root.style.removeProperty('--accent-foreground');
        root.style.removeProperty('--background');
        root.style.removeProperty('--font-sans');
        return;
    }
    
    // Apply new styles
    root.style.setProperty('--primary', kit.colors.primary);
    root.style.setProperty('--primary-foreground', getContrastColor(kit.colors.primary));
    root.style.setProperty('--secondary', kit.colors.secondary);
    root.style.setProperty('--secondary-foreground', getContrastColor(kit.colors.secondary));
    root.style.setProperty('--accent', kit.colors.accent);
    root.style.setProperty('--accent-foreground', getContrastColor(kit.colors.accent));
    root.style.setProperty('--background', kit.colors.background);
    root.style.setProperty('--font-sans', `${kit.font}, sans-serif`);
}

export function BrandKitProvider({ children }: { children: React.ReactNode }) {
    const [activeBrandKit, setActiveBrandKit] = useState<BrandKit | null>(null);
    const [isBrandedSession, setIsBrandedSession] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check query param first
        const searchParams = new URLSearchParams(window.location.search);
        const urlBrandParam = searchParams.get('brand_kit');
        
        if (urlBrandParam) {
            const decoded = decodeBrandKit(urlBrandParam);
            if (decoded) {
                setActiveBrandKit(decoded);
                setIsBrandedSession(true);
                sessionStorage.setItem('tinytask_active_brand_kit', JSON.stringify(decoded));
                applyBrandStyles(decoded);
                return;
            }
        }

        // Check sessionStorage
        const stored = sessionStorage.getItem('tinytask_active_brand_kit');
        if (stored) {
            try {
                const decoded = JSON.parse(stored) as BrandKit;
                setActiveBrandKit(decoded);
                setIsBrandedSession(true);
                applyBrandStyles(decoded);
            } catch (e) {
                console.error("Failed to parse stored brand kit", e);
                sessionStorage.removeItem('tinytask_active_brand_kit');
            }
        }
    }, []);

    const clearBrandKit = () => {
        setActiveBrandKit(null);
        setIsBrandedSession(false);
        sessionStorage.removeItem('tinytask_active_brand_kit');
        applyBrandStyles(null);
        
        // Remove brand_kit query parameter from the URL if present
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('brand_kit');
            window.history.replaceState({}, '', url.pathname + url.search);
        }
    };

    const setPreviewBrandKit = (kit: BrandKit | null) => {
        applyBrandStyles(kit);
    };

    return (
        <BrandKitContext.Provider value={{ activeBrandKit, isBrandedSession, clearBrandKit, setPreviewBrandKit }}>
            {children}
        </BrandKitContext.Provider>
    );
}

export function useBrandKit() {
    const context = useContext(BrandKitContext);
    if (context === undefined) {
        throw new Error('useBrandKit must be used within a BrandKitProvider');
    }
    return context;
}
