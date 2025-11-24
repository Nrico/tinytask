import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Grid, CreditCard, Circle, Tag, FileSpreadsheet,
    Printer, Upload, ArrowLeft, Check, Type, ChevronDown,
    MoveLeft, MoveRight, SplitSquareHorizontal, Merge, ArrowRightLeft,
    Wand2, Trash2, Home, Download, FileText, Clipboard, Eraser,
    FileCode, Bold, Italic, Quote, Megaphone, AlertTriangle, LayoutTemplate,
    Info, AlertCircle, CheckCircle, QrCode, ScanLine, Tent, Table, BookOpen
} from 'lucide-react';

// --- Mock Data for Label Creator ---
const CATEGORIES = [
    { id: 'address', name: 'Address Labels', icon: Grid },
    { id: 'shipping', name: 'Shipping Labels', icon: FileSpreadsheet },
    { id: 'round', name: 'Round Labels', icon: Circle },
    { id: 'cards', name: 'Business Cards', icon: CreditCard },
    { id: 'badges', name: 'Name Badges', icon: Tag },
];

const TEMPLATES = [
    { id: '5160', category: 'address', name: 'Address Labels', width: 2.625, height: 1, cols: 3, rows: 10, shape: 'rect' },
    { id: '5163', category: 'shipping', name: 'Shipping Labels', width: 4, height: 2, cols: 2, rows: 5, shape: 'rect' },
    { id: '5167', category: 'address', name: 'Return Address', width: 1.75, height: 0.5, cols: 4, rows: 20, shape: 'rect' },
    { id: '5294', category: 'round', name: 'High Visibility Round', width: 2.5, height: 2.5, cols: 3, rows: 4, shape: 'circle' },
    { id: '5395', category: 'badges', name: 'Adhesive Name Badges', width: 3.38, height: 2.33, cols: 2, rows: 4, shape: 'rect' },
    { id: '5371', category: 'cards', name: 'Clean Edge Business Cards', width: 3.5, height: 2, cols: 2, rows: 5, shape: 'rect' },
];

const LABEL_CSV_DATA = [
    { "First Name": "John", "Last Name": "Doe", "Address": "123 Maple St", "City": "Springfield", "State": "IL" },
    { "First Name": "Jane", "Last Name": "Smith", "Address": "456 Oak Ave", "City": "Metropolis", "State": "NY" },
];

// --- Mock Data for Excel Helper ---
const MESSY_DATA = [
    { id: 1, "Full Name": "Doe, John", "Email": "john@example.com", "Phone": "555-0101", "Dept": "Sales" },
    { id: 2, "Full Name": "Smith, Jane", "Email": "jane@test.co", "Phone": "(555) 0102", "Dept": "Marketing" },
    { id: 3, "Full Name": "Johnson, Bob", "Email": "bob.j@site.org", "Phone": "555.0103", "Dept": "IT" },
    { id: 4, "Full Name": "Williams, Alice", "Email": "alice@w.net", "Phone": "555-0104", "Dept": "Sales" },
    { id: 5, "Full Name": "Brown, Charlie", "Email": "cbrown@peanuts.com", "Phone": "5550105", "Dept": "HR" },
];

// --- Mock Data for Word Scrubber ---
const MESSY_WORD_CONTENT = `
Heading 1
• Bullet point one with “smart quotes”
• Bullet point two with text that is bold and italic
Note: This text has hidden line breaks and weird spacing.     
For more info, click here.
`;

