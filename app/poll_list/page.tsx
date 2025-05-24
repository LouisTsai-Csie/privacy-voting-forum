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
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  ></path>
                </svg>
                <span className="font-semibold text-gray-700">
                  Community Voting
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Polls List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="text-xl text-gray-600 font-medium">
                Loading...
              </div>
            </div>
          ) : polls.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-xl text-gray-600 font-medium">
                No polls available at the moment.
              </div>
            </div>
          ) : (
            polls.map((poll: Poll, index: number) => (
              <div
                key={poll.id}
                className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 group cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100 + 600}ms` }}
              >
                <div className="flex flex-col h-full">
                  {/* Poll Header */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {poll.title}
                      </h3>
                      <div
                        className={`ml-3 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          isPollExpired(poll.end_date)
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isPollExpired(poll.end_date) ? "Expired" : "Active"}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-3 leading-relaxed">
                      {poll.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Deadline: {new Date(poll.end_date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Poll Options */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-3 text-gray-800 flex items-center">
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        ></path>
                      </svg>
                      Options ({poll.options.length})
                    </h4>
                    <div className="space-y-2 mb-4">
                      {poll.options.map(
                        (option: { text: string }, index: number) => (
                          <div
                            key={index}
                            className={`flex items-center p-3 rounded-lg transition-colors duration-200 border border-transparent ${
                              isPollExpired(poll.end_date)
                                ? "bg-gray-50 text-gray-500"
                                : "hover:bg-blue-50 hover:border-blue-200"
                            }`}
                          >
                            <input
                              type="radio"
                              id={`option-${poll.id}-${index}`}
                              name={`poll-${poll.id}`}
                              value={option.text}
                              onChange={() =>
                                handleVoteSelection(poll.id, option.text)
                              }
                              disabled={isPollExpired(poll.end_date)}
                              className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                            />
                            <label
                              htmlFor={`option-${poll.id}-${index}`}
                              className={`text-sm font-medium cursor-pointer flex-1 ${
                                isPollExpired(poll.end_date)
                                  ? "text-gray-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {option.text}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-auto">
                    <Button
                      onClick={handleVote}
                      className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                        isPollExpired(poll.end_date)
                          ? "bg-gray-200/80 backdrop-blur-sm text-gray-500 cursor-not-allowed border border-gray-300"
                          : selectedVotes[poll.id]
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border border-blue-400/50"
                          : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-blue-700 hover:text-white hover:from-blue-600 hover:to-purple-600 border border-blue-300/50 hover:border-blue-500"
                      }`}
                      disabled={
                        !selectedVotes[poll.id] || isPollExpired(poll.end_date)
                      }
                    >
                      <div className="flex items-center justify-center space-x-2 relative z-10">
                        {isPollExpired(poll.end_date) ? (
                          <>
                            <svg
                              className="w-4 h-4"
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
                              className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
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
                              className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
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
                        className="w-full py-3 px-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-gray-700 hover:text-blue-600 hover:bg-white/60 hover:border-blue-400/50 font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-center space-x-2 relative z-10">
                          <svg
                            className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
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
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Navigation */}
        <div
          className={`text-center pt-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/initiate_poll">
              <Button className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px]">
                <div className="flex items-center justify-center space-x-3">
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
                  <span>Create New Poll</span>
                </div>
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="px-10 py-5 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-2xl text-lg font-semibold bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300 min-w-[200px]"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
