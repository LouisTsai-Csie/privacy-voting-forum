"use client";

import React, { createContext, useContext, useState } from "react";

export interface Poll {
  id: string;
  title: string;
  description: string;
  deadline: string;
  options: { text: string }[];
}

interface PollContextType {
  polls: Poll[];
  addPoll: (poll: Poll) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [polls, setPolls] = useState<Poll[]>([]);

  const addPoll = (poll: Poll) => {
    setPolls((prev) => [...prev, poll]);
  };

  return (
    <PollContext.Provider value={{ polls, addPoll }}>
      {children}
    </PollContext.Provider>
  );
};

export const usePollContext = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error("usePollContext must be used within a PollProvider");
  }
  return context;
};
