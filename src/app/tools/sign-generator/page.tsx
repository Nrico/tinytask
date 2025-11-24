"use client"

import React, { useState } from 'react';
import { SignPreview } from '@/components/tools/sign-generator/sign-preview';
import { SignControls } from '@/components/tools/sign-generator/sign-controls';
import { signTemplates, SignType } from '@/lib/sign-templates';

export default function SignGeneratorPage() {
  const [templateId, setTemplateId] = useState<SignType>('danger');
  const [headline, setHeadline] = useState('HIGH VOLTAGE');
  const [bodyText, setBodyText] = useState('Authorized personnel only.');
  const [icon, setIcon] = useState('triangle-alert');

  const template = signTemplates.find(t => t.id === templateId) || signTemplates[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Sign Generator</h1>
        <p className="text-muted-foreground">
          Create professional safety and notice signs. Select a template and customize the text.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 print:hidden">
          <SignControls
            templateId={templateId}
            onTemplateChange={setTemplateId}
            headline={headline}
            onHeadlineChange={setHeadline}
            bodyText={bodyText}
            onBodyTextChange={setBodyText}
            icon={icon}
            onIconChange={setIcon}
            onPrint={handlePrint}
          />
        </div>

        <div className="lg:col-span-2 flex items-start justify-center bg-muted/10 rounded-xl p-4 print:p-0 print:bg-white print:block">
          <SignPreview
            template={template}
            headline={headline}
            bodyText={bodyText}
            icon={icon}
          />
        </div>
      </div>

    </div>
  );
}
