import Link from "next/link"
import React from "react"

export function ToolCard({ icon, title, description, href, isNew, isPreview }: { icon: React.ReactNode, title: string, description: string, href: string, isNew?: boolean, isPreview?: boolean }) {
    return (
        <Link href={href} className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer">
            {isNew && !isPreview && (
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    New
                </span>
            )}
            {isPreview && (
                <span className="absolute top-3 right-3 bg-amber-500/10 text-amber-800 border border-amber-200/50 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider dark:text-amber-300">
                    Labs
                </span>
            )}
            <div className="flex flex-col gap-4">
                <div className="p-3 bg-muted/65 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300 border border-border/40 text-primary">
                    {icon}
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
            </div>
        </Link>
    )
}
