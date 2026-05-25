"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@tinytask/ui/buttons/button"
import { Input } from "@tinytask/ui/forms/input"
import { Label } from "@tinytask/ui/forms/label"
import { Card, CardContent, CardHeader, CardTitle } from "@tinytask/ui/cards/card"
import { Printer, Download, Sparkles, RefreshCw } from "lucide-react"
import "./print.css"

export default function JarLabelGeneratorPage() {
  const [options, setOptions] = useState({
    title: "Jar Label",
    subtitle: "Homemade with Love",
    themeColor: "#4f46e5",
    textColor: "#ffffff",
    fontSize: 24,
    width: 250,
    height: 150,
  })

  const [exampleLoaded, setExampleLoaded] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const loadExample = () => {
    setOptions({
      title: "Strawberry Jam",
      subtitle: "Batch #4 - May 2026",
      themeColor: "#e11d48",
      textColor: "#ffffff",
      fontSize: 26,
      width: 250,
      height: 150,
    })
    setExampleLoaded(true)
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl sm:px-6 lg:px-8 print:hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jar Label Generator</h1>
          <p className="text-muted-foreground mt-1">Small-batch food producers, hobbyists, and home cooks need a quick way to design and print professional jar labels that fit standard label sheets.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadExample} className="gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Load Example
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print Labels
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Controls */}
        <div className="md:col-span-1 space-y-6 bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg border-b pb-2">Customization</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Label Title</Label>
              <Input
                id="title"
                value={options.title}
                onChange={(e) => setOptions({ ...options, title: e.target.value })}
                placeholder="Enter title text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle / Description</Label>
              <Input
                id="subtitle"
                value={options.subtitle}
                onChange={(e) => setOptions({ ...options, subtitle: e.target.value })}
                placeholder="Enter subtitle text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="themeColor">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="themeColor"
                    type="color"
                    value={options.themeColor}
                    onChange={(e) => setOptions({ ...options, themeColor: e.target.value })}
                    className="h-10 w-12 p-1"
                  />
                  <Input
                    value={options.themeColor}
                    onChange={(e) => setOptions({ ...options, themeColor: e.target.value })}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={options.textColor}
                    onChange={(e) => setOptions({ ...options, textColor: e.target.value })}
                    className="h-10 w-12 p-1"
                  />
                  <Input
                    value={options.textColor}
                    onChange={(e) => setOptions({ ...options, textColor: e.target.value })}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size (px)</Label>
              <Input
                id="fontSize"
                type="number"
                value={options.fontSize}
                onChange={(e) => setOptions({ ...options, fontSize: Number(e.target.value) })}
                min={12}
                max={60}
              />
            </div>
          </div>

          <div className="pt-4 border-t text-xs text-muted-foreground space-y-2">
            <p className="flex items-center gap-1.5 font-medium text-slate-700">
              🛡️ Privacy Note
            </p>
            <p>
              This tool runs entirely in your browser. None of your input data is sent to our servers.
            </p>
          </div>
        </div>

        {/* Right Column: Visual Preview Area */}
        <div className="md:col-span-2 flex flex-col items-center justify-center bg-card/100 rounded-xl border border-dashed p-8 min-h-[400px]">
          <h3 className="text-slate-500 font-medium mb-6 text-sm">Visual Preview</h3>

          {/* Interactive Canvas Sheet */}
          <div
            className="flex flex-col items-center justify-center rounded-lg border shadow-lg transition-all print:block"
            style={{
              width: `${options.width}px`,
              height: `${options.height}px`,
              backgroundColor: options.themeColor,
              color: options.textColor,
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              className="font-bold tracking-tight truncate w-full"
              style={{ fontSize: `${options.fontSize}px` }}
            >
              {options.title || "Label Title"}
            </div>
            <div className="text-sm opacity-90 mt-2 truncate w-full">
              {options.subtitle || "Label Subtitle"}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-6">
            Dimensions: {options.width}px × {options.height}px. Click "Print Labels" to print.
          </p>
        </div>
      </div>

      {/* Hidden Print Wrapper */}
      <div className="hidden print:block print:block">
        <div className="flex flex-wrap gap-4 p-8 justify-center">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-lg border"
              style={{
                width: `${options.width}px`,
                height: `${options.height}px`,
                backgroundColor: options.themeColor,
                color: options.textColor,
                padding: "16px",
                textAlign: "center",
                pageBreakInside: "avoid",
              }}
            >
              <div
                className="font-bold tracking-tight truncate w-full"
                style={{ fontSize: `${options.fontSize}px` }}
              >
                {options.title || "Label Title"}
              </div>
              <div className="text-sm opacity-90 mt-2 truncate w-full">
                {options.subtitle || "Label Subtitle"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
