"use client"

import React, { useState } from 'react';
import { LabelCanvas } from '@/components/tools/label-editor/label-canvas';
import { LabelControls } from '@/components/tools/label-editor/label-controls';
import { LabelElement, LabelConfig, LabelSheetMode, MergeField } from '@/types/label';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
import { averyTemplates } from '@/lib/avery-templates';
import './print.css';

export default function LabelCreatorPage() {
    const [config, setConfig] = useState<LabelConfig>({
        width: 66.675,
        height: 25.4,
        unit: 'mm',
        templateId: '5160',
    });

    const [elements, setElements] = useState<LabelElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const [sheetMode, setSheetMode] = useState<LabelSheetMode>('replicate');
    const [mergeData, setMergeData] = useState<Record<string, string>[]>([]);
    const [mergeFields, setMergeFields] = useState<MergeField[]>([]);

    const handleAddElement = (type: LabelElement['type']) => {
        const newElement: LabelElement = {
            id: crypto.randomUUID(),
            type,
            content: type === 'text' ? 'New Text' : 'https://tinytask.app',
            x: 5,
            y: 5,
            fontSize: 12,
            fontFamily: 'var(--font-inter)',
            width: 32,
            height: 32,
        };
        setElements([...elements, newElement]);
        setSelectedId(newElement.id);
    };

    const handleUpdateElement = (id: string, updates: Partial<LabelElement>) => {
        setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
    };

    const handleDeleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const handleFileUpload = async (file: File) => {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);

        if (jsonData.length > 0) {
            setMergeData(jsonData);
            const keys = Object.keys(jsonData[0]);
            setMergeFields(keys.map(key => ({ key, value: jsonData[0][key] })));
        }
    };

    const handleInsertMergeField = (key: string) => {
        if (selectedId) {
            const el = elements.find(e => e.id === selectedId);
            if (el && el.type === 'text') {
                handleUpdateElement(selectedId, { content: el.content + ` {${key}}` });
            }
        } else {
            // Create new text element with field
            const newElement: LabelElement = {
                id: crypto.randomUUID(),
                type: 'text',
                content: `{${key}}`,
                x: 5,
                y: 5,
                fontSize: 12,
                fontFamily: 'var(--font-inter)',
            };
            setElements([...elements, newElement]);
            setSelectedId(newElement.id);
        }
    };

    const handlePrint = () => {
        setViewMode('preview');
        setTimeout(() => {
            window.print();
        }, 500);
    };

    const selectedElement = elements.find(el => el.id === selectedId);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Label Creator</h1>
                    <p className="text-muted-foreground">
                        Design, merge, and print labels using Avery templates.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'edit' ? 'default' : 'outline'}
                        onClick={() => setViewMode('edit')}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Design
                    </Button>
                    <Button
                        variant={viewMode === 'preview' ? 'default' : 'outline'}
                        onClick={() => setViewMode('preview')}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Sheet
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3 print:hidden h-[calc(100vh-200px)]">
                    <LabelControls
                        config={config}
                        onConfigChange={setConfig}
                        onAddElement={handleAddElement}
                        selectedElement={selectedElement}
                        onUpdateElement={handleUpdateElement}
                        onDeleteElement={handleDeleteElement}
                        onPrint={handlePrint}
                        mode={sheetMode}
                        onModeChange={setSheetMode}
                        onFileUpload={handleFileUpload}
                        mergeFields={mergeFields}
                        onInsertMergeField={handleInsertMergeField}
                    />
                </div>

                <div className="lg:col-span-9 flex items-start justify-center bg-muted/10 rounded-xl p-4 print:p-0 print:bg-white print:block overflow-auto h-[calc(100vh-200px)]">
                    <LabelCanvas
                        elements={elements}
                        config={config}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onUpdate={handleUpdateElement}
                        viewMode={viewMode}
                        sheetMode={sheetMode}
                        mergeData={mergeData}
                    />
                </div>
            </div>
        </div>
    );
}
