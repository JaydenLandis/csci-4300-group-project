"use client";

import { useState } from "react";
import FlipCard from "./FlipCard";

interface Flashcard {
  _id: string;
  question: string;
  answer: string;
}

interface SingleCardClientProps {
  flashcards: Flashcard[];
  setName: string;
}

export default function SingleCardClient({
  flashcards,
  setName,
}: SingleCardClientProps) {
  const [selectedCard, setSelectedCard] = useState(flashcards[0]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">{setName}</h1>

      <div className="w-full flex flex-col items-center lg:flex-row lg:items-start lg:gap-8 max-w-6xl">
        {/* Sidebar / Scrollable List of Cards */}
        <div className="w-full max-w-xs overflow-y-auto border border-gray-300 rounded-md p-4 h-64 lg:h-[32rem] mb-6 lg:mb-0">
          <div className="space-y-2">
            {flashcards.map((card) => (
              <div
                key={card._id}
                onClick={() => setSelectedCard(card)}
                className={`cursor-pointer p-3 rounded-md border transition ${
                  selectedCard._id === card._id
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white text-gray-800 hover:bg-gray-100 border-gray-300"
                }`}
              >
                {card.question}
              </div>
            ))}
          </div>
        </div>

        {/* Flip Card Display */}
        <div className="w-full flex justify-center lg:flex-1">
          <FlipCard
            front={
              <div className="text-center px-6">
                <h2 className="text-xl font-semibold">
                  {selectedCard.question}
                </h2>
              </div>
            }
            back={
              <div className="text-center px-6">
                <h2 className="text-xl font-semibold">{selectedCard.answer}</h2>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
