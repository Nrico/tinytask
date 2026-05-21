"use client"

import React, { useState, useEffect } from 'react';
import { FileUploader } from './components/file-uploader';
import { ScrubberControls } from './components/scrubber-controls';
import { Button } from '@tinytask/ui/buttons/button';
import { parseExcelFile, cleanData, exportToExcel, ScrubberOptions } from './lib/excel-utils';
import { ArrowLeft, Download, FileSpreadsheet, MoveLeft, MoveRight, ChevronDown, ArrowRightLeft, SplitSquareHorizontal, Merge, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@tinytask/ui/forms/dropdown-menu"

export default function ExcelScrubberPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [originalCount, setOriginalCount] = useState(0);
    const [options, setOptions] = useState<ScrubberOptions>({
        removeEmptyRows: true,
        removeDuplicates: false,
        trimWhitespace: true,
        upperCaseHeader: false,
    });

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        const jsonData = await parseExcelFile(selectedFile);
        setData(jsonData);
        setOriginalCount(jsonData.length);
        if (jsonData.length > 0) {
            setHeaders(Object.keys(jsonData[0]));
        }
    };

    // Apply cleaning options whenever data or options change
    // Note: This might be expensive for large files, so we might want to debounce or make it manual.
    // For now, let's make it manual via a "Clean" button or just apply on export?
    // Actually, the previous implementation applied it on effect. Let's keep it simple:
    // We will display the CURRENT data state. Column ops modify 'data' directly.
    // 'ScrubberControls' will modify 'options', and we can have a button to "Apply Global Cleaners".

    const applyGlobalCleaners = () => {
        const cleaned = cleanData(data, options);
        setData(cleaned);
    };

    const handleExport = () => {
        exportToExcel(data, 'cleaned_data');
    };

    // --- Column Operations ---

    const moveColumn = (colName: string, direction: 'left' | 'right') => {
        const currentIndex = headers.indexOf(colName);
        if (currentIndex === -1) return;
        const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= headers.length) return;

        const newHeaders = [...headers];
        [newHeaders[currentIndex], newHeaders[newIndex]] = [newHeaders[newIndex], newHeaders[currentIndex]];
        setHeaders(newHeaders);
    };

    const switchNameFormat = (colName: string) => {
        const newData = data.map(row => {
            const val = row[colName];
            if (!val || typeof val !== 'string') return row;

            if (val.includes(',')) {
                const parts = val.split(',').map((s: string) => s.trim());
                if (parts.length === 2) {
                    return { ...row, [colName]: `${parts[1]} ${parts[0]} ` };
                }
            } else {
                const parts = val.split(' ');
                if (parts.length >= 2) {
                    const last = parts.pop();
                    const first = parts.join(' ');
                    return { ...row, [colName]: `${last}, ${first} ` };
                }
            }
            return row;
        });
        setData(newData);
    };

    const splitColumn = (colName: string) => {
        const colIndex = headers.indexOf(colName);
        const col1Name = `${colName} (1)`;
        const col2Name = `${colName} (2)`;

        const newHeaders = [...headers];
        newHeaders.splice(colIndex + 1, 0, col1Name, col2Name);
        setHeaders(newHeaders);

        const newData = data.map(row => {
            const val = row[colName] || "";
            let part1 = "", part2 = "";

            if (val.includes(',')) {
                [part1, part2] = val.split(',').map((s: string) => s.trim());
            } else {
                const parts = val.split(' ');
                part1 = parts[0];
                part2 = parts.slice(1).join(' ');
            }

            return { ...row, [col1Name]: part1 || "", [col2Name]: part2 || "" };
        });
        setData(newData);
    };

    const mergeWithRight = (colName: string) => {
        const colIndex = headers.indexOf(colName);
        if (colIndex === headers.length - 1) return;

        const rightColName = headers[colIndex + 1];
        const newColName = `${colName} + ${rightColName} `;

        const newHeaders = [...headers];
        newHeaders.splice(colIndex, 2, newColName);
        setHeaders(newHeaders);

        const newData = data.map(row => {
            const val1 = row[colName] || "";
            const val2 = row[rightColName] || "";
            const merged = `${val1} ${val2} `.trim();
            return { ...row, [newColName]: merged };
        });
        setData(newData);
    };

    const deleteColumn = (colName: string) => {
        setHeaders(headers.filter(h => h !== colName));
    };


    if (data.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Excel Data Scrubber</h1>
                    <p className="text-muted-foreground">Upload your messy Excel or CSV file to clean and format it.</p>
                </div>
                <FileUploader onFileSelect={handleFileSelect} selectedFile={file} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-60px)]">
            <div className="border-b p-4 bg-background flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-secondary rounded-full text-muted-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="font-bold flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-green-600" />
                            Data Preview
                        </h2>
                        <div className="text-xs text-muted-foreground flex gap-2">
                            <span>Original: {originalCount} rows</span>
                            <span>•</span>
                            <span>Current: {data.length} rows</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleExport} className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-80 border-r bg-secondary/10 p-4 overflow-y-auto flex flex-col gap-4">
                    <ScrubberControls options={options} onChange={setOptions} />
                    <Button onClick={applyGlobalCleaners} variant="secondary" className="w-full">
                        Apply Cleaning Rules
                    </Button>
                </div>

                <div className="flex-1 overflow-auto bg-secondary/20 p-8">
                    <div className="bg-background rounded-lg shadow border overflow-hidden inline-block min-w-full">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-secondary/50 border-b">
                                    <th className="p-3 border-r w-12 text-center text-muted-foreground">#</th>
                                    {headers.map((header, idx) => (
                                        <th key={idx} className="p-0 border-r min-w-[200px] relative group">
                                            <div className="p-3 pr-8 font-semibold select-none flex justify-between items-center">
                                                <span>{header}</span>
                                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-secondary rounded px-1 absolute right-1 top-1/2 -translate-y-1/2 shadow-sm">
                                                    <button onClick={() => moveColumn(header, 'left')} disabled={idx === 0} className="p-1 hover:text-primary disabled:opacity-30"><MoveLeft className="w-3 h-3" /></button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-1 hover:text-primary"><ChevronDown className="w-3 h-3" /></button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuLabel>Column Options</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => switchNameFormat(header)}>
                                                                <ArrowRightLeft className="mr-2 h-4 w-4" /> Flip Name Format
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => splitColumn(header)}>
                                                                <SplitSquareHorizontal className="mr-2 h-4 w-4" /> Split Column
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => mergeWithRight(header)}>
                                                                <Merge className="mr-2 h-4 w-4" /> Merge with Right
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => deleteColumn(header)} className="text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Column
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                    <button onClick={() => moveColumn(header, 'right')} disabled={idx === headers.length - 1} className="p-1 hover:text-primary disabled:opacity-30"><MoveRight className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 100).map((row, rIdx) => (
                                    <tr key={rIdx} className="border-b hover:bg-secondary/10">
                                        <td className="p-3 text-center text-xs text-muted-foreground bg-secondary/5 border-r">{rIdx + 1}</td>
                                        {headers.map((header, cIdx) => (
                                            <td key={cIdx} className="p-3 border-r whitespace-nowrap">
                                                {row[header]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data.length > 100 && (
                            <div className="p-4 text-center text-muted-foreground text-sm bg-secondary/5">
                                Showing first 100 rows of {data.length}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
