"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@tinytask/ui/buttons/button"
import { Card, CardContent } from "@tinytask/ui/cards/card"
import { Label } from "@tinytask/ui/forms/label"
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout"
import { 
  Clipboard, 
  Check, 
  Trash2, 
  Sparkles, 
  AlignLeft, 
  FileCode, 
  Scissors, 
  FileText,
  Copy
} from "lucide-react"

type PurgeMode = "plain" | "structure" | "markdown"

const INITIAL_HTML = `<div style="font-family: 'Calibri', sans-serif; font-size: 11pt; color: #1f497d; background-color: #f3f4f6;"><p class="MsoNormal" style="line-height: 150%;"><b><span style="font-size: 14pt; color: #4f46e5;">Welcome to the Style Purger Sample!</span></b></p><p class="MsoNormal">This paragraph has a <span style="background-color: yellow; font-family: 'Courier New';">messy background color highlight</span> and custom styling attributes.</p><ul><li style="margin-left: 10px; color: red;">List item 1 with inline margins and colors.</li><li style="margin-left: 10px; color: blue;">List item 2 with similar formatting.</li></ul></div>`

const INITIAL_TEXT = `Welcome to the Style Purger Sample!
This paragraph has a messy background color highlight and custom styling attributes.
• List item 1 with inline margins and colors.
• List item 2 with similar formatting.`

