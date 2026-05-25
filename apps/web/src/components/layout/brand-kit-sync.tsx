"use client"

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useBrandKit } from '@tinytask/ui/brand/brand-context';

export function BrandKitSync() {
    const { user, isLoading } = useAuth();
    const { updateActiveBrandKit, activeBrandKit, clearBrandKit } = useBrandKit();

    useEffect(() => {
        if (isLoading) return;

        if (user) {
            if (user.plan === 'pro') {
                const saved = localStorage.getItem(`tinytask_brand_kit_${user.id}`);
                if (saved) {
                    try {
                        const kit = JSON.parse(saved);
                        // Only update context if it differs to prevent re-render loops
                        if (!activeBrandKit || JSON.stringify(activeBrandKit) !== JSON.stringify(kit)) {
                            updateActiveBrandKit(kit);
                        }
                    } catch (e) {
                        console.error("Failed to parse user brand kit in sync", e);
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
