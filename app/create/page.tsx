// app/create/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProposalContext } from "@/app/context/ProposalContext";

export default function Home() {
  const { addProposal } = useProposalContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleVote = () => {
    const newProposal = {
      id: Date.now().toString(),
      title,
      description,
      deadline,
      options,
    };
    addProposal(newProposal);
    alert(`You have initiated a vote: ${title}`);
    // Clear the form
    setTitle("");
    setDescription("");
    setDeadline("");
    setOptions(["", ""]);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">Privacy Voting Forum</h1>
      <h2 className="text-2xl font-semibold mt-8">Initiate Vote</h2>
      <div className="flex flex-col items-center gap-4 w-full max-w-5xl">
        <div className="flex flex-col w-full">
          <label className="text-left" htmlFor="title">
            Vote Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-1/1"
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-left" htmlFor="description">
            Vote Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-1/1 h-40"
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-left" htmlFor="deadline">
            Voting Deadline
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border rounded p-2 w-1/1"
            required
          />
        </div>
        {options.map((option, index) => (
          <div key={index} className="flex flex-col w-full">
            <label className="text-left" htmlFor={`option-${index}`}>
              Option {index + 1}
            </label>
            <input
              id={`option-${index}`}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="border rounded p-2 w-1/1"
              required
            />
          </div>
        ))}
        <Button onClick={addOption}>Add Option</Button>
        <Button onClick={handleVote}>Initiate Vote</Button>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <Button asChild>
          <Link href="/proposals">View Vote List</Link>
        </Button>
      </div>
    </section>
  );
}
