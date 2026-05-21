import Link from "next/link"
import React from "react"

export function ToolCard({ icon, title, description, href, isNew }: { icon: React.ReactNode, title: string, description: string, href: string, isNew?: boolean }) {
    return (
        <Link href={href} className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            {isNew && (
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    New
                </span>
            )}
            <div className="flex flex-col gap-4">
                <div className="p-3 bg-slate-50 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                    {icon}
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
            </div>
        </Link>
    )
}
