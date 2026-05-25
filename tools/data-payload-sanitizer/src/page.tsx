"use client"

import React, { useState, useEffect, useRef } from "react"
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
  ShieldCheck, 
  FileCode,
  Files,
  Scale
} from "lucide-react"

const MOCK_BLOATED_HTML = `<html>
<head>
<meta name=Generator content="Microsoft Word 15">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"MS Mincho";
	panose-1:2 2 6 9 4 2 5 8 3 4;}
p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0in;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;
	mso-fareast-font-family:"MS Mincho";
	color:#1F497D;}
-->
</style>
</head>
<body lang=EN-US style='word-wrap:break-word'>
<div class=WordSection1>
<p class=MsoNormal><span style='font-size:12.0pt;font-family:"Arial",sans-serif;color:black'>
This is the clean text that was preserved inside the bloated payload.
</span></p>
</div>
</body>
</html>`

const MOCK_PLAIN_TEXT = `This is the clean text that was preserved inside the bloated payload.`

export default function DataPayloadSanitizerPage() {
  const [rawHtml, setRawHtml] = useState(MOCK_BLOATED_HTML)
  const [sanitizedText, setSanitizedText] = useState(MOCK_PLAIN_TEXT)
  
  const [autoCopy, setAutoCopy] = useState(true)
  const [collapseNewlines, setCollapseNewlines] = useState(false)
  const [trimWhitespace, setTrimWhitespace] = useState(false)
  
  const [copied, setCopied] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  
  const [sizes, setSizes] = useState({
    htmlBytes: 660,
    textBytes: 68,
    savings: 592,
    ratio: 9.7
  })

  const pasteAreaRef = useRef<HTMLTextAreaElement>(null)

  const getByteSize = (str: string): number => {
    try {
      return new Blob([str]).size
    } catch {
      return str.length
    }
  }

  // Intercept paste events
  const handlePaste = (e: React.ClipboardEvent<any>) => {
    e.preventDefault()
    
    const htmlData = e.clipboardData.getData("text/html") || ""
    let textData = e.clipboardData.getData("text/plain") || ""

    if (!textData) {
      setToastMessage("Pasted content has no text payload.")
      setTimeout(() => setToastMessage(""), 3000)
      return
    }

    // Apply cleaning parameters
    let cleaned = textData
    if (collapseNewlines) {
      cleaned = cleaned.replace(/\n{3,}/g, "\n\n")
    }
    if (trimWhitespace) {
      cleaned = cleaned.trim().split("\n").map(line => line.trim()).join("\n")
    }

    setRawHtml(htmlData)
    setSanitizedText(cleaned)

    const htmlBytes = getByteSize(htmlData)
    const textBytes = getByteSize(cleaned)
    const savings = htmlBytes > textBytes ? htmlBytes - textBytes : 0
    const ratio = textBytes > 0 ? htmlBytes / textBytes : 1

    setSizes({
      htmlBytes,
      textBytes,
      savings,
      ratio
    })

    if (autoCopy) {
      navigator.clipboard.writeText(cleaned)
      setCopied(true)
      setToastMessage("Sanitized text automatically copied to clipboard!")
      setTimeout(() => {
        setCopied(false)
        setToastMessage("")
      }, 3000)
    } else {
      setToastMessage("Data sanitized successfully!")
      setTimeout(() => setToastMessage(""), 2000)
    }
  }

  const loadExample = () => {
    setRawHtml(MOCK_BLOATED_HTML)
    setSanitizedText(MOCK_PLAIN_TEXT)
    
    const htmlBytes = getByteSize(MOCK_BLOATED_HTML)
    const textBytes = getByteSize(MOCK_PLAIN_TEXT)
    const savings = htmlBytes - textBytes
    const ratio = htmlBytes / textBytes

    setSizes({
      htmlBytes,
      textBytes,
      savings,
      ratio
    })
  }

  const clearAll = () => {
    setRawHtml("")
    setSanitizedText("")
    setSizes({
      htmlBytes: 0,
      textBytes: 0,
      savings: 0,
      ratio: 1
    })
    setToastMessage("")
  }

  const manualCopy = () => {
    if (!sanitizedText) return
    navigator.clipboard.writeText(sanitizedText)
    setCopied(true)
    setToastMessage("Copied to clipboard!")
    setTimeout(() => {
      setCopied(false)
      setToastMessage("")
    }, 2000)
  }

  // Formatting byte values
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizesArr = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizesArr[i]
  }

  return (
    <ToolLayout
      title="Data Payload Sanitizer"
      description="Paste rich-text copies from Word, Excel, or Outlook to immediately strip out hidden HTML/XML formatting and obtain clean plain text."
      sidebarContent={
        <div className="space-y-6">
          {/* Cleaning Toggles */}
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sanitation Rules</Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoCopy"
                checked={autoCopy}
                onChange={(e) => setAutoCopy(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="autoCopy" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Auto-Copy Clean Text on Paste
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="collapseNewlines"
                checked={collapseNewlines}
                onChange={(e) => setCollapseNewlines(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="collapseNewlines" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Collapse Multiple Blank Lines
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
                Trim Inner/Outer Indents
              </Label>
            </div>
          </div>

          {/* Size statistics / bloat gauges */}
          {sanitizedText && (
            <Card className="bg-slate-50 border shadow-2xs">
              <CardContent className="p-4 space-y-4 text-xs">
                <div>
                  <div className="font-bold text-slate-700 mb-2 uppercase tracking-wide text-[10px] text-slate-400">Payload Comparison</div>
                  <div className="space-y-1.5 text-[11px] text-slate-500">
                    <div className="flex justify-between">
                      <span>Raw HTML Weight:</span>
                      <span className="font-mono text-slate-700 font-semibold">{formatBytes(sizes.htmlBytes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plain Text Weight:</span>
                      <span className="font-mono text-slate-700 font-semibold">{formatBytes(sizes.textBytes)}</span>
                    </div>
                  </div>
                </div>

                {sizes.savings > 0 && (
                  <div className="border-t pt-3 space-y-2.5">
                    <div className="flex justify-between text-[11px] font-bold text-emerald-600">
                      <span>Bloat Stripped:</span>
                      <span>{formatBytes(sizes.savings)} ({((sizes.savings / sizes.htmlBytes) * 100).toFixed(1)}%)</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(sizes.savings / sizes.htmlBytes) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-white p-2 rounded border border-slate-100 font-medium">
                      <Scale className="w-3.5 h-3.5 text-primary" />
                      Original payload was <span className="font-bold text-primary font-mono">{sizes.ratio.toFixed(1)}x</span> heavier.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      }
      previewContent={
        <div className="flex flex-col gap-6 w-full h-[calc(100vh-140px)] min-h-[400px]">
          {/* Paste Dropzone Box */}
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center relative group hover:border-primary transition-colors shadow-2xs">
            <input
              type="text"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onPaste={handlePaste}
              placeholder="Paste trigger input"
            />
            <div className="pointer-events-none flex flex-col items-center max-w-md space-y-2">
              <div className="p-3 bg-card rounded-2xl border border-border/50 group-hover:scale-105 transition-transform">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-bold text-slate-700">Paste Rich Document Content Here</span>
              <p className="text-xs text-slate-500">
                Click here and press <kbd className="bg-slate-100 border px-1.5 py-0.5 rounded font-mono text-[10px] shadow-2xs font-semibold text-slate-700">Cmd+V</kbd> or <kbd className="bg-slate-100 border px-1.5 py-0.5 rounded font-mono text-[10px] shadow-2xs font-semibold text-slate-700">Ctrl+V</kbd> to intercept clipboard formats.
              </p>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={loadExample}
                  className="pointer-events-auto text-xs font-bold text-primary hover:text-primary/90 hover:underline flex items-center gap-1 cursor-pointer select-none"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Sample Office Bloat
                </button>
                {(rawHtml || sanitizedText) && (
                  <button
                    onClick={clearAll}
                    className="pointer-events-auto text-xs font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer select-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Result split panels */}
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
            {/* Sanitized Text Panel */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Preserved Plain Text
                </span>
                <Button
                  disabled={!sanitizedText}
                  onClick={manualCopy}
                  size="sm"
                  className="h-8 gap-1 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Output"}
                </Button>
              </div>
              
              <textarea
                readOnly
                value={sanitizedText}
                className="flex-1 p-6 resize-none font-mono text-sm border-0 focus:outline-none focus:ring-0 bg-slate-50/10 text-slate-700 cursor-text"
                placeholder="Sanitized plain text payload will display here..."
              />
            </div>

            {/* Bloated XML/HTML Panel */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-primary/70" />
                  Stripped HTML/CSS Structure ({formatBytes(sizes.htmlBytes)})
                </span>
              </div>
              
              <textarea
                readOnly
                value={rawHtml || "No bloated HTML detected in clipboard (plain text only)."}
                className="flex-1 p-6 resize-none font-mono text-xs border-0 focus:outline-none focus:ring-0 bg-slate-900 text-slate-400 select-all cursor-text leading-relaxed"
                placeholder="Stripped CSS stylesheets and office tags will display here for comparison..."
              />
            </div>
          </div>

          {/* Custom Notification Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              {toastMessage}
            </div>
          )}
        </div>
      }
    />
  )
}
