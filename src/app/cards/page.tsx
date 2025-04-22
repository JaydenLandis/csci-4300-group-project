"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DemoCard {
  _id: string;
  setName: string;
  imgUrl: string;
  flashcards: { question: string; answer: string }[];
}

export default function CardsPage() {
  const [demoCards, setDemoCards] = useState<DemoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cards", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        if (Array.isArray(data.cards)) {
          setDemoCards(data.cards);
        } else {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="w-full">
            {card.type === "add" ? (
              <Link href="/new-card">
                <div className="rounded-xl border border-gray-300 hover:shadow-lg transition bg-white min-h-[350px] flex flex-col p-4">
                  <div className="flex flex-col justify-between flex-grow h-full">
                    <div className="flex-grow flex flex-col justify-center items-center text-center">
                      <h5 className="text-lg font-semibold">Add Card</h5>
                      <p className="text-gray-600 mt-2">
                        Click here to add a new card
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  router.push(`/single-card/${(card as DemoCard)._id}`)
                }
                className="w-full text-left"
              >
                <div className="rounded-xl border border-gray-300 hover:shadow-lg transition bg-white min-h-[350px] overflow-hidden flex flex-col">
                  <Image
                    src={(card as DemoCard).imgUrl || "/assets/flashcards.jpg"}
                    alt={(card as DemoCard).setName}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold">
                      {(card as DemoCard).setName}
                    </h5>
                    <p className="text-gray-600">
                      {(card as DemoCard).flashcards.length} cards
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
