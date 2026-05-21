import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@tinytask/brand",
    "@tinytask/ui",
    "@tinytask/utils",
    "@tinytask/tool-bi-fold-brochure",
    "@tinytask/tool-brochure-builder",
    "@tinytask/tool-excel-scrubber",
    "@tinytask/tool-greeting-card",
    "@tinytask/tool-invoice-swift",
    "@tinytask/tool-jar-label-generator",
    "@tinytask/tool-label-creator",
    "@tinytask/tool-name-tent",
    "@tinytask/tool-pixel-pruner",
    "@tinytask/tool-qr-generator",
    "@tinytask/tool-sign-generator",
    "@tinytask/tool-signature-smith",
    "@tinytask/tool-table-tuner",
    "@tinytask/tool-team-taggler",
    "@tinytask/tool-word-formatter",
    "@tinytask/tool-zone-zapper"
  ]
};

export default nextConfig;
