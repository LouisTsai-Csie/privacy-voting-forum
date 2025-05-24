"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "🔒",
      title: "Privacy First",
      description:
        "Zero-knowledge proofs ensure complete privacy while maintaining transparency",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Built on modern blockchain technology for instant and secure voting",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "🌐",
      title: "Decentralized",
      description:
        "No central authority - powered by the community, for the community",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "🛡️",
      title: "Secure Verified",
      description:
        "Advanced cryptographic verification ensures every vote counts",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { number: "1000+", label: "Active Voters", icon: "👥" },
    { number: "250+", label: "Completed Polls", icon: "📊" },
    { number: "99.9%", label: "Uptime", icon: "🚀" },
    { number: "0", label: "Security Breaches", icon: "🔒" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20">
        <div className="mx-auto max-w-7xl">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Privacy Voting Forum
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The future of democratic decision-making is here. Experience
              <span className="font-semibold text-blue-600"> secure</span>,
              <span className="font-semibold text-purple-600">
                {" "}
                transparent
              </span>
              , and
              <span className="font-semibold text-pink-600"> private</span>{" "}
              voting powered by blockchain technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                asChild
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
              >
                <Link
                  href="/poll_list"
                  className="flex items-center justify-center space-x-3 text-white hover:text-white"
                >
                  <span>Explore Polls</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    ></path>
                  </svg>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="group px-10 py-5 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-2xl text-lg font-semibold bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300 min-w-[200px]"
              >
                <Link
                  href="/initiate_poll"
                  className="flex items-center justify-center space-x-3"
                >
                  <svg
                    className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  <span>Create Poll</span>
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 500}ms` }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Privacy Forum?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge technology to ensure your voice is heard
              while your privacy is protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150 + 800}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                ></div>
                <div className="relative">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Voting?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users making democratic decisions in a secure,
              private environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/project-intro">Learn More</Link>
              </Button>
              <Button
                asChild
                className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/about_us">About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
