# Link Un-linker

Strip active hyperlinks and anchor tags from rich-text blocks, remove UTM parameters, or extract all URLs into a list.

## Features

- **HTML Anchor Stripper**: Parses active `<a>` elements and converts them according to your selected unlinking mode.
- **Plain-Text Link Cleanser**: Locates plain text URLs via regex and cleans/strips them.
- **UTM Cleanser**: Automatically strips analytics query variables (`utm_source`, `utm_medium`, `fbclid`, etc.).
- **URL Harvester**: Extracts all unique hyperlinks from a document and lists them cleanly.