// --- COMPONENT: LABEL CREATOR (Tool 1) ---
const LabelCreator = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [mode, setMode] = useState('single');
    const [designData, setDesignData] = useState({
        line1: 'Your Company Name',
        line2: '123 Business Rd.',
        line3: 'City, State 12345',
        bgColor: '#ffffff',
        textColor: '#000000',
        fontSize: 14,
        textAlign: 'center'
    });
    const [mergeData, setMergeData] = useState([]);
    const [mapping, setMapping] = useState({ line1: '', line2: '', line3: '' });
    const [csvLoaded, setCsvLoaded] = useState(false);

    const handleTemplateSelect = (template) => { setSelectedTemplate(template); setStep(2); };
    const handleCsvUpload = () => { setTimeout(() => { setMergeData(LABEL_CSV_DATA); setCsvLoaded(true); setMapping({ line1: 'First Name', line2: 'Address', line3: 'City' }); }, 800); };

    const filteredTemplates = TEMPLATES.filter(t => {
        const matchesSearch = t.id.includes(searchQuery) || t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (step === 1) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Label Studio</h2>
                        <p className="text-slate-500">Choose a template to start designing</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input type="text" placeholder="Search ID (e.g., 5160)..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All</button>
                        {CATEGORIES.map(cat => (
                            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                <cat.icon className="w-3 h-3" /> {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map(template => (
                        <button key={template.id} onClick={() => handleTemplateSelect(template)} className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col gap-4">
                            <div className="flex justify-between items-start w-full">
                                <div><div className="font-bold text-lg text-slate-800">Avery {template.id}</div><div className="text-sm text-slate-500">{template.name}</div></div>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">{template.width}" x {template.height}"</span>
                            </div>
                            <div className="w-full h-32 bg-slate-50 rounded border border-slate-100 flex flex-wrap content-start p-2 gap-1 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                                {Array.from({ length: Math.min(template.cols * template.rows, 12) }).map((_, i) => (
                                    <div key={i} className={`bg-white border border-slate-300 shadow-sm ${template.shape === 'circle' ? 'rounded-full' : 'rounded-sm'}`} style={{ width: `calc(${100 / template.cols}% - 4px)`, height: `${100 / template.rows}%`, minHeight: '20px' }} />
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto rounded-xl shadow-sm">
                <div className="p-4 border-b border-slate-100">
                    <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4"><ArrowLeft className="w-4 h-4" /> Change Template</button>
                    <h3 className="font-bold text-lg text-slate-800">{selectedTemplate.name} ({selectedTemplate.id})</h3>
                </div>
                <div className="p-4 flex gap-2 bg-slate-50">
                    <button onClick={() => setMode('single')} className={`flex-1 py-2 text-sm font-medium rounded-lg border ${mode === 'single' ? 'bg-white border-slate-300 shadow-sm text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Single Design</button>
                    <button onClick={() => setMode('merge')} className={`flex-1 py-2 text-sm font-medium rounded-lg border ${mode === 'merge' ? 'bg-white border-slate-300 shadow-sm text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Mail Merge</button>
                </div>
                <div className="p-4 flex-1 space-y-6">
                    {mode === 'single' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Text Content</label>
                                <input type="text" value={designData.line1} onChange={(e) => setDesignData({ ...designData, line1: e.target.value })} className="w-full mb-2 p-2 text-sm border border-slate-200 rounded" placeholder="Line 1" />
                                <input type="text" value={designData.line2} onChange={(e) => setDesignData({ ...designData, line2: e.target.value })} className="w-full mb-2 p-2 text-sm border border-slate-200 rounded" placeholder="Line 2" />
                                <input type="text" value={designData.line3} onChange={(e) => setDesignData({ ...designData, line3: e.target.value })} className="w-full p-2 text-sm border border-slate-200 rounded" placeholder="Line 3" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Styling</label>
                                <div className="flex gap-2 mb-2">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-400">Align</label>
                                        <div className="flex border border-slate-200 rounded overflow-hidden mt-1">
                                            {['left', 'center', 'right'].map(align => (
                                                <button key={align} onClick={() => setDesignData({ ...designData, textAlign: align })} className={`flex-1 py-1 flex justify-center ${designData.textAlign === align ? 'bg-slate-100 text-blue-600' : 'text-slate-400'}`}><Type className="w-4 h-4" /></button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1"><label className="text-xs text-slate-400">Size</label><input type="number" value={designData.fontSize} onChange={(e) => setDesignData({ ...designData, fontSize: parseInt(e.target.value) })} className="w-full mt-1 p-1 text-sm border border-slate-200 rounded" /></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {!csvLoaded ? (
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                                    <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <h4 className="text-sm font-medium text-slate-700">Upload CSV File</h4>
                                    <button onClick={handleCsvUpload} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto mt-4"><Upload className="w-4 h-4" /> Simulate Upload</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700 text-sm"><Check className="w-4 h-4" /><span>File Loaded: <strong>contacts.csv</strong></span></div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Map Columns</label>
                                        {['line1', 'line2', 'line3'].map((line, i) => (
                                            <div key={line} className="mb-2">
                                                <label className="text-xs font-medium text-slate-600">Line {i + 1}</label>
                                                <select value={mapping[line]} onChange={(e) => setMapping({ ...mapping, [line]: e.target.value })} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded bg-white">
                                                    <option value="">(Empty)</option>
                                                    {Object.keys(LABEL_CSV_DATA[0]).map(header => <option key={header} value={header}>{header}</option>)}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-slate-200"><button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex justify-center items-center gap-2 shadow-lg shadow-blue-200"><Printer className="w-5 h-5" /> Print PDF</button></div>
            </div>
            <div className="flex-1 bg-slate-100 rounded-xl overflow-y-auto p-4 lg:p-8 flex justify-center items-start">
                <div className="bg-white shadow-xl min-h-[1056px] w-[816px] relative p-[0.5in] transform origin-top scale-50 sm:scale-75 lg:scale-100 transition-transform">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${selectedTemplate.cols}, 1fr)`, gridTemplateRows: `repeat(${selectedTemplate.rows}, 1fr)`, height: '100%' }}>
                        {Array.from({ length: (mode === 'merge' && csvLoaded ? Math.max(selectedTemplate.rows * selectedTemplate.cols, mergeData.length) : selectedTemplate.rows * selectedTemplate.cols) }).map((_, index) => {
                            let contentLine1, contentLine2, contentLine3;
                            if (mode === 'single') {
                                contentLine1 = designData.line1; contentLine2 = designData.line2; contentLine3 = designData.line3;
                            } else {
                                if (csvLoaded && mergeData[index]) {
                                    const row = mergeData[index];
                                    contentLine1 = mapping.line1 ? row[mapping.line1] : '';
                                    contentLine2 = mapping.line2 ? row[mapping.line2] : '';
                                    contentLine3 = mapping.line3 ? row[mapping.line3] : '';
                                    if (mapping.line3 === 'City') contentLine3 = `${row['City']}, ${row['State']}`;
                                } else { contentLine1 = csvLoaded ? '' : '<<Line 1>>'; contentLine2 = csvLoaded ? '' : '<<Line 2>>'; contentLine3 = csvLoaded ? '' : '<<Line 3>>'; }
                            }
                            return (
                                <div key={index} className={`border border-dashed border-slate-200 hover:border-blue-300 flex flex-col justify-center overflow-hidden p-2 relative transition-all ${selectedTemplate.shape === 'circle' ? 'rounded-full aspect-square' : 'rounded-md'}`} style={{ backgroundColor: designData.bgColor, color: designData.textColor, textAlign: designData.textAlign }}>
                                    <div style={{ fontSize: `${designData.fontSize}px`, fontWeight: 'bold' }}>{contentLine1}</div><div style={{ fontSize: `${Math.max(10, designData.fontSize - 2)}px` }}>{contentLine2}</div><div style={{ fontSize: `${Math.max(10, designData.fontSize - 2)}px` }}>{contentLine3}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENT: EXCEL HELPER (Tool 2) ---
const ExcelHelper = ({ onBack }) => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCol, setSelectedCol] = useState(null);

    // Load mock data
    const handleSimulateUpload = () => {
        setLoading(true);
        setTimeout(() => {
            setData(MESSY_DATA);
            setHeaders(Object.keys(MESSY_DATA[0]).filter(k => k !== 'id'));
            setLoading(false);
        }, 1000);
    };

    // --- Transformers ---

    const moveColumn = (colName, direction) => {
        const currentIndex = headers.indexOf(colName);
        if (currentIndex === -1) return;
        const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= headers.length) return;

        const newHeaders = [...headers];
        [newHeaders[currentIndex], newHeaders[newIndex]] = [newHeaders[newIndex], newHeaders[currentIndex]];
        setHeaders(newHeaders);
    };

    const switchNameFormat = (colName) => {
        // Toggles "Last, First" <-> "First Last"
        const newData = data.map(row => {
            const val = row[colName];
            if (!val || typeof val !== 'string') return row;

            if (val.includes(',')) {
                // Assume "Last, First" -> "First Last"
                const parts = val.split(',').map(s => s.trim());
                if (parts.length === 2) {
                    return { ...row, [colName]: `${parts[1]} ${parts[0]}` };
                }
            } else {
                // Assume "First Last" -> "Last, First"
                const parts = val.split(' ');
                if (parts.length >= 2) {
                    const last = parts.pop();
                    const first = parts.join(' ');
                    return { ...row, [colName]: `${last}, ${first}` };
                }
            }
            return row;
        });
        setData(newData);
        setSelectedCol(null);
    };

    const splitColumn = (colName) => {
        // Splits "Last, First" or "First Last" into two new columns
        const newHeaders = [...headers];
        const colIndex = headers.indexOf(colName);

        // Create new column names
        const col1Name = `${colName} (1)`;
        const col2Name = `${colName} (2)`;

        // Insert new headers after the current one
        newHeaders.splice(colIndex + 1, 0, col1Name, col2Name);

        const newData = data.map(row => {
            const val = row[colName] || "";
            let part1 = "", part2 = "";

            if (val.includes(',')) {
                [part1, part2] = val.split(',').map(s => s.trim());
            } else {
                const parts = val.split(' ');
                part1 = parts[0];
                part2 = parts.slice(1).join(' ');
            }

            return {
                ...row,
                [col1Name]: part1 || "",
                [col2Name]: part2 || ""
            };
        });

        setHeaders(newHeaders);
        setData(newData);
        setSelectedCol(null);
    };

    const mergeWithRight = (colName) => {
        const colIndex = headers.indexOf(colName);
        if (colIndex === headers.length - 1) return; // Can't merge if last

        const rightColName = headers[colIndex + 1];
        const newColName = `${colName} + ${rightColName}`;

        // Update headers: remove both, insert merged
        const newHeaders = [...headers];
        newHeaders.splice(colIndex, 2, newColName);

        const newData = data.map(row => {
            const val1 = row[colName] || "";
            const val2 = row[rightColName] || "";
            // Simple space join
            const merged = `${val1} ${val2}`.trim();

            // Clean up old keys if desired, but for grid rendering we just add new key
            return { ...row, [newColName]: merged };
        });

        setHeaders(newHeaders);
        setData(newData);
        setSelectedCol(null);
    };

    if (data.length === 0 && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-4 absolute top-4 left-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">Data Scrubber</h2>
                </div>

                <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-300 text-center max-w-lg shadow-sm">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileSpreadsheet className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload Messy Excel File</h3>
                    <p className="text-slate-500 mb-8">Upload your .xlsx or .csv file to clean formatting, split names, and reorder columns.</p>
                    <button
                        onClick={handleSimulateUpload}
                        className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2 mx-auto"
                    >
                        <Upload className="w-5 h-5" /> Simulate Upload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in">
            {/* Toolbar */}
            <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-green-600" />
                            customer_list_messy.csv
                        </h2>
                        <p className="text-xs text-slate-400">{data.length} rows loaded</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Clean File
                    </button>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-auto bg-slate-50 p-8">
                {loading ? (
                    <div className="flex justify-center items-center h-full text-slate-400">Loading data...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden inline-block min-w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-3 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
                                    {headers.map((header, idx) => (
                                        <th key={idx} className="p-0 border-r border-slate-200 min-w-[200px] relative group">
                                            <div className="p-3 pr-8 font-semibold text-sm text-slate-700 select-none flex justify-between items-center">
                                                <span>{header}</span>
                                                {/* Column Controls */}
                                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 rounded px-1 absolute right-1 top-1/2 -translate-y-1/2 shadow-sm">
                                                    <button
                                                        onClick={() => moveColumn(header, 'left')}
                                                        disabled={idx === 0}
                                                        className="p-1 hover:text-blue-600 disabled:opacity-30"
                                                        title="Move Left"
                                                    >
                                                        <MoveLeft className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedCol(selectedCol === header ? null : header)}
                                                        className={`p-1 hover:text-blue-600 ${selectedCol === header ? 'text-blue-600' : ''}`}
                                                        title="Tools"
                                                    >
                                                        <ChevronDown className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => moveColumn(header, 'right')}
                                                        disabled={idx === headers.length - 1}
                                                        className="p-1 hover:text-blue-600 disabled:opacity-30"
                                                        title="Move Right"
                                                    >
                                                        <MoveRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {selectedCol === header && (
                                                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 m-1 overflow-hidden animate-in zoom-in-95 duration-100">
                                                    <div className="p-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                                                        Quick Fixes
                                                    </div>
                                                    <button onClick={() => switchNameFormat(header)} className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm flex items-center gap-2 text-slate-700">
                                                        <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                                                        <div>
                                                            <div className="font-medium">Flip Name Format</div>
                                                            <div className="text-xs text-slate-400">"Last, First" ↔ "First Last"</div>
                                                        </div>
                                                    </button>
                                                    <button onClick={() => splitColumn(header)} className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm flex items-center gap-2 text-slate-700 border-t border-slate-100">
                                                        <SplitSquareHorizontal className="w-4 h-4 text-blue-500" />
                                                        <div>
                                                            <div className="font-medium">Split Column</div>
                                                            <div className="text-xs text-slate-400">By comma or space</div>
                                                        </div>
                                                    </button>
                                                    <button onClick={() => mergeWithRight(header)} className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm flex items-center gap-2 text-slate-700 border-t border-slate-100">
                                                        <Merge className="w-4 h-4 text-blue-500" />
                                                        <div>
                                                            <div className="font-medium">Merge with Right</div>
                                                            <div className="text-xs text-slate-400">Combine this + next column</div>
                                                        </div>
                                                    </button>
                                                    <button className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm flex items-center gap-2 text-red-600 border-t border-slate-100">
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Column
                                                    </button>
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, rIdx) => (
                                    <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50 group">
                                        <td className="p-3 text-center text-xs text-slate-400 bg-slate-50 border-r border-slate-200">{rIdx + 1}</td>
                                        {headers.map((header, cIdx) => (
                                            <td key={cIdx} className="p-3 text-sm text-slate-700 border-r border-slate-100 whitespace-nowrap">
                                                {row[header]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENT: WORD SCRUBBER (Tool 3) ---
const WordScrubber = ({ onBack }) => {
    const [inputText, setInputText] = useState('');
    const [formatMode, setFormatMode] = useState('plain'); // plain, markdown, rich
    const [copied, setCopied] = useState(false);

    const handleFileUpload = () => {
        // Simulating file upload
        setInputText(MESSY_WORD_CONTENT.trim());
    };

    // Mock processing logic - in a real app this would use regex/libraries
    const getProcessedText = () => {
        if (!inputText) return '';

        let text = inputText;

        if (formatMode === 'plain') {
            // Remove bullets, strip smart quotes roughly
            text = text.replace(/[•]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
            // Remove HTML tags if any (simulated)
            text = text.replace(/<[^>]*>/g, '');
        } else if (formatMode === 'markdown') {
            // Convert bullets to * text = text.replace(/[•]/g, '* ');
            // Fake conversion for bold headings
            text = text.replace(/^Heading 1/gm, '# Heading 1');
        }
        // 'rich' just keeps it as is for this prototype, maybe stripping classes
        return text;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getProcessedText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = (ext) => {
        const element = document.createElement("a");
        const file = new Blob([getProcessedText()], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `cleaned_document.${ext}`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-60px)] animate-in fade-in">
            {/* Header Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            Format Stripper
                        </h2>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
                        <button onClick={() => setFormatMode('plain')} className={`px-3 py-1.5 rounded-md transition-all ${formatMode === 'plain' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Plain Text</button>
                        <button onClick={() => setFormatMode('markdown')} className={`px-3 py-1.5 rounded-md transition-all ${formatMode === 'markdown' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Markdown</button>
                        <button onClick={() => setFormatMode('rich')} className={`px-3 py-1.5 rounded-md transition-all ${formatMode === 'rich' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Clean Rich</button>
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-indigo-200 shadow-md transition-all">
                        {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Clean Text'}
                    </button>
                    <div className="relative group">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Download className="w-5 h-5" /></button>
                        <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 hidden group-hover:block w-32">
                            <button onClick={() => handleDownload('txt')} className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded">As .txt</button>
                            <button onClick={() => handleDownload('rtf')} className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded">As .rtf</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area - Split View */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">

                {/* Input Side */}
                <div className="flex-1 p-6 flex flex-col border-r border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Source</label>
                        <button onClick={handleFileUpload} className="text-xs flex items-center gap-1 text-indigo-600 font-medium hover:underline">
                            <Upload className="w-3 h-3" /> Upload Document
                        </button>
                    </div>
                    <textarea
                        className="flex-1 w-full p-4 rounded-xl border border-slate-200 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm font-mono text-sm"
                        placeholder="Paste your messy Word content here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
                </div>

                {/* Output Side */}
                <div className="flex-1 p-6 flex flex-col bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            Preview: <span className="text-indigo-600">{formatMode}</span>
                        </label>
                    </div>
                    <div className="flex-1 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 overflow-auto font-mono text-sm whitespace-pre-wrap text-slate-700">
                        {getProcessedText() || <span className="text-slate-400 italic">Cleaned output will appear here...</span>}
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- COMPONENT: SIGN SWIFT (Tool 4) ---
const SignSwift = ({ onBack }) => {
    const [headline, setHeadline] = useState('NOTICE');
    const [subtext, setSubtext] = useState('Please keep this door closed at all times.');
    const [orientation, setOrientation] = useState('portrait'); // portrait, landscape
    const [theme, setTheme] = useState('notice'); // notice, danger, warning, success, plain
    const [headlineSize, setHeadlineSize] = useState(80);
    const [subtextSize, setSubtextSize] = useState(32);

    const THEMES = {
        notice: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-800', icon: Info, label: 'Notice' },
        danger: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-800', icon: AlertCircle, label: 'Danger' },
        warning: { bg: 'bg-amber-500', text: 'text-black', border: 'border-amber-600', icon: AlertTriangle, label: 'Warning' },
        success: { bg: 'bg-green-600', text: 'text-white', border: 'border-green-800', icon: CheckCircle, label: 'Success' },
        plain: { bg: 'bg-white', text: 'text-black', border: 'border-black', icon: null, label: 'Plain' },
    };

    const currentTheme = THEMES[theme];
    const Icon = currentTheme.icon;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] animate-in fade-in">
            {/* Left Sidebar - Controls */}
            <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shadow-sm z-10">
                <div className="p-4 border-b border-slate-100">
                    <button onClick={onBack} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
                    <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-orange-500" /> Sign Swift
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Text Input */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sign Content</label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            className="w-full p-3 text-lg font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="HEADLINE"
                        />
                        <textarea
                            value={subtext}
                            onChange={(e) => setSubtext(e.target.value)}
                            className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none"
                            placeholder="Additional details..."
                        />
                    </div>

                    {/* Themes */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Style Theme</label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(THEMES).map(([key, t]) => (
                                <button
                                    key={key}
                                    onClick={() => setTheme(key)}
                                    className={`p-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2
                        ${theme === key ? 'ring-2 ring-offset-1 ring-slate-400' : 'hover:bg-slate-50'}
                        ${key === 'plain' ? 'bg-white text-slate-800 border-slate-300' : `${t.bg} text-white border-transparent`}
                        ${key === 'warning' ? '!text-black' : ''}
                      `}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sizing */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Typography</label>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Headline Size</span><span>{headlineSize}px</span></div>
                            <input type="range" min="20" max="200" value={headlineSize} onChange={(e) => setHeadlineSize(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Subtext Size</span><span>{subtextSize}px</span></div>
                            <input type="range" min="12" max="100" value={subtextSize} onChange={(e) => setSubtextSize(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                    </div>

                    {/* Orientation */}
                    <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
                        <button onClick={() => setOrientation('portrait')} className={`flex-1 py-2 rounded-md transition-all ${orientation === 'portrait' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>Portrait</button>
                        <button onClick={() => setOrientation('landscape')} className={`flex-1 py-2 rounded-md transition-all ${orientation === 'landscape' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>Landscape</button>
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-slate-200">
                    <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">
                        <Printer className="w-5 h-5" /> Print Sign
                    </button>
                </div>
            </div>

            {/* Right Preview Area */}
            <div className="flex-1 bg-slate-100 overflow-auto p-8 flex justify-center items-center relative">
                {/* Paper Canvas */}
                <div
                    className={`bg-white shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative
               ${orientation === 'portrait' ? 'w-[500px] h-[647px]' : 'w-[647px] h-[500px]'}
            `}
                >
                    {/* Header Banner (if not plain) */}
                    {theme !== 'plain' && (
                        <div className={`${currentTheme.bg} h-[25%] flex items-center justify-center relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black opacity-10"></div>
                            <div className={`z-10 flex items-center gap-4 ${currentTheme.text}`}>
                                {Icon && <Icon className="w-16 h-16" />}
                                <span className="text-6xl font-black tracking-tighter uppercase">{THEMES[theme].label}</span>
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${theme === 'plain' ? 'border-[20px] border-black m-4' : ''}`}>
                        <h1
                            className="font-black leading-tight mb-4 break-words w-full"
                            style={{ fontSize: `${headlineSize}px`, color: theme === 'plain' ? 'black' : '#1f2937' }}
                        >
                            {headline}
                        </h1>
                        <p
                            className="font-medium leading-snug opacity-80 break-words w-full"
                            style={{ fontSize: `${subtextSize}px`, color: theme === 'plain' ? 'black' : '#4b5563' }}
                        >
                            {subtext}
                        </p>
                    </div>
                </div>

                {/* Zoom hint */}
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-slate-500">
                    Preview scaled to fit
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: CODE BAKER (Tool 5) ---
const CodeBaker = ({ onBack }) => {
    const [content, setContent] = useState('https://example.com');
    const [codeType, setCodeType] = useState('qr'); // qr, barcode
    const [color, setColor] = useState('#000000');
    const [loading, setLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState('');

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            if (codeType === 'qr') {
                // QR Server API
                // Format color: remove #, typically 000000
                const hex = color.replace('#', '');
                setImgUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(content)}&color=${hex}`);
            } else {
                // BWIP-JS API for Barcode 128
                setImgUrl(`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(content)}&scale=3&includetext&backgroundcolor=ffffff`);
            }
            setLoading(false);
        }, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [content, codeType, color]);

    const handleDownload = async () => {
        try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${codeType}_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert('Could not download image. Try right-clicking and saving.');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] animate-in fade-in">
            {/* Sidebar */}
            <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm z-10">
                <div className="mb-6">
                    <button onClick={onBack} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
                    <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-purple-600" /> Code Baker
                    </h2>
                </div>

                <div className="space-y-6">
                    {/* Type Selector */}
                    <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
                        <button onClick={() => setCodeType('qr')} className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all ${codeType === 'qr' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}>
                            <QrCode className="w-4 h-4" /> QR Code
                        </button>
                        <button onClick={() => setCodeType('barcode')} className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all ${codeType === 'barcode' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}>
                            <ScanLine className="w-4 h-4" /> Barcode
                        </button>
                    </div>

                    {/* Content Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</label>
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                            placeholder={codeType === 'qr' ? 'https://...' : '123456789'}
                        />
                        <p className="text-xs text-slate-400">
                            {codeType === 'qr' ? 'Enter URL, Text, or Wi-Fi string.' : 'Enter alphanumeric text for Code-128.'}
                        </p>
                    </div>

                    {/* Styling (QR Only) */}
                    {codeType === 'qr' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                />
                                <span className="text-xs font-mono text-slate-500">{color}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <button onClick={handleDownload} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" /> Download PNG
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-slate-100 flex justify-center items-center p-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 max-w-md w-full">
                    <div className="w-full aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        )}
                        <img
                            src={imgUrl}
                            alt="Generated Code"
                            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}
                        />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="font-bold text-slate-800 text-lg">Preview</h3>
                        <p className="text-sm text-slate-500 break-all px-4">{content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: NAME TENT MAKER (Tool 6) ---
const NameTentMaker = ({ onBack }) => {
    const [namesInput, setNamesInput] = useState("John Doe\nJane Smith");
    const [fontSize, setFontSize] = useState(100);

    // Parse names into array
    const names = namesInput.split('\n').filter(n => n.trim() !== '');

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] animate-in fade-in">
            {/* Style for print hiding */}
            <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
          .page-break { page-break-after: always; break-after: page; height: 100vh; }
        }
      `}</style>

            {/* Sidebar */}
            <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 h-full">
                <div className="p-6 border-b border-slate-100">
                    <button onClick={onBack} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
                    <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                        <Tent className="w-5 h-5 text-rose-500" /> Name Tent Maker
                    </h2>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Names List</label>
                        <textarea
                            value={namesInput}
                            onChange={(e) => setNamesInput(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none h-48 font-sans text-sm"
                            placeholder="Enter names, one per line..."
                        />
                        <p className="text-xs text-slate-400">Each line generates a separate page.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Font Size</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="40"
                                max="200"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <span className="text-xs font-mono text-slate-500 w-8">{fontSize}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 mt-auto">
                    <button onClick={handlePrint} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">
                        <Printer className="w-5 h-5" /> Print All Pages
                    </button>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex flex-col items-center gap-8 relative">

                <div id="printable-area" className="flex flex-col gap-8 print:gap-0 w-full items-center">
                    {names.length === 0 && (
                        <div className="text-slate-400 italic mt-12">Enter names to see previews...</div>
                    )}

                    {names.map((name, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg print:shadow-none w-[297mm] h-[210mm] print:w-screen print:h-screen flex-shrink-0 flex flex-col overflow-hidden relative page-break origin-top scale-50 sm:scale-75 lg:scale-100 transition-transform"
                            style={{ maxWidth: '100%', aspectRatio: '1.414' }} // A4 Landscape approx
                        >
                            {/* Top Half (Inverted) */}
                            <div className="flex-1 flex items-center justify-center border-b border-dashed border-slate-300 print:border-slate-100 p-8 transform rotate-180">
                                <h1 className="font-bold text-slate-900 text-center leading-tight" style={{ fontSize: `${fontSize}px` }}>
                                    {name}
                                </h1>
                            </div>

                            {/* Bottom Half (Normal) */}
                            <div className="flex-1 flex items-center justify-center p-8">
                                <h1 className="font-bold text-slate-900 text-center leading-tight" style={{ fontSize: `${fontSize}px` }}>
                                    {name}
                                </h1>
                            </div>

                            {/* Fold Guides (Visual only, faint in print) */}
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono -rotate-90 print:hidden">FOLD HERE</div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono rotate-90 print:hidden">FOLD HERE</div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

// --- COMPONENT: TABLE TUNER (Tool 7) ---
const TableTuner = ({ onBack }) => {
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
                const obj = {};
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
            const drawRow = (row) => `| ${row.map((c, i) => (c || '').padEnd(colWidths[i])).join(' | ')} |`;

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
        <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] animate-in fade-in">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                <div className="p-6 border-b border-slate-100">
                    <button onClick={onBack} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
                    <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                        <Table className="w-5 h-5 text-teal-600" /> Table Tuner
                    </h2>
                </div>

                <div className="p-6 space-y-6 flex-1">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Data</label>
                        <textarea
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-48 font-mono text-xs resize-none"
                            placeholder="Paste from Excel (tab separated) or CSV..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <p className="text-xs text-slate-400">Supports tab-separated (Excel) and CSV.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Output Format</label>
                        <div className="flex flex-col gap-2">
                            {['markdown', 'html', 'json', 'csv', 'ascii'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors ${format === f ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-white hover:bg-slate-50 border border-transparent'}`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Output Area */}
            <div className="flex-1 bg-slate-100 p-8 flex flex-col">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Result Preview</span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                            {copied ? 'COPIED' : 'COPY CODE'}
                        </button>
                    </div>
                    <pre className="flex-1 p-6 font-mono text-sm overflow-auto text-slate-800 whitespace-pre">
                        {output}
                    </pre>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: BROCHURE BUILDER (Tool 8) ---
const BrochureBuilder = ({ onBack }) => {
    // Panels: 0=Front, 1=InLeft, 2=InCenter, 3=InRight, 4=Back, 5=Flap
    const [panels, setPanels] = useState([
        { id: 0, title: "Front Cover", content: "Welcome to Our Services\n\nProfessional Solutions for Your Needs", align: "center", bg: "#ffffff" },
        { id: 1, title: "Inside Left", content: "Our Mission\n\nTo provide high quality services efficiently.", align: "left", bg: "#ffffff" },
        { id: 2, title: "Inside Center", content: "Core Values\n\n- Integrity\n- Innovation\n- Excellence", align: "left", bg: "#ffffff" },
        { id: 3, title: "Inside Right", content: "Contact Us\n\n123 Business Rd.\nCity, State 12345\n\n(555) 123-4567", align: "left", bg: "#ffffff" },
        { id: 4, title: "Back Cover", content: "Visit our website at:\nwww.example.com", align: "center", bg: "#f8fafc" },
        { id: 5, title: "Inside Flap", content: "Why Choose Us?\n\nWe have over 20 years of experience.", align: "left", bg: "#f1f5f9" },
    ]);
    const [activePanelId, setActivePanelId] = useState(0);

    const handlePanelUpdate = (key, value) => {
        setPanels(panels.map(p => p.id === activePanelId ? { ...p, [key]: value } : p));
    };

    const activePanel = panels.find(p => p.id === activePanelId);

    const handlePrint = () => {
        window.print();
    };

    // Helper to render a single panel view
    const renderPanel = (panelId) => {
        const p = panels.find(pan => pan.id === panelId);
        return (
            <div
                className="h-full w-full p-8 flex flex-col overflow-hidden relative border-r border-dashed border-slate-300 last:border-r-0"
                style={{ backgroundColor: p.bg, textAlign: p.align }}
                onClick={() => setActivePanelId(panelId)}
            >
                <div className={`absolute inset-0 pointer-events-none border-4 transition-colors ${activePanelId === panelId ? 'border-blue-500/50' : 'border-transparent'}`}></div>
                <h3 className="font-bold text-xl mb-4 text-slate-800">{p.title}</h3>
                <div className="whitespace-pre-wrap text-sm text-slate-600">{p.content}</div>
                <div className="mt-auto pt-4 text-xs text-slate-300 font-mono text-center uppercase tracking-widest select-none">
                    {panelId === 0 ? "Front Cover" : panelId === 5 ? "Inside Flap" : panelId === 4 ? "Back Cover" : "Inside Panel"}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] animate-in fade-in">
            <style>{`
        @media print {
          body * { visibility: hidden; }
          #brochure-print-area, #brochure-print-area * { visibility: visible; }
          #brochure-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print-sheet { width: 100vw; height: 100vh; page-break-after: always; display: flex; flex-direction: row; }
          .print-panel { flex: 1; height: 100%; border: none !important; padding: 1in; }
        }
      `}</style>

            {/* Sidebar */}
            <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 h-full">
                <div className="p-6 border-b border-slate-100">
                    <button onClick={onBack} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
                    <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-sky-600" /> Brochure Builder
                    </h2>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Panel Selector */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {panels.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setActivePanelId(p.id)}
                                className={`h-16 rounded-lg border text-xs flex items-center justify-center text-center p-1 transition-all
                     ${activePanelId === p.id ? 'border-sky-500 ring-1 ring-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}
                   `}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Panel Title</label>
                            <input
                                type="text"
                                value={activePanel.title}
                                onChange={(e) => handlePanelUpdate('title', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</label>
                            <textarea
                                value={activePanel.content}
                                onChange={(e) => handlePanelUpdate('content', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-sky-500 outline-none h-40 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Alignment</label>
                                <select
                                    value={activePanel.align}
                                    onChange={(e) => handlePanelUpdate('align', e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded bg-white text-sm"
                                >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Background</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={activePanel.bg}
                                        onChange={(e) => handlePanelUpdate('bg', e.target.value)}
                                        className="h-9 w-full rounded cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 mt-auto">
                    <button onClick={handlePrint} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">
                        <Printer className="w-5 h-5" /> Print Brochure
                    </button>
                    <p className="text-xs text-center mt-2 text-slate-400">Prints 2 pages (Duplex required)</p>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex flex-col items-center gap-8">
                <div id="brochure-print-area" className="flex flex-col gap-8 w-full items-center">

                    {/* Outside Sheet */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider print:hidden">Outside Sheet (Front/Back/Flap)</span>
                        <div className="print-sheet bg-white shadow-lg w-[297mm] h-[210mm] flex flex-row overflow-hidden print:shadow-none origin-top scale-50 sm:scale-75 lg:scale-100 transition-transform" style={{ aspectRatio: '1.414' }}>
                            {/* Left 1/3: Inside Flap (Panel 5) - Folds IN */}
                            <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(5)}</div>
                            {/* Center 1/3: Back Cover (Panel 4) */}
                            <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(4)}</div>
                            {/* Right 1/3: Front Cover (Panel 0) */}
                            <div className="flex-1 h-full print-panel">{renderPanel(0)}</div>
                        </div>
                    </div>

                    {/* Inside Sheet */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider print:hidden">Inside Sheet</span>
                        <div className="print-sheet bg-white shadow-lg w-[297mm] h-[210mm] flex flex-row overflow-hidden print:shadow-none origin-top scale-50 sm:scale-75 lg:scale-100 transition-transform" style={{ aspectRatio: '1.414' }}>
                            {/* Left 1/3: Inside Left (Panel 1) */}
                            <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(1)}</div>
                            {/* Center 1/3: Inside Center (Panel 2) */}
                            <div className="flex-1 h-full border-r border-slate-200 print-panel">{renderPanel(2)}</div>
                            {/* Right 1/3: Inside Right (Panel 3) */}
                            <div className="flex-1 h-full print-panel">{renderPanel(3)}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: MAIN APP ---
export default function App() {
    const [view, setView] = useState('home'); // home, labels, excel, word, sign, code, tent, table, brochure

    if (view === 'home') {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Grid className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">TaskTiny<span className="text-blue-600">.</span></span>
                        </div>
                        <div className="text-sm font-medium text-slate-500">Micro-Tools for Office Work</div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">What do you need to fix today?</h1>
                        <p className="text-lg text-slate-500">Select a tool to get started.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <button
                            onClick={() => setView('labels')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all group text-left flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Tag className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Label Studio</h2>
                            <p className="text-slate-500 mb-6 text-sm flex-1">Create & print Avery® labels. Mail merge capable.</p>
                            <span className="text-blue-600 font-medium flex items-center gap-2 text-sm">Open Tool <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                        </button>

                        <button
                            onClick={() => setView('excel')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-green-500 hover:shadow-xl transition-all group text-left flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Data Scrubber</h2>
                            <p className="text-slate-500 mb-6 text-sm flex-1">Fix messy Excel files. Reorder & split columns.</p>
                            <span className="text-green-600 font-medium flex items-center gap-2 text-sm">Open Tool <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                        </button>

                        <button
                            onClick={() => setView('word')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all group text-left flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Format Stripper</h2>
                            <p className="text-slate-500 mb-6 text-sm flex-1">Clean Word docs to plain text or markdown.</p>
                            <span className="text-indigo-600 font-medium flex items-center gap-2 text-sm">Open Tool <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                        </button>

                        <button
                            onClick={() => setView('sign')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all group text-left flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Megaphone className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Sign Swift</h2>
                            <p className="text-slate-500 mb-6 text-sm flex-1">Instant signage. "Out of Order," "Warning," etc.</p>
                            <span className="text-orange-600 font-medium flex items-center gap-2 text-sm">Open Tool <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                        </button>

                        <button
                            onClick={() => setView('code')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all group text-left flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <QrCode className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Code Baker</h2>
                            <p className="text-slate-500 mb-6 text-sm flex-1">Generate QR codes and barcodes instantly.</p>
                            <span className="text-purple-600 font-medium flex items-center gap-2 text-sm">Open Tool <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                        </button>

                        <button
                            onClick={() => setView('tent')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-rose-500 hover:shadow-xl transition-all group text-left flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Tent className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Name Tent Maker</h2>
                            <p className="text-slate-500 mb-6 text-sm flex-1">Foldable name signs for meetings. Batch print ready.</p>
                            <span className="text-rose-600 font-medium flex items-center gap-2 text-sm">Open Tool <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                        </button>

                        <button
                            onClick={() => setView('table')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all group text-left flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Table className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Table Tuner</h2>
                            <p className="text-slate-500 mb-6 text-sm flex-1">Convert Excel/CSV to Markdown, HTML, JSON, or ASCII.</p>
                            <span className="text-teal-600 font-medium flex items-center gap-2 text-sm">Open Tool <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                        </button>

                        <button
                            onClick={() => setView('brochure')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-sky-500 hover:shadow-xl transition-all group text-left flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Brochure Builder</h2>
                            <p className="text-slate-500 mb-6 text-sm flex-1">Design Tri-Fold brochures. Auto-arranges panels for print.</p>
                            <span className="text-sky-600 font-medium flex items-center gap-2 text-sm">Open Tool <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {view === 'labels' && <LabelCreator onBack={() => setView('home')} />}
            {view === 'excel' && <ExcelHelper onBack={() => setView('home')} />}
            {view === 'word' && <WordScrubber onBack={() => setView('home')} />}
            {view === 'sign' && <SignSwift onBack={() => setView('home')} />}
            {view === 'code' && <CodeBaker onBack={() => setView('home')} />}
            {view === 'tent' && <NameTentMaker onBack={() => setView('home')} />}
            {view === 'table' && <TableTuner onBack={() => setView('home')} />}
            {view === 'brochure' && <BrochureBuilder onBack={() => setView('home')} />}
        </div>
    );
}