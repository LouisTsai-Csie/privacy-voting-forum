"use client";

import { useProposalContext, Proposal } from "@/app/context/ProposalContext";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProposalsList() {
  const { proposals } = useProposalContext();
  const [selectedVotes, setSelectedVotes] = useState<{ [key: string]: string }>(
    {}
  );
  const [confirmVote, setConfirmVote] = useState<{
    proposalId: string;
    option: string;
  } | null>(null);

  const handleVoteSelection = (proposalId: string, option: string) => {
    setSelectedVotes({ ...selectedVotes, [proposalId]: option });
    setConfirmVote({ proposalId, option });
  };

  const handleVote = () => {
    if (confirmVote) {
      alert(
        `You have voted for ${confirmVote.option} on proposal ${confirmVote.proposalId}`
      );
      setConfirmVote(null);
    }
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24">
      <h1 className="text-4xl font-bold sm:text-5xl">Privacy Voting Forum</h1>
      <h2 className="text-2xl font-semibold mt-8">Vote List</h2>
      <h2 className="text-2xl font-semibold mt-8"></h2>
      <ul className="w-full max-w-lg">
        {proposals.length === 0 ? (
          <li className="text-lg text-muted-foreground">
            No votes available at the moment.
          </li>
        ) : (
          proposals.map((proposal: Proposal) => (
            <li
              key={proposal.id}
              className="border border-gray-300 rounded-md p-4 mb-4"
            >
              <div className="flex flex-col items-start">
                <h2 className="text-2xl font-semibold mb-2">
                  {proposal.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  {proposal.description}
                </p>
                <p className="text-sm mb-2">Deadline: {proposal.deadline}</p>
                <div className="mt-2">
                  <span className="font-semibold text-lg">Vote Options:</span>
                  {proposal.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center mb-2 text-lg">
                      <input
                        type="radio"
                        id={`option-${proposal.id}-${index}`}
                        name={`proposal-${proposal.id}`}
                        value={option}
                        onChange={() =>
                          handleVoteSelection(proposal.id, option)
                        }
                      />
                      <label
                        htmlFor={`option-${proposal.id}-${index}`}
                        className="ml-2"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <Button onClick={handleVote} className="mt-2">
                  Vote
                </Button>
                <Link
                  href={`/proposals/${proposal.id}`}
                  className="text-blue-500 underline"
                >
                  View Details
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="mt-4">
        <Link href="/" className="text-primary underline">
          Return to Home
        </Link>
      </div>
    </section>
  );
}
