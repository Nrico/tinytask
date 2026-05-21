import { ToolCard } from "@/components/ui/tool-card"
import { Tags, Heart, Tent, FileText, QrCode } from "lucide-react"

export default function FloristCollectionPage() {
    return (
        <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center py-24 bg-rose-50/30">
            <section className="container mx-auto px-4 flex flex-col items-center gap-8 text-center pb-20 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-rose-900">
                        Tools for <span className="text-rose-500">Florists</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-lg text-rose-700/80">
                        A curated collection of tools to help you manage your flower shop, create beautiful displays, and delight your customers.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8 max-w-5xl">
                <ToolCard
                    title="Label Creator"
                    description="Create custom price tags, stickers, and care instruction labels."
                    icon={<Tags className="w-6 h-6 text-purple-500" />}
                    href="/tools/label-creator"
                />
                <ToolCard
                    title="Greeting Card Builder"
                    description="Design personalized cards for bouquets and arrangements."
                    icon={<Heart className="w-6 h-6 text-red-500" />}
                    href="/tools/greeting-card"
                />
                <ToolCard
                    title="Name Tent Maker"
                    description="Create elegant display signs for flower varieties and pricing."
                    icon={<Tent className="w-6 h-6 text-rose-500" />}
                    href="/tools/name-tent"
                />
                <ToolCard
                    title="Invoice Swift"
                    description="Generate professional invoices for weddings and events."
                    icon={<FileText className="w-6 h-6 text-emerald-600" />}
                    href="/tools/invoice-swift"
                />
                <ToolCard
                    title="QR Generator"
                    description="Link customers to plant care guides or your social media."
                    icon={<QrCode className="w-6 h-6 text-blue-500" />}
                    href="/tools/qr-generator"
                />
            </section>
        </main>
    )
}
