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
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedCard = flashcards[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-bold">{setName}</h1>
      </div>
      <div className="w-full flex flex-col items-center lg:flex-row lg:items-start lg:gap-8 max-w-6xl">
        {/* Sidebar */}
        <div className="w-full max-w-xs overflow-y-auto border border-gray-300 rounded-md p-4 h-64 lg:h-[32rem] mt-10 mb-2 ml-10">
          <div className="space-y-2">
            {flashcards.map((card, index) => (
              <div
                key={card._id}
                onClick={() => setCurrentIndex(index)}
                className={`cursor-pointer p-3 rounded-md border transition ${
                  index === currentIndex
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white text-gray-800 hover:bg-gray-100 border-gray-300"
                }`}
              >
                {card.question}
              </div>
            ))}
          </div>
        </div>

        {/* Flip Card Display + Navigation */}
        <div className="w-full flex flex-col items-center lg:flex-1 mt-10 mb-12">
          <FlipCard
            front={
              <div className="text-center px-6 py-8">
                <h2 className="text-xl font-semibold">
                  {selectedCard.question}
                </h2>
              </div>
            }
            back={
              <div className="text-center px-6 py-8">
                <h2 className="text-xl font-semibold">{selectedCard.answer}</h2>
              </div>
            }
          />

          {/* Navigation Buttons Below */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 py-2 rounded shadow-md transition active:scale-95"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-600">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <button
              onClick={goToNext}
              className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 py-2 rounded shadow-md transition active:scale-95"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
