import Link from "next/link";

export default function ProjectIntro() {
  return (
    <section>
      <header className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">Privacy Voting Forum</h1>
        <h2 className="text-2xl font-semibold mt-8">Project Intro</h2>
        <p className="max-w-2xl text-lg text-muted-foreground">
          This project is a demonstrative Web3 governance platform that combines
          real-time front-end interaction, back-end cloud services, and
          blockchain voting contracts. It aims to provide a transparent and
          privacy-protected community decision-making mechanism.
        </p>
      </header>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold">Project Generation Method</h2>
        <ol className="list-decimal list-inside">
          <li>
            Use <strong>Create Next App</strong> to establish the App Router
            architecture (TypeScript).
          </li>
          <li>
            Integrate <strong>Tailwind CSS 4</strong> and{" "}
            <strong>shadcn/ui</strong> CLI-generated accessibility (A11y)
            components.
          </li>
          <li>
            Install wallet SDKs like <em>wagmi / viem</em>, RainbowKit via{" "}
            <strong>npm</strong> (to be integrated in later branches).
          </li>
          <li>
            Follow <strong>Git Flow</strong>: <code>dev → feature → PR</code>,
            and use "one thing at a time" Atomic Commit to record history.
          </li>
        </ol>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold">Frontend Architecture</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Next.js 15</strong> (App Router): Supports React Server
            Components and Route Handlers.
          </li>
          <li>
            <strong>Tailwind CSS</strong> + <strong>shadcn/ui</strong>: Quickly
            create layouts and light/dark themes.
          </li>
          <li>
            <strong>Responsive Design</strong>: Desktop horizontal navigation
            bar, mobile hamburger drawer, auto-detect dark mode.
          </li>
        </ul>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold">Backend Services</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Next.js Route Handler</strong>: <code>/api/*</code> for
            initiating proposals, voting, AI fact-checking, etc., REST API.
          </li>
          <li>
            <strong>Supabase</strong>: Auth (SiWE), Postgres database for
            storing proposals and discussions.
          </li>
          <li>
            <strong>Edge Functions</strong>: Future plans to move image storage
            and caching to Vercel Edge Runtime.
          </li>
        </ul>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold">Blockchain Technology</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Voting Contracts</strong>: Written in Solidity{" "}
            <code>VotingContract.sol</code>, <code>ProposalRegistry.sol</code>,
            deployed on Sepolia or Polygon PoS.
          </li>
          <li>
            <strong>Celo Self Protocol</strong>: Uses ZK methods to verify real
            humans and resist Sybil attacks.
          </li>
          <li>
            <strong>wagmi + viem</strong>: Use <code>useContractRead</code>,{" "}
            <code>useContractWrite</code> to read and write on-chain states from
            the frontend.
          </li>
        </ul>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold">Future Plans</h2>
        <ul className="list-disc list-inside">
          <li>Support Layer 2 (Base, Arbitrum) to reduce gas costs.</li>
          <li>Add DAO fund management and automatic execution modules.</li>
          <li>
            Introduce AI sentiment analysis and public opinion monitoring to
            improve discussion quality.
          </li>
        </ul>
      </section>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="text-primary underline">
          Return to Home
        </Link>
      </div>
    </section>
  );
}
