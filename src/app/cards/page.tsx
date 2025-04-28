"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getClientUsername } from "../../../services/clientInfo";
import "./cardPage.css";

interface DemoCard {
  _id: string;
  setName: string;
  imgUrl: string;
  flashcards: { question: string; answer: string }[];
  owner: string;
}

export default function CardsPage() {
  const [demoCards, setDemoCards] = useState<DemoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredCards = demoCards.filter((card) => {
    const lowerSearch = searchQuery.toLowerCase();
    return (
      (card.setName?.toLowerCase().includes(lowerSearch) ?? false) ||
      (card.owner?.toLowerCase().includes(lowerSearch) ?? false)
    );
  });

  const cards = [
    { type: "add" },
    ...filteredCards.map((card) => ({
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
      <input
        type="text"
        placeholder="Search by name or username..."
        className="mb-6 w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="w-full">
            {card.type === "add" ? (
              <Link href="/new-card">
                <div className="rounded-xl border border-gray-300 hover:shadow-lg transition bg-white h-[280px] flex flex-col p-4">
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
                <div className="rounded-xl border border-gray-300 hover:shadow-lg transition bg-white h-[280px] overflow-hidden flex flex-col">
                  <Image
                    src={(card as DemoCard).imgUrl || "/assets/flashcards.jpg"}
                    alt={(card as DemoCard).setName}
                    width={400}
                    height={200}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-3">
                    <h5 className="text-base font-semibold">
                      {(card as DemoCard).setName}
                    </h5>
                    <p className="text-gray-600 text-sm">
                      {(card as DemoCard).flashcards.length} cards
                    </p>
                    <h5 className="text-xs font-medium mt-2">
                      Owner: {(card as DemoCard).owner || "Anonymous"}
                    </h5>
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
