"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProjectIntro() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 添加小延迟确保DOM完全渲染后再触发动画
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 避免hydration不匹配，在服务端不应用动画类
  const getAnimationClass = (delay = "") => {
    if (!mounted) {
      return "opacity-100 translate-y-0"; // 服务端渲染时直接显示
    }
    const baseClasses =
      "bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 group cursor-pointer";
    const animationClasses = `transition-all duration-1000 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`;
    return `${baseClasses} ${animationClasses}`;
  };

  const getHeaderAnimationClass = () => {
    if (!mounted) {
      return "text-center opacity-100 translate-y-0";
    }
    return `text-center transition-all duration-1000 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`;
  };

  const getOverviewAnimationClass = () => {
    if (!mounted) {
      return "bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl opacity-100 translate-y-0";
    }
    return `bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>

      <section className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24">
        {/* Header */}
        <div className={getHeaderAnimationClass()}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Project Introduction
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover how we're building the future of
            <span className="font-semibold text-blue-600">
              {" "}
              democratic participation
            </span>{" "}
            with
            <span className="font-semibold text-purple-600">
              {" "}
              cutting-edge technology
            </span>
          </p>
        </div>

        {/* Project Overview */}
        <div className={getOverviewAnimationClass()}>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Project Overview
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            This project is a demonstrative Web3 governance platform that
            combines real-time front-end interaction, back-end cloud services,
            and blockchain polling contracts. It aims to provide a transparent
            and privacy-protected community decision-making mechanism.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Development Method */}
          <div
            className={getAnimationClass("600ms")}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Development Method
              </h3>
            </div>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  1
                </span>
                <span>
                  Use <strong>Create Next App</strong> to establish the App
                  Router architecture (TypeScript).
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  2
                </span>
                <span>
                  Integrate <strong>Tailwind CSS 4</strong> and{" "}
                  <strong>shadcn/ui</strong> CLI-generated accessibility
                  components.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  3
                </span>
                <span>
                  Set up authentication and database integration with{" "}
                  <strong>Supabase</strong> for secure user management.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  4
                </span>
                <span>
                  Follow <strong>Git Flow</strong>:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    dev → feature → PR
                  </code>
                  , and use Atomic Commit practices.
                </span>
              </li>
            </ol>
          </div>

          {/* Frontend Architecture */}
          <div
            className={getAnimationClass("700ms")}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Frontend Architecture
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Next.js 15</strong> (App Router): Supports React
                  Server Components and Route Handlers.
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Tailwind CSS</strong> + <strong>shadcn/ui</strong>:
                  Quickly create modern layouts and accessible UI components.
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Responsive Design</strong>: Clean navigation and
                  mobile-friendly interface with modern card-based layouts.
                </span>
              </li>
            </ul>
          </div>

          {/* Backend Services */}
          <div
            className={getAnimationClass("800ms")}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Backend Services
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Next.js Route Handler</strong>:{" "}
                  <code className="bg-gray-100 px-1 rounded">/api/*</code> for
                  initiating polls, voting, AI fact-checking, etc., REST API.
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Supabase</strong>: Auth (SiWE), Postgres database for
                  storing polls and discussions.
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Edge Functions</strong>: Future plans to move image
                  storage and caching to Vercel Edge Runtime.
                </span>
              </li>
            </ul>
          </div>

          {/* Blockchain Technology */}
          <div
            className={getAnimationClass("900ms")}
            style={{ transitionDelay: "900ms" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Blockchain Technology
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Polling Contracts</strong>: Written in Solidity{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    VotingContract.sol
                  </code>
                  ,{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    ProposalRegistry.sol
                  </code>
                  , deployed on Sepolia or Polygon PoS.
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Celo Self Protocol</strong>: Uses ZK methods to verify
                  real humans and resist Sybil attacks.
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 mt-2"></div>
                <span>
                  <strong>Web3 Integration</strong>: Future plans to integrate
                  wallet connectivity and smart contract interactions for
                  decentralized voting.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Future Plans */}
        <div className="border border-gray-300 rounded-lg p-8 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Future Plans
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold mb-2">Layer 2 Support</h4>
              <p className="text-sm text-gray-600">
                Support Base, Arbitrum to reduce gas costs
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏛️</span>
              </div>
              <h4 className="font-semibold mb-2">DAO Management</h4>
              <p className="text-sm text-gray-600">
                Add fund management and automatic execution modules
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">
                Sentiment analysis and public opinion monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            href="/"
            className="text-primary underline hover:text-primary/80"
          >
            Return to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
