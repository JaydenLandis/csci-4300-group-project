"use client";

//import Image from "next/image";
import React, { useState } from "react";
import { useEffect } from "react";
import "@/components/NewCard.css";

type Card = {
  question: string;
  answer: string;
};

const QuestionAnswerForm: React.FC = () => {
  // State variables
  const [setName, setSetName] = useState("");
  const [setUrl, setSetUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [confirmedCards, setConfirmedCards] = useState<Card[]>([]);

  const handleConfirm = () => {
    if (!question.trim() || !answer.trim()) return;

    const newCard: Card = {
      question: question,
      answer: answer,
    };

    setCards((prevCards) => [...prevCards, newCard]);
    setQuestion("");
    setAnswer("");
  };

  const handleDeleteCard = (index: number) => {
    setCards((prevCards) => prevCards.filter((_, i) => i !== index));
  };

  const handleConfirmSet = async () => {
    if (!setName.trim() || cards.length === 0) {
      alert("Set name and at least one card are required.");
      return;
    }

    const flashcardSet = {
      setName: setName.trim(),
      flashcards: cards,
      setUrl: setUrl.trim(),
    };

    try {
      const res = await fetch("http://localhost:3000/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flashcardSet),
      });

      if (!res.ok) {
        throw new Error("Failed to save card set.");
      }

      const savedSet = await res.json();
      console.log("Card set saved:", savedSet);

      alert("✅ Card set saved!");
      setConfirmedCards(cards);
      setCards([]);
      setSetName("");
    } catch (error) {
      console.error("Error saving card set:", error);
      alert("Failed to save card set.");
    }
  };

  return (
    <div className="qa-container">
      <form className="qa-form">
        <h2 className="qa-title">Create a New Flashcard Set</h2>
        <p className="qa-description">
          Add questions and answers to create your flashcards.
        </p>
        <hr />
        <div>
          <label htmlFor="setName" className="qa-label mr-3">
            Set Name:
          </label>
          <input
            name="setName"
            type="text"
            placeholder="Enter set name"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            className="qa-set-name mb-2"
          />
        </div>
        <div>
          <label htmlFor="setUrl" className="qa-label mr-3">
            Cover Image URL:
          </label>
          <input
            name="setUrl"
            type="url"
            placeholder="Enter cover image URL"
            value={setUrl}
            onChange={(e) => setSetUrl(e.target.value)}
            className="qa-set-name mb-2"
          />
        </div>

        <input
          name="question"
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="qa-question mb-2"
        />

        <input
          name="answer"
          type="text"
          placeholder="Enter your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="qa-answer"
        />
      </form>

      <button onClick={handleConfirm} className="qa-button">
        Add Card
      </button>

      <h3>Current Cards</h3>
      <ul className="qa-card-list">
        {cards.map((card, index) => (
          <li key={index} className="qa-card">
            <p>
              <strong>Q:</strong> {card.question}{" "}
            </p>
            <p>
              <strong>A:</strong> {card.answer}
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
                  <strong>Q:</strong> {card.question}
                </p>
                <p>
                  <strong>A:</strong> {card.answer}
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
