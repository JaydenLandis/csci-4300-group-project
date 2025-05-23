"use client";

import { useEffect, useState } from "react";
import SingleCardClient from "@/components/SingleCardClient";
import { belongsToClient } from "../../../../services/clientInfo";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const handleAddCard = () => {
    if (!flashcardSet) return;

    const randomHexId = [...Array(24)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
    const newCard: Flashcard = {
      _id: randomHexId,
      question: "",
      answer: "",
    };

    setFlashcardSet({
      ...flashcardSet,
      flashcards: [...flashcardSet.flashcards, newCard],
    });
  };

  const handleDeleteCard = (index: number) => {
    if (!flashcardSet) return;

    const updatedFlashcards = flashcardSet.flashcards.filter(
      (_, i) => i !== index
    );
    setFlashcardSet({
      ...flashcardSet,
      flashcards: updatedFlashcards,
    });
  };

  const handleSaveAll = async () => {
    if (!flashcardSet) return;

    const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flashcards: flashcardSet.flashcards }),
    });

    const result = await res.json();
    console.log("Save result:", result);

    if (!res.ok) {
      alert("Failed to save changes.");
    } else {
      setShowEditor(false);
    }
  };

  const handleDeleteSet = async () => {
    const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete flashcard set.");
    } else {
      router.push("/cards");
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
                <button
                  onClick={() => handleDeleteCard(index)}
                  className="ml-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md shadow-sm transition-all duration-200 ease-in-out hover:shadow-md active:scale-95"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              className="qa-button-add my-4"
              onClick={handleAddCard}
              style={{ marginTop: "1rem" }}
            >
              Add New Card
            </button>
            <button className="qa-button-save" onClick={handleSaveAll}>
              Save Changes
            </button>
          </>
        ) : (
          isOwner && (
            <div className="flex flex-col items-center gap-6 mt-6">
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="qa-button-small edit"
              >
                Edit Flashcards
              </button>
              <button
                onClick={handleDeleteSet}
                className="qa-button-small delete"
              >
                Delete Set
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
