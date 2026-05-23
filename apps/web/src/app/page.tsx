import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QrCode, FileSpreadsheet, FileText, Tent, Table, BookOpen, Tags, Globe, Mail, Image as ImageIcon, Users, Heart, Package } from "lucide-react"
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

      {/* Featured Core Suite */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight">Featured Core Suite</h2>
          <p className="text-muted-foreground mt-2">
            Fully featured, production-ready utilities to power your workflow.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard
            title="Excel Data Scrubber"
            description="Clean, format, and manipulate Excel and CSV data with automatic column cleaners."
            icon={<FileSpreadsheet className="w-6 h-6 text-green-600" />}
            href="/tools/excel-scrubber"
          />
          <ToolCard
            title="Invoice Swift"
            description="Create professional PDF invoices instantly with custom line items and tax calculations."
            icon={<FileText className="w-6 h-6 text-emerald-600" />}
            href="/tools/invoice-swift"
          />
          <ToolCard
            title="Signature Smith"
            description="Create professional copy-pasteable HTML email signatures for your mail apps."
            icon={<Mail className="w-6 h-6 text-pink-500" />}
            href="/tools/signature-smith"
            isNew
          />
          <ToolCard
            title="QR & Barcode Generator"
            description="Generate high-resolution QR codes and barcodes for URLs, text, and catalog IDs."
            icon={<QrCode className="w-6 h-6 text-blue-500" />}
            href="/tools/qr-generator"
          />
        </div>
      </section>

      {/* Experimental Labs */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 border-t w-full">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Experimental Labs
            </h2>
            <p className="text-muted-foreground text-sm">
              Early previews of utility concepts currently in active development.
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300 max-w-md">
            <strong>Preview Mode:</strong> These tools are fully functional but are undergoing design upgrades and refinement.
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ToolCard
            title="Jar Label Generator"
            description="Design and print custom jar labels for canning, pantries, and small-batch products."
            icon={<Package className="w-6 h-6 text-amber-600" />}
            href="/tools/jar-label-generator"
            isNew
            isPreview
          />
          <ToolCard
            title="Zone Zapper"
            description="Find the perfect meeting time across timezones for remote teams."
            icon={<Globe className="w-6 h-6 text-cyan-600" />}
            href="/tools/zone-zapper"
            isPreview
          />
          <ToolCard
            title="Pixel Pruner"
            description="Resize and compress images locally in your browser to save bandwidth."
            icon={<ImageIcon className="w-6 h-6 text-cyan-500" />}
            href="/tools/pixel-pruner"
            isNew
            isPreview
          />
          <ToolCard
            title="Label Creator"
            description="Design and print custom labels with Avery templates and spreadsheet mail merge."
            icon={<Tags className="w-6 h-6 text-purple-500" />}
            href="/tools/label-creator"
            isPreview
          />
          <ToolCard
            title="Table Tuner"
            description="Convert CSV/Excel data to Markdown, HTML, JSON, and ASCII tables."
            icon={<Table className="w-6 h-6 text-teal-600" />}
            href="/tools/table-tuner"
            isPreview
          />
          <ToolCard
            title="Brochure Builder"
            description="Design and print tri-fold and bi-fold brochures with ease."
            icon={<BookOpen className="w-6 h-6 text-sky-600" />}
            href="/tools/brochure-builder"
            isPreview
          />

          <ToolCard
            title="Greeting Card"
            description="Create folded greeting cards."
            icon={<Heart className="w-6 h-6 text-red-500" />}
            href="/tools/greeting-card"
            isNew
            isPreview
          />
          <ToolCard
            title="Team Taggler"
            description="Pick winners and split teams instantly."
            icon={<Users className="w-6 h-6 text-indigo-500" />}
            href="/tools/team-taggler"
            isNew
            isPreview
          />
          <ToolCard
            title="Name Tent Maker"
            description="Create foldable name tents for meetings and events."
            icon={<Tent className="w-6 h-6 text-rose-500" />}
            href="/tools/name-tent"
            isPreview
          />
          <ToolCard
            title="Word Formatter"
            description="Fix formatting issues in text and export to Markdown."
            icon={<FileText className="w-6 h-6 text-indigo-600" />}
            href="/tools/word-formatter"
            isPreview
          />
        </div>
      </section>
    </main>
  )
}
