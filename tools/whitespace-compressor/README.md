# Whitespace Compressor

Strips duplicate spaces, trailing line breaks, zero-width characters, non-breaking spaces, and hidden typography artifacts.

## Features

- **Double to Single Space**: Collapses arbitrary sequences of spaces.
- **Trailing & Leading Trim**: Removes spaces at the ends and starts of lines.
- **Invisible Char Stripper**: Removes Zero-Width Spaces (`\\u200B`), Zero-Width Non-Joiners (`\\u200C`), and BOM marks (`\\uFEFF`).
- **Visual Highlighter**: Renders space markings so whitespace shapes become visible as dots (`·`) and arrows (`→`).
