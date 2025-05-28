"use client";

import { usePollContext, Poll } from "@/app/context/PollContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function PollsList() {
  const [selectedVotes, setSelectedVotes] = useState<{ [key: string]: string }>(
    {}
  );
  const [confirmVote, setConfirmVote] = useState<{
    pollId: string;
    option: string;
  } | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // 检查poll是否已过期
  const isPollExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // 获取活跃poll数量
  const activePollsCount = polls.filter(
    (poll) => !isPollExpired(poll.end_date)
  ).length;

  useEffect(() => {
    setIsVisible(true);
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/poll");
        setPolls(response.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleVoteSelection = (pollId: string, option: string) => {
    setSelectedVotes({ ...selectedVotes, [pollId]: option });
    setConfirmVote({ pollId, option });
  };

  const handleVote = () => {
    if (confirmVote) {
      alert(
        `You have voted for ${confirmVote.option} on poll ${confirmVote.pollId}`
      );
      setConfirmVote(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>

      <section className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-24">
        {/* Header */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Poll List
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse and participate in community voting polls with complete
            <span className="font-semibold text-blue-600"> privacy</span> and
            <span className="font-semibold text-purple-600"> transparency</span>
          </p>
        </div>

        {/* Stats Bar */}
        {!loading && polls.length > 0 && (
          <div
            className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-sm"></div>
                <span className="font-semibold text-gray-700">
                  {activePollsCount} Active Poll
                  {activePollsCount !== 1 ? "s" : ""}
                </span>
              </div>
              {polls.length - activePollsCount > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-sm"></div>
                  <span className="font-semibold text-gray-700">
                    {polls.length - activePollsCount} Expired Poll
                    {polls.length - activePollsCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Polls List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div
                className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="text-xl text-gray-600 font-medium">
                    Loading polls...
                  </div>
                </div>
              </div>
            </div>
          ) : polls.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div
                className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
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
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-xl text-gray-600 font-medium">
                    No polls available at the moment.
                  </div>
                  <p className="text-gray-500">
                    Be the first to create a poll for the community!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            polls.map((poll: Poll, index: number) => (
              <div
                key={poll.id}
                className={`relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${
                  isPollExpired(poll.end_date)
                    ? "hover:scale-[1.02]"
                    : "hover:scale-[1.03]"
                }`}
                style={{ transitionDelay: `${index * 100 + 600}ms` }}
              >
                <div className="flex flex-col h-full">
                  {/* Enhanced Poll Header */}
                  <div className="border-b-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 pb-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 flex-1 mr-4">
                        {poll.title}
                      </h3>
                      <div
                        className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap shadow-lg ${
                          isPollExpired(poll.end_date)
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        }`}
                      >
                        {isPollExpired(poll.end_date) ? "Expired" : "Active"}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-lg">
                      {poll.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-50/80 backdrop-blur-sm rounded-xl px-4 py-2">
                      <svg
                        className="w-5 h-5 mr-2 text-purple-500"
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
                      <span className="font-semibold">
                        Deadline: {new Date(poll.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Poll Options */}
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
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
                      <h4 className="font-bold text-lg text-gray-800">
                        Options ({poll.options.length})
                      </h4>
                    </div>
                    <div className="space-y-3 mb-6">
                      {poll.options.map(
                        (option: { text: string }, optionIndex: number) => (
                          <div
                            key={optionIndex}
                            className={`relative flex items-center p-4 rounded-2xl transition-all duration-300 border-2 ${
                              isPollExpired(poll.end_date)
                                ? "bg-gray-50/80 text-gray-500 border-gray-200/50"
                                : selectedVotes[poll.id] === option.text
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400/50 shadow-lg scale-[1.02]"
                                : "bg-white/60 backdrop-blur-sm border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 hover:border-blue-300/50 hover:shadow-md hover:scale-[1.01]"
                            }`}
                          >
                            <input
                              type="radio"
                              id={`option-${poll.id}-${optionIndex}`}
                              name={`poll-${poll.id}`}
                              value={option.text}
                              onChange={() =>
                                handleVoteSelection(poll.id, option.text)
                              }
                              disabled={isPollExpired(poll.end_date)}
                              className="mr-4 w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                            />
                            <label
                              htmlFor={`option-${poll.id}-${optionIndex}`}
                              className={`font-semibold cursor-pointer flex-1 ${
                                isPollExpired(poll.end_date)
                                  ? "text-gray-500"
                                  : selectedVotes[poll.id] === option.text
                                  ? "text-blue-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {option.text}
                            </label>
                            {selectedVotes[poll.id] === option.text &&
                              !isPollExpired(poll.end_date) && (
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
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
                                      d="M5 13l4 4L19 7"
                                    ></path>
                                  </svg>
                                </div>
                              )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mt-auto">
                    <Button
                      onClick={handleVote}
                      className={`flex-1 font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:text-white cursor-pointer relative overflow-hidden group shadow-lg hover:shadow-xl ${
                        isPollExpired(poll.end_date)
                          ? "bg-gray-200/80 backdrop-blur-sm text-gray-500 cursor-not-allowed border-2 border-gray-300"
                          : selectedVotes[poll.id]
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-[1.05] border-2 border-blue-400/50"
                          : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-blue-700 hover:text-white hover:from-blue-600 hover:to-purple-600 border-2 border-blue-300/50 hover:border-blue-500 hover:scale-[1.05]"
                      }`}
                      disabled={
                        !selectedVotes[poll.id] || isPollExpired(poll.end_date)
                      }
                    >
                      <div className="flex items-center justify-center space-x-3 relative z-10">
                        {isPollExpired(poll.end_date) ? (
                          <>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <span>Poll Expired</span>
                          </>
                        ) : selectedVotes[poll.id] ? (
                          <>
                            <svg
                              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
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
                            <span>Cast Vote</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
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
                            <span>Select Option</span>
                          </>
                        )}
                      </div>
                      {!isPollExpired(poll.end_date) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </Button>
                    <Link href={`/polls/${poll.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full py-4 px-6 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-white/60 text-gray-700 hover:text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:border-blue-500 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] cursor-pointer group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-center space-x-3 relative z-10">
                          <svg
                            className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            ></path>
                          </svg>
                          <span>View Details</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Navigation */}
        <div
          className={`text-center pt-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/initiate_poll">
              <Button className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:text-white rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 min-w-[200px] cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <svg
                    className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
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
                  <span>Create New Poll</span>
                </div>
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="px-10 py-5 border-2 border-white/60 hover:border-blue-500 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 rounded-2xl text-lg font-bold bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 min-w-[200px] cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <svg
                    className="w-6 h-6 group-hover:animate-pulse"
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
                  <span>Return to Home</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
