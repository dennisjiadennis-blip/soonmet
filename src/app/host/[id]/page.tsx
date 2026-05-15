import { getHostById } from "@/lib/data";
import { notFound } from "next/navigation";
import { HostDetailView } from "@/components/HostDetailView";

interface HostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HostPage({ params }: HostPageProps) {
  const { id } = await params;
  const host = getHostById(id);

  if (!host) {
    notFound();
  }

  return <HostDetailView host={host} />;
}
