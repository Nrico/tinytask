"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Table, Clipboard, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TableTunerPage() {
    const [input, setInput] = useState('Name\tRole\tLocation\nJohn\tDev\tNY\nJane\tDesign\tCA');
    const [output, setOutput] = useState('');
    const [format, setFormat] = useState('markdown'); // markdown, html, json, csv, ascii
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // PARSING
        if (!input.trim()) {
            setOutput('');
            return;
        }

        // Detect separator (Excel uses tabs, CSV uses commas)
        // Simple detection: check first line
        const firstLine = input.split('\n')[0];
        const separator = firstLine.includes('\t') ? '\t' : ',';

        const rows = input.split('\n').filter(r => r.trim() !== '').map(r => r.split(separator));
        const headers = rows[0];
        const body = rows.slice(1);

        let res = '';

        // FORMATTING
        if (format === 'markdown') {
            const headerRow = `| ${headers.join(' | ')} |`;
            const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
            const bodyRows = body.map(r => `| ${r.join(' | ')} |`).join('\n');
            res = `${headerRow}\n${separatorRow}\n${bodyRows}`;
        }
        else if (format === 'html') {
            const th = headers.map(h => `    <th>${h.trim()}</th>`).join('\n');
            const trs = body.map(r => `  <tr>\n${r.map(c => `    <td>${c.trim()}</td>`).join('\n')}\n  </tr>`).join('\n');
            res = `<table>\n  <thead>\n    <tr>\n${th}\n    </tr>\n  </thead>\n  <tbody>\n${trs}\n  </tbody>\n</table>`;
        }
        else if (format === 'json') {
            const jsonArr = body.map(row => {
                const obj: Record<string, string> = {};
                headers.forEach((h, i) => obj[h.trim()] = (row[i] || '').trim());
                return obj;
            });
            res = JSON.stringify(jsonArr, null, 2);
        }
        else if (format === 'csv') {
            res = rows.map(r => r.join(',')).join('\n');
        }
        else if (format === 'ascii') {
            // Calculate widths
            const colWidths = headers.map((_, i) => {
                const headerLen = (headers[i] || '').length;
                const maxBodyLen = Math.max(0, ...body.map(r => (r[i] || '').length));
                return Math.max(headerLen, maxBodyLen);
            });

            const drawLine = (char = '-') => `+${colWidths.map(w => char.repeat(w + 2)).join('+')}+`;
            const drawRow = (row: string[]) => `| ${row.map((c, i) => (c || '').padEnd(colWidths[i])).join(' | ')} |`;

            res = [
                drawLine(),
                drawRow(headers),
                drawLine('='),
                ...body.map(r => drawRow(r)),
                drawLine()
            ].join('\n');
        }

        setOutput(res);

    }, [input, format]);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)]">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 bg-background border-r flex flex-col shadow-sm z-10">
                <div className="p-6 border-b">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h2 className="font-bold text-xl flex items-center gap-2">
                        <Table className="w-5 h-5 text-teal-600" /> Table Tuner
                    </h2>
                </div>

                <div className="p-6 space-y-6 flex-1">
                    <div className="space-y-2">
                        <Label>Input Data</Label>
                        <textarea
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none h-48 font-mono text-xs resize-none bg-background"
                            placeholder="Paste from Excel (tab separated) or CSV..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Supports tab-separated (Excel) and CSV.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Output Format</Label>
                        <div className="flex flex-col gap-2">
                            {['markdown', 'html', 'json', 'csv', 'ascii'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors border",
                                        format === f
                                            ? "bg-teal-50 text-teal-700 border-teal-200"
                                            : "bg-background hover:bg-secondary border-transparent"
                                    )}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Output Area */}
            <div className="flex-1 bg-secondary/20 p-8 flex flex-col">
                <div className="bg-background rounded-xl shadow-sm border flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-secondary/10">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Result Preview</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                            {copied ? 'COPIED' : 'COPY CODE'}
                        </Button>
                    </div>
                    <pre className="flex-1 p-6 font-mono text-sm overflow-auto text-foreground whitespace-pre">
                        {output}
                    </pre>
                </div>
            </div>
        </div>
    );
}
