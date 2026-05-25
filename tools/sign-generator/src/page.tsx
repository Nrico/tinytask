"use client"

import React, { useState, useEffect } from 'react';
import { SignPreview } from './components/sign-preview';
import { SignControls } from './components/sign-controls';
import { signTemplates, SignType } from './lib/sign-templates';
import { ToolLayout } from '@tinytask/ui/layouts/tool-layout';

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

  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial state on mount from URL or LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTemplateId = params.get("templateId") as SignType | null;
      const urlOrientation = params.get("orientation") as 'portrait' | 'landscape' | null;
      const urlHeaderText = params.get("headerText");
      const urlHeadline = params.get("headline");
      const urlBodyText = params.get("bodyText");
      const urlIcon = params.get("icon");
      const urlHeaderColor = params.get("headerColor");
      const urlHeaderTextColor = params.get("headerTextColor");
      const urlBorderColor = params.get("borderColor");

      const cachedData = localStorage.getItem("tinytask:sign-generator");
      let cached: any = {};
      if (cachedData) {
        try {
          cached = JSON.parse(cachedData);
        } catch (e) {
          console.error(e);
        }
      }

      if (urlTemplateId && ['danger', 'warning', 'caution', 'notice', 'safety', 'parking', 'closed', 'cancelled', 'holiday', 'custom'].includes(urlTemplateId)) {
        setTemplateId(urlTemplateId);
      } else if (cached.templateId !== undefined) {
        setTemplateId(cached.templateId);
      }

      if (urlOrientation && ['portrait', 'landscape'].includes(urlOrientation)) {
        setOrientation(urlOrientation);
      } else if (cached.orientation !== undefined) {
        setOrientation(cached.orientation);
      }

      if (urlHeaderText !== null) setHeaderText(urlHeaderText);
      else if (cached.headerText !== undefined) setHeaderText(cached.headerText);

      if (urlHeadline !== null) setHeadline(urlHeadline);
      else if (cached.headline !== undefined) setHeadline(cached.headline);

      if (urlBodyText !== null) setBodyText(urlBodyText);
      else if (cached.bodyText !== undefined) setBodyText(cached.bodyText);

      if (urlIcon !== null) setIcon(urlIcon);
      else if (cached.icon !== undefined) setIcon(cached.icon);

      if (urlHeaderColor !== null) setHeaderColor(urlHeaderColor);
      else if (cached.headerColor !== undefined) setHeaderColor(cached.headerColor);

      if (urlHeaderTextColor !== null) setHeaderTextColor(urlHeaderTextColor);
      else if (cached.headerTextColor !== undefined) setHeaderTextColor(cached.headerTextColor);

      if (urlBorderColor !== null) setBorderColor(urlBorderColor);
      else if (cached.borderColor !== undefined) setBorderColor(cached.borderColor);

      setIsLoaded(true);
    }
  }, []);

  // Sync state changes back to LocalStorage and URL search params
  useEffect(() => {
    if (!isLoaded) return;

    if (typeof window !== "undefined") {
      const dataToSave = {
        templateId,
        orientation,
        headerText,
        headline,
        bodyText,
        icon,
        headerColor,
        headerTextColor,
        borderColor
      };
      localStorage.setItem("tinytask:sign-generator", JSON.stringify(dataToSave));

      const params = new URLSearchParams();
      if (templateId !== 'danger') {
        params.set("templateId", templateId);
      }
      if (orientation !== 'portrait') {
        params.set("orientation", orientation);
      }
      if (headerText && headerText !== TEMPLATE_EXAMPLES[templateId]?.headerText) {
        params.set("headerText", headerText);
      }
      if (headline && headline !== TEMPLATE_EXAMPLES[templateId]?.headline) {
        params.set("headline", headline);
      }
      if (bodyText && bodyText !== TEMPLATE_EXAMPLES[templateId]?.bodyText) {
        params.set("bodyText", bodyText);
      }
      if (icon && icon !== TEMPLATE_EXAMPLES[templateId]?.icon) {
        params.set("icon", icon);
      }
      if (templateId === 'custom') {
        if (headerColor !== '#4f46e5') params.set("headerColor", headerColor);
        if (headerTextColor !== '#ffffff') params.set("headerTextColor", headerTextColor);
        if (borderColor !== '#4f46e5') params.set("borderColor", borderColor);
      }

      const newSearch = params.toString();
      const newUrl = newSearch 
        ? `${window.location.pathname}?${newSearch}`
        : window.location.pathname;
        
      window.history.replaceState({ ...window.history.state }, "", newUrl);
    }
  }, [templateId, orientation, headerText, headline, bodyText, icon, headerColor, headerTextColor, borderColor, isLoaded]);

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
    <>
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

      <ToolLayout
        title="Design OSHA-Compliant Signs"
        description="Create professional warning signs, office notices, parking displays, and announcement sheets."
        faqs={[
          {
            question: "Can I print these signs in landscape or portrait orientation?",
            answer: "Yes. You can toggle between Portrait (vertical) and Landscape (horizontal) orientations. Make sure to set your system print dialog orientation matching the selection for the best layout scale."
          },
          {
            question: "Is there a charge to print or download these templates?",
            answer: "No, all templates on TinyTask are 100% free, run fully client-side, and can be printed directly from your browser."
          },
          {
            question: "Can I create signs for parking or office announcements?",
            answer: "Yes. TinyTask supports standard OSHA safety signs (Danger, Warning, Caution, Notice, Safety First) as well as modern office templates like Closed Notices, Class Cancellations, Reserved Parking, and Custom notices."
          }
        ]}
        sidebarContent={
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
        }
        previewContent={
          <div className="flex items-start justify-center bg-muted/10 rounded-xl p-4 print:p-0 print:bg-white print:block w-full max-w-2xl">
            <SignPreview
              template={template}
              orientation={orientation}
              headerText={headerText}
              headline={headline}
              bodyText={bodyText}
              icon={icon}
            />
          </div>
        }
      />
    </>
  );
}
