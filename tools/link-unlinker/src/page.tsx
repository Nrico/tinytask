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
  Link2,
  Link2Off,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck
} from "lucide-react"

type UnlinkMode = "keep-text" | "remove" | "append-url" | "extract-list"

const MOCK_LINKY_TEXT = `Read the latest news on <a href="https://example.com/news?utm_source=feed&utm_medium=email">our blog</a>.
You can also follow us on Twitter: https://twitter.com/mytask?ref_src=twsrc%5Egoogle
For support, go to <a href="https://support.example.com/tickets">our Help Center</a> or search on Google.com.`

export default function LinkUnlinkerPage() {
  const [inputText, setInputText] = useState(`Read the latest news on our blog (https://example.com/news?utm_source=feed&utm_medium=email).\nYou can also follow us on Twitter: https://twitter.com/mytask?ref_src=twsrc%5Egoogle\nFor support, go to our Help Center (https://support.example.com/tickets) or search on Google.com.`)
  const [pastedHtml, setPastedHtml] = useState(MOCK_LINKY_TEXT)
  const [outputText, setOutputText] = useState("")
  
  const [unlinkMode, setUnlinkMode] = useState<UnlinkMode>("keep-text")
  const [stripUtm, setStripUtm] = useState(true)
  const [cleanPlainUrls, setCleanPlainUrls] = useState(true)
  
  const [copied, setCopied] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  
  const [stats, setStats] = useState({
    htmlLinksStripped: 0,
    plainUrlsStripped: 0,
    uniqueUrlsFound: 0
  })
  
  const [uniqueUrls, setUniqueUrls] = useState<string[]>([])

  // Utility to clean tracking parameters
  const cleanTrackingParams = (urlStr: string): string => {
    try {
      const trimmed = urlStr.trim()
      if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        const url = new URL(trimmed, "https://dummy.com")
        const paramsToStrip = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid", "ref", "ref_src"]
        paramsToStrip.forEach(p => url.searchParams.delete(p))
        return urlStr.includes("?") ? url.pathname + url.search : urlStr
      }
      const url = new URL(trimmed)
      const paramsToStrip = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid", "ref", "ref_src"]
      paramsToStrip.forEach(p => url.searchParams.delete(p))
      return url.toString().replace(/&$/, "").replace(/\?$/, "")
    } catch {
      return urlStr
    }
  }

  // Intercept paste event to capture rich text HTML formatting
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const htmlData = e.clipboardData.getData("text/html") || ""
    const textData = e.clipboardData.getData("text/plain") || ""

    if (htmlData) {
      setPastedHtml(htmlData)
    } else {
      setPastedHtml("")
    }
    setInputText(textData)
  }

  // Parse and process links
  useEffect(() => {
    if (!inputText) {
      setOutputText("")
      setUniqueUrls([])
      setStats({ htmlLinksStripped: 0, plainUrlsStripped: 0, uniqueUrlsFound: 0 })
      return
    }

    const discoveredUrls: Set<string> = new Set()
    let htmlLinksCount = 0
    let plainUrlsCount = 0

    // Mode: Extract URLs List
    if (unlinkMode === "extract-list") {
      // 1. Extract from pasted HTML if available
      if (pastedHtml) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(pastedHtml, "text/html")
        const anchors = Array.from(doc.getElementsByTagName("a"))
        anchors.forEach(a => {
          const href = a.getAttribute("href")
          if (href) {
            const cleanUrl = stripUtm ? cleanTrackingParams(href) : href
            discoveredUrls.add(cleanUrl)
            htmlLinksCount++
          }
        })
      }

      // 2. Extract plain text URLs
      const urlRegex = /https?:\/\/[^\s<>\"]+/g
      let match
      while ((match = urlRegex.exec(inputText)) !== null) {
        const url = match[0]
        const cleanUrl = stripUtm ? cleanTrackingParams(url) : url
        discoveredUrls.add(cleanUrl)
        plainUrlsCount++
      }

      const sortedUrls = Array.from(discoveredUrls)
      setUniqueUrls(sortedUrls)
      setOutputText(sortedUrls.join("\n"))
      setStats({
        htmlLinksStripped: htmlLinksCount,
        plainUrlsStripped: plainUrlsCount,
        uniqueUrlsFound: sortedUrls.length
      })
      return
    }

    // Default modes: Text cleanups
    let workingText = inputText
    let cleanedHtmlText = ""

    // 1. Process via HTML Parser if rich text was pasted
    if (pastedHtml) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(pastedHtml, "text/html")
      const anchors = Array.from(doc.getElementsByTagName("a"))
      
      anchors.forEach(a => {
        const href = a.getAttribute("href") || ""
        const text = a.textContent || ""
        const cleanHref = stripUtm ? cleanTrackingParams(href) : href
        
        if (href) {
          discoveredUrls.add(cleanHref)
          htmlLinksCount++
        }

        if (unlinkMode === "keep-text") {
          a.replaceWith(doc.createTextNode(text))
        } else if (unlinkMode === "remove") {
          a.replaceWith(doc.createTextNode(""))
        } else if (unlinkMode === "append-url") {
          a.replaceWith(doc.createTextNode(`${text} (${cleanHref})`))
        }
      })
      
      cleanedHtmlText = doc.body.innerText || doc.body.textContent || ""
    }

    // 2. Fallback / process plain text URLs
    const textToProcess = cleanedHtmlText || workingText
    const urlRegex = /https?:\/\/[^\s<>\"]+/g

    // Capture plain text unique links for stats
    let plainMatch
    while ((plainMatch = urlRegex.exec(textToProcess)) !== null) {
      const url = plainMatch[0]
      const cleanUrl = stripUtm ? cleanTrackingParams(url) : url
      discoveredUrls.add(cleanUrl)
      plainUrlsCount++
    }

    // Perform replacements
    let finalCleaned = textToProcess
    if (cleanPlainUrls) {
      finalCleaned = textToProcess.replace(urlRegex, (url) => {
        const cleanUrl = stripUtm ? cleanTrackingParams(url) : url
        if (unlinkMode === "keep-text") {
          return cleanUrl
        } else if (unlinkMode === "remove") {
          return ""
        } else if (unlinkMode === "append-url") {
          return cleanUrl
        }
        return url
      })
    }

    const sortedUrls = Array.from(discoveredUrls)
    setUniqueUrls(sortedUrls)
    setOutputText(finalCleaned)
    setStats({
      htmlLinksStripped: htmlLinksCount,
      plainUrlsStripped: plainUrlsCount,
      uniqueUrlsFound: sortedUrls.length
    })

  }, [inputText, pastedHtml, unlinkMode, stripUtm, cleanPlainUrls])

  const loadExample = () => {
    setPastedHtml(MOCK_LINKY_TEXT)
    setInputText(`Read the latest news on our blog (https://example.com/news?utm_source=feed&utm_medium=email).
You can also follow us on Twitter: https://twitter.com/mytask?ref_src=twsrc%5Egoogle
For support, go to our Help Center (https://support.example.com/tickets) or search on Google.com.`)
  }

  const clearAll = () => {
    setInputText("")
    setPastedHtml("")
    setOutputText("")
    setUniqueUrls([])
    setStats({ htmlLinksStripped: 0, plainUrlsStripped: 0, uniqueUrlsFound: 0 })
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setToastMessage("Copied output text!")
    setTimeout(() => {
      setCopied(false)
      setToastMessage("")
    }, 2000)
  }

  const copySingleUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setToastMessage("Copied link URL!")
    setTimeout(() => setToastMessage(""), 2000)
  }

  return (
    <ToolLayout
      title="Strip Tracking (UTM) from Links"
      description="Remove hyperlinks from rich documents while preserving text, strip tracking metrics, or extract unique link URLs."
      sidebarContent={
        <div className="space-y-6">
          {/* Unlinking Modes */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Unlinking Mode</Label>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={unlinkMode === "keep-text" ? "default" : "outline"}
                onClick={() => setUnlinkMode("keep-text")}
                className="justify-start gap-2 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <Link2Off className="w-3.5 h-3.5 text-primary" />
                Keep Anchor Text Only
              </Button>

              <Button
                variant={unlinkMode === "remove" ? "default" : "outline"}
                onClick={() => setUnlinkMode("remove")}
                className="justify-start gap-2 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Remove Link & Text
              </Button>

              <Button
                variant={unlinkMode === "append-url" ? "default" : "outline"}
                onClick={() => setUnlinkMode("append-url")}
                className="justify-start gap-2 text-xs py-1 px-2.5 h-9"
                size="sm"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                Append URL: Text (URL)
              </Button>

              <Button
                variant={unlinkMode === "extract-list" ? "default" : "outline"}
                onClick={() => setUnlinkMode("extract-list")}
                className="justify-start gap-2 text-xs py-1 px-2.5 h-9 font-mono"
                size="sm"
              >
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Extract Discovered URLs
              </Button>
            </div>
          </div>

          {/* Filtering Toggles */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Options
            </Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="stripUtm"
                checked={stripUtm}
                onChange={(e) => setStripUtm(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring"
              />
              <Label htmlFor="stripUtm" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Strip Tracking parameters (UTM)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="cleanPlain"
                checked={cleanPlainUrls}
                disabled={unlinkMode === "extract-list"}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring disabled:opacity-50"
                onChange={(e) => setCleanPlainUrls(e.target.checked)}
              />
              <Label htmlFor="cleanPlain" className="text-xs font-medium text-slate-600 cursor-pointer select-none disabled:opacity-50">
                Process plain-text URLs too
              </Label>
            </div>
          </div>

          {/* Extracted URL checklist/list */}
          {uniqueUrls.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Unique URLs Discovered ({stats.uniqueUrlsFound})</Label>
              <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-slate-50 border rounded-lg">
                {uniqueUrls.map((url, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-2 text-[10px] text-slate-600 border-b pb-1 last:border-0 last:pb-0">
                    <span className="truncate flex-1 font-mono">{url}</span>
                    <button
                      onClick={() => copySingleUrl(url)}
                      className="text-primary hover:underline font-semibold flex-shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {inputText && (
            <Card className="bg-slate-50 border shadow-2xs">
              <CardContent className="p-4 space-y-1.5 text-[10px] text-slate-500 leading-normal">
                <div className="font-bold text-slate-700 mb-1">Process Metrics</div>
                <div>HTML links stripped: <span className="font-mono text-slate-800">{stats.htmlLinksStripped}</span></div>
                <div>Plain-text URLs cleaned: <span className="font-mono text-slate-800">{stats.plainUrlsStripped}</span></div>
                <div>Unique links harvested: <span className="font-mono text-slate-800">{stats.uniqueUrlsFound}</span></div>
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
                1. Paste Content with Hyperlinks
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
              onPaste={handlePaste}
              className="flex-1 p-6 resize-none font-mono text-sm border-0 focus:outline-none focus:ring-0 bg-transparent text-slate-800"
              placeholder="Paste text with active hyperlinks or plain links..."
            />
          </div>

          {/* Output Panel */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Link2Off className="w-3.5 h-3.5 text-slate-400" />
                2. Sanitized Clean Output
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
            {(stats.htmlLinksStripped > 0 || stats.plainUrlsStripped > 0) && (
              <div className="px-4 py-2 bg-card border-b border-border/50/50 text-[10px] font-semibold text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Removed {stats.htmlLinksStripped} active links and cleaned {stats.plainUrlsStripped} tracking URLs!
              </div>
            )}
            
            <textarea
              readOnly
              value={outputText}
              className="flex-1 p-6 resize-none font-mono text-sm border-0 focus:outline-none focus:ring-0 bg-slate-50/20 text-slate-700 cursor-text"
              placeholder="Clean plain text without active links will display here..."
            />
          </div>

          {/* Custom Notification Toast */}
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
