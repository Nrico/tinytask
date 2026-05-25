"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Label } from '@tinytask/ui/forms/label';
import { Card, CardContent } from '@tinytask/ui/cards/card';
import { ArrowLeft, Users, Shuffle, Trophy, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@tinytask/ui/forms/input';
import { Textarea } from '@tinytask/ui/forms/textarea';

export default function TeamTagglerPage() {
    const [namesInput, setNamesInput] = useState("Alice\nBob\nCharlie\nDavid\nEve\nFrank\nGrace\nHank");
    const [mode, setMode] = useState<'pick' | 'groups'>('pick');
    const [numGroups, setNumGroups] = useState(2);
    const [result, setResult] = useState<any>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayWinner, setDisplayWinner] = useState<string | null>(null);

    const getNames = () => namesInput.split('\n').filter(n => n.trim() !== '');

    const handlePickOne = () => {
        const names = getNames();
        if (names.length === 0) return;

        setIsAnimating(true);
        setResult(null);

        let count = 0;
        const maxCount = 20;
        const interval = setInterval(() => {
            setDisplayWinner(names[Math.floor(Math.random() * names.length)]);
            count++;
            if (count >= maxCount) {
                clearInterval(interval);
                const winner = names[Math.floor(Math.random() * names.length)];
                setDisplayWinner(winner);
                setResult(winner);
                setIsAnimating(false);
            }
        }, 100);
    };

    const handleMakeGroups = () => {
        const names = getNames();
        if (names.length === 0) return;

        // Fisher-Yates Shuffle
        const shuffled = [...names];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Split into groups
        const groups: string[][] = Array.from({ length: numGroups }, () => []);
        shuffled.forEach((name, i) => {
            groups[i % numGroups].push(name);
        });

        setResult(groups);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pick Winners & Split Squads</h1>
                        <p className="text-muted-foreground">Randomly pick a winner or split teams instantly.</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Input Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label>Names List</Label>
                                <Textarea
                                    value={namesInput}
                                    onChange={e => setNamesInput(e.target.value)}
                                    className="h-64 font-sans"
                                    placeholder="Enter names, one per line..."
                                />
                                <p className="text-xs text-muted-foreground">{getNames().length} names entered</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'pick' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}
                                        onClick={() => { setMode('pick'); setResult(null); }}
                                    >
                                        Pick One
                                    </button>
                                    <button
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'groups' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}
                                        onClick={() => { setMode('groups'); setResult(null); }}
                                    >
                                        Make Groups
                                    </button>
                                </div>

                                {mode === 'groups' && (
                                    <div className="space-y-2">
                                        <Label>Number of Groups</Label>
                                        <Input
                                            type="number"
                                            min="2"
                                            max="20"
                                            value={numGroups}
                                            onChange={e => setNumGroups(parseInt(e.target.value) || 2)}
                                        />
                                    </div>
                                )}

                                <Button
                                    className="w-full bg-primary hover:bg-primary/90"
                                    size="lg"
                                    onClick={mode === 'pick' ? handlePickOne : handleMakeGroups}
                                    disabled={isAnimating || getNames().length === 0}
                                >
                                    {mode === 'pick' ? (
                                        <><Trophy className="w-4 h-4 mr-2" /> Pick Winner</>
                                    ) : (
                                        <><Shuffle className="w-4 h-4 mr-2" /> Shuffle Teams</>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-2 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center min-h-[500px]">
                    {mode === 'pick' ? (
                        <div className="text-center space-y-6">
                            {isAnimating || result ? (
                                <div className="animate-in zoom-in duration-300">
                                    <div className="text-sm font-bold text-primary uppercase tracking-widest mb-4">The Winner Is</div>
                                    <div className={`text-6xl font-black text-slate-900 ${isAnimating ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
                                        {displayWinner}
                                    </div>
                                    {!isAnimating && (
                                        <Button variant="outline" className="mt-8" onClick={handlePickOne}>
                                            <RefreshCcw className="w-4 h-4 mr-2" /> Pick Again
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <Trophy className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Ready to pick a winner...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full">
                            {result ? (
                                <div className="grid sm:grid-cols-2 gap-4 w-full">
                                    {(result as string[][]).map((group, idx) => (
                                        <Card key={idx} className="overflow-hidden">
                                            <div className="bg-primary px-4 py-2 text-white font-bold text-sm flex justify-between">
                                                <span>Group {idx + 1}</span>
                                                <span className="opacity-80">{group.length} members</span>
                                            </div>
                                            <CardContent className="p-4">
                                                <ul className="space-y-2">
                                                    {group.map((member, mIdx) => (
                                                        <li key={mIdx} className="flex items-center gap-2 text-sm">
                                                            <div className="w-6 h-6 rounded-full bg-card text-primary flex items-center justify-center text-xs font-bold">
                                                                {member.charAt(0)}
                                                            </div>
                                                            {member}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center text-center">
                                    <Users className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Ready to split {getNames().length} people into {numGroups} groups...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
