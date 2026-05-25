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
  FileSpreadsheet, 
  Table, 
  Code,
  AlertTriangle,
  HelpCircle
} from "lucide-react"

type ProtectionMethod = "formula" | "quote" | "csv-quote"
type ScopeMode = "all" | "smart" | "selected"
type MatchLogic = "all-cells" | "prone-cells"
type DelimiterType = "tab" | "comma" | "semicolon" | "auto"

const MOCK_MESSY_TABLE = `ID\tZIP Code\tProduct Code\tOrder Date\tScientific ID
001\t02138\tMAR1\t12-15\t3E02
002\t07030\tFEB2\t11-30\t1E04
003\t90210\tAPR15\t10-24\t8.2E10
004\t00912\tOCT9\t09-12\t9.5E07`

export default function StringIntegrityPreserverPage() {
  const [inputText, setInputText] = useState(MOCK_MESSY_TABLE)
  const [outputText, setOutputText] = useState("")
  
  const [inputDelimiter, setInputDelimiter] = useState<DelimiterType>("auto")
  const [outputDelimiter, setOutputDelimiter] = useState<"tab" | "comma" | "semicolon">("tab")
  
  const [hasHeader, setHasHeader] = useState(true)
  const [method, setMethod] = useState<ProtectionMethod>("formula")
  const [scope, setScope] = useState<ScopeMode>("smart")
  const [matchLogic, setMatchLogic] = useState<MatchLogic>("prone-cells")
  
  const [selectedColumns, setSelectedColumns] = useState<Record<number, boolean>>({})
  const [activeTab, setActiveTab] = useState<"raw" | "preview">("raw")
  
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    rows: 0,
    cols: 0,
    protectedCells: 0
  })

  // Parsed representation of grid and modified flags
  const [parsedGrid, setParsedGrid] = useState<{ value: string; isProtected: boolean; original: string }[][]>([])
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([])

  // Detection patterns
  const hasLeadingZero = (val: string): boolean => {
    return /^0\d+$/.test(val) && val.length > 1
  }

  const isScientificNotation = (val: string): boolean => {
    return /^\d+(\.\d+)?[eE]\d+$/.test(val)
  }

  const isDateLike = (val: string): boolean => {
    const lower = val.toLowerCase().trim()
    const months = "jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec"
    const monthRegex = new RegExp(`^(${months})\\d+$|^\\d+(${months})$|^(${months})[-/\\s]\\d+`, "i")
    const numericDateRegex = /^\d+[-/]\d+([-/]\d+)?$/
    return monthRegex.test(lower) || numericDateRegex.test(lower)
  }

  const isProneToMutation = (val: string): boolean => {
    const trimmed = val.trim()
    if (!trimmed) return false
    return hasLeadingZero(trimmed) || isScientificNotation(trimmed) || isDateLike(trimmed)
  }

  // Auto-detect delimiter
  const getDelimiterChar = (text: string, type: DelimiterType): string => {
    if (type !== "auto") {
      if (type === "tab") return "\t"
      if (type === "semicolon") return ";"
      return ","
    }
    
    // Auto detection
    const lines = text.slice(0, 5000).split(/\r?\n/)
    let tabs = 0
    let commas = 0
    let semicolons = 0
    
    for (const line of lines) {
      tabs += (line.match(/\t/g) || []).length
      commas += (line.match(/,/g) || []).length
      semicolons += (line.match(/;/g) || []).length
    }
    
    if (tabs >= commas && tabs >= semicolons) return "\t"
    if (commas >= tabs && commas >= semicolons) return ","
    return ";"
  }

  // Parse input and process protection
  useEffect(() => {
    if (!inputText.trim()) {
      setParsedGrid([])
      setDetectedHeaders([])
      setOutputText("")
      setStats({ rows: 0, cols: 0, protectedCells: 0 })
      return
    }

    const delim = getDelimiterChar(inputText, inputDelimiter)
    const lines = inputText.split(/\r?\n/).filter(line => line.trim() !== "")
    if (lines.length === 0) return

    // 1. Split lines into cells
    const rawRows = lines.map(line => line.split(delim))
    
    // 2. Discover max column count
    const colCount = Math.max(...rawRows.map(row => row.length))
    
    // 3. Extract headers if enabled
    let headers: string[] = []
    let dataStartIdx = 0

    if (hasHeader && rawRows.length > 0) {
      headers = rawRows[0]
      // Pad headers to match colCount if necessary
      while (headers.length < colCount) {
        headers.push(`Column ${headers.length + 1}`)
      }
      dataStartIdx = 1
    } else {
      for (let i = 0; i < colCount; i++) {
        headers.push(`Column ${i + 1}`)
      }
    }
    setDetectedHeaders(headers)

    // 4. Process grid cells
    let protectedCount = 0
    const grid = rawRows.map((row, rowIdx) => {
      // Pad rows to match colCount
      const paddedRow = [...row]
      while (paddedRow.length < colCount) {
        paddedRow.push("")
      }

      return paddedRow.map((cell, colIdx) => {
        const isHeaderRow = hasHeader && rowIdx === 0
        if (isHeaderRow) {
          return { value: cell, isProtected: false, original: cell }
        }

        const cleanVal = cell.trim()
        
        // Check if this cell should be protected based on scope & match logic
        let shouldProtect = false

        if (scope === "all") {
          shouldProtect = matchLogic === "all-cells" ? true : isProneToMutation(cleanVal)
        } else if (scope === "smart") {
          shouldProtect = isProneToMutation(cleanVal)
        } else if (scope === "selected") {
          const isColSelected = !!selectedColumns[colIdx]
          if (isColSelected) {
            shouldProtect = matchLogic === "all-cells" ? true : isProneToMutation(cleanVal)
          }
        }

        let finalValue = cell
        if (shouldProtect && cleanVal !== "") {
          protectedCount++
          if (method === "formula") {
            finalValue = `="${cleanVal.replace(/"/g, '""')}"`
          } else if (method === "quote") {
            finalValue = `'${cleanVal}`
          } else if (method === "csv-quote") {
            finalValue = `"${cleanVal.replace(/"/g, '""')}"`
          }
        }

        return {
          value: finalValue,
          isProtected: shouldProtect && cleanVal !== "",
          original: cell
        }
      })
    })

    setParsedGrid(grid)
    
    // 5. Generate raw output text
    const outDelim = outputDelimiter === "tab" ? "\t" : outputDelimiter === "semicolon" ? ";" : ","
    const outputLines = grid.map(row => {
      return row.map(cell => cell.value).join(outDelim)
    })
    
    setOutputText(outputLines.join("\n"))
    setStats({
      rows: grid.length - (hasHeader ? 1 : 0),
      cols: colCount,
      protectedCells: protectedCount
    })

  }, [inputText, inputDelimiter, outputDelimiter, hasHeader, method, scope, matchLogic, selectedColumns])

  // Sync columns checkboxes when grid shape changes
  useEffect(() => {
    if (detectedHeaders.length > 0) {
      const newSelected: Record<number, boolean> = {}
      detectedHeaders.forEach((_, idx) => {
        // default all columns selected for customization
        newSelected[idx] = selectedColumns[idx] !== undefined ? selectedColumns[idx] : true
      })
      setSelectedColumns(newSelected)
    }
  }, [detectedHeaders.length])

  const loadExample = () => {
    setInputText(MOCK_MESSY_TABLE)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setParsedGrid([])
    setDetectedHeaders([])
    setStats({ rows: 0, cols: 0, protectedCells: 0 })
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleColumnSelection = (idx: number) => {
    setSelectedColumns(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const selectAllColumns = (val: boolean) => {
    const updated: Record<number, boolean> = {}
    detectedHeaders.forEach((_, idx) => {
      updated[idx] = val
    })
    setSelectedColumns(updated)
  }

  return (
    <ToolLayout
      title="String Integrity Preserver"
      description="Format Excel, Sheets, and CSV columns as explicit formulas or quoted texts so leading zeros are kept and date auto-conversions are skipped."
      sidebarContent={
        <div className="space-y-6">
          {/* Method Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Protection Method</Label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={method === "formula" ? "default" : "outline"}
                onClick={() => setMethod("formula")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <span className="font-mono text-primary font-bold text-sm">=“A”</span>
                <div>
                  <div className="font-semibold">Excel Formula Wrap</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Wraps as static value formula `="001"`</div>
                </div>
              </Button>

              <Button
                variant={method === "quote" ? "default" : "outline"}
                onClick={() => setMethod("quote")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <span className="font-mono text-emerald-500 font-bold text-sm">'01</span>
                <div>
                  <div className="font-semibold">Single Quote Prefix</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Prepends apostrophe prefix `'01234`</div>
                </div>
              </Button>

              <Button
                variant={method === "csv-quote" ? "default" : "outline"}
                onClick={() => setMethod("csv-quote")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <span className="font-mono text-amber-500 font-bold text-sm">"01"</span>
                <div>
                  <div className="font-semibold">Double Quote Escape</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Standard RFC 4180 CSV quoting `"00912"`</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Scope Selector */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Protection Scope</Label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "smart"}
                  onChange={() => setScope("smart")}
                  className="h-4 w-4 border-slate-300 text-primary focus:ring-ring"
                />
                <div>
                  <span className="font-semibold text-slate-700">Smart Auto-Detect (Recommended)</span>
                  <p className="text-[10px] text-muted-foreground">Only modify values prone to mutation (zeros, dates, e-notation)</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "all"}
                  onChange={() => setScope("all")}
                  className="h-4 w-4 border-slate-300 text-primary focus:ring-ring"
                />
                <div>
                  <span className="font-semibold text-slate-700">All Columns</span>
                  <p className="text-[10px] text-muted-foreground">Process columns based on Match Logic</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "selected"}
                  onChange={() => setScope("selected")}
                  className="h-4 w-4 border-slate-300 text-primary focus:ring-ring"
                />
                <div>
                  <span className="font-semibold text-slate-700">Selected Columns Only</span>
                  <p className="text-[10px] text-muted-foreground">Enable custom checkboxes for specific columns</p>
                </div>
              </label>
            </div>
          </div>

          {/* Match Logic Selection */}
          {scope !== "smart" && (
            <div className="space-y-2 border-t pt-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Logic</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="radio"
                    name="matchLogic"
                    checked={matchLogic === "prone-cells"}
                    onChange={() => setMatchLogic("prone-cells")}
                    className="h-3.5 w-3.5 border-slate-300 text-primary focus:ring-ring"
                  />
                  <span className="text-slate-600">Only Prone Cells</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="radio"
                    name="matchLogic"
                    checked={matchLogic === "all-cells"}
                    onChange={() => setMatchLogic("all-cells")}
                    className="h-3.5 w-3.5 border-slate-300 text-primary focus:ring-ring"
                  />
                  <span className="text-slate-600">All Cells</span>
                </label>
              </div>
            </div>
          )}

          {/* Column Checklist (visible if scope is "selected") */}
          {scope === "selected" && detectedHeaders.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Columns</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => selectAllColumns(true)}
                    className="text-[10px] text-primary hover:underline font-semibold"
                  >
                    All
                  </button>
                  <span className="text-[10px] text-slate-300">|</span>
                  <button
                    onClick={() => selectAllColumns(false)}
                    className="text-[10px] text-primary hover:underline font-semibold"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-50 border rounded-lg">
                {detectedHeaders.map((header, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!selectedColumns[idx]}
                      onChange={() => toggleColumnSelection(idx)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-ring"
                    />
                    <span className="truncate">{header}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Config Settings */}
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
                First Row Contains Headers
              </Label>
            </div>

            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold text-slate-500">Output Delimiter</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={outputDelimiter === "tab" ? "default" : "outline"}
                  onClick={() => setOutputDelimiter("tab")}
                  size="sm"
                  className="text-[10px]"
                >
                  Tab (TSV)
                </Button>
                <Button
                  variant={outputDelimiter === "comma" ? "default" : "outline"}
                  onClick={() => setOutputDelimiter("comma")}
                  size="sm"
                  className="text-[10px]"
                >
                  Comma (CSV)
                </Button>
                <Button
                  variant={outputDelimiter === "semicolon" ? "default" : "outline"}
                  onClick={() => setOutputDelimiter("semicolon")}
                  size="sm"
                  className="text-[10px]"
                >
                  Semicolon
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics summary */}
          {inputText && (
            <Card className="bg-slate-50 border shadow-2xs">
              <CardContent className="p-4 space-y-1.5 text-[10px] text-slate-500 leading-normal">
                <div className="font-bold text-slate-700 mb-1">Protection Summary</div>
                <div>Parsed Rows: <span className="font-mono text-slate-800">{stats.rows}</span></div>
                <div>Detected Columns: <span className="font-mono text-slate-800">{stats.cols}</span></div>
                <div className="flex items-center justify-between text-primary font-bold border-t pt-1.5 mt-1.5">
                  <span>Cells Sanitized:</span>
                  <span className="font-mono bg-card px-1.5 py-0.5 rounded border border-border/50">{stats.protectedCells}</span>
                </div>
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
                1. Paste Tabular / CSV Data
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
              placeholder="Paste rows and columns directly from Excel or Google Sheets (or format as commas/semicolons)..."
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
                  <Code className="w-3.5 h-3.5" /> Raw Output
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
                  placeholder="Processed columns will appear here. Copy and paste back to Excel or Sheets directly..."
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
                              className={`p-2.5 border-r border-slate-200 font-mono transition-colors ${
                                cell.isProtected 
                                  ? "bg-card/100 text-primary border-border/50/50 relative group"
                                  : "text-slate-600"
                              }`}
                            >
                              <span className="block truncate max-w-[200px]">
                                {cell.value}
                              </span>
                              {cell.isProtected && (
                                <div className="absolute right-1 top-1 w-1.5 h-1.5 bg-card0 rounded-full" title="Protected Cell" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {stats.protectedCells > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-primary font-medium bg-card/100 p-2 rounded border border-border/50/30">
                      <AlertTriangle className="w-3.5 h-3.5 text-primary" />
                      Highlighted cells indicate values that are formatted/escaped to prevent automatic spreadsheet conversions.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}
