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

      <section className="relative mx-auto flex max-w-4xl flex-col gap-8 px-4 py-24">
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

        {/* Form */}
        <div
          className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Form Notice */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <span className="text-red-500">*</span> indicates required fields.
              All fields marked with an asterisk must be completed.
            </p>
          </div>

          <div className="space-y-6">
            {/* Poll Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Poll Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear and concise poll title"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Poll Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Poll Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of what this poll is about"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Deadline */}
            <div>
              <label
                htmlFor="deadline"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Poll Deadline <span className="text-red-500">*</span>
              </label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-medium text-gray-700">
                  Poll Options <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  onClick={addOption}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  Add Option
                </Button>
              </div>
              <div className="space-y-4">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">
                        Option {index + 1}
                      </span>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          onClick={() => removeOption(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:border-red-300 cursor-pointer"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Option Text <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          placeholder={`Enter option ${index + 1} text`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Option Description{" "}
                          <span className="text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                          value={option.description}
                          onChange={(e) =>
                            handleOptionDescriptionChange(index, e.target.value)
                          }
                          placeholder="Add additional details about this option (optional)"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={handlePollCreation}
                disabled={isSubmitting}
                className="w-full py-3 text-lg cursor-pointer"
              >
                {isSubmitting ? "Creating Poll..." : "Create Poll"}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            href="/poll_list"
            className="text-primary underline hover:text-primary/80 mr-6"
          >
            View Poll List
          </Link>
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
