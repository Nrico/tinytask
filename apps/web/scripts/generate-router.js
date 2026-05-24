/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../../../tools');
const outputFile = path.join(__dirname, '../src/app/tools/[slug]/page.tsx');

function generate() {
  if (!fs.existsSync(toolsDir)) {
    console.error(`Tools directory not found at: ${toolsDir}`);
    process.exit(1);
  }

  const items = fs.readdirSync(toolsDir);
  const tools = [];

  for (const item of items) {
    const itemPath = path.join(toolsDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const pkgPath = path.join(itemPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          if (pkg.name && pkg.name.startsWith('@tinytask/tool-')) {
            tools.push(item);
          }
        } catch (e) {
          console.warn(`Warning: Failed to parse package.json for tool ${item}:`, e.message);
        }
      }
    }
  }

  // Sort tools alphabetically for deterministic output
  tools.sort();

  const code = `import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Static mapping of tool slugs to their workspace packages
const tools: Record<string, ComponentType> = {
${tools.map(slug => `  "${slug}": dynamic(() => import("@tinytask/tool-${slug}")),`).join('\n')}
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
${tools.map(slug => `    { slug: "${slug}" },`).join('\n')}
  ];
}
`;

  fs.writeFileSync(outputFile, code, 'utf8');
  console.log(`Successfully generated tool router at ${outputFile} with ${tools.length} tools.`);
}

generate();
