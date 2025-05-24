"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import TeamMemberAvatar from "./components/TeamMemberAvatar";

const teamMembers = [
  {
    name: "陳竹欣 Bamboo",
    position: "Smart Contract Engineer",
    description:
      "Writes and tests smart contracts to ensure correct logic and security.",
    photo: "/images/team_member/bamboo.png",
  },
  {
    name: "蔡佳誠 Louis",
    position: "Backend Engineer",
    description:
      "Designs databases and implements APIs to ensure stable backend data flow.",
    photo: "/images/team_member/louis.png",
  },
  {
    name: "步家霖 Charlie",
    position: "Frontend Engineer",
    description:
      "Develops user interfaces, implements voting pages, and comment features.",
    photo: "/images/team_member/charlie.png",
  },
  {
    name: "許智皓 Howard",
    position: "Integration Engineer",
    description:
      "Integrates wallets and smart contracts, and introduces LLM to enhance platform interactivity.",
    photo: "/images/team_member/howard.png",
  },
];

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>

      <section className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24">
        {/* Header */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              About Us
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Meet the team behind the next generation of
            <span className="font-semibold text-blue-600">
              {" "}
              democratic participation
            </span>{" "}
            and
            <span className="font-semibold text-purple-600">
              {" "}
              blockchain governance
            </span>
          </p>
        </div>

        {/* Mission Statement */}
        <div
          className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              We are a team dedicated to promoting decentralized governance.
              Through blockchain technology and innovative solutions, we aim to
              enhance the transparency and fairness of community governance,
              ensuring every voice can be heard in a secure and verifiable
              environment.
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Our Team
            </h3>
            <p className="text-muted-foreground">
              The talented individuals driving our vision forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 text-center group cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100 + 800}ms` }}
              >
                <div className="relative mb-4">
                  <TeamMemberAvatar
                    photo={member.photo}
                    name={member.name}
                    className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  {member.name}
                </h4>
                <p className="text-blue-600 font-medium mb-3">
                  {member.position}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 text-center group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
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
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Security First
            </h4>
            <p className="text-gray-600 text-sm">
              Building secure and verifiable voting systems that protect user
              privacy while ensuring transparency.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 text-center group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Community Driven
            </h4>
            <p className="text-gray-600 text-sm">
              Empowering communities to make decisions collectively through
              democratic and inclusive processes.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 text-center group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
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
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Innovation
            </h4>
            <p className="text-gray-600 text-sm">
              Leveraging cutting-edge blockchain technology and zero-knowledge
              proofs to revolutionize governance.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border border-gray-300 rounded-lg p-8 bg-gradient-to-br from-gray-50 to-white text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Get In Touch
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            If you are interested in our project or have any questions, please
            feel free to contact us! We'd love to hear from you and discuss how
            we can work together to improve democratic participation.
          </p>
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
