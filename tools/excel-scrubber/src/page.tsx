"use client"

import React, { useState } from 'react';
import { FileUploader } from '@tinytask/ui/forms/file-uploader';
import { ScrubberControls } from './components/scrubber-controls';
import { Button } from '@tinytask/ui/buttons/button';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { ToolLayout } from '@tinytask/ui/layouts/tool-layout';
import { parseExcelFile, cleanData, exportToExcel, ScrubberOptions } from './lib/excel-utils';
import { Download, FileSpreadsheet, MoveLeft, MoveRight, ChevronDown, ArrowRightLeft, SplitSquareHorizontal, Merge, Trash2 } from 'lucide-react';
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

    // Advanced Column Cleaners State
    const [selectedColumn, setSelectedColumn] = useState('');
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [fillValue, setFillValue] = useState('N/A');
    const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
    const [activeColCleanerTab, setActiveColCleanerTab] = useState<'replace' | 'fill' | 'date'>('replace');

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        const jsonData = await parseExcelFile(selectedFile);
        setData(jsonData);
        setOriginalCount(jsonData.length);
        if (jsonData.length > 0) {
            setHeaders(Object.keys(jsonData[0]));
        }
    };

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
        if (selectedColumn === colName) {
            setSelectedColumn('');
        }
    };

    const applySearchReplace = () => {
        if (!selectedColumn) return alert("Please select a column first");
        const newData = data.map(row => {
            const val = row[selectedColumn];
            if (val === undefined || val === null) return row;
            const strVal = String(val);
            const replaced = strVal.split(findText).join(replaceText);
            return { ...row, [selectedColumn]: replaced };
        });
        setData(newData);
        setFindText('');
        setReplaceText('');
    };

    const applyEmptyFiller = () => {
        if (!selectedColumn) return alert("Please select a column first");
        const newData = data.map(row => {
            const val = row[selectedColumn];
            if (val === undefined || val === null || String(val).trim() === '') {
                return { ...row, [selectedColumn]: fillValue };
            }
            return row;
        });
        setData(newData);
    };

    const excelSerialToDate = (serial: number): Date => {
        const utcDays = Math.floor(serial - 25569);
        const utcValue = utcDays * 86400;
        return new Date(utcValue * 1000);
    };

    const applyDateNormalizer = () => {
        if (!selectedColumn) return alert("Please select a column first");
        const newData = data.map(row => {
            const val = row[selectedColumn];
            if (!val) return row;
            
            let parsedDate: Date | null = null;
            
            if (typeof val === 'number') {
                if (val > 10000 && val < 60000) {
                    parsedDate = excelSerialToDate(val);
                }
            } else if (val instanceof Date) {
                parsedDate = val;
            } else {
                const str = String(val).trim();
                const timestamp = Date.parse(str);
                if (!isNaN(timestamp)) {
                    parsedDate = new Date(timestamp);
                } else {
                    const parts = str.split(/[-/.]/);
                    if (parts.length === 3) {
                        let year = parseInt(parts[0]);
                        let month = parseInt(parts[1]) - 1;
                        let day = parseInt(parts[2]);
                        if (year > 1000) {
                            parsedDate = new Date(year, month, day);
                        } else {
                            day = parseInt(parts[0]);
                            month = parseInt(parts[1]) - 1;
                            year = parseInt(parts[2]);
                            if (year > 1000) {
                                parsedDate = new Date(year, month, day);
                            }
                        }
                    }
                }
            }
            
            if (parsedDate && !isNaN(parsedDate.getTime())) {
                const yyyy = parsedDate.getFullYear();
                const mm = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const dd = String(parsedDate.getDate()).padStart(2, '0');
                
                let formatted = `${yyyy}-${mm}-${dd}`;
                if (dateFormat === 'MM/DD/YYYY') {
                    formatted = `${mm}/${dd}/${yyyy}`;
                } else if (dateFormat === 'DD-MM-YYYY') {
                    formatted = `${dd}-${mm}-${yyyy}`;
                }
                return { ...row, [selectedColumn]: formatted };
            }
            
            return row;
        });
        setData(newData);
    };

    return (
        <ToolLayout
            title="Excel Data Scrubber"
            description="Clean, reorder columns, split/merge fields, and format CSV or Excel tables."
            sidebarContent={
                data.length === 0 ? (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs text-muted-foreground space-y-2 leading-relaxed">
                            <p className="font-semibold text-slate-700">How to use:</p>
                            <ol className="list-decimal pl-4 space-y-1">
                                <li>Upload a `.xlsx` or `.csv` file.</li>
                                <li>Choose cleaning options in the sidebar.</li>
                                <li>Hover column headers to reorder, split, merge, or delete.</li>
                                <li>Click Export to save the cleaned data.</li>
                            </ol>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <ScrubberControls options={options} onChange={setOptions} />
                        <Button 
                            onClick={applyGlobalCleaners} 
                            variant="secondary" 
                            className="w-full bg-slate-100 hover:bg-slate-200 border-none text-slate-800"
                        >
                            Apply Cleaning Rules
                        </Button>

                        <div className="border-t pt-4 space-y-4">
                            <h3 className="font-semibold text-slate-800 text-sm">Advanced Column Cleaners</h3>
                            <div className="space-y-2">
                                <Label htmlFor="column-select">Select Column</Label>
                                <select
                                    id="column-select"
                                    value={selectedColumn}
                                    onChange={e => setSelectedColumn(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">-- Choose Column --</option>
                                    {headers.map((h, i) => (
                                        <option key={i} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedColumn && (
                                <div className="space-y-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                                    <div className="flex border-b border-slate-200 text-xs">
                                        <button
                                            onClick={() => setActiveColCleanerTab('replace')}
                                            className={`flex-1 pb-2 font-medium text-center border-b-2 transition-all ${
                                                activeColCleanerTab === 'replace'
                                                    ? 'border-green-600 text-green-600'
                                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                        >
                                            Find & Replace
                                        </button>
                                        <button
                                            onClick={() => setActiveColCleanerTab('fill')}
                                            className={`flex-1 pb-2 font-medium text-center border-b-2 transition-all ${
                                                activeColCleanerTab === 'fill'
                                                    ? 'border-green-600 text-green-600'
                                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                        >
                                            Fill Empty
                                        </button>
                                        <button
                                            onClick={() => setActiveColCleanerTab('date')}
                                            className={`flex-1 pb-2 font-medium text-center border-b-2 transition-all ${
                                                activeColCleanerTab === 'date'
                                                    ? 'border-green-600 text-green-600'
                                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                        >
                                            Format Dates
                                        </button>
                                    </div>

                                    {activeColCleanerTab === 'replace' && (
                                        <div className="space-y-2 pt-1">
                                            <div className="space-y-1">
                                                <Label htmlFor="find-text" className="text-xs">Find</Label>
                                                <Input
                                                    id="find-text"
                                                    value={findText}
                                                    onChange={e => setFindText(e.target.value)}
                                                    placeholder="Text to find"
                                                    className="h-8 text-xs font-normal"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="replace-text" className="text-xs">Replace With</Label>
                                                <Input
                                                    id="replace-text"
                                                    value={replaceText}
                                                    onChange={e => setReplaceText(e.target.value)}
                                                    placeholder="Replacement text"
                                                    className="h-8 text-xs font-normal"
                                                />
                                            </div>
                                            <Button
                                                onClick={applySearchReplace}
                                                size="sm"
                                                className="w-full text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Replace All
                                            </Button>
                                        </div>
                                    )}

                                    {activeColCleanerTab === 'fill' && (
                                        <div className="space-y-2 pt-1">
                                            <div className="space-y-1">
                                                <Label htmlFor="fill-value" className="text-xs">Fill Blank Cells With</Label>
                                                <Input
                                                    id="fill-value"
                                                    value={fillValue}
                                                    onChange={e => setFillValue(e.target.value)}
                                                    placeholder="N/A"
                                                    className="h-8 text-xs font-normal"
                                                />
                                            </div>
                                            <Button
                                                onClick={applyEmptyFiller}
                                                size="sm"
                                                className="w-full text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Fill Empty Cells
                                            </Button>
                                        </div>
                                    )}

                                    {activeColCleanerTab === 'date' && (
                                        <div className="space-y-2 pt-1">
                                            <div className="space-y-1">
                                                <Label htmlFor="date-format-select" className="text-xs">Date Output Format</Label>
                                                <select
                                                    id="date-format-select"
                                                    value={dateFormat}
                                                    onChange={e => setDateFormat(e.target.value)}
                                                    className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                >
                                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                                </select>
                                            </div>
                                            <Button
                                                onClick={applyDateNormalizer}
                                                size="sm"
                                                className="w-full text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Normalize Dates
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <Button 
                            onClick={() => { setFile(null); setData([]); setHeaders([]); setSelectedColumn(''); }} 
                            variant="outline" 
                            className="w-full text-xs py-1.5 h-auto text-slate-600 hover:text-slate-800"
                        >
                            Upload Different File
                        </Button>
                    </div>
                )
            }
            previewContent={
                data.length === 0 ? (
                    <div className="max-w-xl w-full">
                        <FileUploader
                            onFileSelect={handleFileSelect}
                            selectedFileName={file?.name}
                            accept=".xlsx,.csv"
                            allowedExtensions={['.xlsx', '.csv']}
                            description="Supports .xlsx and .csv files"
                            icon={<FileSpreadsheet className="w-8 h-8 text-green-600" />}
                        />
                    </div>
                ) : (
                    <div className="bg-background rounded-xl shadow-sm border flex flex-col h-full w-full overflow-hidden min-h-[400px]">
                        <div className="p-4 border-b flex justify-between items-center bg-secondary/10">
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Result Preview</span>
                                <div className="text-xs text-muted-foreground flex gap-2 items-center">
                                    <span>Original: {originalCount} rows</span>
                                    <span>•</span>
                                    <span>Current: {data.length} rows</span>
                                </div>
                            </div>
                            <Button onClick={handleExport} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                                <Download className="w-3.5 h-3.5" /> Export Cleaned File
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-secondary/50 border-b">
                                        <th className="p-3 border-r w-12 text-center text-muted-foreground font-semibold">#</th>
                                        {headers.map((header, idx) => (
                                            <th key={idx} className="p-0 border-r min-w-[200px] relative group">
                                                <div className="p-3 pr-8 font-semibold select-none flex justify-between items-center">
                                                    <span>{header}</span>
                                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-secondary rounded px-1 absolute right-1 top-1/2 -translate-y-1/2 shadow-sm">
                                                        <button 
                                                            onClick={() => moveColumn(header, 'left')} 
                                                            disabled={idx === 0} 
                                                            className="p-1 hover:text-primary disabled:opacity-30"
                                                        >
                                                            <MoveLeft className="w-3 h-3" />
                                                        </button>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="p-1 hover:text-primary">
                                                                    <ChevronDown className="w-3 h-3" />
                                                                </button>
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

                                                        <button 
                                                            onClick={() => moveColumn(header, 'right')} 
                                                            disabled={idx === headers.length - 1} 
                                                            className="p-1 hover:text-primary disabled:opacity-30"
                                                        >
                                                            <MoveRight className="w-3 h-3" />
                                                        </button>
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
                )
            }
        />
    );
}