export default function VisualStylePurgerPage() {
  const [inputText, setInputText] = useState(INITIAL_TEXT)
  const [inputHtml, setInputHtml] = useState(INITIAL_HTML)
  const [outputText, setOutputText] = useState("")
  
  const [purgeMode, setPurgeMode] = useState<PurgeMode>("structure")
  const [stripZeroWidth, setStripZeroWidth] = useState(true)
  const [trimSpacing, setTrimSpacing] = useState(true)
  
  const [copied, setCopied] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [pasteStats, setPasteStats] = useState({
    originalHtmlBytes: 0,
    cleanedBytes: 0,
    reductionPercent: 0,
    isPasted: false
  })

  const pasteAreaRef = useRef<HTMLDivElement>(null)

  // Recursively walks the DOM nodes to sanitize HTML tags and strip inline styles
  const sanitizeHtml = (htmlString: string, mode: PurgeMode, stripZW: boolean, collapseNewlines: boolean): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, "text/html")
    
    const cleanNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || ""
      }
      
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return ""
      }
      
      const el = node as HTMLElement
      const tagName = el.tagName.toUpperCase()
      
      // Recursively process children
      let childrenHtml = ""
      el.childNodes.forEach(child => {
        childrenHtml += cleanNode(child)
      })
      
      // PLAIN TEXT MODE: Convert structural elements to formatting-free returns
      if (mode === "plain") {
        if (["P", "DIV", "TR", "H1", "H2", "H3", "H4", "H5", "H6"].includes(tagName)) {
          return childrenHtml + "\n"
        }
        if (tagName === "BR") {
          return "\n"
        }
        if (tagName === "LI") {
          return "• " + childrenHtml + "\n"
        }
        return childrenHtml
      }
      
      // STRUCTURE MODE: Keep basic HTML tags but discard all attributes/styling
      const allowedTags = [
        "B", "STRONG", "I", "EM", "U", "S", "DEL", 
        "P", "BR", "UL", "OL", "LI", 
        "H1", "H2", "H3", "H4", "H5", "H6", 
        "TABLE", "THEAD", "TBODY", "TR", "TD", "TH"
      ]
      
      if (allowedTags.includes(tagName)) {
        if (tagName === "BR") {
          return "<br />"
        }
        return `<${tagName.toLowerCase()}>${childrenHtml}</${tagName.toLowerCase()}>`
      }
      
      // If block level tag is stripped, append newline to prevent text smash
      if (["DIV", "SECTION", "ARTICLE", "MAIN", "P"].includes(tagName)) {
        return childrenHtml + "\n"
      }
      
      return childrenHtml
    }
    
    let cleaned = ""
    doc.body.childNodes.forEach(node => {
      cleaned += cleanNode(node)
    })
    
    // Apply filters
    if (stripZW) {
      cleaned = cleaned.replace(/\u200B/g, "") // strip zero-width spaces
    }
    
    if (mode === "plain") {
      if (collapseNewlines) {
        cleaned = cleaned.replace(/\r?\n{3,}/g, "\n\n")
      }
      return cleaned.trim()
    }
    
    // For HTML mode, clean up empty paragraphs and normalize spaces
    cleaned = cleaned.replace(/<p><\/p>/g, "").trim()
    return cleaned
  }

  // Convert rich HTML tree elements into standard Markdown syntax
  const htmlToMarkdown = (htmlString: string, stripZW: boolean, collapseNewlines: boolean): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, "text/html")
    
    const convertNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || ""
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return ""
      }
      
      const el = node as HTMLElement
      const tagName = el.tagName.toUpperCase()
      
      let children = ""
      el.childNodes.forEach(child => {
        children += convertNode(child)
      })
      
      switch (tagName) {
        case "B":
        case "STRONG":
          return children.trim() ? `**${children.trim()}**` : ""
        case "I":
        case "EM":
          return children.trim() ? `*${children.trim()}*` : ""
        case "U":
          return children.trim() ? `<u>${children.trim()}</u>` : ""
        case "S":
        case "DEL":
          return children.trim() ? `~~${children.trim()}~~` : ""
        case "H1":
          return `\n# ${children.trim()}\n\n`
        case "H2":
          return `\n## ${children.trim()}\n\n`
        case "H3":
          return `\n### ${children.trim()}\n\n`
        case "H4":
          return `\n#### ${children.trim()}\n\n`
        case "H5":
          return `\n##### ${children.trim()}\n\n`
        case "H6":
          return `\n###### ${children.trim()}\n\n`
        case "P":
          return `\n${children.trim()}\n\n`
        case "BR":
          return "\n"
        case "LI": {
          const parent = el.parentElement
          if (parent && parent.tagName.toUpperCase() === "OL") {
            const index = Array.from(parent.children).indexOf(el) + 1
            return `${index}. ${children.trim()}\n`
          }
          return `* ${children.trim()}\n`
        }
        case "UL":
        case "OL":
          return `\n${children}\n`
        case "TR":
          return `| ${children} |\n`
        case "TD":
        case "TH":
          return `${children.trim()} |`
        default:
          return children
      }
    }
    
    let result = ""
    doc.body.childNodes.forEach(node => {
      result += convertNode(node)
    })
    
    if (stripZW) {
      result = result.replace(/\u200B/g, "")
    }
    
    if (collapseNewlines) {
      result = result.replace(/\n{3,}/g, "\n\n")
    }
    
    return result.trim()
  }

  // Processes the raw inputs and generates the sanitized outputs based on settings
  const processPaste = (html: string, plainText: string, mode: PurgeMode = purgeMode) => {
    // If no HTML was pasted (e.g. simple typing), wrap raw text in basic markup to pass parser
    const sourceHtml = html || `<div>${plainText.replace(/\n/g, "<br />")}</div>`
    
    let cleanOutput = ""
    if (mode === "markdown") {
      cleanOutput = htmlToMarkdown(sourceHtml, stripZeroWidth, trimSpacing)
    } else {
      cleanOutput = sanitizeHtml(sourceHtml, mode, stripZeroWidth, trimSpacing)
    }
    
    setOutputText(cleanOutput)

    // Calculate metadata/style bloat
    const originalLength = sourceHtml.length
    const cleanedLength = cleanOutput.length
    
    if (originalLength > 0) {
      const reduction = Math.max(0, Math.round(((originalLength - cleanedLength) / originalLength) * 100))
      setPasteStats({
        originalHtmlBytes: originalLength,
        cleanedBytes: cleanedLength,
        reductionPercent: reduction,
        isPasted: true
      })
    } else {
      setPasteStats(prev => ({ ...prev, isPasted: false }))
    }
  }

  // Auto-load initial samples
  useEffect(() => {
    if (pasteAreaRef.current && inputText) {
      pasteAreaRef.current.innerText = inputText
    }
    processPaste(inputHtml, inputText)
  }, [])

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    
    const html = e.clipboardData.getData("text/html")
    const plainText = e.clipboardData.getData("text/plain")
    
    setInputText(plainText)
    setInputHtml(html)
    
    // Clear visual paste box to display plain text representation
    if (pasteAreaRef.current) {
      pasteAreaRef.current.innerText = plainText.substring(0, 300) + (plainText.length > 300 ? "..." : "")
    }
    
    processPaste(html, plainText)
  }

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.innerText
    setInputText(value)
    setInputHtml("") // Typing has no HTML metadata representation
    processPaste("", value)
  }

  const handleModeChange = (mode: PurgeMode) => {
    setPurgeMode(mode)
    processPaste(inputHtml, inputText, mode)
  }

  // Intercept, parse and auto-copy in one click
  const handlePasteAndPurge = async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        let html = ""
        let text = ""
        if (item.types.includes("text/html")) {
          const htmlBlob = await item.getType("text/html")
          html = await htmlBlob.text()
        }
        if (item.types.includes("text/plain")) {
          const textBlob = await item.getType("text/plain")
          text = await textBlob.text()
        }
        
        if (html || text) {
          setInputText(text)
          setInputHtml(html)
          
          if (pasteAreaRef.current) {
            pasteAreaRef.current.innerText = text.substring(0, 300) + (text.length > 300 ? "..." : "")
          }

          // Process synchronously
          const sourceHtml = html || `<div>${text.replace(/\n/g, "<br />")}</div>`
          let cleanOutput = ""
          if (purgeMode === "markdown") {
            cleanOutput = htmlToMarkdown(sourceHtml, stripZeroWidth, trimSpacing)
          } else {
            cleanOutput = sanitizeHtml(sourceHtml, purgeMode, stripZeroWidth, trimSpacing)
          }

          setOutputText(cleanOutput)
          await navigator.clipboard.writeText(cleanOutput)
          
          const originalLength = sourceHtml.length
          const cleanedLength = cleanOutput.length
          const reduction = Math.max(0, Math.round(((originalLength - cleanedLength) / originalLength) * 100))
          setPasteStats({
            originalHtmlBytes: originalLength,
            cleanedBytes: cleanedLength,
            reductionPercent: reduction,
            isPasted: true
          })

          setToastMessage("Pasted, style purged, and clean text copied back to clipboard!")
          setTimeout(() => setToastMessage(""), 3500)
          break
        }
      }
    } catch {
      setToastMessage("Clipboard read permission denied. Please paste manually inside the input box.")
      setTimeout(() => setToastMessage(""), 3500)
    }
  }

  const clearAll = () => {
    setInputText("")
    setInputHtml("")
    setOutputText("")
    setPasteStats({
      originalHtmlBytes: 0,
      cleanedBytes: 0,
      reductionPercent: 0,
      isPasted: false
    })
    if (pasteAreaRef.current) {
      pasteAreaRef.current.innerText = ""
    }
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="Visual Style Purger"
      description="Instantly strips MS Word XML styles, inline line-heights, fonts, and background shading, leaving clean content."
      sidebarContent={
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Purge Output Mode</Label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={purgeMode === "structure" ? "default" : "outline"}
                onClick={() => handleModeChange("structure")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <FileCode className="w-4 h-4 text-indigo-500" />
                <div>
                  <div className="font-semibold">Clean HTML Structure</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Keep bold/lists, strip styles</div>
                </div>
              </Button>

              <Button
                variant={purgeMode === "plain" ? "default" : "outline"}
                onClick={() => handleModeChange("plain")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <AlignLeft className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-semibold">Absolute Plain Text</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Strip all tags and brackets</div>
                </div>
              </Button>

              <Button
                variant={purgeMode === "markdown" ? "default" : "outline"}
                onClick={() => handleModeChange("markdown")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="font-semibold">Markdown Syntax</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Convert tags to standard MD</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Filtering Filters</Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="stripZW"
                checked={stripZeroWidth}
                onChange={(e) => {
                  setStripZeroWidth(e.target.checked)
                  setTimeout(() => processPaste(inputHtml, inputText), 50)
                }}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="stripZW" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Strip Zero-Width Characters
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trimSpacing"
                checked={trimSpacing}
                onChange={(e) => {
                  setTrimSpacing(e.target.checked)
                  setTimeout(() => processPaste(inputHtml, inputText), 50)
                }}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="trimSpacing" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Collapse Duplicate Line Breaks
              </Label>
            </div>
          </div>

          {pasteStats.isPasted && (
            <Card className="bg-indigo-50/50 border border-indigo-100 shadow-2xs">
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Purger Statistics
                </div>
                <div className="text-slate-600">
                  <div className="flex justify-between py-0.5">
                    <span>Original Size:</span>
                    <span className="font-mono">{(pasteStats.originalHtmlBytes / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span>Cleaned Size:</span>
                    <span className="font-mono">{(pasteStats.cleanedBytes / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-t border-indigo-100/80 mt-1.5 pt-1.5 font-semibold text-indigo-900">
                    <span>Bloat Removed:</span>
                    <span className="font-mono text-indigo-600">{pasteStats.reductionPercent}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      }
      previewContent={
        <div className="flex flex-col md:flex-row gap-6 w-full h-[calc(100vh-140px)] min-h-[300px]">
          {/* Paste Input Container */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-slate-400" />
                1. Paste Styled Text Here
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={handlePasteAndPurge}
                  size="sm"
                  className="h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Copy className="w-3.5 h-3.5" /> Paste & Purge
                </Button>
                {(inputText || inputHtml) && (
                  <button
                    onClick={clearAll}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer select-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Interactive contenteditable area to capture copy payloads */}
            <div
              ref={pasteAreaRef}
              contentEditable
              onPaste={handlePaste}
              onInput={handleTextChange}
              className="flex-1 p-6 overflow-y-auto font-mono text-sm focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-500/10 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400/80 cursor-text select-text"
              data-placeholder="Paste formatted rich text from Word, Outlook, web, etc. (Ctrl+V / Cmd+V)..."
              style={{ minHeight: "100px" }}
            />
          </div>

          {/* Purged Output Container */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                2. Purged Text Output
              </span>
              <Button
                disabled={!outputText}
                onClick={handleCopy}
                size="sm"
                className="h-8 gap-1 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Cleaned"}
              </Button>
            </div>
            
            <textarea
              readOnly
              value={outputText}
              className="flex-1 p-6 resize-none font-mono text-sm border-0 focus:outline-none focus:ring-0 bg-slate-50/20 text-slate-700 cursor-text"
              placeholder="Cleaned plain-text / structural output will appear here automatically..."
            />
          </div>

          {/* Notification Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 z-50">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              {toastMessage}
            </div>
          )}
        </div>
      }
    />
  )
}
