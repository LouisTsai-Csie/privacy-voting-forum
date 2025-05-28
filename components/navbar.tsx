/* components/navbar.tsx
 * ------------------------------------------------------------
 * Global Navigation Bar (UI Only)
 * - Wallet connection, Self Protocol verification (dynamic import), createUser, and disconnect.
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
  SheetHeader,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { metaMask } from "@wagmi/connectors";
import { hashEndpointWithScope } from "@selfxyz/core";

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
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [selfModule, setSelfModule] = useState<{
    SelfAppBuilder: any;
    SelfQRcodeWrapper: React.ComponentType<any>;
  } | null>(null);

  const [selfApp, setSelfApp] = useState<any>(null);
  const [selfVerified, setSelfVerified] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    import("@selfxyz/qrcode").then((mod) => {
      setSelfModule({
        SelfAppBuilder: mod.SelfAppBuilder,
        SelfQRcodeWrapper: mod.default,
      });
    });
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !isConnected || !address || !selfModule) return;
    const endpoint = process.env.NEXT_PUBLIC_SELF_ENDPOINT || "";
    const scope = process.env.NEXT_PUBLIC_SELF_SCOPE || "";
    const isLocal =
      endpoint.startsWith("http://localhost") ||
      endpoint.startsWith("http://127.0.0.1");
    const isSecure = endpoint.startsWith("https://");
    if (!isSecure && !isLocal) {
      console.error(
        "NEXT_PUBLIC_SELF_ENDPOINT must start with https:// or http://localhost",
        endpoint
      );
      return;
    }
    const app = new selfModule.SelfAppBuilder({
      appName: "Privacy Voting Forum",
      scope: scope,
      endpoint: endpoint,
      endpointType: "staging_https",
      userId: address,
      userIdType: "hex",
    }).build();
    setSelfApp(app);
    const hashScope = hashEndpointWithScope(endpoint, scope);
    console.log("Endpoint: ", endpoint);
    console.log("Scope: ", scope);
    console.log("Hash Scope: ", hashScope);
  }, [mounted, isConnected, address, selfModule]);

  const handleSelfSuccess = async (result?: any) => {
    if (!address) return;
    let passport_id: string;
    if (result && result.credentialSubject && result.credentialSubject.passport_number) {
      passport_id = result.credentialSubject.passport_number as string;
    } else if (selfApp) {
      const { passport_number } = await selfApp.getCredentialSubject();
      passport_id = passport_number as string;
    } else {
      return;
    }
    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_address: address,
        passport_id,
        self_verified: true,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setSelfVerified(true);
    } else {
      console.error("createUser failed", json);
      alert(json.message || "Login failed");
    }
  };

  // for testing ===========================
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      // @ts-ignore
      window.handleSelfSuccess = handleSelfSuccess;
      // @ts-ignore
      window.fakeSelfResult = { credentialSubject: { passport_number: "N87654321" } };
    }
  }, [handleSelfSuccess]);

  // DEV BYPASS FUNCTION: test createUser API with fake passport id
  const handleBypass = async () => {
    const fakePassportId = "DEV-FAKE-PASSPORT-12345";
    console.log("Bypass: calling createUser with fakePassportId", fakePassportId);
    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_address: address,
        passport_id: fakePassportId,
        self_verified: true,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      console.log("Bypass createUser success", json);
      setSelfVerified(true);
    } else {
      console.error("Bypass createUser failed", json);
      alert(json.message || "Bypass createUser failed");
    }
  };
  // for testing ===========================

  const QRComponent = selfModule?.SelfQRcodeWrapper;

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
          {mounted &&
            (isConnected ? (
              !selfVerified ? (
                <>
                  {/* Self Protocol Button - Show after wallet connected */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="group relative w-10 h-10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                        <img
                          src="/images/login/SelfProtocol.jpg"
                          alt="Self Protocol"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 p-6 bg-white/95 backdrop-blur-xl">
                      <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-gray-800 mb-4">Self Verification</SheetTitle>
                      </SheetHeader>
                      {/* DEV BYPASS BUTTON */}
                      {process.env.NODE_ENV === "development" && (
                        <button
                          onClick={handleBypass}
                          className="mb-4 w-full px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          （DEV）模擬 Self 驗證
                        </button>
                      )}
                      {selfApp && QRComponent ? (
                        <>
                          <p className="mb-4 text-gray-600">請用 Self App 掃描 QR Code：</p>
                          <div className="flex justify-center">
                            <QRComponent
                              selfApp={selfApp}
                              size={280}
                              onSuccess={(result: any) => handleSelfSuccess(result)}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-600">Loading Self verification...</p>
                      )}
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <button
                      onClick={() => disconnect()}
                      className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                {/* MetaMask Button - Show when not connected */}
                <button 
                  onClick={() => connect({ connector: metaMask() })}
                  className="group relative w-10 h-10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <img
                    src="/images/login/MetaMask.webp"
                    alt="MetaMask"
                    className="w-full h-full object-cover"
                  />
                </button>
              </>
            ))}
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
                <div className="flex flex-col items-center space-y-4">
                  {mounted &&
                    (isConnected ? (
                      !selfVerified ? (
                        <Sheet>
                          <SheetTrigger asChild>
                            <button className="group relative w-12 h-12 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                              <img
                                src="/images/login/SelfProtocol.jpg"
                                alt="Self Protocol"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-80 p-6 bg-white/95 backdrop-blur-xl">
                            <SheetHeader>
                              <SheetTitle className="text-xl font-bold text-gray-800 mb-4">Self Verification</SheetTitle>
                            </SheetHeader>
                            {/* DEV BYPASS BUTTON */}
                            {process.env.NODE_ENV === "development" && (
                              <button
                                onClick={handleBypass}
                                className="mb-4 w-full px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                （DEV）模擬 Self 驗證
                              </button>
                            )}
                            {selfApp && QRComponent ? (
                              <>
                                <p className="mb-4 text-gray-600">請用 Self App 掃描 QR Code：</p>
                                <div className="flex justify-center">
                                  <QRComponent
                                    selfApp={selfApp}
                                    size={280}
                                    onSuccess={(result: any) => handleSelfSuccess(result)}
                                  />
                                </div>
                              </>
                            ) : (
                              <p className="text-gray-600">Loading Self verification...</p>
                            )}
                          </SheetContent>
                        </Sheet>
                      ) : (
                        <div className="w-full px-6 space-y-3">
                          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium text-center">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                          </div>
                          <button
                            onClick={() => disconnect()}
                            className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                          >
                            Logout
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center">
                        {/* MetaMask Button */}
                        <button 
                          onClick={() => connect({ connector: metaMask() })}
                          className="group relative w-12 h-12 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                        >
                          <img
                            src="/images/login/MetaMask.webp"
                            alt="MetaMask"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
