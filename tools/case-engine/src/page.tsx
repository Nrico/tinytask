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
  Type, 
  Scissors,
  Baseline,
  ChevronDown
} from "lucide-react"

type CaseStyle = "sentence" | "title" | "upper" | "lower" | "camel" | "kebab" | "snake"

const MOCK_MESSY_TEXT = `this is a raw headline. we need to fix it!
SOME ACRONYMS LIKE HTML OR CSS SHOULD BE HANDLED properly.
let's check the formatting of this list:
- strawberry preserves (DELICIOUS)
- marmalade orange spreads
`

const MINOR_WORDS = [
  "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", 
  "to", "by", "in", "of", "up", "with", "from", "as", "into"
]

export default function CaseEnginePage() {
  const [inputText, setInputText] = useState(MOCK_MESSY_TEXT.trim())
  const [outputText, setOutputText] = useState("")
  
  const [caseStyle, setCaseStyle] = useState<CaseStyle>("sentence")
  const [ignoreMinorWords, setIgnoreMinorWords] = useState(true)
  const [standardSentenceSpacing, setStandardSentenceSpacing] = useState(true)
  
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    chars: 0,
    words: 0,
    lines: 0
  })

  const [isLoaded, setIsLoaded] = useState(false)

  // Load initial state on mount from URL or LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const urlText = params.get("text")
      const urlStyle = params.get("style") as CaseStyle | null
      const urlIgnoreMinor = params.get("ignoreMinor")
      const urlSentenceSpacing = params.get("sentenceSpacing")

      const cachedData = localStorage.getItem("tinytask:case-engine")
      let cached: any = {}
      if (cachedData) {
        try {
          cached = JSON.parse(cachedData)
        } catch (e) {
          console.error(e)
        }
      }

      if (urlText !== null) setInputText(urlText)
      else if (cached.inputText !== undefined) setInputText(cached.inputText)

      if (urlStyle && ["sentence", "title", "upper", "lower", "camel", "kebab", "snake"].includes(urlStyle)) {
        setCaseStyle(urlStyle)
      } else if (cached.caseStyle !== undefined) {
        setCaseStyle(cached.caseStyle)
      }

      if (urlIgnoreMinor !== null) setIgnoreMinorWords(urlIgnoreMinor === "true")
      else if (cached.ignoreMinorWords !== undefined) setIgnoreMinorWords(cached.ignoreMinorWords)

      if (urlSentenceSpacing !== null) setStandardSentenceSpacing(urlSentenceSpacing === "true")
      else if (cached.standardSentenceSpacing !== undefined) setStandardSentenceSpacing(cached.standardSentenceSpacing)

      setIsLoaded(true)
    }
  }, [])

  // Sync state changes back to LocalStorage and URL search params
  useEffect(() => {
    if (!isLoaded) return

    if (typeof window !== "undefined") {
      const dataToSave = {
        inputText,
        caseStyle,
        ignoreMinorWords,
        standardSentenceSpacing
      }
      localStorage.setItem("tinytask:case-engine", JSON.stringify(dataToSave))

      const params = new URLSearchParams()
      if (inputText && inputText !== MOCK_MESSY_TEXT.trim()) {
        params.set("text", inputText)
      }
      if (caseStyle !== "sentence") {
        params.set("style", caseStyle)
      }
      if (ignoreMinorWords !== true) {
        params.set("ignoreMinor", String(ignoreMinorWords))
      }
      if (standardSentenceSpacing !== true) {
        params.set("sentenceSpacing", String(standardSentenceSpacing))
      }

      const newSearch = params.toString()
      const newUrl = newSearch 
        ? `${window.location.pathname}?${newSearch}`
        : window.location.pathname
        
      window.history.replaceState({ ...window.history.state }, "", newUrl)
    }
  }, [inputText, caseStyle, ignoreMinorWords, standardSentenceSpacing, isLoaded])

  // Conversion Functions
  const toSentenceCase = (text: string, addSpace: boolean): string => {
    if (!text) return ""
    return text.split("\n").map(para => {
      if (!para.trim()) return para
      
      const parts = para.split(/([.!?]\s*)/)
      let capitalizeNext = true
      
      const cleanedParts = parts.map((part, index) => {
        // Punctuation separator block
        if (index % 2 === 1) {
          if (addSpace && !part.includes(" ") && !part.match(/\s/)) {
            return part.trim() + " "
          }
          return part
        }
        
        if (!part.trim()) return part
        
        let str = part
        const match = str.match(/\S/)
        if (match && match.index !== undefined) {
          const idx = match.index
          // Capitalize first letter, lowercase the rest of the sentence
          str = str.substring(0, idx) + str.charAt(idx).toUpperCase() + str.substring(idx + 1).toLowerCase()
        }
        
        return str
      })
      
      return cleanedParts.join("")
    }).join("\n")
  }

  const toTitleCase = (text: string, ignoreMinor: boolean): string => {
    if (!text) return ""
    return text.split("\n").map(para => {
      if (!para.trim()) return para
      
      const words = para.split(/(\s+)/)
      const processed = words.map((word, idx) => {
        if (word.match(/^\s+$/)) return word
        
        const cleanWord = word.toLowerCase()
        const isFirstOrLast = idx === 0 || idx === words.length - 1
        
        if (ignoreMinor && MINOR_WORDS.includes(cleanWord) && !isFirstOrLast) {
          return cleanWord
        }
        
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
      })
      return processed.join("")
    }).join("\n")
  }

  const toCamelCase = (text: string): string => {
    if (!text) return ""
    return text.split("\n").map(para => {
      if (!para.trim()) return para
      const words = para.trim().split(/[\s\-_]+/)
      return words.map((word, idx) => {
        if (idx === 0) return word.toLowerCase()
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
      }).join("")
    }).join("\n")
  }

  const toKebabCase = (text: string): string => {
    if (!text) return ""
    return text.split("\n").map(para => {
      if (!para.trim()) return para
      return para.trim().toLowerCase().replace(/[^a-zA-Z0-9\s\-_]/g, "").replace(/[\s\-_]+/g, "-")
    }).join("\n")
  }

  const toSnakeCase = (text: string): string => {
    if (!text) return ""
    return text.split("\n").map(para => {
      if (!para.trim()) return para
      return para.trim().toLowerCase().replace(/[^a-zA-Z0-9\s\-_]/g, "").replace(/[\s\-_]+/g, "_")
    }).join("\n")
  }

  // Core processing controller
  const runConversion = (
    text: string, 
    style: CaseStyle, 
    ignoreMin: boolean, 
    addSpace: boolean
  ) => {
    if (!text) {
      setOutputText("")
      return
    }

    let result = ""
    switch (style) {
      case "upper":
        result = text.toUpperCase()
        break
      case "lower":
        result = text.toLowerCase()
        break
      case "title":
        result = toTitleCase(text, ignoreMin)
        break
      case "sentence":
        result = toSentenceCase(text, addSpace)
        break
      case "camel":
        result = toCamelCase(text)
        break
      case "kebab":
        result = toKebabCase(text)
        break
      case "snake":
        result = toSnakeCase(text)
        break
      default:
        result = text
    }
    
    setOutputText(result)
  }

  // Re-run whenever settings or input variables shift
  useEffect(() => {
    runConversion(inputText, caseStyle, ignoreMinorWords, standardSentenceSpacing)
    
    // Calculate text stats
    if (inputText) {
      const charCount = inputText.length
      const wordCount = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length
      const lineCount = inputText.split("\n").length
      setStats({ chars: charCount, words: wordCount, lines: lineCount })
    } else {
      setStats({ chars: 0, words: 0, lines: 0 })
    }
  }, [inputText, caseStyle, ignoreMinorWords, standardSentenceSpacing])

  const loadExample = () => {
    setInputText(MOCK_MESSY_TEXT.trim())
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setStats({ chars: 0, words: 0, lines: 0 })
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="Quick Case Engine"
      description="Instantly convert word list or text paragraphs into uppercase, lowercase, sentence case, or standard publishing title casing."
      faqs={[
        {
          question: "What is Sentence Case vs Title Case?",
          answer: "Sentence Case capitalizes only the first letter of each sentence, similar to standard paragraphs. Title Case capitalizes the first letter of every word, excluding prepositions and minor words like 'the', 'and', or 'of'."
        },
        {
          question: "Can this tool convert programming casing styles?",
          answer: "Yes, the Quick Case Engine can convert text to camelCase, kebab-case (hyphenated), and snake_case (underscored) formats for developers and database naming structures."
        },
        {
          question: "Does the Case Engine support bulk paragraph formatting?",
          answer: "Yes. You can paste whole articles or lists. The tool processes each line and paragraph dynamically while maintaining formatting."
        }
      ]}
      sidebarContent={
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Case Style</Label>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={caseStyle === "sentence" ? "default" : "outline"}
                onClick={() => setCaseStyle("sentence")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <Baseline className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-semibold font-sans">Sentence case</div>
                  <div className="text-[10px] text-muted-foreground font-normal">e.g. Case engine sample.</div>
                </div>
              </Button>

              <Button
                variant={caseStyle === "title" ? "default" : "outline"}
                onClick={() => setCaseStyle("title")}
                className="justify-start gap-2.5 text-xs text-left"
                size="sm"
              >
                <Type className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-semibold font-sans">Title Case</div>
                  <div className="text-[10px] text-muted-foreground font-normal">e.g. Case Engine Sample</div>
                </div>
              </Button>

              <Button
                variant={caseStyle === "upper" ? "default" : "outline"}
                onClick={() => setCaseStyle("upper")}
                className="justify-start gap-2.5 text-xs text-left font-sans font-bold"
                size="sm"
              >
                <span className="w-4 text-center text-xs text-amber-500">AA</span>
                <div>
                  <div className="font-semibold font-sans">UPPERCASE</div>
                  <div className="text-[10px] text-muted-foreground font-normal">e.g. CASE ENGINE SAMPLE</div>
                </div>
              </Button>

              <Button
                variant={caseStyle === "lower" ? "default" : "outline"}
                onClick={() => setCaseStyle("lower")}
                className="justify-start gap-2.5 text-xs text-left font-sans font-normal"
                size="sm"
              >
                <span className="w-4 text-center text-xs text-rose-500">aa</span>
                <div>
                  <div className="font-semibold font-sans">lowercase</div>
                  <div className="text-[10px] text-muted-foreground font-normal">e.g. case engine sample</div>
                </div>
              </Button>

              <Button
                variant={caseStyle === "camel" ? "default" : "outline"}
                onClick={() => setCaseStyle("camel")}
                className="justify-start gap-2.5 text-xs text-left font-mono"
                size="sm"
              >
                <span className="w-4 text-center text-xs text-cyan-500">cC</span>
                <div>
                  <div className="font-semibold font-sans">camelCase</div>
                  <div className="text-[10px] text-muted-foreground font-normal">e.g. caseEngineSample</div>
                </div>
              </Button>

              <Button
                variant={caseStyle === "kebab" ? "default" : "outline"}
                onClick={() => setCaseStyle("kebab")}
                className="justify-start gap-2.5 text-xs text-left font-mono"
                size="sm"
              >
                <span className="w-4 text-center text-xs text-purple-500">k-c</span>
                <div>
                  <div className="font-semibold font-sans">kebab-case</div>
                  <div className="text-[10px] text-muted-foreground font-normal">e.g. case-engine-sample</div>
                </div>
              </Button>

              <Button
                variant={caseStyle === "snake" ? "default" : "outline"}
                onClick={() => setCaseStyle("snake")}
                className="justify-start gap-2.5 text-xs text-left font-mono"
                size="sm"
              >
                <span className="w-4 text-center text-xs text-teal-500">s_c</span>
                <div>
                  <div className="font-semibold font-sans">snake_case</div>
                  <div className="text-[10px] text-muted-foreground font-normal">e.g. case_engine_sample</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Options</Label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ignoreMinor"
                checked={ignoreMinorWords}
                onChange={(e) => setIgnoreMinorWords(e.target.checked)}
                disabled={caseStyle !== "title"}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring disabled:opacity-50"
              />
              <Label htmlFor="ignoreMinor" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Smart Title Case (Ignore prepositions)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="addSpace"
                checked={standardSentenceSpacing}
                onChange={(e) => setStandardSentenceSpacing(e.target.checked)}
                disabled={caseStyle !== "sentence"}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-ring disabled:opacity-50"
              />
              <Label htmlFor="addSpace" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                Add Space After Sentences
              </Label>
            </div>
          </div>

          {inputText && (
            <Card className="bg-slate-50 border shadow-2xs">
              <CardContent className="p-4 space-y-1.5 text-[10px] text-slate-500 leading-normal">
                <div className="font-bold text-slate-700 mb-1">Text Summary</div>
                <div>Characters: <span className="font-mono text-slate-800">{stats.chars}</span></div>
                <div>Words: <span className="font-mono text-slate-800">{stats.words}</span></div>
                <div>Paragraphs/Lines: <span className="font-mono text-slate-800">{stats.lines}</span></div>
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
                1. Input Messy Cased Text
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
              placeholder="Paste text here to convert casing. Type or load a sample..."
            />
          </div>

          {/* Clean Output Panel */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-slate-400" />
                2. Case Converted Output
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
              placeholder="Converted casing will appear here instantly..."
            />
          </div>
        </div>
      }
    />
  )
}
