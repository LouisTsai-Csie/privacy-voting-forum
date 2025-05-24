import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">Privacy Voting Forum</h1>

      <p className="max-w-2xl text-lg text-muted-foreground">
        Create a community governance platform that balances transparency and
        privacy through zero-knowledge identity verification and blockchain
        technology.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/poll_list">View Polls</Link>
        </Button>
        <Button asChild>
          <Link href="/initiate_poll">Initiate Poll</Link>
        </Button>
      </div>
    </section>
  );
}
