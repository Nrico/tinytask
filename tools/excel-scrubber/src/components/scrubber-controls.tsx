"use client"

import React from 'react';
import { Label } from '@tinytask/ui/forms/label';
import { ScrubberOptions } from '../lib/excel-utils';
import { Checkbox } from "@tinytask/ui/forms/checkbox"

interface ScrubberControlsProps {
    options: ScrubberOptions;
    onChange: (options: ScrubberOptions) => void;
}

export function ScrubberControls({ options, onChange }: ScrubberControlsProps) {
    const toggle = (key: keyof ScrubberOptions) => {
        onChange({ ...options, [key]: !options[key] });
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-background">
            <h3 className="font-semibold">Cleaning Options</h3>

            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="empty"
                        checked={options.removeEmptyRows}
                        onCheckedChange={() => toggle('removeEmptyRows')}
                    />
                    <Label htmlFor="empty">Remove Empty Rows</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="duplicates"
                        checked={options.removeDuplicates}
                        onCheckedChange={() => toggle('removeDuplicates')}
                    />
                    <Label htmlFor="duplicates">Remove Duplicate Rows</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="whitespace"
                        checked={options.trimWhitespace}
                        onCheckedChange={() => toggle('trimWhitespace')}
                    />
                    <Label htmlFor="whitespace">Trim Whitespace</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="uppercase"
                        checked={options.upperCaseHeader}
                        onCheckedChange={() => toggle('upperCaseHeader')}
                    />
                    <Label htmlFor="uppercase">Uppercase Headers</Label>
                </div>
            </div>
        </div>
    );
}
