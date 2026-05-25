"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@tinytask/ui/buttons/button"
import { Label } from "@tinytask/ui/forms/label"
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout"
import { 
  Clipboard, 
  Check, 
  Trash2, 
  Sparkles, 
  Scissors,
  List,
  ListOrdered,
  Eraser,
  ListChecks,
  ListPlus
} from "lucide-react"

type ListStyle = "none" | "dash" | "star" | "numbered" | "original"

const MOCK_MESSY_LIST = `   •   Strawberry Jam - Batch 4
        - Blueberry Preserves (labeled)
     * Marmalade orange marmalade
   1.   Apple Compote
   2) Pear Spread
  [ ] Peach Butter
  [x] Fig Spread
  
  Note: Check jars for cracks before filling.
      - Wash rings and lids.
`

export default function ListUnbreakerPage() {
  const [inputText, setInputText] = useState(MOCK_MESSY_LIST.trim())
  const [outputText, setOutputText] = useState("")
  
  const [listStyle, setListStyle] = useState<ListStyle>("dash")
  const [stripEmptyLines, setStripEmptyLines] = useState(true)
  const [collapseSpaces, setCollapseSpaces] = useState(true)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [forceListPrefix, setForceListPrefix] = useState(false)
  
  const [copied, setCopied] = useState(false)
  const [linesUnbroken, setLinesUnbroken] = useState(0)

  // Performs formatting and left alignment
  const processText = (
    rawText: string,
    style: ListStyle,
    stripEmpty: boolean,
    collapseSps: boolean,
    trimWhitespc: boolean,
    forcePrefix: boolean
  ) => {
    if (!rawText) {
      setOutputText("")
      setLinesUnbroken(0)
      return
    }

    const lines = rawText.split(/\r?\n/)
    let listIndex = 1
    const outputLines: string[] = []
    let modifiedCount = 0

    // Regex to detect bullet/number patterns at the beginning of a string
    const bulletRegex = /^([-*+•◦⬦▪▫\u2022\u2023\u2043\u25E6\u25C9\u25CB\u25A0\u25C6\u25C7\u25C8]|\[[ xX]?\]|[-*+•]?\s*\[[ xX]?\]|\(?\d+[\.)\]]|\(?\w+[\.)\]])[\s\t]*/

    lines.forEach(line => {
      let cleanLine = trimWhitespc ? line.trim() : line
      
      if (stripEmpty && cleanLine === "") {
        return
      }

      // Try to match bullet/list symbol
      const bulletMatch = cleanLine.match(bulletRegex)
      
      let textContent = cleanLine
      let originalSymbol = ""
      const isBullet = !!bulletMatch

      if (isBullet && bulletMatch) {
        originalSymbol = bulletMatch[1]
        textContent = cleanLine.substring(bulletMatch[0].length)
      }

      // Collapse multiple spaces inside the text content
      if (collapseSps) {
        textContent = textContent.replace(/ {2,}/g, " ").replace(/\t+/g, " ")
      }

      if (trimWhitespc) {
        textContent = textContent.trim()
      }

      let finalLine = ""

      // Format based on style choice
      if (style === "none") {
        finalLine = textContent
        if (isBullet) modifiedCount++
      } else if (style === "dash") {
        if (isBullet || forcePrefix) {
          finalLine = `- ${textContent}`
          if (!isBullet || originalSymbol !== "-") modifiedCount++
        } else {
          finalLine = textContent
        }
      } else if (style === "star") {
        if (isBullet || forcePrefix) {
          finalLine = `* ${textContent}`
          if (!isBullet || originalSymbol !== "*") modifiedCount++
        } else {
          finalLine = textContent
        }
      } else if (style === "numbered") {
        if (isBullet || forcePrefix) {
          finalLine = `${listIndex}. ${textContent}`
          listIndex++
          modifiedCount++
        } else {
          finalLine = textContent
        }
      } else if (style === "original") {
        if (isBullet) {
          finalLine = `${originalSymbol} ${textContent}`
        } else if (forcePrefix) {
          finalLine = `- ${textContent}`
          modifiedCount++
        } else {
          finalLine = textContent
        }
      } else {
        finalLine = cleanLine
      }

      outputLines.push(finalLine)
    })

    setOutputText(outputLines.join("\n"))
    setLinesUnbroken(modifiedCount || outputLines.length)
  }

  // Sync inputs with engine state
  useEffect(() => {
    processText(
      inputText, 
      listStyle, 
      stripEmptyLines, 
      collapseSpaces, 
      trimWhitespace, 
      forceListPrefix
    )
  }, [inputText, listStyle, stripEmptyLines, collapseSpaces, trimWhitespace, forceListPrefix])

  const loadExample = () => {
    setInputText(MOCK_MESSY_LIST.trim())
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setLinesUnbroken(0)
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="Plain-Text List Un-breaker"
      description="Clean up erratically indented lines, strip erratic tab spaces, and format nested lists into aligned bullet points."
      sidebarContent={
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">List Style</Label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={listStyle === "dash" ? "default" : "outline"}
                onClick={() => setListStyle("dash")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <List className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-semibold">Dashed List (- )</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Force standard plain-text dashes</div>
                </div>
              </Button>

              <Button
                variant={listStyle === "star" ? "default" : "outline"}
                onClick={() => setListStyle("star")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <ListPlus className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-semibold">Star List (* )</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Force asterisk bullet formatting</div>
                </div>
              </Button>

              <Button
                variant={listStyle === "numbered" ? "default" : "outline"}
                onClick={() => setListStyle("numbered")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <ListOrdered className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="font-semibold">Numbered Sequence</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Reset lists to 1. 2. 3. format</div>
                </div>
              </Button>

              <Button
                variant={listStyle === "original" ? "default" : "outline"}
                onClick={() => setListStyle("original")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <ListChecks className="w-4 h-4 text-cyan-500" />
                <div>
                  <div className="font-semibold">Retain Symbols</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Left-align but keep original bullet</div>
                </div>
              </Button>

              <Button
                variant={listStyle === "none" ? "default" : "outline"}
                onClick={() => setListStyle("none")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <Eraser className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="font-semibold">No Bullets / Indents</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Strip formatting and align text left</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Settings</Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="stripEmpty"
                checked={stripEmptyLines}
                onChange={(e) => setStripEmptyLines(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="stripEmpty" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Remove Empty Lines
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
                Collapse Duplicate Spaces
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trimWhitespace"
                checked={trimWhitespace}
                onChange={(e) => setTrimWhitespace(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="trimWhitespace" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Trim Indent Whitespace
              </Label>
            </div>

            <div className="flex items-center gap-3 border-t pt-3">
              <input
                type="checkbox"
                id="forceList"
                checked={forceListPrefix}
                onChange={(e) => setForceListPrefix(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="forceList" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                Force Lists On All Lines
              </Label>
            </div>
          </div>

          {inputText && (
            <div className="text-[10px] text-muted-foreground bg-slate-50 p-3 rounded-lg border leading-relaxed">
              <strong>Process Metrics:</strong> Snapped and reformatted {linesUnbroken} lines back to the left margin margin.
            </div>
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
                1. Input Messy Document Lines
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
              placeholder="Paste text with erratic line spacing, tabs, or bullet lists..."
            />
          </div>

          {/* Clean Output Panel */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <List className="w-3.5 h-3.5 text-slate-400" />
                2. Aligned Clean List Output
              </span>
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
            
            <textarea
              readOnly
              value={outputText}
              className="flex-1 p-6 resize-none font-mono text-sm border-0 focus:outline-none focus:ring-0 bg-slate-50/20 text-slate-700 cursor-text"
              placeholder="Your left-aligned and bullet-cleaned output list will appear here..."
            />
          </div>
        </div>
      }
    />
  )
}
