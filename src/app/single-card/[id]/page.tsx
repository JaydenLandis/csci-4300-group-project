// src/app/single-card/[id]/page.tsx
import SingleCardClient from "@/components/SingleCardClient";
export const dynamic = "force-dynamic";

interface SingleCardPageProps {
  params: { id: string };
}

export default async function SingleCardPage({ params }: SingleCardPageProps) {
  const { id } = await params;
  const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch data");

  const { flashcardSet } = await res.json();

  return (
    <SingleCardClient
      flashcards={flashcardSet.flashcards}
      setName={flashcardSet.setName}
    />
  );
}
