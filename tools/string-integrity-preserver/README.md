# String Integrity Preserver

Protect alphanumeric columns from being auto-mutated by spreadsheet software (e.g. Microsoft Excel or Google Sheets).

## Features

- **Excel Formula Wrap**: Wraps cell content in `="value"` formulas.
- **Single Quote Prefix**: Prepends `'` to make Excel treat cells as explicit text.
- **Smart Mutation Protection**: Detects and targets columns or cells matching patterns prone to mutation:
  - Leading zeroes (ZIP codes, IDs)
  - Date-like text (e.g. `MAR1`, `12-15`)
  - Scientific notation suspects (e.g. `3E02`)
- **Direct TSV / CSV Parsing**: Paste directly from Excel or Google Sheets, toggle columns, and copy clean formats back instantly.
