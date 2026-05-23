"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@tinytask/ui/buttons/button";
import { Label } from "@tinytask/ui/forms/label";
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout";
import { Clipboard, Check } from "lucide-react";
import { cn } from "@tinytask/utils";

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
        <ToolLayout
            title="Table Tuner"
            description="Convert CSV or Excel data to Markdown, HTML, JSON, and ASCII tables."
            sidebarContent={
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Input Data</Label>
                        <textarea
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none h-48 font-mono text-xs resize-none bg-background text-foreground"
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
            }
            previewContent={
                <div className="bg-background rounded-xl shadow-sm border flex flex-col h-full w-full max-w-4xl overflow-hidden min-h-[400px]">
                    <div className="p-4 border-b flex justify-between items-center bg-secondary/10">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Result Preview</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                            {copied ? 'COPIED' : 'COPY CODE'}
                        </Button>
                    </div>
                    <pre className="flex-1 p-6 font-mono text-sm overflow-auto text-foreground whitespace-pre leading-relaxed">
                        {output}
                    </pre>
                </div>
            }
        />
    );
}
