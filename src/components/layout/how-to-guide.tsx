"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, Play } from "lucide-react"
import { TOOL_HELP } from "@/lib/tool-help"

export function HowToGuide() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [hasSeen, setHasSeen] = useState(false)
    const [mounted, setMounted] = useState(false)

    const helpData = TOOL_HELP[pathname]

    useEffect(() => {
        setMounted(true)
    }, [])

    // Reset "has seen" when path changes
    useEffect(() => {
        setHasSeen(false)
    }, [pathname])

    if (!helpData) return null

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className={`gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 ${!hasSeen ? "animate-pulse ring-2 ring-blue-300 ring-offset-1" : ""
                    }`}
                onClick={() => {
                    setIsOpen(true)
                    setHasSeen(true)
                }}
            >
                <HelpCircle className="w-4 h-4" />
                How To Use
            </Button>

            {isOpen && mounted && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors z-50 backdrop-blur-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image / GIF Area */}
                        <div className="aspect-video bg-slate-100 relative flex items-center justify-center overflow-hidden">
                            <img
                                src={helpData.imageUrl}
                                alt={helpData.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <h2 className="text-white text-2xl font-bold shadow-sm">{helpData.title}</h2>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {helpData.description}
                            </p>

                            <div className="flex gap-4">
                                <a
                                    href={helpData.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1"
                                >
                                    <Button className="w-full gap-2 text-lg h-12" size="lg">
                                        <Play className="w-5 h-5 fill-current" /> Watch Tutorial
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
