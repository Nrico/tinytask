"use client"

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useBrandKit, BrandKit } from '@tinytask/ui/brand/brand-context';

export function BrandKitSync() {
    const { user, isLoading } = useAuth();
    const { updateActiveBrandKit, activeBrandKit, clearBrandKit } = useBrandKit();

    useEffect(() => {
        if (isLoading) return;

        if (user) {
            if (user.plan === 'pro') {
                const savedKits = localStorage.getItem(`tinytask_brand_kits_${user.id}`);
                const activeId = localStorage.getItem(`tinytask_active_brand_kit_id_${user.id}`);
                
                if (savedKits) {
                    try {
                        const parsedKits = JSON.parse(savedKits) as BrandKit[];
                        if (Array.isArray(parsedKits) && parsedKits.length > 0) {
                            const selectedId = activeId && parsedKits.some(k => k.id === activeId) 
                                ? activeId 
                                : parsedKits[0].id;
                            const activeKit = parsedKits.find(k => k.id === selectedId) || parsedKits[0];
                            // Only update context if it differs to prevent re-render loops
                            if (!activeBrandKit || JSON.stringify(activeBrandKit) !== JSON.stringify(activeKit)) {
                                updateActiveBrandKit(activeKit);
                            }
                        }
                    } catch (e) {
                        console.error("Failed to parse user brand kits in sync", e);
                    }
                } else {
                    // Check legacy single brand kit
                    const legacy = localStorage.getItem(`tinytask_brand_kit_${user.id}`);
                    if (legacy) {
                        try {
                            const kit = JSON.parse(legacy) as BrandKit;
                            if (kit) {
                                if (!kit.id) kit.id = 'default';
                                const kits = [kit];
                                localStorage.setItem(`tinytask_brand_kits_${user.id}`, JSON.stringify(kits));
                                localStorage.setItem(`tinytask_active_brand_kit_id_${user.id}`, 'default');
                                if (!activeBrandKit || JSON.stringify(activeBrandKit) !== JSON.stringify(kit)) {
                                    updateActiveBrandKit(kit);
                                }
                            }
                        } catch (e) {
                            console.error("Failed to parse legacy brand kit in sync", e);
                        }
                    }
                }
            } else {
                // User is logged in but on the free plan, so clear any residual brand kit
                clearBrandKit();
            }
        } else {
            // User is logged out. We only clear context if we aren't in a branded link session
            if (typeof window !== 'undefined') {
                const searchParams = new URLSearchParams(window.location.search);
                if (!searchParams.has('brand_kit')) {
                    clearBrandKit();
                }
            }
        }
    }, [user, isLoading, updateActiveBrandKit, activeBrandKit, clearBrandKit]);

    return null;
}

