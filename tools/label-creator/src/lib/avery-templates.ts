import { LabelConfig } from "../types/label";

export interface AveryTemplate {
    id: string;
    name: string;
    description: string;
    width: number; // Label width in mm
    height: number; // Label height in mm
    sheet: {
        width: number; // Sheet width (usually 215.9mm for Letter)
        height: number; // Sheet height (usually 279.4mm for Letter)
        marginTop: number;
        marginLeft: number;
        rows: number;
        cols: number;
        horizontalGap: number;
        verticalGap: number;
    };
}

// 1 inch = 25.4 mm
export const averyTemplates: AveryTemplate[] = [
    {
        id: '5160',
        name: '5160 Address',
        description: '1" x 2-5/8" (30 per sheet)',
        width: 66.675, // 2.625"
        height: 25.4,   // 1"
        sheet: {
            width: 215.9,
            height: 279.4,
            marginTop: 12.7, // 0.5"
            marginLeft: 4.7625, // 0.1875"
            rows: 10,
            cols: 3,
            horizontalGap: 3.175, // 0.125"
            verticalGap: 0,
        }
    },
    {
        id: '5163',
        name: '5163 Shipping',
        description: '2" x 4" (10 per sheet)',
        width: 101.6, // 4"
        height: 50.8, // 2"
        sheet: {
            width: 215.9,
            height: 279.4,
            marginTop: 12.7, // 0.5"
            marginLeft: 4.7625, // 0.1875"
            rows: 5,
            cols: 2,
            horizontalGap: 3.175, // 0.125"
            verticalGap: 0,
        }
    },
    {
        id: '5164',
        name: '5164 Shipping',
        description: '3-1/3" x 4" (6 per sheet)',
        width: 101.6, // 4"
        height: 84.67, // 3.33"
        sheet: {
            width: 215.9,
            height: 279.4,
            marginTop: 12.7, // 0.5"
            marginLeft: 4.7625, // 0.1875"
            rows: 3,
            cols: 2,
            horizontalGap: 3.175, // 0.125"
            verticalGap: 0,
        }
    },
    {
        id: '22806',
        name: '22806 Square',
        description: '2" x 2" (12 per sheet)',
        width: 50.8, // 2"
        height: 50.8, // 2"
        sheet: {
            width: 215.9,
            height: 279.4,
            marginTop: 15.875, // 0.625" (approx, adjusted for centering)
            marginLeft: 15.875, // 0.625"
            rows: 4,
            cols: 3,
            horizontalGap: 12.7, // 0.5"
            verticalGap: 12.7, // 0.5"
        }
    },
];
