"use client";

// app/context/ProposalContext.tsx
import React, { createContext, useContext, useState } from "react";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  options: string[];
}

interface ProposalContextType {
  proposals: Proposal[];
  addProposal: (proposal: Proposal) => void;
}

const ProposalContext = createContext<ProposalContextType | undefined>(
  undefined
);

export const ProposalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const addProposal = (proposal: Proposal) => {
    setProposals((prev) => [...prev, proposal]);
  };

  return (
    <ProposalContext.Provider value={{ proposals, addProposal }}>
      {children}
    </ProposalContext.Provider>
  );
};

export const useProposalContext = () => {
  const context = useContext(ProposalContext);
  if (!context) {
    throw new Error(
      "useProposalContext must be used within a ProposalProvider"
    );
  }
  return context;
};
