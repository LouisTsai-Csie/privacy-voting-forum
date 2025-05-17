/* components/navbar.tsx
 * ------------------------------------------------------------
 * Global Navigation Bar (UI Only)
 * - Currently does not include wallet or db interactions.
 * ------------------------------------------------------------
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

/* ======================
   Navigation Links Configuration
   To add new pages, just push into the links array
   ====================== */
const links = [
  { href: "/", label: "Home" },
  { href: "/votes", label: "Vote List" },
  { href: "/create", label: "Initiate Vote" },
  { href: "/project-intro", label: "Project Intro" },
  { href: "/about_us", label: "About Us" },
];

/* ======================
   Navbar Main Component
   ====================== */
export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left Logo */}
        <Link href="/" className="text-lg font-semibold">
          Privacy Voting Forum
        </Link>

        {/* ========= Desktop Navigation (visible on sm and above) ========= */}
        <nav className="hidden gap-6 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground/80",
                pathname === l.href
                  ? "text-foreground font-medium"
                  : "text-foreground/60"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ======== ★ New: Mobile Hamburger Button + Drawer Menu ★ ======== */}
        <Sheet>
          {/* Trigger: Three-line button, visible below sm */}
          <SheetTrigger asChild>
            <button
              className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
              aria-label="Open menu"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </SheetTrigger>

          {/* Drawer Content: Vertical Navigation */}
          <SheetContent side="left" className="w-64 bg-white">
            <nav className="mt-8 flex flex-col gap-4 pl-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "text-base",
                    pathname === l.href
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* =========================================================
             Right Reserved Area: For future wallet connection or user info
          ========================================================= */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Currently empty */}
        </div>
      </div>
    </header>
  );
}
