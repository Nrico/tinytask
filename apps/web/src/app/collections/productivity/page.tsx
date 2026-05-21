import { ToolCard } from "@/components/ui/tool-card"
import { Globe, FileSpreadsheet, FileText, Users, Mail } from "lucide-react"

export default function ProductivityCollectionPage() {
    return (
        <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center py-24 bg-slate-50">
            <section className="container mx-auto px-4 flex flex-col items-center gap-8 text-center pb-20 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-slate-900">
                        Ultimate <span className="text-blue-600">Productivity</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-lg text-slate-600">
                        Streamline your workflow, organize your data, and save time with these essential utilities.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8 max-w-5xl">
                <ToolCard
                    title="Zone Zapper"
                    description="Coordinate meetings across multiple timezones effortlessly."
                    icon={<Globe className="w-6 h-6 text-cyan-600" />}
                    href="/tools/zone-zapper"
                />
                <ToolCard
                    title="Excel Data Scrubber"
                    description="Clean and format messy spreadsheet data in seconds."
                    icon={<FileSpreadsheet className="w-6 h-6 text-green-600" />}
                    href="/tools/excel-scrubber"
                />
                <ToolCard
                    title="Word Formatter"
                    description="Strip formatting and clean up text documents."
                    icon={<FileText className="w-6 h-6 text-indigo-600" />}
                    href="/tools/word-formatter"
                />
                <ToolCard
                    title="Team Taggler"
                    description="Make quick decisions and split teams for projects."
                    icon={<Users className="w-6 h-6 text-indigo-500" />}
                    href="/tools/team-taggler"
                />
                <ToolCard
                    title="Signature Smith"
                    description="Create professional email signatures for your correspondence."
                    icon={<Mail className="w-6 h-6 text-pink-500" />}
                    href="/tools/signature-smith"
                />
            </section>
        </main>
    )
}
