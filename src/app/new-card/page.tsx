"use client";

//import Image from "next/image";
import React, { useState } from "react";
import "@/components/NewCard.css";

type Card = {
  front: string;
  back: string;
};

const QuestionAnswerForm: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [confirmedCards, setConfirmedCards] = useState<Card[]>([]);

  const handleConfirm = () => {
    if (!question.trim() || !answer.trim()) return;

    const newCard: Card = {
      front: question,
      back: answer,
    };

    setCards((prevCards) => [...prevCards, newCard]);
    setQuestion("");
    setAnswer("");
  };

  const handleDeleteCard = (index: number) => {
    setCards((prevCards) => prevCards.filter((_, i) => i !== index));
  };

  const handleConfirmSet = () => {
    console.log("Confirmed card set:", cards);
    console.log("Final card set confirmed:", cards);
    alert("Card set confirmed!");
  };

  return (
    <div className="qa-container">
      <h2 className="qa-heading">Create a Card</h2>

      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="qa-question"
      />

      <textarea
        placeholder="Enter your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="qa-answer"
      />

      <button onClick={handleConfirm} className="qa-button">
        Add Card
      </button>

      <h3>Current Cards</h3>
      <ul className="qa-card-list">
        {cards.map((card, index) => (
          <li key={index} className="qa-card">
            <p>
              <strong>Q:</strong> {card.front}{" "}
            </p>
            <p>
              <strong>A:</strong> {card.back}
            </p>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button
                onClick={() => handleDeleteCard(index)}
                className="qa-delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {cards.length > 0 && (
        <button onClick={handleConfirmSet} className="qa-confirm-button">
          Confirm Set
        </button>
      )}
      {confirmedCards.length > 0 && (
        <>
          <h3>✅ Confirmed Set:</h3>
          <ul className="qa-card-list">
            {confirmedCards.map((card, index) => (
              <li key={index} className="qa-card">
                <p>
                  <strong>Q:</strong> {card.front}
                </p>
                <p>
                  <strong>A:</strong> {card.back}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default QuestionAnswerForm;
