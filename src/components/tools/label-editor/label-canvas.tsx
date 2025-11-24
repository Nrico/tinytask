"use client"

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { LabelElement, LabelConfig, LabelSheetMode, MergeField } from '@/types/label';
import { QRCodeCanvas } from 'qrcode.react';
import { cn } from '@/lib/utils';
import { averyTemplates } from '@/lib/avery-templates';

interface LabelCanvasProps {
    elements: LabelElement[];
    config: LabelConfig;
    selectedId: string | null;
    onSelect: (id: string) => void;
    onUpdate: (id: string, updates: Partial<LabelElement>) => void;
    viewMode: 'edit' | 'preview';
    sheetMode: LabelSheetMode;
    mergeData: Record<string, string>[];
}

export function LabelCanvas({
    elements,
    config,
    selectedId,
    onSelect,
    onUpdate,
    viewMode,
    sheetMode,
    mergeData
}: LabelCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // 1mm = 3.78px at 96 DPI
    const mmToPx = 3.78;

    const template = averyTemplates.find(t => t.id === config.templateId);

    const renderLabelContent = (currentElements: LabelElement[], dataRow?: Record<string, string>) => {
        return currentElements.map((element) => {
            let content = element.content;

            // Replace merge fields if data is provided
            if (dataRow) {
                content = content.replace(/\{(\w+)\}/g, (_, key) => dataRow[key] || `{${key}}`);
            }

            return (
                <div
                    key={element.id}
                    className="absolute"
                    style={{
                        left: `${element.x}mm`,
                        top: `${element.y}mm`,
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                    }}
                >
                    {element.type === 'text' && (
                        <span className="whitespace-pre-wrap select-none leading-tight block">{content}</span>
                    )}
                    {element.type === 'qr' && (
                        <div className="pointer-events-none">
                            <QRCodeCanvas value={content} size={element.width || 64} />
                        </div>
                    )}
                </div>
            );
        });
    };

    // Editor View (Single Label)
    if (viewMode === 'edit') {
        return (
            <div className="flex items-center justify-center overflow-hidden bg-muted/20 p-8 rounded-lg border border-dashed min-h-[500px]">
                <div
                    ref={containerRef}
                    className="relative bg-white shadow-lg"
                    style={{
                        width: `${config.width}mm`,
                        height: `${config.height}mm`,
                    }}
                    onClick={() => onSelect('')}
                >
                    {elements.map((element) => (
                        <motion.div
                            key={element.id}
                            drag
                            dragMomentum={false}
                            dragConstraints={containerRef}
                            onDragEnd={(_, info) => {
                                // Calculate position in mm relative to container
                                if (containerRef.current) {
                                    const rect = containerRef.current.getBoundingClientRect();
                                    const x = (info.point.x - rect.left);
                                    const y = (info.point.y - rect.top);
                                    // Convert px to mm (approximate based on screen DPI, but better to use percentage or fixed ratio if possible)
                                    // Since we set width in mm, the browser renders it in px.
                                    // We need to map back.
                                    // A safer way for this demo is to just update visual state.
                                    // For a production app, we'd need robust coordinate conversion.
                                    // Here we will just assume the visual drag is enough for the "Edit" view,
                                    // but to persist we need to update the element's x/y in mm.

                                    // Let's try to convert back using the ratio of rect.width / config.width
                                    const ratio = config.width / rect.width;
                                    onUpdate(element.id, { x: x * ratio, y: y * ratio });
                                }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(element.id);
                            }}
                            className={cn(
                                "absolute cursor-move hover:ring-1 hover:ring-primary/50",
                                selectedId === element.id && "ring-2 ring-primary"
                            )}
                            style={{
                                left: `${element.x}mm`,
                                top: `${element.y}mm`,
                                fontSize: element.fontSize,
                                fontFamily: element.fontFamily,
                            }}
                        >
                            {element.type === 'text' && (
                                <span className="whitespace-pre-wrap select-none leading-tight block">{element.content}</span>
                            )}
                            {element.type === 'qr' && (
                                <div className="pointer-events-none">
                                    <QRCodeCanvas value={element.content} size={element.width || 64} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    // Preview View (Full Sheet)
    if (!template) return <div>Select a template</div>;

    const sheet = template.sheet;
    const totalLabels = sheet.rows * sheet.cols;

    // Generate label data for the sheet
    let labelsToRender: { elements: LabelElement[], data?: Record<string, string> }[] = [];

    if (sheetMode === 'replicate') {
        labelsToRender = Array(totalLabels).fill({ elements });
    } else {
        // Merge mode
        labelsToRender = mergeData.slice(0, totalLabels).map(row => ({
            elements,
            data: row
        }));
        // Fill remaining spots with empty if needed, or just stop? 
        // Usually we just stop, but for grid alignment we might need empty divs.
    }

    return (
        <div className="flex items-center justify-center overflow-auto bg-muted/20 p-8 rounded-lg border border-dashed min-h-[500px]">
            <div
                className="relative bg-white shadow-lg print:shadow-none mx-auto"
                style={{
                    width: `${sheet.width}mm`,
                    height: `${sheet.height}mm`,
                    paddingTop: `${sheet.marginTop}mm`,
                    paddingLeft: `${sheet.marginLeft}mm`,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${sheet.cols}, ${template.width}mm)`,
                    gridTemplateRows: `repeat(${sheet.rows}, ${template.height}mm)`,
                    columnGap: `${sheet.horizontalGap}mm`,
                    rowGap: `${sheet.verticalGap}mm`,
                }}
            >
                {labelsToRender.map((label, i) => (
                    <div
                        key={i}
                        className="relative overflow-hidden border border-gray-100 print:border-none"
                        style={{ width: '100%', height: '100%' }}
                    >
                        {renderLabelContent(label.elements, label.data)}
                    </div>
                ))}
            </div>
        </div>
    );
}
