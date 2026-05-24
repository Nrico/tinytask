import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@tinytask/brand",
    "@tinytask/ui",
    "@tinytask/utils",
    "@tinytask/tool-brochure-builder",
    "@tinytask/tool-case-engine",
    "@tinytask/tool-data-payload-sanitizer",
    "@tinytask/tool-delimiter-matrix",
    "@tinytask/tool-excel-scrubber",
    "@tinytask/tool-greeting-card",
    "@tinytask/tool-invoice-swift",
    "@tinytask/tool-jar-label-generator",
    "@tinytask/tool-label-creator",
    "@tinytask/tool-link-unlinker",
    "@tinytask/tool-list-unbreaker",
    "@tinytask/tool-name-tent",
    "@tinytask/tool-pattern-replacer",
    "@tinytask/tool-pixel-pruner",
    "@tinytask/tool-qr-generator",
    "@tinytask/tool-signature-generator",
    "@tinytask/tool-signature-smith",
    "@tinytask/tool-sign-generator",
    "@tinytask/tool-string-integrity-preserver",
    "@tinytask/tool-table-tuner",
    "@tinytask/tool-team-taggler",
    "@tinytask/tool-visual-style-purger",
    "@tinytask/tool-whitespace-compressor",
    "@tinytask/tool-word-formatter",
    "@tinytask/tool-zone-zapper"
  ]
};

export default nextConfig;
