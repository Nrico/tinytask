# Delimiter Matrix

Parse, normalize, and format tabular clipboard data safely, handling double-quotes, newlines inside fields, and comma/tab/semicolon/pipe delimiters correctly.

## Features

- **Smart RFC 4180 Parser**: Parses quotes, double double-quote escaping, and lines split inside quoted strings.
- **Auto-Detect input delimiter**: Tab-Separated Values, Comma-Separated Values, Semicolons, or Pipes.
- **Multiple Output Formats**:
  - Clean CSV, TSV, Semicolon, Pipe
  - JSON Object Array or 2D Array
  - Markdown Tables
  - HTML Tables
- **Clean Controls**:
  - Trim spaces inside fields
  - Remove empty rows
  - Ensure uniform column count (pads shorter lines)
- **Interactive Grid Preview**: View parsed columns in a clean spreadsheet format.
