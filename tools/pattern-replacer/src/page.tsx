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
  RefreshCw,
  Search,
  Eye,
  Settings
} from "lucide-react"

const MOCK_REPLACE_TEXT = `Dear Client,

We are writing to confirm your order of Product_A.
Product_A has been shipped to your office address.
Please review the shipment details for Product_A at your earliest convenience.

Notes:
\t- Shipment takes 2-3 business days.
\t- Double check invoice details.  (Ensure no typos)

Sincerely,
TinyTask Support Team`

export default function PatternReplacerPage() {
  const [inputText, setInputText] = useState(MOCK_REPLACE_TEXT.trim())
  const [outputText, setOutputText] = useState("")
  
  const [findText, setFindText] = useState("Product_A")
  const [replaceText, setReplaceText] = useState("SuperTask Pro")
  
  const [matchCase, setMatchCase] = useState(true)
  const [wholeWords, setWholeWords] = useState(false)
  const [isRegex, setIsRegex] = useState(false)
  
  const [replaceTabs, setReplaceTabs] = useState(false)
  const [replaceNewlines, setReplaceNewlines] = useState(false)
  const [collapseSpaces, setCollapseSpaces] = useState(false)
  
  const [regexError, setRegexError] = useState("")
  const [matchCount, setMatchCount] = useState(0)
  
  const [activeTab, setActiveTab] = useState<"raw" | "preview">("raw")
  const [copied, setCopied] = useState(false)

  // Core find and replace processing engine
  useEffect(() => {
    if (!inputText) {
      setOutputText("")
      setMatchCount(0)
      setRegexError("")
      return
    }

    let workingText = inputText
    setRegexError("")

    // 1. Process plain-English replacements
    if (replaceTabs) {
      workingText = workingText.replace(/\t/g, replaceText)
    }
    if (replaceNewlines) {
      workingText = workingText.replace(/\r?\n/g, replaceText)
    }
    if (collapseSpaces) {
      workingText = workingText.replace(/ {2,}/g, " ")
    }

    // 2. Process Custom Find & Replace
    if (findText) {
      try {
        let pattern = findText
        if (!isRegex) {
          pattern = findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
          if (wholeWords) {
            pattern = `\\b${pattern}\\b`
          }
        }

        let flags = "g"
        if (!matchCase) flags += "i"

        const regex = new RegExp(pattern, flags)
        
        // Count matches
        const matches = workingText.match(regex)
        setMatchCount(matches ? matches.length : 0)

        // Perform replacement
        workingText = workingText.replace(regex, replaceText)
      } catch (err: any) {
        setRegexError(err.message || "Invalid regular expression pattern.")
        setMatchCount(0)
      }
    } else {
      setMatchCount(0)
    }

    setOutputText(workingText)

  }, [inputText, findText, replaceText, matchCase, wholeWords, isRegex, replaceTabs, replaceNewlines, collapseSpaces])

  // Highlights matches in yellow for the visual highlighter view
  const highlightMatches = (text: string): string => {
    if (!text || !findText) return text

    try {
      let pattern = findText
      if (!isRegex) {
        pattern = findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
        if (wholeWords) {
          pattern = `\\b${pattern}\\b`
        }
      }

      let flags = "g"
      if (!matchCase) flags += "i"

      const regex = new RegExp(pattern, flags)
      
      // Escape HTML tags to prevent broken preview rendering
      let escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

      return escaped.replace(regex, (match) => {
        return `<mark class="bg-yellow-200 text-slate-800 px-0.5 rounded-xs select-all font-bold">${match}</mark>`
      })
    } catch {
      return text
    }
  }

  const loadExample = () => {
    setInputText(MOCK_REPLACE_TEXT)
    setFindText("Product_A")
    setReplaceText("SuperTask Pro")
    setReplaceTabs(false)
    setReplaceNewlines(false)
    setCollapseSpaces(false)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setFindText("")
    setReplaceText("")
    setMatchCount(0)
    setRegexError("")
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="Find & Replace with Patterns"
      description="Find and replace text using custom text, regex patterns, or plain-English checkboxes (Tabs, Line Breaks, double spaces) with yellow highlights."
      sidebarContent={
        <div className="space-y-6">
          {/* Custom Find & Replace Form */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-400" /> Find & Replace
            </Label>
            
            <div className="space-y-2">
              <div>
                <Label htmlFor="find" className="text-[10px] text-slate-500 font-semibold">Find</Label>
                <input
                  type="text"
                  id="find"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none font-mono"
                  placeholder="Text or pattern to search..."
                />
              </div>

              <div>
                <Label htmlFor="replace" className="text-[10px] text-slate-500 font-semibold">Replace With</Label>
                <input
                  type="text"
                  id="replace"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none font-mono"
                  placeholder="Text to replace with..."
                />
              </div>
            </div>
          </div>

          {/* Search Options */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-400" /> Search Options
            </Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="matchCase"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="matchCase" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Match Case (Case-Sensitive)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="wholeWords"
                checked={wholeWords}
                disabled={isRegex}
                onChange={(e) => setWholeWords(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring disabled:opacity-50"
              />
              <Label htmlFor="wholeWords" className="text-xs font-medium text-slate-600 cursor-pointer select-none disabled:opacity-50">
                Whole Words Only
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isRegex"
                checked={isRegex}
                onChange={(e) => setIsRegex(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="isRegex" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Treat Find as Regex
              </Label>
            </div>
          </div>

          {/* Plain-English Presets */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Plain-English Shortcuts</Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="replaceTabs"
                checked={replaceTabs}
                onChange={(e) => setReplaceTabs(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="replaceTabs" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Replace Tab Characters (\\t)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="replaceNewlines"
                checked={replaceNewlines}
                onChange={(e) => setReplaceNewlines(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="replaceNewlines" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Replace Newlines (\\n)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="collapseSpaces"
                checked={collapseSpaces}
                onChange={(e) => setCollapseSpaces(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="collapseSpaces" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Collapse duplicate spaces
              </Label>
            </div>
          </div>

          {/* Regex Error Warnings */}
          {regexError && (
            <div className="text-[10px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 font-mono leading-relaxed">
              <strong>Regex Error:</strong> {regexError}
            </div>
          )}

          {/* Stats Summary */}
          {inputText && (
            <Card className="bg-slate-50 border shadow-2xs">
              <CardContent className="p-4 space-y-1.5 text-[10px] text-slate-500 leading-normal">
                <div className="font-bold text-slate-700 mb-1">Process Metrics</div>
                <div className="flex justify-between font-bold text-primary">
                  <span>Occurrences Found:</span>
                  <span className="font-mono bg-card px-1.5 py-0.5 rounded border border-border/50">{matchCount}</span>
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
                1. Input Messy Document Text
              </span>
              <div className="flex gap-2">
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
              placeholder="Paste raw text block or code content here..."
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
                  <RefreshCw className="w-3.5 h-3.5" /> Output Text
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  disabled={!inputText || !findText}
                  className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                    activeTab === "preview" 
                      ? "bg-white text-slate-800 shadow-2xs" 
                      : "text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Match Highlighter
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
                  placeholder="Processed output text with all pattern replacements will appear here..."
                />
              ) : (
                <div className="w-full h-full overflow-auto p-6 bg-card/100">
                  <pre 
                    className="font-mono text-sm text-slate-700 whitespace-pre-wrap break-all leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightMatches(inputText) }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}
