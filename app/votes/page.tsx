"use client";

import { useVoteContext, Vote } from "@/app/context/VoteContext";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function VotesList() {
  const { votes } = useVoteContext();
  const [selectedVotes, setSelectedVotes] = useState<{ [key: string]: string }>(
    {}
  );
  const [confirmVote, setConfirmVote] = useState<{
    voteId: string;
    option: string;
  } | null>(null);

  const handleVoteSelection = (voteId: string, option: string) => {
    setSelectedVotes({ ...selectedVotes, [voteId]: option });
    setConfirmVote({ voteId, option });
  };

  const handleVote = () => {
    if (confirmVote) {
      alert(
        `You have voted for ${confirmVote.option} on vote ${confirmVote.voteId}`
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
        {votes.length === 0 ? (
          <li className="text-lg text-muted-foreground">
            No votes available at the moment.
          </li>
        ) : (
          votes.map((vote: Vote) => (
            <li
              key={vote.id}
              className="border border-gray-300 rounded-md p-4 mb-4"
            >
              <div className="flex flex-col items-start">
                <h2 className="text-2xl font-semibold mb-2">{vote.title}</h2>
                <p className="text-lg text-muted-foreground mb-2">
                  {vote.description}
                </p>
                <p className="text-sm mb-2">Deadline: {vote.deadline}</p>
                <div className="mt-2">
                  <span className="font-semibold text-lg">Vote Options:</span>
                  {vote.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center mb-2 text-lg">
                      <input
                        type="radio"
                        id={`option-${vote.id}-${index}`}
                        name={`vote-${vote.id}`}
                        value={option}
                        onChange={() => handleVoteSelection(vote.id, option)}
                      />
                      <label
                        htmlFor={`option-${vote.id}-${index}`}
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
                  href={`/votes/${vote.id}`}
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
