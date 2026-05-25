import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-[var(--kraft)] text-[#2c1d12] dark:text-[#f2e4c8] border-t border-[var(--kraft-dark)]/20 py-8 print:hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <Link href="/" className="logo group flex items-center gap-2 select-none cursor-pointer">
                    <span className="logo-mark scale-75 origin-center animate-none" aria-hidden="true">
                        <span className="face"><span></span></span>
                    </span>
                    <span className="font-extrabold text-lg tracking-tight text-[#2c1d12] dark:text-[#f2e4c8]">TinyTask</span>
                </Link>
                
                <p className="text-center text-xs font-semibold md:text-left">
                    &copy; {new Date().getFullYear()} TinyTask. All rights reserved.
                </p>

                <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold" aria-label="Footer navigation">
                    <Link href="/#categories" className="hover:underline">Tools</Link>
                    <Link href="/collections/productivity" className="hover:underline">Collections</Link>
                    <Link href="/pricing" className="hover:underline">Pricing</Link>
                    <Link href="/about" className="hover:underline">About</Link>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                    <Link href="/terms" className="hover:underline">Terms</Link>
                </nav>
            </div>
        </footer>
    );
}
