import { Hero } from "@/components/Hero";
import { HostList } from "@/components/HostList";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Hero />
      <HostList query={q} />
    </main>
  );
}
