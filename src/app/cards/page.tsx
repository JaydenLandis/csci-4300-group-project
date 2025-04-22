"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import './cardPage.css'

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
      <div className="custom-container">
        {rows.map((row, rowIndex) => (
          <div className="custom-row" key={rowIndex}>
            {row.map((card, cardIndex) => (
              <div className="card-column" key={cardIndex}>
                {card.type === "add" ? (
                  <Link href="/new-card" className="text-decoration-none">
                    <div className="add-card-container">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Add New Set</h5>
                          <p className="card-text">Click here to add a new set</p>
                        </div>
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
                      className="card-button"
                    >
                      <div className="custom-card">
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