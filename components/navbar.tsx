/* components/navbar.tsx
 * ------------------------------------------------------------
 * Global Navigation Bar (UI Only)
 * - Wallet connection, Self Protocol verification (dynamic import), createUser, and disconnect.
 * ------------------------------------------------------------ */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { metaMask } from "@wagmi/connectors";
import { hashEndpointWithScope } from "@selfxyz/core";

/* ======================
   Navigation Links Configuration
   ====================== */
const links = [
  { href: "/", label: "Home" },
  { href: "/poll_list", label: "Poll List" },
  { href: "/initiate_poll", label: "Initiate Poll" },
  { href: "/project-intro", label: "Project Intro" },
  { href: "/about_us", label: "About Us" },
];

/* ======================
   Navbar Main Component
   ====================== */
export default function Navbar() {
  const pathname = usePathname();
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          Privacy Voting Forum
        </Link>
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
        <Sheet>
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

          <SheetContent side="left" className="w-64 bg-white">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
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

        <div className="hidden sm:flex items-center gap-2">
          {mounted &&
            (isConnected ? (
              !selfVerified && selfApp && QRComponent ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      Complete Self Verification
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 p-4">
                    <SheetHeader>
                      <SheetTitle>Self Verification</SheetTitle>
                    </SheetHeader>
                    {/* DEV BYPASS BUTTON */}
                    {process.env.NODE_ENV === "development" && (
                      <button
                        onClick={handleBypass}
                        className="mb-4 w-full px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                      >
                        （DEV）模擬 Self 驗證
                      </button>
                    )}
                    <p className="mb-2">請用 Self App 掃描 QR Code：</p>
                    <QRComponent
                      selfApp={selfApp}
                      size={280}
                      onSuccess={(result: any) => handleSelfSuccess(result)}
                    />
                  </SheetContent>
                </Sheet>
              ) : (
                <>
                  <span className="px-4 py-2 bg-green-100 rounded">
                    {address}
                  </span>
                  <button
                    onClick={() => disconnect()}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <button
                onClick={() => connect({ connector: metaMask() })}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            ))}
        </div>
      </div>
    </header>
  );
}
