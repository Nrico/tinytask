import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Static mapping of tool slugs to their workspace packages
const tools: Record<string, ComponentType> = {
  "brochure-builder": dynamic(() => import("@tinytask/tool-brochure-builder")),
  "case-engine": dynamic(() => import("@tinytask/tool-case-engine")),
  "data-payload-sanitizer": dynamic(() => import("@tinytask/tool-data-payload-sanitizer")),
  "delimiter-matrix": dynamic(() => import("@tinytask/tool-delimiter-matrix")),
  "excel-scrubber": dynamic(() => import("@tinytask/tool-excel-scrubber")),
  "greeting-card": dynamic(() => import("@tinytask/tool-greeting-card")),
  "invoice-swift": dynamic(() => import("@tinytask/tool-invoice-swift")),
  "jar-label-generator": dynamic(() => import("@tinytask/tool-jar-label-generator")),
  "label-creator": dynamic(() => import("@tinytask/tool-label-creator")),
  "link-unlinker": dynamic(() => import("@tinytask/tool-link-unlinker")),
  "list-unbreaker": dynamic(() => import("@tinytask/tool-list-unbreaker")),
  "name-tent": dynamic(() => import("@tinytask/tool-name-tent")),
  "pattern-replacer": dynamic(() => import("@tinytask/tool-pattern-replacer")),
  "pixel-pruner": dynamic(() => import("@tinytask/tool-pixel-pruner")),
  "qr-generator": dynamic(() => import("@tinytask/tool-qr-generator")),
  "sign-generator": dynamic(() => import("@tinytask/tool-sign-generator")),
  "signature-generator": dynamic(() => import("@tinytask/tool-signature-generator")),
  "signature-smith": dynamic(() => import("@tinytask/tool-signature-smith")),
  "string-integrity-preserver": dynamic(() => import("@tinytask/tool-string-integrity-preserver")),
  "table-tuner": dynamic(() => import("@tinytask/tool-table-tuner")),
  "team-taggler": dynamic(() => import("@tinytask/tool-team-taggler")),
  "visual-style-purger": dynamic(() => import("@tinytask/tool-visual-style-purger")),
  "whitespace-compressor": dynamic(() => import("@tinytask/tool-whitespace-compressor")),
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
    { slug: "brochure-builder" },
    { slug: "case-engine" },
    { slug: "data-payload-sanitizer" },
    { slug: "delimiter-matrix" },
    { slug: "excel-scrubber" },
    { slug: "greeting-card" },
    { slug: "invoice-swift" },
    { slug: "jar-label-generator" },
    { slug: "label-creator" },
    { slug: "link-unlinker" },
    { slug: "list-unbreaker" },
    { slug: "name-tent" },
    { slug: "pattern-replacer" },
    { slug: "pixel-pruner" },
    { slug: "qr-generator" },
    { slug: "sign-generator" },
    { slug: "signature-generator" },
    { slug: "signature-smith" },
    { slug: "string-integrity-preserver" },
    { slug: "table-tuner" },
    { slug: "team-taggler" },
    { slug: "visual-style-purger" },
    { slug: "whitespace-compressor" },
    { slug: "word-formatter" },
    { slug: "zone-zapper" },
  ];
}
