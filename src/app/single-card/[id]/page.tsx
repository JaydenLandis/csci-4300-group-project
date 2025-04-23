"use client";

import { useEffect, useState } from "react";
import SingleCardClient from "@/components/SingleCardClient";
import { belongsToClient } from "../../../../services/clientInfo";
import { useParams } from "next/navigation";
import "./editor.css";

interface Flashcard {
  _id: string;
  question: string;
  answer: string;
}

interface FlashcardSet {
  setName: string;
  flashcards: Flashcard[];
  owner: string;
}

export default function SingleCardPage() {
  const { id } = useParams();
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const { flashcardSet } = await res.json();
      setFlashcardSet(flashcardSet);
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    async function checkOwnership() {
      if (!flashcardSet) return;

      const owner = await belongsToClient(flashcardSet.owner);
      setIsOwner(owner);
    }

    checkOwnership();
  }, [flashcardSet]);

  const handleChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    if (!flashcardSet) return;

    const updatedFlashcards = [...flashcardSet.flashcards];
    updatedFlashcards[index] = {
      ...updatedFlashcards[index],
      [field]: value,
    };

    setFlashcardSet({ ...flashcardSet, flashcards: updatedFlashcards });
  };

  const handleSaveAll = async () => {
    if (!flashcardSet) return;

    const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
      method: "PUT", // or PATCH depending on your API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flashcards: flashcardSet.flashcards }),
    });

    if (!res.ok) {
      alert("Failed to save changes.");
    } else {
      setShowEditor(false);
    }
  };

  if (!flashcardSet) return <div>Loading...</div>;

  return (
    <div>
      <SingleCardClient
        flashcards={flashcardSet.flashcards}
        setName={flashcardSet.setName}
      />

      <div className="qa-main" style={{ marginTop: "2rem" }}>
        {showEditor ? (
          <>
            <h2 className="qa-editor-title">Edit Cards</h2>
            {flashcardSet.flashcards.map((card, index) => (
              <div key={card._id} className="qa-input-group">
                <input
                  className="qa-input"
                  value={card.question}
                  onChange={(e) =>
                    handleChange(index, "question", e.target.value)
                  }
                  placeholder="Edit question"
                />
                <input
                  className="qa-input"
                  value={card.answer}
                  onChange={(e) =>
                    handleChange(index, "answer", e.target.value)
                  }
                  placeholder="Edit answer"
                />
              </div>
            ))}
            <button className="qa-button-save" onClick={handleSaveAll}>
              Save Changes
            </button>
          </>
        ) : (
          isOwner && (
            <button
              className="qa-button-add"
              onClick={() => setShowEditor(!showEditor)}
            >
              Edit Flashcards
            </button>
          )
        )}
      </div>
    </div>
  );
}
