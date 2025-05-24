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

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("/api/poll");
        setPolls(response.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
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
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24">
      <h1 className="text-4xl font-bold sm:text-5xl">Privacy Voting Forum</h1>
      <h2 className="text-2xl font-semibold mt-8">Poll List</h2>
      <h2 className="text-2xl font-semibold mt-8"></h2>
      <ul className="w-full max-w-lg">
        {polls.length === 0 ? (
          <li className="text-lg text-muted-foreground">
            No polls available at the moment.
          </li>
        ) : (
          polls.map((poll: Poll) => (
            <li
              key={poll.id}
              className="border border-gray-300 rounded-md p-4 mb-4"
            >
              <div className="flex flex-col items-start">
                <h2 className="text-2xl font-semibold mb-2">{poll.title}</h2>
                <p className="text-lg text-muted-foreground mb-2">
                  {poll.description}
                </p>
                <p className="text-sm mb-2">Deadline: {poll.deadline}</p>
                <div className="mt-2">
                  <span className="font-semibold text-lg">Poll Options:</span>
                  {poll.options.map(
                    (option: { text: string }, index: number) => (
                      <div
                        key={index}
                        className="flex items-center mb-2 text-lg"
                      >
                        <input
                          type="radio"
                          id={`option-${poll.id}-${index}`}
                          name={`poll-${poll.id}`}
                          value={option.text}
                          onChange={() =>
                            handleVoteSelection(poll.id, option.text)
                          }
                        />
                        <label
                          htmlFor={`option-${poll.id}-${index}`}
                          className="ml-2"
                        >
                          {option.text}
                        </label>
                      </div>
                    )
                  )}
                </div>
                <Button onClick={handleVote} className="mt-2">
                  Vote
                </Button>
                <Link
                  href={`/polls/${poll.id}`}
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
