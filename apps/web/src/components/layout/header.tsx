"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { User, LogOut, ChevronDown, FileText, Globe, Mail, Image as ImageIcon, BookOpen, Heart, Users, Tent, Table, QrCode, Tags, AlertTriangle, FileSpreadsheet, Zap } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HowToGuide } from "@/components/layout/how-to-guide";

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block text-xl tracking-tight">TinyTask</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 gap-1">
                                    Tools <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuLabel>Documents</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/invoice-swift" className="cursor-pointer w-full flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-emerald-500" /> Invoice Swift
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/brochure-builder" className="cursor-pointer w-full flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-sky-500" /> Brochure Builder
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/bi-fold-brochure" className="cursor-pointer w-full flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-blue-500" /> Bi-Fold Brochure
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/greeting-card" className="cursor-pointer w-full flex items-center gap-2">
                                            <Heart className="h-4 w-4 text-red-500" /> Greeting Card
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/name-tent" className="cursor-pointer w-full flex items-center gap-2">
                                            <Tent className="h-4 w-4 text-rose-500" /> Name Tent Maker
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/sign-generator" className="cursor-pointer w-full flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-orange-500" /> Sign Generator
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/label-creator" className="cursor-pointer w-full flex items-center gap-2">
                                            <Tags className="h-4 w-4 text-purple-500" /> Label Creator
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Utilities</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/qr-generator" className="cursor-pointer w-full flex items-center gap-2">
                                            <QrCode className="h-4 w-4 text-blue-500" /> QR Generator
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/pixel-pruner" className="cursor-pointer w-full flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-cyan-500" /> Pixel Pruner
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/zone-zapper" className="cursor-pointer w-full flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-cyan-600" /> Zone Zapper
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/team-taggler" className="cursor-pointer w-full flex items-center gap-2">
                                            <Users className="h-4 w-4 text-indigo-500" /> Team Taggler
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/signature-smith" className="cursor-pointer w-full flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-pink-500" /> Signature Smith
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Data</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/excel-scrubber" className="cursor-pointer w-full flex items-center gap-2">
                                            <FileSpreadsheet className="h-4 w-4 text-green-600" /> Excel Scrubber
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/table-tuner" className="cursor-pointer w-full flex items-center gap-2">
                                            <Table className="h-4 w-4 text-teal-600" /> Table Tuner
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tools/word-formatter" className="cursor-pointer w-full flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-indigo-600" /> Word Formatter
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 gap-1">
                                    Collections <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuLabel>Industry Pages</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/collections/florist" className="cursor-pointer w-full flex items-center gap-2">
                                            <Heart className="h-4 w-4 text-rose-500" /> Florist
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/collections/productivity" className="cursor-pointer w-full flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-amber-500" /> Productivity
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
                        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search could go here */}
                    </div>
                    <nav className="flex items-center gap-2">
                        <HowToGuide />
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <User className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Sign In</Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
