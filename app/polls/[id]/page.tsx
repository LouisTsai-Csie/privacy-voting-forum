"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Poll {
  id: string;
  title: string;
  description: string;
  end_date: string;
  options: { text: string; description?: string }[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export default function PollDetail() {
  const params = useParams();
  const pollId = params?.id as string;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (pollId) {
      fetchPollDetail();
      fetchComments();
    }
  }, [pollId]);

  const fetchPollDetail = async () => {
    try {
      setLoading(true);

      try {
        const response = await axios.get(`/api/poll/${pollId}`);
        const rawData = response.data;
        const transformedPoll: Poll = {
          id: rawData.id,
          title: rawData.title,
          description: rawData.description,
          end_date: rawData.end_date || rawData.deadline,
          options: rawData.options,
        };
        setPoll(transformedPoll);
        return;
      } catch (apiError) {
        console.warn("Single poll API failed, trying fallback...", apiError);
      }

      const allPollsResponse = await axios.get("/api/poll");
      const targetPoll = allPollsResponse.data.find(
        (p: any) => p.id.toString() === pollId
      );

      if (targetPoll) {
        const transformedPoll: Poll = {
          id: targetPoll.id,
          title: targetPoll.title,
          description: targetPoll.description,
          end_date: targetPoll.end_date || targetPoll.deadline,
          options: targetPoll.options,
        };
        setPoll(transformedPoll);
      } else {
        setError("找不到此投票");
      }
    } catch (error) {
      console.error("Error fetching poll:", error);
      setError("無法載入投票詳情");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    // TODO: 實作留言 API 後替換
    // 目前為模擬資料
    const mockComments: Comment[] = [
      {
        id: "1",
        author: "Satoshi Nakamoto",
        content:
          "This poll topic is very interesting. I think Option 1 is more suitable for our community needs.",
        timestamp: "2024-01-15 10:30",
      },
      {
        id: "2",
        author: "Vitalik Buterin",
        content:
          "I have a different perspective. Option 2 might better align with our long-term goals and practical requirements.",
        timestamp: "2024-01-15 11:45",
      },
    ];
    setComments(mockComments);
  };

  const handleVote = () => {
    if (!selectedOption) {
      alert("Please select an option");
      return;
    }
    // TODO: 實作投票 API
    alert(`You have voted for: ${selectedOption}`);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !commentAuthor.trim()) {
      alert("Please fill in both name and comment");
      return;
    }

    // TODO: 實作新增留言 API
    const comment: Comment = {
      id: Date.now().toString(),
      author: commentAuthor,
      content: newComment,
      timestamp: new Date().toLocaleString("en-US"),
    };

    setComments([...comments, comment]);
    setNewComment("");
    setCommentAuthor("");
    alert("Comment added successfully!");
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
              Poll Details
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            View poll information and participate in
            <span className="font-semibold text-blue-600"> secure voting</span>
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div
            className={`text-center py-12 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
              <div className="text-lg text-gray-600 font-medium">
                Loading...
              </div>
            </div>
          </div>
        ) : error || !poll ? (
          <div
            className={`text-center py-12 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
              <div className="text-lg text-red-600 font-medium mb-4">
                {error || "Poll not found"}
              </div>
              <Link
                href="/poll_list"
                className="text-blue-600 underline hover:text-blue-700 transition-colors"
              >
                Return to Poll List
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Poll Details Header */}
            <div
              className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl text-center transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                {poll.title}
              </h3>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                {poll.description}
              </p>
              <div className="flex items-center justify-center text-sm text-gray-600">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>Deadline: {poll.end_date}</span>
              </div>
            </div>

            {/* Voting Section */}
            <div
              className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-blue-600"
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
                Voting Options
              </h2>
              <div className="space-y-4 mb-6">
                {poll.options.map((option, index) => (
                  <div
                    key={index}
                    className={`relative border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      selectedOption === option.text
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md bg-white/50 backdrop-blur-sm"
                    }`}
                    onClick={() => setSelectedOption(option.text)}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="vote-option"
                        value={option.text}
                        checked={selectedOption === option.text}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="mt-1.5 mr-4 w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`option-${index}`}
                          className="text-lg font-semibold cursor-pointer block text-gray-800 mb-2"
                        >
                          {option.text}
                        </label>
                        {option.description && option.description.trim() && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {selectedOption === option.text && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button
                onClick={handleVote}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center justify-center space-x-2">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Confirm Vote</span>
                </div>
              </Button>
            </div>

            {/* Comments Section */}
            <div
              className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "900ms" }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                Discussion
              </h2>

              {/* Add Comment Form */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-xl border border-blue-200/30">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                  Share Your Thoughts
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={commentAuthor}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCommentAuthor(e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <textarea
                    placeholder="Share your thoughts about this poll..."
                    value={newComment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewComment(e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                  <Button
                    onClick={handleAddComment}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center justify-center space-x-2">
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                      <span>Post Comment</span>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                    ></path>
                  </svg>
                  All Comments ({comments.length})
                </h3>
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {comment.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-semibold text-blue-700">
                            {comment.author}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed pl-13">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <Link
            href="/poll_list"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Return to Poll List
          </Link>
        </div>
      </section>
    </main>
  );
}
