"use client"

import React, { useState } from 'react';
import { FileUploader } from './components/file-uploader';
import { StyleSelector } from './components/style-selector';
import { DocStyle, extractTextFromDocx, generateFormattedDoc } from './lib/word-utils';
import { Button } from '@tinytask/ui/buttons/button';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { Download, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function WordFormatterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState<string>('');
    const [style, setStyle] = useState<DocStyle>('modern');
    const [title, setTitle] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        setIsProcessing(true);
        try {
            const extractedText = await extractTextFromDocx(selectedFile);
            setText(extractedText);
        } catch (error) {
            console.error("Error extracting text:", error);
            alert("Failed to extract text from file.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (!text) return;
        setIsProcessing(true);
        try {
            const blob = await generateFormattedDoc(text, { style, title });
            saveAs(blob, `formatted_${title || 'document'}.docx`);
        } catch (error) {
            console.error("Error generating document:", error);
            alert("Failed to generate document.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExportMarkdown = () => {
        if (!text) return;
        // Simple conversion: just use the text as is if it's already plain, 
        // but since this tool is for cleaning word docs, the output is usually plain text.
        // We can wrap it in a markdown file download.
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'document'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl sm:px-6 lg:px-8">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Format Drafts into Markdown</h1>
                <p className="text-muted-foreground">
                    Transform messy documents into professionally formatted reports, papers, or legal docs.
                </p>
            </div>

            <div className="grid gap-8">
                {/* Step 1: Input */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                        Upload or Paste Content
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label>Upload .docx</Label>
                            <FileUploader onFileSelect={handleFileSelect} selectedFile={file} />
                        </div>
                        <div className="space-y-2">
                            <Label>Or Paste Text</Label>
                            <textarea
                                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste your text here..."
                            />
                        </div>
                    </div>
                </div>

                {/* Step 2: Options */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                        Choose Style
                    </h2>

                    <div className="max-w-md space-y-2">
                        <Label>Document Title (Optional)</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Q3 Financial Report"
                        />
                    </div>

                    <StyleSelector selectedStyle={style} onSelect={setStyle} />
                </div>

                {/* Step 3: Download */}
                <div className="pt-4 border-t">
                    <Button
                        size="lg"
                        className="w-full md:w-auto"
                        disabled={!text || isProcessing}
                        onClick={handleDownload}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        Download Formatted Document
                    </Button>
                </div>
            </div>
        </div>
    );
}
