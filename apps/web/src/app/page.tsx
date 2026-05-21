import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QrCode, FileSpreadsheet, FileText, Tent, Table, BookOpen, Tags, AlertTriangle, Globe, Mail, Image as ImageIcon, Users, Heart, Package } from "lucide-react"
import { ToolCard } from "@/components/ui/tool-card"

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-24">
      <section className="container mx-auto px-4 flex flex-col items-center gap-8 text-center pb-20 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            Tiny tools for <span className="text-primary">big tasks</span>.
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            A suite of premium productivity tools designed to make your workflow smoother.
            Generate QR codes, create labels, clean data, and more.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/tools/qr-generator">
            <Button size="lg">Try QR Generator</Button>
          </Link>
          <Button variant="outline" size="lg">
            Explore All Tools
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
        <ToolCard
          title="Jar Label Generator"
          description="Design and print custom jar labels for home canning, pantry organization, and small-batch products."
          icon={<Package className="w-6 h-6 text-amber-600" />}
          href="/tools/jar-label-generator"
          isNew
        />
        <ToolCard
          title="Invoice Swift"
          description="Create professional PDF invoices instantly."
          icon={<FileText className="w-6 h-6 text-emerald-600" />}
          href="/tools/invoice-swift"
        />
        <ToolCard
          title="Zone Zapper"
          description="Find the perfect meeting time across timezones."
          icon={<Globe className="w-6 h-6 text-cyan-600" />}
          href="/tools/zone-zapper"
        />
        <ToolCard
          title="Signature Smith"
          description="Create professional email signatures."
          icon={<Mail className="w-6 h-6 text-pink-500" />}
          href="/tools/signature-smith"
          isNew
        />
        <ToolCard
          title="Pixel Pruner"
          description="Resize and compress images in your browser."
          icon={<ImageIcon className="w-6 h-6 text-cyan-500" />}
          href="/tools/pixel-pruner"
          isNew
        />
        <ToolCard
          title="Bi-Fold Brochure"
          description="Design simple 4-panel brochures."
          icon={<BookOpen className="w-6 h-6 text-blue-500" />}
          href="/tools/bi-fold-brochure"
          isNew
        />
        <ToolCard
          title="Greeting Card"
          description="Create folded greeting cards."
          icon={<Heart className="w-6 h-6 text-red-500" />}
          href="/tools/greeting-card"
          isNew
        />
        <ToolCard
          title="Team Taggler"
          description="Pick winners and split teams instantly."
          icon={<Users className="w-6 h-6 text-indigo-500" />}
          href="/tools/team-taggler"
          isNew
        />
        <ToolCard
          title="Name Tent Maker"
          description="Create foldable name tents for meetings and events."
          icon={<Tent className="w-6 h-6 text-rose-500" />}
          href="/tools/name-tent"
        />
        <ToolCard
          title="Table Tuner"
          description="Convert CSV/Excel data to Markdown, HTML, JSON, and ASCII tables."
          icon={<Table className="w-6 h-6 text-teal-600" />}
          href="/tools/table-tuner"
        />
        <ToolCard
          title="Brochure Builder"
          description="Design and print tri-fold brochures with ease."
          icon={<BookOpen className="w-6 h-6 text-sky-600" />}
          href="/tools/brochure-builder"
        />
        <ToolCard
          title="QR & Barcode Generator"
          description="Generate QR codes and Barcodes for URLs, text, and more."
          icon={<QrCode className="w-6 h-6 text-blue-500" />}
          href="/tools/qr-generator"
        />
        <ToolCard
          title="Label Creator"
          description="Design and print custom labels with Avery templates."
          icon={<Tags className="w-6 h-6 text-purple-500" />}
          href="/tools/label-creator"
        />
        <ToolCard
          title="Sign Generator"
          description="Create professional OSHA-compliant safety signs."
          icon={<AlertTriangle className="w-6 h-6 text-orange-500" />}
          href="/tools/sign-generator"
        />
        <ToolCard
          title="Excel Data Scrubber"
          description="Clean, format, and manipulate Excel and CSV data."
          icon={<FileSpreadsheet className="w-6 h-6 text-green-600" />}
          href="/tools/excel-scrubber"
        />
        <ToolCard
          title="Word Formatter"
          description="Fix formatting issues in text and export to Markdown."
          icon={<FileText className="w-6 h-6 text-indigo-600" />}
          href="/tools/word-formatter"
        />
      </section>
    </main>
  )
}
