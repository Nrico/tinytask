"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LabelElement, LabelConfig, LabelSheetMode, MergeField } from '@/types/label';
import { Type, QrCode, Trash2, Printer, FileSpreadsheet, Plus } from 'lucide-react';
import { fontOptions } from '@/lib/fonts';
import { averyTemplates } from '@/lib/avery-templates';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LabelControlsProps {
    config: LabelConfig;
    onConfigChange: (config: LabelConfig) => void;
    onAddElement: (type: LabelElement['type']) => void;
    selectedElement: LabelElement | undefined;
    onUpdateElement: (id: string, updates: Partial<LabelElement>) => void;
    onDeleteElement: (id: string) => void;
    onPrint: () => void;
    mode: LabelSheetMode;
    onModeChange: (mode: LabelSheetMode) => void;
    onFileUpload: (file: File) => void;
    mergeFields: MergeField[];
    onInsertMergeField: (key: string) => void;
}

export function LabelControls({
    config,
    onConfigChange,
    onAddElement,
    selectedElement,
    onUpdateElement,
    onDeleteElement,
    onPrint,
    mode,
    onModeChange,
    onFileUpload,
    mergeFields,
    onInsertMergeField
}: LabelControlsProps) {
    return (
        <div className="flex flex-col gap-6 p-4 border rounded-lg bg-background h-full overflow-y-auto">
            <div className="space-y-4">
                <h3 className="font-semibold">Label Settings</h3>

                <div className="space-y-2">
                    <Label>Mode</Label>
                    <div className="flex gap-2">
                        <Button
                            variant={mode === 'replicate' ? 'default' : 'outline'}
                            onClick={() => onModeChange('replicate')}
                            className="flex-1"
                        >
                            Replicate
                        </Button>
                        <Button
                            variant={mode === 'merge' ? 'default' : 'outline'}
                            onClick={() => onModeChange('merge')}
                            className="flex-1"
                        >
                            Mail Merge
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Template</Label>
                    <Select
                        value={config.templateId}
                        onValueChange={(value) => {
                            const template = averyTemplates.find(t => t.id === value);
                            if (template) {
                                onConfigChange({
                                    ...config,
                                    templateId: value,
                                    width: template.width,
                                    height: template.height,
                                });
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                            {averyTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                    {template.name} ({template.description})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {mode === 'merge' && (
                <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold">Data Source</h3>
                    <div className="space-y-2">
                        <Label>Upload Excel/CSV</Label>
                        <Input
                            type="file"
                            accept=".xlsx,.csv"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    onFileUpload(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    {mergeFields.length > 0 && (
                        <div className="space-y-2">
                            <Label>Insert Field</Label>
                            <div className="flex flex-wrap gap-2">
                                {mergeFields.map((field) => (
                                    <Button
                                        key={field.key}
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onInsertMergeField(field.key)}
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {field.key}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Add Elements</h3>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => onAddElement('text')}>
                        <Type className="w-4 h-4 mr-2" />
                        Text
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => onAddElement('qr')}>
                        <QrCode className="w-4 h-4 mr-2" />
                        QR
                    </Button>
                </div>
            </div>

            {selectedElement && (
                <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Edit Element</h3>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteElement(selectedElement.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedElement.content}
                            onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                            {mode === 'merge' ? 'Use {ColumnName} for merge fields.' : ''}
                        </p>
                    </div>

                    {selectedElement.type === 'text' && (
                        <>
                            <div className="space-y-2">
                                <Label>Font</Label>
                                <Select
                                    value={selectedElement.fontFamily || fontOptions[0].value}
                                    onValueChange={(value) => onUpdateElement(selectedElement.id, { fontFamily: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fontOptions.map((font) => (
                                            <SelectItem key={font.value} value={font.value}>
                                                <span className={font.className}>{font.label}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Font Size (px)</Label>
                                <Input
                                    type="number"
                                    value={selectedElement.fontSize}
                                    onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                                />
                            </div>
                        </>
                    )}

                    {selectedElement.type === 'qr' && (
                        <div className="space-y-2">
                            <Label>Size (px)</Label>
                            <Input
                                type="number"
                                value={selectedElement.width}
                                onChange={(e) => onUpdateElement(selectedElement.id, { width: Number(e.target.value) })}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="mt-auto pt-4 border-t">
                <Button className="w-full" onClick={onPrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print Sheet
                </Button>
            </div>
        </div>
    );
}
