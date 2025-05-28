"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePollContext } from "@/app/context/PollContext";
import axios from "axios";

export default function Home() {
  const { addPoll } = usePollContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [options, setOptions] = useState([
    { text: "", description: "" },
    { text: "", description: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePollCreation = async () => {
    const missingFields = [];

    if (!title.trim()) {
      missingFields.push("Poll Title");
    }

    if (!description.trim()) {
      missingFields.push("Poll Description");
    }

    if (!deadline) {
      missingFields.push("Poll Deadline");
    }

    const emptyOptions = options.some((opt) => !opt.text.trim());
    if (emptyOptions) {
      missingFields.push("All Poll Options");
    }

    if (missingFields.length > 0) {
      alert(
        `Please complete the following required fields:\n• ${missingFields.join(
          "\n• "
        )}`
      );
      return;
    }

    const newPoll = {
      title,
      description,
      options: options.map((option) => ({
        text: option.text,
        ...(option.description.trim() && {
          description: option.description.trim(),
        }),
      })),
      creator: "0aa2b811-9fa4-4334-8f0e-1dddf7e18694",
      end_date: deadline,
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/poll/create", newPoll);
      if (response.status === 201) {
        alert(`You have initiated a poll: ${title}`);
        setTitle("");
        setDescription("");
        setDeadline("");
        setOptions([
          { text: "", description: "" },
          { text: "", description: "" },
        ]);
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    setOptions([...options, { text: "", description: "" }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleOptionDescriptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].description = value;
    setOptions(newOptions);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>

      <section className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-24">
        {/* Header */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Create Poll
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Set up a new voting poll for your community with complete
            <span className="font-semibold text-blue-600"> privacy</span> and
            <span className="font-semibold text-purple-600"> transparency</span>
          </p>
        </div>

        {/* Enhanced Form Container */}
        <div
          className={`relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Enhanced Form Notice */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border border-blue-200/50 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="text-blue-700 font-medium">
                <span className="text-red-500 font-bold">*</span> Required
                fields must be completed to create your poll
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Enhanced Poll Title */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-3 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    ></path>
                  </svg>
                </div>
                <label
                  htmlFor="title"
                  className="text-lg font-bold text-gray-800"
                >
                  Poll Title <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter a compelling and clear poll title"
                  className={`w-full px-6 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none transition-all duration-300 ${
                    focusedField === "title"
                      ? "border-blue-500 shadow-lg shadow-blue-500/25 scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  required
                />
                {focusedField === "title" && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Enhanced Poll Description */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-3 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <label
                  htmlFor="description"
                  className="text-lg font-bold text-gray-800"
                >
                  Poll Description <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              <div className="relative">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setFocusedField("description")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Provide a comprehensive description of your poll's purpose and context"
                  rows={4}
                  className={`w-full px-6 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none transition-all duration-300 resize-none ${
                    focusedField === "description"
                      ? "border-emerald-500 shadow-lg shadow-emerald-500/25 scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  required
                />
                {focusedField === "description" && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Enhanced Deadline */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <label
                  htmlFor="deadline"
                  className="text-lg font-bold text-gray-800"
                >
                  Poll Deadline <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  onFocus={() => setFocusedField("deadline")}
                  onBlur={() => setFocusedField(null)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-6 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none transition-all duration-300 ${
                    focusedField === "deadline"
                      ? "border-purple-500 shadow-lg shadow-purple-500/25 scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  required
                />
                {focusedField === "deadline" && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Enhanced Options */}
            <div className="group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    Poll Options <span className="text-red-500 ml-1">*</span>
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={addOption}
                  variant="ghost"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hover:text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-colors transition-shadow duration-300 cursor-pointer border-0"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Add Option
                </Button>
              </div>
              <div className="space-y-6">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="relative border-2 border-gray-200/50 rounded-2xl p-6 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-colors transition-shadow duration-300 group"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible
                        ? "translateY(0)"
                        : "translateY(20px)",
                    }}
                  >
                    {/* Option Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-bold text-gray-800 text-lg">
                          Option {index + 1}
                        </span>
                      </div>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          onClick={() => removeOption(index)}
                          variant="ghost"
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white hover:text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-colors transition-shadow duration-300 cursor-pointer border-0"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Option Text */}
                      <div>
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 mr-2 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            ></path>
                          </svg>
                          <label className="text-sm font-bold text-gray-700">
                            Option Text <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            onFocus={() => setFocusedField(`option-${index}`)}
                            onBlur={() => setFocusedField(null)}
                            placeholder={`Enter option ${index + 1} text`}
                            className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none transition-all duration-300 ${
                              focusedField === `option-${index}`
                                ? "border-blue-500 shadow-lg shadow-blue-500/25"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            required
                          />
                          {focusedField === `option-${index}` && (
                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>
                          )}
                        </div>
                      </div>

                      {/* Option Description */}
                      <div>
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 mr-2 text-emerald-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                          <label className="text-sm font-bold text-gray-700">
                            Option Description{" "}
                            <span className="text-gray-400 font-normal">
                              (Optional)
                            </span>
                          </label>
                        </div>
                        <div className="relative">
                          <textarea
                            value={option.description}
                            onChange={(e) =>
                              handleOptionDescriptionChange(
                                index,
                                e.target.value
                              )
                            }
                            onFocus={() => setFocusedField(`desc-${index}`)}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Add additional details about this option (optional)"
                            rows={2}
                            className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none transition-all duration-300 resize-none ${
                              focusedField === `desc-${index}`
                                ? "border-emerald-500 shadow-lg shadow-emerald-500/25"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          />
                          {focusedField === `desc-${index}` && (
                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <div className="pt-8 border-t-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
              <div className="relative">
                <Button
                  onClick={handlePollCreation}
                  disabled={isSubmitting}
                  variant="ghost"
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white hover:text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-colors transition-shadow duration-500 cursor-pointer relative overflow-hidden group border-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Your Poll...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          ></path>
                        </svg>
                        <span>Launch Poll</span>
                        <svg
                          className="w-6 h-6"
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
                      </>
                    )}
                  </div>
                </Button>
                {!isSubmitting && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Link
              href="/poll_list"
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hover:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-colors transition-shadow duration-300 cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
              View All Polls
            </Link>
            <Link
              href="/"
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-colors transition-shadow duration-300 cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
