"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@tinytask/ui/buttons/button"
import { Label } from "@tinytask/ui/forms/label"
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout"
import { Card, CardContent } from "@tinytask/ui/cards/card"
import { 
  Clipboard, 
  Check, 
  Trash2, 
  Sparkles, 
  Scissors, 
  Table, 
  Code,
  Braces,
  Hash,
  ArrowRightLeft
} from "lucide-react"

type DelimiterType = "tab" | "comma" | "semicolon" | "pipe" | "auto"
type OutputFormat = "csv" | "tsv" | "semicolon" | "pipe" | "json-obj" | "json-array" | "markdown" | "html"

const MOCK_MESSY_DELIMITED = `Name,Role,Location,Joined Date,Access Level
"Doe, Jane",Engineer,"Seattle, WA",2024-03-01,Admin
"Smith, John",Designer,"San Francisco, CA",2023-11-15,User
"Gatsby, ""The Great""",Manager,"New York, NY",2022-05-18,Editor
"Lee, Bruce",Specialist,,2025-01-10,User`

export default function DelimiterMatrixPage() {
  const [inputText, setInputText] = useState(MOCK_MESSY_DELIMITED)
  const [outputText, setOutputText] = useState("")
  
  const [inputDelimiter, setInputDelimiter] = useState<DelimiterType>("auto")
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("tsv")
  
  const [hasHeader, setHasHeader] = useState(true)
  const [trimCells, setTrimCells] = useState(true)
  const [removeEmptyRows, setRemoveEmptyRows] = useState(true)
  const [autoPadColumns, setAutoPadColumns] = useState(true)
  
  const [activeTab, setActiveTab] = useState<"raw" | "preview">("raw")
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    rows: 0,
    cols: 0,
    cells: 0
  })

  const [parsedGrid, setParsedGrid] = useState<string[][]>([])
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([])

  // Smart delimiter detector
  const detectDelimiter = (text: string): string => {
    const sample = text.slice(0, 5000)
    const tabs = (sample.match(/\t/g) || []).length
    const commas = (sample.match(/,/g) || []).length
    const semicolons = (sample.match(/;/g) || []).length
    const pipes = (sample.match(/\|/g) || []).length

    const counts = [
      { type: "tab", count: tabs, char: "\t" },
      { type: "comma", count: commas, char: "," },
      { type: "semicolon", count: semicolons, char: ";" },
      { type: "pipe", count: pipes, char: "|" }
    ]

    const max = counts.reduce((prev, current) => (prev.count > current.count) ? prev : current)
    return max.count > 0 ? max.char : ","
  }

  // RFC 4180 compliant parsing function
  const parseDelimitedText = (text: string, delimiterChar: string): string[][] => {
    const result: string[][] = []
    let row: string[] = []
    let cell = ""
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const nextChar = text[i + 1]

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            cell += '"'
            i++ // Skip next quote
          } else {
            inQuotes = false
          }
        } else {
          cell += char
        }
      } else {
        if (char === '"') {
          inQuotes = true
        } else if (char === delimiterChar) {
          row.push(cell)
          cell = ""
        } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
          row.push(cell)
          result.push(row)
          row = []
          cell = ""
          if (char === "\r") i++
        } else if (char !== "\r") {
          cell += char
        }
      }
    }

    if (cell !== "" || row.length > 0) {
      row.push(cell)
      result.push(row)
    }

    return result
  }

  // Helper to format values back into delimited text safely
  const formatCell = (val: string, delim: string): string => {
    const clean = val.includes(delim) || val.includes('"') || val.includes("\n") || val.includes("\r")
    if (clean) {
      return `"${val.replace(/"/g, '""')}"`
    }
    return val
  }

  // Helper to render markdown table cell separator lines
  const getMarkdownSeparator = (colCount: number): string => {
    return "|" + Array(colCount).fill(" --- ").join("|") + "|"
  }

  // Main compilation effect
  useEffect(() => {
    if (!inputText.trim()) {
      setParsedGrid([])
      setDetectedHeaders([])
      setOutputText("")
      setStats({ rows: 0, cols: 0, cells: 0 })
      return
    }

    const activeDelimChar = inputDelimiter === "auto" 
      ? detectDelimiter(inputText)
      : inputDelimiter === "tab" ? "\t" : inputDelimiter === "semicolon" ? ";" : inputDelimiter === "pipe" ? "|" : ","

    // 1. Run RFC parser
    let rawGrid = parseDelimitedText(inputText, activeDelimChar)

    // 2. Filter empty rows
    if (removeEmptyRows) {
      rawGrid = rawGrid.filter(row => row.some(cell => cell.trim() !== ""))
    }

    // 3. Trim cells if checked
    if (trimCells) {
      rawGrid = rawGrid.map(row => row.map(cell => cell.trim()))
    }

    if (rawGrid.length === 0) return

    // 4. Discover maximum column count
    const colCount = Math.max(...rawGrid.map(row => row.length))

    // 5. Pad columns
    if (autoPadColumns) {
      rawGrid = rawGrid.map(row => {
        const padded = [...row]
        while (padded.length < colCount) {
          padded.push("")
        }
        return padded
      })
    }

    // 6. Header isolation
    let headers: string[] = []
    if (hasHeader) {
      headers = rawGrid[0]
      while (headers.length < colCount) {
        headers.push(`Column ${headers.length + 1}`)
      }
    } else {
      for (let i = 0; i < colCount; i++) {
        headers.push(`Column ${i + 1}`)
      }
    }

    setParsedGrid(rawGrid)
    setDetectedHeaders(headers)

    // 7. Render Target Formats
    let finalOutput = ""
    const dataRows = hasHeader ? rawGrid.slice(1) : rawGrid

    switch (outputFormat) {
      case "csv":
        finalOutput = rawGrid.map(row => row.map(cell => formatCell(cell, ",")).join(",")).join("\n")
        break
      case "tsv":
        finalOutput = rawGrid.map(row => row.map(cell => formatCell(cell, "\t")).join("\t")).join("\n")
        break
      case "semicolon":
        finalOutput = rawGrid.map(row => row.map(cell => formatCell(cell, ";")).join(";")).join("\n")
        break
      case "pipe":
        finalOutput = rawGrid.map(row => row.map(cell => formatCell(cell, "|")).join("|")).join("\n")
        break
      case "json-array":
        finalOutput = JSON.stringify(rawGrid, null, 2)
        break
      case "json-obj":
        const objList = dataRows.map(row => {
          const obj: Record<string, string> = {}
          headers.forEach((header, idx) => {
            obj[header || `col_${idx + 1}`] = row[idx] || ""
          })
          return obj
        })
        finalOutput = JSON.stringify(objList, null, 2)
        break
      case "markdown":
        const mdHeader = "|" + headers.map(h => ` ${h} `).join("|") + "|"
        const mdSep = getMarkdownSeparator(colCount)
        const mdRows = dataRows.map(row => "|" + row.map(cell => ` ${cell} `).join("|") + "|").join("\n")
        finalOutput = `${mdHeader}\n${mdSep}\n${mdRows}`
        break
      case "html":
        const htmlRows = dataRows.map(row => {
          const cells = row.map(cell => `    <td>${cell}</td>`).join("\n")
          return `  <tr>\n${cells}\n  </tr>`
        }).join("\n")
        const htmlHeader = headers.map(h => `    <th>${h}</th>`).join("\n")
        finalOutput = `<table>\n <thead>\n  <tr>\n${htmlHeader}\n  </tr>\n </thead>\n <tbody>\n${htmlRows}\n </tbody>\n</table>`
        break
    }

    setOutputText(finalOutput)
    setStats({
      rows: dataRows.length,
      cols: colCount,
      cells: dataRows.length * colCount
    })

  }, [inputText, inputDelimiter, outputFormat, hasHeader, trimCells, removeEmptyRows, autoPadColumns])

  const loadExample = () => {
    setInputText(MOCK_MESSY_DELIMITED)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setParsedGrid([])
    setDetectedHeaders([])
    setStats({ rows: 0, cols: 0, cells: 0 })
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="Delimiter Matrix"
      description="Safely parse and convert tabular structures containing nested commas, quotes, and newlines into clean formats."
      sidebarContent={
        <div className="space-y-6">
          {/* Output Format Grid */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Output Format</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={outputFormat === "tsv" ? "default" : "outline"}
                onClick={() => setOutputFormat("tsv")}
                className="justify-start gap-1.5 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
                Tab (TSV)
              </Button>

              <Button
                variant={outputFormat === "csv" ? "default" : "outline"}
                onClick={() => setOutputFormat("csv")}
                className="justify-start gap-1.5 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-500" />
                CSV
              </Button>

              <Button
                variant={outputFormat === "semicolon" ? "default" : "outline"}
                onClick={() => setOutputFormat("semicolon")}
                className="justify-start gap-1.5 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500" />
                Semicolon
              </Button>

              <Button
                variant={outputFormat === "pipe" ? "default" : "outline"}
                onClick={() => setOutputFormat("pipe")}
                className="justify-start gap-1.5 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-purple-500" />
                Pipe (|)
              </Button>

              <Button
                variant={outputFormat === "json-obj" ? "default" : "outline"}
                onClick={() => setOutputFormat("json-obj")}
                className="justify-start gap-1.5 text-xs py-1 px-2.5 h-9 font-mono"
                size="sm"
              >
                <Braces className="w-3.5 h-3.5 text-cyan-500" />
                JSON Object
              </Button>

              <Button
                variant={outputFormat === "json-array" ? "default" : "outline"}
                onClick={() => setOutputFormat("json-array")}
                className="justify-start gap-1.5 text-xs py-1 px-2.5 h-9 font-mono"
                size="sm"
              >
                <Braces className="w-3.5 h-3.5 text-pink-500" />
                JSON Array
              </Button>

              <Button
                variant={outputFormat === "markdown" ? "default" : "outline"}
                onClick={() => setOutputFormat("markdown")}
                className="justify-start gap-1.5 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <Hash className="w-3.5 h-3.5 text-rose-500" />
                Markdown
              </Button>

              <Button
                variant={outputFormat === "html" ? "default" : "outline"}
                onClick={() => setOutputFormat("html")}
                className="justify-start gap-1.5 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <Code className="w-3.5 h-3.5 text-teal-500" />
                HTML Table
              </Button>
            </div>
          </div>

          {/* Parsing Controls */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Settings</Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasHeader"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="hasHeader" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                First row contains headers
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trimCells"
                checked={trimCells}
                onChange={(e) => setTrimCells(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="trimCells" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Trim spaces in cells
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="removeEmpty"
                checked={removeEmptyRows}
                onChange={(e) => setRemoveEmptyRows(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="removeEmpty" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Remove empty lines
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoPad"
                checked={autoPadColumns}
                onChange={(e) => setAutoPadColumns(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="autoPad" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Ensure uniform column size
              </Label>
            </div>
          </div>

          {/* Matrix Stats */}
          {inputText && (
            <Card className="bg-slate-50 border shadow-2xs">
              <CardContent className="p-4 space-y-1.5 text-[10px] text-slate-500 leading-normal">
                <div className="font-bold text-slate-700 mb-1">Matrix Structure</div>
                <div>Data Rows: <span className="font-mono text-slate-800">{stats.rows}</span></div>
                <div>Columns: <span className="font-mono text-slate-800">{stats.cols}</span></div>
                <div>Total Cells: <span className="font-mono text-slate-800">{stats.cells}</span></div>
              </CardContent>
            </Card>
          )}
        </div>
      }
      previewContent={
        <div className="flex flex-col md:flex-row gap-6 w-full h-[calc(100vh-140px)] min-h-[300px]">
          {/* Input Panel */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-slate-400" />
                1. Input Raw Delimited Text
              </span>
              <div className="flex gap-2.5">
                <div className="flex items-center gap-1 bg-slate-200/50 px-2 py-0.5 rounded text-[10px] text-slate-500 border">
                  <span>Input Delim:</span>
                  <select
                    value={inputDelimiter}
                    onChange={(e) => setInputDelimiter(e.target.value as DelimiterType)}
                    className="bg-transparent border-0 font-semibold text-slate-700 focus:ring-0 p-0 text-[10px]"
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="tab">Tabs</option>
                    <option value="comma">Commas</option>
                    <option value="semicolon">Semicolons</option>
                    <option value="pipe">Pipes</option>
                  </select>
                </div>
                
                <button
                  onClick={loadExample}
                  className="text-xs font-semibold text-primary hover:text-primary/90 hover:underline flex items-center gap-1 cursor-pointer select-none"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Sample
                </button>
                {inputText && (
                  <button
                    onClick={clearAll}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer select-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 p-6 resize-none font-mono text-sm border-0 focus:outline-none focus:ring-0 bg-transparent text-slate-800"
              placeholder="Paste raw csv/tsv/pipe lines with potential quote escapes or nested separators..."
            />
          </div>

          {/* Output Panel with Tab Control */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <div className="flex gap-1.5 bg-slate-200/60 p-0.5 rounded-lg border">
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                    activeTab === "raw" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" /> Raw Formatted
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  disabled={parsedGrid.length === 0}
                  className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                    activeTab === "preview" 
                      ? "bg-white text-slate-800 shadow-2xs" 
                      : "text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <Table className="w-3.5 h-3.5" /> Table Grid
                </button>
              </div>

              <Button
                disabled={!outputText}
                onClick={handleCopy}
                size="sm"
                className="h-8 gap-1 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Output"}
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              {activeTab === "raw" ? (
                <textarea
                  readOnly
                  value={outputText}
                  className="w-full h-full p-6 resize-none font-mono text-sm border-0 focus:outline-none focus:ring-0 bg-slate-50/20 text-slate-700 cursor-text"
                  placeholder="Sanitized data formatted in your target selection will display here..."
                />
              ) : (
                <div className="w-full h-full overflow-auto p-4 bg-card/100">
                  <table className="min-w-full border-collapse border border-slate-200 text-xs text-left bg-white shadow-2xs rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        {detectedHeaders.map((header, colIdx) => (
                          <th key={colIdx} className="p-2.5 border-r border-slate-200 truncate">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedGrid.slice(hasHeader ? 1 : 0).map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50/60 transition-colors">
                          {row.map((cell, colIdx) => (
                            <td 
                              key={colIdx} 
                              className="p-2.5 border-r border-slate-200 font-sans text-slate-600"
                            >
                              <span className="block truncate max-w-[200px]">
                                {cell}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}
