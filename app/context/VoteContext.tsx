"use client";

// app/context/ProposalContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Vote {
  id: string;
  title: string;
  description: string;
  deadline: string;
  options: string[];
}

interface VoteContextType {
  votes: Vote[];
  addVote: (vote: Vote) => void;
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const VoteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch("/api/poll/index");
        if (res.ok) {
          const payload = await res.json();
          setVotes(payload.polls); // 假设 API 返回 { polls: [...] }
        } else {
          console.error("无法取得投票列表", await res.text());
        }
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, []);

  const addVote = async (vote: Vote) => {
    try {
      const res = await fetch("/api/poll/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vote),
      });

      if (res.ok) {
        const data = await res.json();
        setVotes((prev) => [...prev, data.data]); // 假设 API 返回 { data: {...} }
      } else {
        console.error("无法添加投票", await res.text());
      }
    } catch (error) {
      console.error("Error adding vote:", error);
    }
  };

  return (
    <VoteContext.Provider value={{ votes, addVote }}>
      {children}
    </VoteContext.Provider>
  );
};

export const useVoteContext = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useVoteContext must be used within a VoteProvider");
  }
  return context;
};
