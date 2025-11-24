export type SignType = 'danger' | 'warning' | 'caution' | 'notice' | 'safety';

export interface SignTemplate {
    id: SignType;
    label: string;
    headerColor: string; // Background color of the header
    headerTextColor: string; // Text color of the header
    headerText: string; // Default text (e.g., DANGER)
    bodyColor: string; // Background color of the body (usually white)
    borderColor: string; // Border color (usually black or same as header)
}

export const signTemplates: SignTemplate[] = [
    {
        id: 'danger',
        label: 'Danger',
        headerColor: '#d92828', // Red
        headerTextColor: '#ffffff',
        headerText: 'DANGER',
        bodyColor: '#ffffff',
        borderColor: '#000000',
    },
    {
        id: 'warning',
        label: 'Warning',
        headerColor: '#ff7f00', // Orange
        headerTextColor: '#000000',
        headerText: 'WARNING',
        bodyColor: '#ffffff',
        borderColor: '#000000',
    },
    {
        id: 'caution',
        label: 'Caution',
        headerColor: '#facc15', // Yellow
        headerTextColor: '#000000',
        headerText: 'CAUTION',
        bodyColor: '#ffffff',
        borderColor: '#000000',
    },
    {
        id: 'notice',
        label: 'Notice',
        headerColor: '#0066cc', // Blue
        headerTextColor: '#ffffff',
        headerText: 'NOTICE',
        bodyColor: '#ffffff',
        borderColor: '#000000',
    },
    {
        id: 'safety',
        label: 'Safety First',
        headerColor: '#16a34a', // Green
        headerTextColor: '#ffffff',
        headerText: 'SAFETY FIRST',
        bodyColor: '#ffffff',
        borderColor: '#000000',
    },
];
