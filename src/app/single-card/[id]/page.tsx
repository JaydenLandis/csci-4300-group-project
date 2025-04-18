// src/app/single-card/[id]/page.tsx
import "./single-card.css";
export const dynamic = "force-dynamic"; // ⬅️ Add this line

interface SingleCardPageProps {
  params: { id: string };
}

export default async function SingleCardPage({ params }: SingleCardPageProps) {
  const { id } = await params;
  const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
    method: "GET",
    cache: "no-store", // ⬅️ Optional, but avoids caching if needed
  });

  if (!res.ok) throw new Error("Failed to fetch data");

  const { flashcardSet } = await res.json();

  return (
    <div className="container mt-3 mb-3 d-flex-col align-items-center">
      <h1 className="mb-3">{flashcardSet.setName}</h1>
      <div className="page-view">
        <div className="scrollable-container">
          {flashcardSet.flashcards.map((card: any) => {
            return (
              <div className="side-cards" key={card._id}>
                {card.question}
              </div>
            );
          })}
        </div>
        <div className="big-card"></div>
      </div>
    </div>
  );
}
