import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Static mapping of tool slugs to their workspace packages
const tools: Record<string, ComponentType> = {
  "jar-label-generator": dynamic(() => import("@tinytask/tool-jar-label-generator")),
  "brochure-builder": dynamic(() => import("@tinytask/tool-brochure-builder")),
  "excel-scrubber": dynamic(() => import("@tinytask/tool-excel-scrubber")),
  "greeting-card": dynamic(() => import("@tinytask/tool-greeting-card")),
  "invoice-swift": dynamic(() => import("@tinytask/tool-invoice-swift")),
  "label-creator": dynamic(() => import("@tinytask/tool-label-creator")),
  "name-tent": dynamic(() => import("@tinytask/tool-name-tent")),
  "pixel-pruner": dynamic(() => import("@tinytask/tool-pixel-pruner")),
  "qr-generator": dynamic(() => import("@tinytask/tool-qr-generator")),
  "signature-smith": dynamic(() => import("@tinytask/tool-signature-smith")),
  "table-tuner": dynamic(() => import("@tinytask/tool-table-tuner")),
  "team-taggler": dynamic(() => import("@tinytask/tool-team-taggler")),
  "word-formatter": dynamic(() => import("@tinytask/tool-word-formatter")),
  "zone-zapper": dynamic(() => import("@tinytask/tool-zone-zapper")),
};

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const ToolComponent = tools[slug];
  if (!ToolComponent) {
    notFound();
  }
  return <ToolComponent />;
}

// Pre-define slugs for static site generation (SSG) on build
export async function generateStaticParams() {
  return [
    { slug: "jar-label-generator" },
    { slug: "brochure-builder" },
    { slug: "excel-scrubber" },
    { slug: "greeting-card" },
    { slug: "invoice-swift" },
    { slug: "label-creator" },
    { slug: "name-tent" },
    { slug: "pixel-pruner" },
    { slug: "qr-generator" },
    { slug: "signature-smith" },
    { slug: "table-tuner" },
    { slug: "team-taggler" },
    { slug: "word-formatter" },
    { slug: "zone-zapper" },
  ];
}
