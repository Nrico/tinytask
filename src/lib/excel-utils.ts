import * as XLSX from 'xlsx';

export interface ScrubberOptions {
    removeEmptyRows: boolean;
    removeDuplicates: boolean;
    trimWhitespace: boolean;
    upperCaseHeader: boolean;
}

export const parseExcelFile = async (file: File): Promise<any[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
};

export const cleanData = (data: any[], options: ScrubberOptions): any[] => {
    let cleaned = [...data];

    // 1. Remove Empty Rows
    if (options.removeEmptyRows) {
        cleaned = cleaned.filter(row => {
            const values = Object.values(row);
            return values.some(val => val !== "" && val !== null && val !== undefined);
        });
    }

    // 2. Trim Whitespace & Uppercase Header (Header logic handled separately usually, but here we modify keys if needed? 
    // Actually, sheet_to_json gives objects. Modifying headers means creating new objects with new keys.
    // Let's handle values first.
    if (options.trimWhitespace) {
        cleaned = cleaned.map(row => {
            const newRow: any = {};
            Object.keys(row).forEach(key => {
                const val = row[key];
                newRow[key] = typeof val === 'string' ? val.trim() : val;
            });
            return newRow;
        });
    }

    // 3. Remove Duplicates
    if (options.removeDuplicates) {
        const seen = new Set();
        cleaned = cleaned.filter(row => {
            const serialized = JSON.stringify(row);
            if (seen.has(serialized)) return false;
            seen.add(serialized);
            return true;
        });
    }

    // 4. Uppercase Headers
    if (options.upperCaseHeader && cleaned.length > 0) {
        cleaned = cleaned.map(row => {
            const newRow: any = {};
            Object.keys(row).forEach(key => {
                newRow[key.toUpperCase()] = row[key];
            });
            return newRow;
        });
    }

    return cleaned;
};

export const exportToExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cleaned Data");
    XLSX.writeFile(workbook, filename);
};
