"use client"

import React, { useState } from 'react';
import { SignPreview } from './components/sign-preview';
import { SignControls } from './components/sign-controls';
import { signTemplates, SignType } from './lib/sign-templates';

const TEMPLATE_EXAMPLES: Record<SignType, { headerText: string; headline: string; bodyText: string; icon: string }> = {
    danger: {
        headerText: 'DANGER',
        headline: 'HIGH VOLTAGE',
        bodyText: 'Authorized personnel only.',
        icon: 'triangle-alert'
    },
    warning: {
        headerText: 'WARNING',
        headline: 'EYE PROTECTION REQUIRED',
        bodyText: 'Safety glasses must be worn in this area.',
        icon: 'circle-alert'
    },
    caution: {
        headerText: 'CAUTION',
        headline: 'WET FLOOR',
        bodyText: 'Watch your step. Slippery when wet.',
        icon: 'triangle-alert'
    },
    notice: {
        headerText: 'NOTICE',
        headline: 'VISITOR REGISTRATION',
        bodyText: 'All visitors must sign in at the front desk.',
        icon: 'info'
    },
    safety: {
        headerText: 'SAFETY FIRST',
        headline: 'FIRST AID STATION',
        bodyText: 'First aid kit and safety supplies located inside.',
        icon: 'shield-check'
    },
    parking: {
        headerText: 'RESERVED PARKING',
        headline: 'VISITOR ONLY',
        bodyText: 'Unauthorized vehicles will be towed at owner\'s expense.',
        icon: 'parking'
    },
    closed: {
        headerText: 'WE ARE CLOSED',
        headline: 'TEMPORARILY CLOSED',
        bodyText: 'We will reopen tomorrow morning at 8:00 AM. Thank you for your patience.',
        icon: 'clock'
    },
    cancelled: {
        headerText: 'NOTICE',
        headline: 'CLASS CANCELLED',
        bodyText: 'The afternoon lecture has been cancelled today. Please check the online portal.',
        icon: 'calendar-x'
    },
    holiday: {
        headerText: 'HAPPY HOLIDAYS',
        headline: 'OFFICE CLOSED',
        bodyText: 'Closed for the holiday. Reopening next Monday. Have a safe and happy season!',
        icon: 'sparkles'
    },
    custom: {
        headerText: 'PLEASE NOTE',
        headline: 'MEETING MOVED',
        bodyText: 'Today\'s 2:00 PM staff meeting has been moved to Conference Room B.',
        icon: 'megaphone'
    }
};

export default function SignGeneratorPage() {
  const [templateId, setTemplateId] = useState<SignType>('danger');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [headerText, setHeaderText] = useState('DANGER');
  const [headline, setHeadline] = useState('HIGH VOLTAGE');
  const [bodyText, setBodyText] = useState('Authorized personnel only.');
  const [icon, setIcon] = useState('triangle-alert');

  // Custom styling colors (active when templateId === 'custom')
  const [headerColor, setHeaderColor] = useState('#4f46e5');
  const [headerTextColor, setHeaderTextColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#4f46e5');

  const selectedTemplate = signTemplates.find(t => t.id === templateId) || signTemplates[0];

  // Merge selected template values with custom styling state if templateId is 'custom'
  const template = templateId === 'custom' 
    ? {
        ...selectedTemplate,
        headerColor,
        headerTextColor,
        borderColor,
      }
    : selectedTemplate;

  const handleTemplateChange = (id: SignType) => {
    setTemplateId(id);
    const example = TEMPLATE_EXAMPLES[id];
    if (example) {
      setHeaderText(example.headerText);
      setHeadline(example.headline);
      setBodyText(example.bodyText);
      setIcon(example.icon);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl sm:px-6 lg:px-8">
      
      {/* Print-specific style to force landscape/portrait orientation during printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: ${orientation};
            margin: 0;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all UI containers */
          body * { visibility: hidden !important; }
          #sign-print-area, #sign-print-area * { visibility: visible !important; }
          #sign-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
          }
          .sign-sheet-box {
            width: 100% !important;
            height: 100% !important;
            border-width: 1.5rem !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          /* Ensure headers take full width */
          .sign-header-bar {
            padding: 2.5rem !important;
          }
          .sign-header-bar h1 {
            font-size: 8rem !important;
          }
          .sign-body-area h2 {
            font-size: 5.5rem !important;
          }
          .sign-body-area p {
            font-size: 3rem !important;
          }
          .sign-body-area svg {
            width: 12rem !important;
            height: 12rem !important;
          }
        }
      `}} />

      <div className="mb-8 space-y-2 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Sign Generator</h1>
        <p className="text-muted-foreground">
          Create professional warning signs, office notices, parking displays, and announcement sheets.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 print:hidden">
          <SignControls
            templateId={templateId}
            onTemplateChange={handleTemplateChange}
            orientation={orientation}
            onOrientationChange={setOrientation}
            headerText={headerText}
            onHeaderTextChange={setHeaderText}
            headline={headline}
            onHeadlineChange={setHeadline}
            bodyText={bodyText}
            onBodyTextChange={setBodyText}
            icon={icon}
            onIconChange={setIcon}
            headerColor={headerColor}
            onHeaderColorChange={setHeaderColor}
            headerTextColor={headerTextColor}
            onHeaderTextColorChange={setHeaderTextColor}
            borderColor={borderColor}
            onBorderColorChange={setBorderColor}
            onPrint={handlePrint}
          />
        </div>

        <div className="lg:col-span-2 flex items-start justify-center bg-muted/10 rounded-xl p-4 print:p-0 print:bg-white print:block">
          <SignPreview
            template={template}
            orientation={orientation}
            headerText={headerText}
            headline={headline}
            bodyText={bodyText}
            icon={icon}
          />
        </div>
      </div>

    </div>
  );
}
