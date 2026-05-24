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
  Eye,
  Info
} from "lucide-react"

const MOCK_MESSY_SPACES = `This   is a   sentence with  erratic duplicate   spaces.   
There are trailing spaces on this line.      
   And leading spaces on this one.

There is a non-breaking space here: (hidden)
And some tabs:\t\tseparated\ttext.

We also have zero-width characters:\u200B(here)\uFEFF(and here) that are invisible.`

export default function WhitespaceCompressorPage() {
  const [inputText, setInputText] = useState(MOCK_MESSY_SPACES.trim())
  const [outputText, setOutputText] = useState("")
  
  const [collapseSpaces, setCollapseSpaces] = useState(true)
  const [trimTrailing, setTrimTrailing] = useState(true)
  const [trimLeading, setTrimLeading] = useState(false)
  const [collapseNewlines, setCollapseNewlines] = useState(true)
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false)
  const [stripZeroWidth, setStripZeroWidth] = useState(true)
  const [replaceNbsps, setReplaceNbsps] = useState(true)
  const [tabsToSpaces, setTabsToSpaces] = useState(false)
  const [tabSize, setTabSize] = useState(4)
  
  const [activeTab, setActiveTab] = useState<"raw" | "visual">("raw")
  const [copied, setCopied] = useState(false)
  
  const [stats, setStats] = useState({
    initialChars: 0,
    finalChars: 0,
    spacesCollapsed: 0,
    zeroWidthStripped: 0,
    nbspsReplaced: 0,
    linesRemoved: 0
  })

  // Core whitespace cleaning engine
  useEffect(() => {
    if (!inputText) {
      setOutputText("")
      setStats({
        initialChars: 0,
        finalChars: 0,
        spacesCollapsed: 0,
        zeroWidthStripped: 0,
        nbspsReplaced: 0,
        linesRemoved: 0
      })
      return
    }

    const initialChars = inputText.length
    const initialLines = inputText.split(/\r?\n/).length

    // 1. Gather stats before cleaning
    const zeroWidthMatches = (inputText.match(/[\u200B-\u200D\uFEFF]/g) || []).length
    const nbspMatches = (inputText.match(/\u00A0/g) || []).length
    
    // Simple estimation of duplicate space matches
    let duplicateSpaces = 0
    const spaceRegex = / {2,}/g
    let match
    while ((match = spaceRegex.exec(inputText)) !== null) {
      duplicateSpaces += match[0].length - 1
    }

    let result = inputText

    // 2. Perform conversions in sequence
    
    // Replace non-breaking spaces (nbsp -> standard space)
    if (replaceNbsps) {
      result = result.replace(/\u00A0/g, " ")
    }

    // Strip zero-width characters
    if (stripZeroWidth) {
      result = result.replace(/[\u200B-\u200D\uFEFF]/g, "")
    }

    // Convert tabs to spaces
    if (tabsToSpaces) {
      const spaceFiller = " ".repeat(tabSize)
      result = result.replace(/\t/g, spaceFiller)
    }

    // Split into lines for line-by-line processing
    let lines = result.split(/\r?\n/)

    // Trim trailing and leading spaces
    lines = lines.map(line => {
      let l = line
      if (trimTrailing) {
        l = l.replace(/[ \t]+$/, "")
      }
      if (trimLeading) {
        l = l.replace(/^[ \t]+/, "")
      }
      return l
    })

    // Remove empty lines entirely if checked
    if (removeEmptyLines) {
      lines = lines.filter(line => line.length > 0)
    }

    let joined = lines.join("\n")

    // Collapse multiple blank lines
    if (collapseNewlines && !removeEmptyLines) {
      joined = joined.replace(/\n{3,}/g, "\n\n")
    }

    // Collapse multiple spaces into single space
    if (collapseSpaces) {
      joined = joined.replace(/ {2,}/g, " ")
    }

    const finalChars = joined.length
    const finalLines = joined.split("\n").length
    const linesRemoved = initialLines > finalLines ? initialLines - finalLines : 0

    setOutputText(joined)
    setStats({
      initialChars,
      finalChars,
      spacesCollapsed: duplicateSpaces,
      zeroWidthStripped: zeroWidthMatches,
      nbspsReplaced: nbspMatches,
      linesRemoved
    })

  }, [inputText, collapseSpaces, trimTrailing, trimLeading, collapseNewlines, removeEmptyLines, stripZeroWidth, replaceNbsps, tabsToSpaces, tabSize])

  // Custom visual space formatter
  const highlightWhitespace = (text: string): string => {
    if (!text) return ""

    // Escape HTML symbols first
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

    // Replace spaces with middle dots (·)
    escaped = escaped.replace(/ /g, '<span class="text-indigo-400/60 font-bold select-none">·</span>')

    // Replace tabs with right arrows (→)
    escaped = escaped.replace(/\t/g, '<span class="text-emerald-500/50 font-bold select-none">→\t</span>')

    // Replace linebreaks with return symbol (↵)
    escaped = escaped.split("\n").map(line => {
      return line + '<span class="text-slate-500/70 select-none ml-0.5">↵</span>'
    }).join("\n")

    return escaped
  }

  const loadExample = () => {
    setInputText(MOCK_MESSY_SPACES)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="Whitespace Compressor"
      description="Clean formatting by collapsing multiple spaces, trimming line tails, stripping invisible editor characters, and normalizing tabs."
      sidebarContent={
        <div className="space-y-6">
          {/* Cleaning Toggles */}
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Compression Settings</Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="collapseSpaces"
                checked={collapseSpaces}
                onChange={(e) => setCollapseSpaces(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="collapseSpaces" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Collapse Multiple Spaces
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trimTrailing"
                checked={trimTrailing}
                onChange={(e) => setTrimTrailing(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="trimTrailing" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Trim Line Ends (Trailing)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trimLeading"
                checked={trimLeading}
                onChange={(e) => setTrimLeading(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="trimLeading" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Trim Line Starts (Leading)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="collapseNewlines"
                checked={collapseNewlines}
                disabled={removeEmptyLines}
                onChange={(e) => setCollapseNewlines(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <Label htmlFor="collapseNewlines" className="text-xs font-medium text-slate-600 cursor-pointer select-none disabled:opacity-50">
                Collapse Multiple Newlines
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="removeEmpty"
                checked={removeEmptyLines}
                onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="removeEmpty" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Remove All Empty Lines
              </Label>
            </div>
          </div>

          {/* Hidden Character Settings */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hidden & Special Characters</Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="stripZeroWidth"
                checked={stripZeroWidth}
                onChange={(e) => setStripZeroWidth(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="stripZeroWidth" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Strip Zero-Width (Invisible)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="replaceNbsps"
                checked={replaceNbsps}
                onChange={(e) => setReplaceNbsps(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="replaceNbsps" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Normalize Non-Breaking Spaces
              </Label>
            </div>

            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="tabsToSpaces"
                  checked={tabsToSpaces}
                  onChange={(e) => setTabsToSpaces(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="tabsToSpaces" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                  Convert Tabs to Spaces
                </Label>
              </div>

              {tabsToSpaces && (
                <div className="flex items-center gap-2 pl-7 mt-1.5">
                  <Label htmlFor="tabSize" className="text-[10px] text-slate-500">Tab Width:</Label>
                  <select
                    id="tabSize"
                    value={tabSize}
                    onChange={(e) => setTabSize(Number(e.target.value))}
                    className="rounded border border-slate-200 text-[10px] px-1 py-0.5 focus:outline-none"
                  >
                    <option value={2}>2 Spaces</option>
                    <option value={4}>4 Spaces</option>
                    <option value={8}>8 Spaces</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Savings / Stats Cards */}
          {inputText && (
            <Card className="bg-slate-50 border shadow-2xs">
              <CardContent className="p-4 space-y-2.5 text-xs">
                <div className="font-bold text-slate-700 uppercase tracking-wide text-[10px] text-slate-400">Sanitation Metrics</div>
                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Initial Characters:</span>
                    <span className="font-mono text-slate-700 font-semibold">{stats.initialChars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaned Characters:</span>
                    <span className="font-mono text-slate-700 font-semibold">{stats.finalChars}</span>
                  </div>
                  <div className="flex justify-between font-bold text-indigo-600 border-t pt-1.5 mt-1.5">
                    <span>Total Bytes Saved:</span>
                    <span>{stats.initialChars - stats.finalChars} chars</span>
                  </div>
                </div>

                <div className="border-t pt-2.5 space-y-1.5 text-[10px] text-slate-500 leading-normal">
                  {stats.spacesCollapsed > 0 && (
                    <div>Collapsed <span className="font-bold text-indigo-600 font-mono">{stats.spacesCollapsed}</span> duplicate spaces.</div>
                  )}
                  {stats.zeroWidthStripped > 0 && (
                    <div className="text-rose-600 font-semibold">Removed <span className="font-mono">{stats.zeroWidthStripped}</span> invisible zero-width chars.</div>
                  )}
                  {stats.nbspsReplaced > 0 && (
                    <div>Replaced <span className="font-mono">{stats.nbspsReplaced}</span> non-breaking spaces.</div>
                  )}
                  {stats.linesRemoved > 0 && (
                    <div>Removed <span className="font-mono">{stats.linesRemoved}</span> empty line breaks.</div>
                  )}
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
                1. Input Messy Whitespace Text
              </span>
              <div className="flex gap-2">
                <button
                  onClick={loadExample}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer select-none"
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
              placeholder="Paste raw text or programming snippets to strip double-spaces, tabs, newlines, and hidden characters..."
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
                  <Code className="w-3.5 h-3.5" /> Clean Raw
                </button>
                <button
                  onClick={() => setActiveTab("visual")}
                  disabled={!outputText}
                  className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                    activeTab === "visual" 
                      ? "bg-white text-slate-800 shadow-2xs" 
                      : "text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Highlighter
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
                  placeholder="Sanitized clean text will display here..."
                />
              ) : (
                <div className="w-full h-full overflow-auto p-6 bg-slate-950/95">
                  <pre 
                    className="font-mono text-xs text-slate-300 whitespace-pre-wrap break-all leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightWhitespace(outputText) }}
                  />
                  
                  <div className="mt-4 flex flex-col gap-1.5 p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px] text-slate-400 font-semibold leading-relaxed">
                    <div className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Whitespace Marker Key:</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] pt-1 pl-5">
                      <div>Spaces = <span className="text-indigo-400 font-bold">·</span></div>
                      <div>Tabs = <span className="text-emerald-500 font-bold">→</span></div>
                      <div>Line Ends = <span className="text-slate-500 font-bold">↵</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}
