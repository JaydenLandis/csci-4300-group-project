"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation'

interface DemoCard {
  _id: string;
  setName: string;
  imgUrl: string;
  flashcards: { question: string; answer: string }[];
}

export default function CardsPage() {
  const [demoCards, setDemoCards] = useState<DemoCard[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter()

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cards", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        console.log("API returned:", data.cards);

        // Adjust based on what the API returns
        if (Array.isArray(data.cards)) {
          setDemoCards(data.cards);
        } else {
          console.error("Expected flashcardSets array but got:", data);
          setDemoCards([]);
        }
      } catch (err) {
        console.error(err);
        setDemoCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const cards = [
    { type: "add" },
    ...demoCards.map((card) => ({
      ...card,
      type: "demo" as const,
    })),
  ];

  const chunkArray = <T,>(arr: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const rows = chunkArray(cards, 3);

  if (loading)
    return (
      <div className="container d-flex justify-content-center pt-5 pb-5">
        <h1>Loading...</h1>
      </div>
    );

  return (
    <div className="container mt-4">
      {rows.map((row, rowIndex) => (
        <div className="row mb-4" key={rowIndex}>
          {row.map((card, cardIndex) => (
            <div className="col-md-4" key={cardIndex}>
              {card.type === "add" ? (
                <Link href="/new-card" className="text-decoration-none">
                  <div
                    className="card text-center h-100"
                    style={{ minHeight: "350px" }}
                  >
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title">Add Card</h5>
                      <p className="card-text">Click here to add a new card</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div>
                <button
                  type="button"
                  onClick={() => {
                    console.log(
                      "Flash me",
                      router.push(`/single-card/${(card as DemoCard)._id}`)
                    );
                  }}
                  className="btn btn-light w-100 h-100 p-0 border-0"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <div
                    className="card text-center h-100"
                    style={{ minHeight: "350px" }}
                  >
                    <Image
                      src={
                        (card as DemoCard).imgUrl || "/assets/flashcards.jpg"
                      }
                      alt={(card as DemoCard).setName}
                      width={400} // Adjust as needed
                      height={250}
                      className="card-img-top"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {(card as DemoCard).setName}
                      </h5>
                      <p className="card-text">
                        {(card as DemoCard).flashcards.length} cards
                      </p>
                    </div>
                  </div>
                </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}