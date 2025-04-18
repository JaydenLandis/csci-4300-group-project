"use client";

import { useState } from "react";
import FlipCard from "./FlipCard";
import "../components/single-card.css";

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
    <div className="container mt-3 mb-3 d-flex-col align-items-center">
      <h1 className="mb-3">{setName}</h1>
      <div className="page-view">
        <div className="scrollable-container">
          {flashcards.map((card) => (
            <div
              key={card._id}
              className={`side-cards ${
                selectedCard._id === card._id ? "selected-card" : ""
              }`}
              onClick={() => setSelectedCard(card)}
            >
              {card.question}
            </div>
          ))}
        </div>

        <FlipCard
          front={
            <>
              <h2>{selectedCard.question}</h2>
            </>
          }
          back={
            <>
              <h2>{selectedCard.answer}</h2>
            </>
          }
        />
      </div>
    </div>
  );
}
