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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

/* ======================
   Navigation Links Configuration
   To add new pages, just push into the links array
   ====================== */
const links = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/poll_list", label: "Poll List", icon: "📊" },
  { href: "/initiate_poll", label: "Create Poll", icon: "✨" },
  { href: "/project-intro", label: "Project Intro", icon: "🚀" },
  { href: "/about_us", label: "About Us", icon: "👥" },
];

/* ======================
   Navbar Main Component
   ====================== */
export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-black/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo with Animation */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            PVF
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2 bg-gray-50/80 rounded-full px-3 py-2 backdrop-blur-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 group",
                pathname === link.href
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
              {pathname === link.href && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side - Auth Buttons with Images */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* MetaMask Button */}
          <button className="group relative w-10 h-10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
            <img
              src="/images/login/MetaMask.webp"
              alt="MetaMask"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Self Protocol Button */}
          <button className="group relative w-10 h-10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
            <img
              src="/images/login/SelfProtocol.jpg"
              alt="Self Protocol"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="lg:hidden relative p-2 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="w-4 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-5"></span>
                <span className="w-5 h-0.5 bg-gray-600 mt-1 transition-all duration-300"></span>
                <span className="w-4 h-0.5 bg-gray-600 mt-1 transition-all duration-300 group-hover:w-5"></span>
              </div>
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50"
          >
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center space-x-3 py-6 pr-4 border-b border-gray-200 ml-auto mr-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  Privacy Voting Forum
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 pt-8">
                <div className="space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                        pathname === link.href
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="font-medium">{link.label}</span>
                      {pathname === link.href && (
                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Mobile Footer */}
              <div className="py-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6">
                  {/* MetaMask Button */}
                  <button className="group relative w-12 h-12 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                    <img
                      src="/images/login/MetaMask.webp"
                      alt="MetaMask"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Self Protocol Button */}
                  <button className="group relative w-12 h-12 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                    <img
                      src="/images/login/SelfProtocol.jpg"
                      alt="Self Protocol"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
