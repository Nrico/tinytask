import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export type DocStyle = 'modern' | 'apa' | 'legal';

export interface FormatterOptions {
    style: DocStyle;
    title?: string;
}

export const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

export const generateFormattedDoc = async (text: string, options: FormatterOptions): Promise<Blob> => {
    const paragraphs = text.split('\n').filter(line => line.trim().length > 0);

    const docChildren = [];

    // Add Title if provided
    if (options.title) {
        docChildren.push(
            new Paragraph({
                text: options.title,
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
            })
        );
    }

    // Style configurations
    const styleConfig = {
        modern: {
            font: "Calibri",
            size: 24, // 12pt
            lineSpacing: 276, // 1.15
            spacingAfter: 200,
        },
        apa: {
            font: "Times New Roman",
            size: 24, // 12pt
            lineSpacing: 480, // Double
            spacingAfter: 0,
            indent: 720, // 0.5 inch
        },
        legal: {
            font: "Arial",
            size: 22, // 11pt
            lineSpacing: 240, // Single
            spacingAfter: 200,
            numbering: true, // Simplified simulation
        }
    };

    const config = styleConfig[options.style];

    // Process paragraphs
    paragraphs.forEach((paraText, index) => {
        docChildren.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: paraText,
                        font: config.font,
                        size: config.size,
                    }),
                ],
                spacing: {
                    line: config.lineSpacing,
                    after: config.spacingAfter,
                },
                indent: options.style === 'apa' ? { firstLine: (config as any).indent } : undefined,
                alignment: options.style === 'legal' ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
            })
        );
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: docChildren,
        }],
        styles: {
            default: {
                document: {
                    run: {
                        font: config.font,
                        size: config.size,
                    },
                },
            },
        },
    });

    return await Packer.toBlob(doc);
};
