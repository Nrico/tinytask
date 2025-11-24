export type LabelElementType = 'text' | 'image' | 'qr';

export interface LabelElement {
    id: string;
    type: LabelElementType;
    content: string;
    x: number;
    y: number;
    fontSize?: number;
    fontFamily?: string;
    width?: number;
    height?: number;
    rotation?: number;
}

export interface LabelConfig {
    width: number; // mm
    height: number; // mm
    unit: 'mm' | 'in';
    templateId?: string;
}

export type LabelSheetMode = 'replicate' | 'merge';

export interface MergeField {
    key: string; // Column header from Excel
    value: string; // Sample value
}
