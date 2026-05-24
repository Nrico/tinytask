"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
    QrCode, 
    FileSpreadsheet, 
    FileText, 
    Heart, 
    Search, 
    Star, 
    Shield, 
    Zap, 
    Sparkles 
} from "lucide-react"
import { ToolCard } from "@/components/ui/tool-card"
import { ALL_TOOLS } from "@/components/layout/header"

export default function Home() {
    const [activeCategory, setActiveCategory] = useState<"all" | "print" | "data" | "text" | "digital">("all")
    const [searchQuery, setSearchQuery] = useState("")

    // Filter tools based on activeCategory and searchQuery
    const filteredTools = useMemo(() => {
        return ALL_TOOLS.filter(tool => {
            const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
            const matchesSearch = searchQuery.trim() === "" ||
                tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    // Categories config
    const categories = [
        { id: "all", name: "All Tools", count: ALL_TOOLS.length, icon: Star },
        { id: "print", name: "Office & Print", count: ALL_TOOLS.filter(t => t.category === "print").length, icon: FileText },
        { id: "data", name: "Data & Sheets", count: ALL_TOOLS.filter(t => t.category === "data").length, icon: FileSpreadsheet },
        { id: "text", name: "Text Cleaners", count: ALL_TOOLS.filter(t => t.category === "text").length, icon: Sparkles },
        { id: "digital", name: "Digital Assets", count: ALL_TOOLS.filter(t => t.category === "digital").length, icon: QrCode },
    ];

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center sm:px-6 lg:px-8">
                <div className="space-y-6 text-left">
                    <div className="eyebrow">Simple tools. Real work.</div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-foreground">
                        Tiny tools for <span className="text-primary block mt-1">big tasks.</span>
                    </h1>
                    <p className="max-w-[560px] text-base md:text-lg text-muted-foreground leading-relaxed">
                        A suite of simple, practical tools that help you clean files, format data, build documents, and get work done faster.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <a href="#categories">
                            <Button size="lg" className="h-11 px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl text-sm transition-all shadow-sm">
                                Explore tools
                            </Button>
                        </a>
                        <a href="#pricing">
                            <Button size="lg" variant="outline" className="h-11 px-6 border-border hover:bg-muted/30 text-foreground bg-card/50 font-bold rounded-xl text-sm transition-all shadow-sm">
                                View pricing
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Visual Hero Image */}
                <div className="hidden lg:flex items-center justify-center w-full min-h-[380px] select-none" aria-hidden="true">
                    <img 
                        src="/hero_image_1.jpg" 
                        alt="TinyTask Mockup" 
                        className="w-full max-w-lg object-contain rounded-2xl shadow-md border border-border/40 hover:-translate-y-1 transition-all duration-300"
                    />
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 border-t border-border/20">
                <div className="flex justify-center mb-10">
                    <h2 className="paper-label">Browse by category</h2>
                </div>

                {/* Category tabs grid styled as folders */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
                    {categories.map(cat => {
                        const IconComponent = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as "all" | "print" | "data" | "text" | "digital")}
                                className={`category-card text-left focus:outline-none cursor-pointer ${
                                    isActive
                                        ? "ring-2 ring-primary border-primary shadow-md translate-y-[-2px] bg-card"
                                        : "bg-card/70"
                                }`}
                            >
                                <span className="icon text-primary">
                                    <IconComponent className="w-6 h-6" />
                                </span>
                                <h3 className="font-extrabold text-sm text-foreground">{cat.name}</h3>
                                <span className="count text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary">
                                    {cat.count} tools
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Fuzzy Search and Tool count summary */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-card/45 border border-border/60 rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
                    </div>
                    
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Type to filter tools..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground"
                        />
                    </div>
                </div>

                {/* Tools Grid */}
                {filteredTools.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300">
                        {filteredTools.map(tool => (
                            <ToolCard
                                key={tool.slug}
                                title={tool.name}
                                description={tool.description}
                                icon={<tool.icon className="w-6 h-6" />}
                                href={`/tools/${tool.slug}`}
                                isPreview={
                                    tool.slug === 'brochure-builder' || 
                                    tool.slug === 'jar-label-generator' || 
                                    tool.slug === 'pixel-pruner' || 
                                    tool.slug === 'label-creator' || 
                                    tool.slug === 'table-tuner' || 
                                    tool.slug === 'greeting-card' || 
                                    tool.slug === 'team-taggler' || 
                                    tool.slug === 'name-tent' || 
                                    tool.slug === 'word-formatter' || 
                                    tool.slug === 'zone-zapper'
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card/30 border border-dashed border-border rounded-2xl">
                        <p className="text-muted-foreground text-sm font-semibold">No tools found matching your criteria.</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setActiveCategory("all");
                                setSearchQuery("");
                            }}
                            className="mt-4 text-primary text-xs font-bold hover:bg-muted/40"
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </section>

            {/* Why Section */}
            <section id="why" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 border-t border-border/20">
                <div className="flex justify-center mb-12">
                    <h2 className="paper-label">Why TinyTask?</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <article className="border border-border bg-card/65 rounded-2xl p-6 shadow-sm flex gap-4 items-start">
                        <span className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                            <Heart className="w-5 h-5" />
                        </span>
                        <div className="space-y-1">
                            <h3 className="font-bold text-base text-foreground">Simple</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Easy to use. No clutter. Just single-purpose tools that work perfectly.</p>
                        </div>
                    </article>
                    <article className="border border-border bg-card/65 rounded-2xl p-6 shadow-sm flex gap-4 items-start">
                        <span className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                            <Zap className="w-5 h-5" />
                        </span>
                        <div className="space-y-1">
                            <h3 className="font-bold text-base text-foreground">Fast</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Runs completely inside your browser. No loading bars, instant results.</p>
                        </div>
                    </article>
                    <article className="border border-border bg-card/65 rounded-2xl p-6 shadow-sm flex gap-4 items-start">
                        <span className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                            <Shield className="w-5 h-5" />
                        </span>
                        <div className="space-y-1">
                            <h3 className="font-bold text-base text-foreground">Private</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Your files stay on your device. We do not store or see your data.</p>
                        </div>
                    </article>
                    <article className="border border-border bg-card/65 rounded-2xl p-6 shadow-sm flex gap-4 items-start">
                        <span className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                            <Star className="w-5 h-5" />
                        </span>
                        <div className="space-y-1">
                            <h3 className="font-bold text-base text-foreground">Useful</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Practical micro-utilities designed to solve real daily office tasks.</p>
                        </div>
                    </article>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 border-t border-border/20 max-w-4xl">
                <div className="flex justify-center mb-12">
                    <h2 className="paper-label">Simple pricing</h2>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                    <article className="relative border border-border bg-card/80 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[320px]">
                        <div>
                            <h3 className="font-extrabold text-xl text-foreground">Free Plan</h3>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Essential tools for everyday task automation.</p>
                            <div className="text-4xl font-black tracking-tight text-foreground mt-6">$0<small className="text-sm text-muted-foreground font-semibold"> /mo</small></div>
                            
                            <ul className="mt-6 space-y-2 text-xs text-muted-foreground font-semibold">
                                <li className="flex items-center gap-2">✓ Access to standard tools</li>
                                <li className="flex items-center gap-2">✓ 100% private browser processing</li>
                                <li className="flex items-center gap-2">✓ Unlimited standard exports</li>
                            </ul>
                        </div>
                        <a href="#categories" className="mt-8">
                            <Button className="w-full text-xs font-bold border border-border hover:bg-muted/40 text-foreground bg-card/50 h-10 rounded-xl cursor-pointer">
                                Get started
                            </Button>
                        </a>
                    </article>

                    <article className="relative border-2 border-primary bg-card rounded-2xl p-8 shadow-md flex flex-col justify-between min-h-[320px]">
                        <span className="absolute top-0 right-6 translate-y-[-50%] bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            Popular
                        </span>
                        <div>
                            <h3 className="font-extrabold text-xl text-foreground">Pro Plan</h3>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Unlock advanced file operations and bulk formatting.</p>
                            <div className="text-4xl font-black tracking-tight text-foreground mt-6">$9<small className="text-sm text-muted-foreground font-semibold"> /mo</small></div>
                            
                            <ul className="mt-6 space-y-2 text-xs text-muted-foreground/90 font-semibold">
                                <li className="flex items-center gap-2">✓ Everything in Free</li>
                                <li className="flex items-center gap-2">✓ Advanced print tools &amp; layouts</li>
                                <li className="flex items-center gap-2">✓ High-res vector code downloads</li>
                                <li className="flex items-center gap-2">✓ PDF invoice customization &amp; reports</li>
                            </ul>
                        </div>
                        <Link href="/login" className="mt-8">
                            <Button className="w-full text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-xl cursor-pointer">
                                Upgrade to Pro
                            </Button>
                        </Link>
                    </article>
                </div>
            </section>
        </main>
    )
}
