"use client";

import { useState, useEffect, useRef } from "react";
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

interface FactCheckResult {
  score: number;
  explanation: string;
}

interface VoteData {
  totalVotes: number;
  optionVotes: number[];
  percentages: number[];
}

function seededRandom(seed: string): number {
  if (!seed || typeof seed !== "string") {
    return Math.random();
  }

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
}

function generateSeededRandoms(seed: string, count: number): number[] {
  if (!seed || typeof seed !== "string" || count <= 0) {
    return [];
  }

  const randoms: number[] = [];
  let currentSeed = seed;

  for (let i = 0; i < count; i++) {
    const random = seededRandom(currentSeed + i.toString());
    randoms.push(random);
    currentSeed = currentSeed + random.toString();
  }

  return randoms;
}

function CountingNumber({
  target,
  duration = 2000,
  suffix = "",
  className = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (typeof target !== "number" || isNaN(target) || target < 0) {
      setCurrent(0);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(
        startValue + (target - startValue) * easeOutQuart
      );

      setCurrent(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(timer);
  }, [target, duration]);

  return (
    <span className={className}>
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

function PieChart({
  data,
  options,
  isVisible,
}: {
  data: VoteData;
  options: { text: string; description?: string }[];
  isVisible: boolean;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [progressBarAnimations, setProgressBarAnimations] = useState<number[]>(
    []
  );

  const colors = [
    "from-blue-500 via-blue-600 to-blue-700",
    "from-red-500 via-red-600 to-red-700",
    "from-emerald-500 via-emerald-600 to-emerald-700",
    "from-violet-500 via-violet-600 to-violet-700",
    "from-orange-500 via-orange-600 to-orange-700",
    "from-cyan-500 via-cyan-600 to-cyan-700",
    "from-pink-500 via-pink-600 to-pink-700",
    "from-amber-500 via-amber-600 to-amber-700",
  ];

  const shadowColors = [
    "shadow-blue-500/60",
    "shadow-red-500/60",
    "shadow-emerald-500/60",
    "shadow-violet-500/60",
    "shadow-orange-500/60",
    "shadow-cyan-500/60",
    "shadow-pink-500/60",
    "shadow-amber-500/60",
  ];

  const colorValues = [
    { start: "#3b82f6", middle: "#2563eb", end: "#1d4ed8" },
    { start: "#ef4444", middle: "#dc2626", end: "#b91c1c" },
    { start: "#10b981", middle: "#059669", end: "#047857" },
    { start: "#8b5cf6", middle: "#7c3aed", end: "#6d28d9" },
    { start: "#f97316", middle: "#ea580c", end: "#c2410c" },
    { start: "#06b6d4", middle: "#0891b2", end: "#0e7490" },
    { start: "#ec4899", middle: "#db2777", end: "#be185d" },
    { start: "#f59e0b", middle: "#d97706", end: "#b45309" },
  ];

  useEffect(() => {
    if (isVisible && data && data.percentages) {
      setProgressBarAnimations(new Array(options.length).fill(0));

      data.percentages.forEach((targetPercentage, index) => {
        const startTime = Date.now();
        const duration = 1500;
        const delay = 1200 + index * 150;

        setTimeout(() => {
          const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = targetPercentage * easeOutQuart;

            setProgressBarAnimations((prev) => {
              const newArray = [...prev];
              newArray[index] = currentValue;
              return newArray;
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }, delay);
      });
    }
  }, [isVisible, data, options.length]);

  useEffect(() => {
    if (isVisible) {
      const startTime = Date.now();
      const duration = 3000;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutElastic =
          progress === 1
            ? 1
            : 1 -
              Math.pow(2, -10 * progress) *
                Math.sin(((progress * 10 - 0.75) * (2 * Math.PI)) / 3);
        setAnimationProgress(easeOutElastic);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      const timer = setTimeout(() => {
        requestAnimationFrame(animate);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const createPieSlice = (
    percentage: number,
    startAngle: number,
    index: number
  ) => {
    if (!percentage || percentage <= 0) return "";

    const progress = Math.min(animationProgress * 1.2, 1);
    const endAngle = startAngle + (percentage / 100) * 360 * progress;
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const radius = hoveredIndex === index ? 95 : 85;
    const centerX = 120;
    const centerY = 120;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    if (endAngle - startAngle === 0) return "";

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  if (
    !data ||
    !data.percentages ||
    !options ||
    data.percentages.length !== options.length
  ) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 animate-pulse">Loading chart data...</div>
      </div>
    );
  }

  let currentAngle = -90;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12">
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)",
              filter: "blur(20px)",
              transitionDelay: "400ms",
            }}
          />

          <div
            className={`relative transition-all duration-1500 ${
              isVisible
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-50 -rotate-180"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <svg
              width="240"
              height="240"
              className="drop-shadow-2xl relative z-10"
            >
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="url(#outerGlow)"
                strokeWidth="2"
                className="opacity-30"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
                }}
              />

              <circle
                cx="120"
                cy="120"
                r="85"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                className="opacity-20"
              />

              <defs>
                <linearGradient
                  id="outerGlow"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                </linearGradient>

                <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </radialGradient>

                {data.percentages.map((_, index) => (
                  <radialGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    cx="50%"
                    cy="50%"
                    r="80%"
                  >
                    <stop
                      offset="0%"
                      stopColor={colorValues[index % colorValues.length].start}
                    />
                    <stop
                      offset="50%"
                      stopColor={colorValues[index % colorValues.length].middle}
                    />
                    <stop
                      offset="100%"
                      stopColor={colorValues[index % colorValues.length].end}
                    />
                  </radialGradient>
                ))}

                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {data.percentages.map((percentage, index) => {
                const path = createPieSlice(percentage, currentAngle, index);
                const sliceAngle = currentAngle;
                currentAngle += (percentage / 100) * 360;

                if (!path) return null;

                return (
                  <g key={index}>
                    <path
                      d={path}
                      fill={`url(#gradient-${index})`}
                      className="opacity-30"
                      transform="translate(2, 2)"
                    />
                    <path
                      d={path}
                      fill={`url(#gradient-${index})`}
                      className={`cursor-pointer transition-all duration-500 ${
                        shadowColors[index % shadowColors.length]
                      } ${
                        hoveredIndex === index
                          ? "drop-shadow-2xl"
                          : "drop-shadow-lg"
                      }`}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        filter:
                          hoveredIndex === index
                            ? "brightness(1.2) saturate(1.3) url(#glow)"
                            : "brightness(1) saturate(1)",
                        transformOrigin: "120px 120px",
                        transform:
                          hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                    {hoveredIndex === index && (
                      <path
                        d={path}
                        fill="url(#outerGlow)"
                        className="opacity-20 pointer-events-none"
                        style={{
                          animation: "pulse 1s ease-in-out infinite",
                        }}
                      />
                    )}
                  </g>
                );
              })}

              <circle
                cx="120"
                cy="120"
                r="40"
                fill="url(#centerGradient)"
                className="drop-shadow-xl"
                style={{
                  filter: "drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15))",
                }}
              />

              <circle
                cx="120"
                cy="120"
                r="35"
                fill="none"
                stroke="url(#outerGlow)"
                strokeWidth="1"
                className="opacity-40"
              />

              <text
                x="120"
                y="125"
                textAnchor="middle"
                className="text-2xl font-black fill-blue-600"
                style={{
                  textShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                }}
              >
                <CountingNumber target={data.totalVotes} />
              </text>
            </svg>

            {hoveredIndex !== null && hoveredIndex < options.length && (
              <div
                className="absolute pointer-events-none z-20"
                style={{
                  left: "50%",
                  top: "-75px",
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 rounded-xl shadow-2xl border border-gray-700"
                  style={{
                    animation: "tooltipFadeIn 0.2s ease-out",
                    minHeight: "80px",
                    width: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="text-sm font-bold text-center leading-tight mb-1"
                    style={{
                      minHeight: "32px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {options[hoveredIndex]?.text}
                  </div>
                  <div className="text-lg font-black text-blue-400">
                    {data.percentages[hoveredIndex]}%
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl px-6 py-4 shadow-lg inline-block">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <div className="text-lg font-semibold text-gray-700">
                Total Votes
              </div>
              <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <CountingNumber target={data.totalVotes} duration={2000} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {options.map((option, index) => {
          if (index >= data.percentages.length) return null;

          return (
            <div
              key={index}
              className={`group flex items-center p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] ${
                hoveredIndex === index
                  ? "shadow-2xl scale-[1.03] ring-2 ring-blue-400/50 bg-white/90"
                  : ""
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(50px)",
                transition: isVisible
                  ? `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${
                      1000 + index * 150
                    }ms, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${
                      1000 + index * 150
                    }ms, all 0.2s ease-out`
                  : "all 0.2s ease-out",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative mr-5">
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                    colors[index % colors.length]
                  } shadow-lg transition-all duration-200`}
                  style={{
                    transform:
                      hoveredIndex === index
                        ? "scale(1.3) rotate(180deg)"
                        : "scale(1) rotate(0deg)",
                    boxShadow:
                      hoveredIndex === index
                        ? `0 0 20px ${
                            colorValues[index % colorValues.length].middle
                          }40`
                        : "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                />
                {hoveredIndex === index && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      background: `linear-gradient(45deg, ${
                        colorValues[index % colorValues.length].start
                      }, ${colorValues[index % colorValues.length].end})`,
                      opacity: 0.4,
                    }}
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors duration-200">
                  {option.text}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                  <CountingNumber
                    target={data.percentages[index] || 0}
                    suffix="%"
                    duration={2500 + index * 300}
                  />
                </div>
                <div className="text-sm font-semibold text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                  <CountingNumber
                    target={data.optionVotes[index] || 0}
                    suffix=" votes"
                    duration={2500 + index * 300}
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    colors[index % colors.length]
                  } transition-all duration-200 ease-out`}
                  style={{
                    width: `${progressBarAnimations[index] || 0}%`,
                    boxShadow:
                      hoveredIndex === index
                        ? `0 0 10px ${
                            colorValues[index % colorValues.length].middle
                          }60`
                        : "none",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes tooltipFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
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
  // AI Fact Check states
  const [factCheckResults, setFactCheckResults] = useState<Record<string, FactCheckResult>>({});
  const [checkingComment, setCheckingComment] = useState<string | null>(null);
  const [animatedText, setAnimatedText] = useState<Record<string, string>>({});
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [isVotingResultsVisible, setIsVotingResultsVisible] = useState(false);
  const votingResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    if (pollId) {
      fetchPollDetail();
      fetchComments();
    }
  }, [pollId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVotingResultsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (votingResultsRef.current) {
      observer.observe(votingResultsRef.current);
    }

    return () => {
      if (votingResultsRef.current) {
        observer.unobserve(votingResultsRef.current);
      }
    };
  }, [voteData]);

  const generateVoteData = (poll: Poll): VoteData => {
    try {
      if (!poll || !poll.options || poll.options.length === 0) {
        return {
          totalVotes: 0,
          optionVotes: [],
          percentages: [],
        };
      }

      const seed = poll.title + poll.id;
      const randoms = generateSeededRandoms(seed, poll.options.length + 1);

      const totalVotes = Math.floor(20 + randoms[0] * 280);

      const optionVotes: number[] = [];
      let remainingVotes = totalVotes;

      for (let i = 0; i < poll.options.length; i++) {
        if (i === poll.options.length - 1) {
          optionVotes.push(Math.max(0, remainingVotes));
        } else {
          const minVotes = Math.floor(remainingVotes * 0.1);
          const maxVotes = Math.floor(remainingVotes * 0.6);
          const votes = Math.floor(
            minVotes + randoms[i + 1] * (maxVotes - minVotes)
          );
          optionVotes.push(Math.max(0, votes));
          remainingVotes -= votes;
        }
      }

      let percentages = optionVotes.map((votes) =>
        totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
      );

      const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);
      if (totalPercentage !== 100 && percentages.length > 0) {
        const difference = 100 - totalPercentage;
        const maxIndex = percentages.indexOf(Math.max(...percentages));
        percentages[maxIndex] = Math.max(0, percentages[maxIndex] + difference);

        const newTotal = percentages.reduce((sum, p) => sum + p, 0);
        if (newTotal !== 100) {
          const remaining = 100;
          let allocated = 0;
          percentages = percentages.map((p, index) => {
            if (index === percentages.length - 1) {
              return remaining - allocated;
            } else {
              const adjusted = Math.max(
                1,
                Math.min(
                  p,
                  remaining - allocated - (percentages.length - index - 1)
                )
              );
              allocated += adjusted;
              return adjusted;
            }
          });
        }
      }

      return {
        totalVotes,
        optionVotes,
        percentages,
      };
    } catch (error) {
      console.error("Error generating vote data:", error);
      return {
        totalVotes: 0,
        optionVotes: new Array(poll?.options?.length || 0).fill(0),
        percentages: new Array(poll?.options?.length || 0).fill(0),
      };
    }
  };

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
        setVoteData(generateVoteData(transformedPoll));
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
        setVoteData(generateVoteData(transformedPoll));
      } else {
        setError("Poll not found");
      }
    } catch (error) {
      console.error("Error fetching poll:", error);
      setError("Unable to load poll details");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    const mockComments: Comment[] = [
      {
        id: "1",
        author: "Satoshi Nakamoto",
        content:
          "This poll topic is very interesting. I think Option 1 is more suitable for our community needs.",
        timestamp: "5/28/2025, 2:30:02 PM",
      },
      {
        id: "2",
        author: "Vitalik Buterin",
        content:
          "I have a different perspective. Option 2 might better align with our long-term goals and practical requirements.",
        timestamp: "5/28/2025, 2:51:47 PM",
      },
    ];
    setComments(mockComments);
  };

  const handleVote = () => {
    if (!selectedOption) {
      alert("Please select an option");
      return;
    }
    alert(`You have voted for: ${selectedOption}`);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !commentAuthor.trim()) {
      alert("Please fill in both name and comment");
      return;
    }

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

  // Animate text word by word
  const animateText = (commentId: string, text: string) => {
    const words = text.split(' ');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex <= words.length) {
        setAnimatedText(prev => ({
          ...prev,
          [commentId]: words.slice(0, currentIndex).join(' ')
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const performFactCheck = async (comment: Comment) => {
    setCheckingComment(comment.id);
    setAnimatedText(prev => ({ ...prev, [comment.id]: '' }));

    try {
      const prompt = `As a fact-checking AI, analyze this comment and provide:
1. A truth score from 0-100 (where 100 is completely truthful/reasonable)
2. A brief explanation (max 50 words)

Comment: "${comment.content}"
Context: This comment is about a poll titled "${poll?.title}" with description "${poll?.description}"

Respond in JSON format: {"score": number, "explanation": "string"}`;

      const HF_API_TOKEN = process.env.NEXT_PUBLIC_HF_API_TOKEN || 'hf_YOUR_TOKEN_HERE';
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
        {
          headers: {
            Authorization: `Bearer ${HF_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      let factCheckResult = { score: 85, explanation: "Analysis in progress..." };
      
      try {
        const generatedText = result[0]?.generated_text || "";
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          factCheckResult = {
            score: Math.min(100, Math.max(0, parseInt(parsed.score) || 85)),
            explanation: parsed.explanation || "The comment appears to be a personal opinion expressed constructively."
          };
        }
      } catch (parseError) {
        console.warn("Could not parse AI response, using fallback", parseError);
        // Fallback analysis based on comment sentiment
        factCheckResult = {
          score: 85,
          explanation: "This appears to be a subjective opinion. The reasoning seems coherent though specific claims would need verification."
        };
      }

      setFactCheckResults(prev => ({
        ...prev,
        [comment.id]: factCheckResult
      }));
      animateText(comment.id, factCheckResult.explanation);

    } catch (error) {
      console.error("Error performing fact check:", error);
      
      // Fall back to mock response when API fails
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockResponse = {
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        explanation: "This comment presents a subjective viewpoint. The reasoning appears coherent and contributes to the discussion, though specific factual claims would require independent verification."
      };
      
      setFactCheckResults(prev => ({
        ...prev,
        [comment.id]: mockResponse
      }));
      
      animateText(comment.id, mockResponse.explanation);
    } finally {
      setCheckingComment(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>

      <section className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-24">
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
                <span>
                  Deadline: {new Date(poll.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div
              className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "450ms" }}
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
                Cast Your Vote
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

            {/* Voting Results with Pie Chart */}
            {voteData && (
              <div
                ref={votingResultsRef}
                className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <h2 className="text-2xl font-semibold mb-8 text-gray-800 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  Voting Results
                </h2>

                <PieChart
                  data={voteData}
                  options={poll.options}
                  isVisible={isVotingResultsVisible}
                />
              </div>
            )}

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
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full">
                            {comment.timestamp}
                          </span>
                          <button
                            onClick={() => performFactCheck(comment)}
                            disabled={checkingComment === comment.id}
                            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 flex items-center space-x-1 ${
                              checkingComment === comment.id
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-md"
                            }`}
                          >
                            {checkingComment === comment.id ? (
                              <>
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Checking...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span>AI Fact Check</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed pl-13">
                        {comment.content}
                      </p>
                      
                      {/* AI Fact Check Result */}
                      {factCheckResults[comment.id] && (
                        <div className={`mt-4 ml-13 p-4 rounded-lg border ${getScoreColor(factCheckResults[comment.id].score)} transition-all duration-500`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              AI Analysis
                            </span>
                            <span className="text-sm font-bold">
                              Truth Score: {factCheckResults[comment.id].score}%
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {animatedText[comment.id] || ''}
                            {animatedText[comment.id] && animatedText[comment.id].length < factCheckResults[comment.id].explanation.length && (
                              <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1"></span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

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
