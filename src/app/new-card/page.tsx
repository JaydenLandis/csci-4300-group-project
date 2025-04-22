"use client";

import React, { useState, DragEvent } from "react";
import "@/components/NewCard.css";

type Card = {
  question: string;
  answer: string;
};

const QuestionAnswerForm: React.FC = () => {
  const [setName, setSetName] = useState("");
  const [imgUrl, setImgUrl] = useState("");   // renamed for clarity
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [confirmedCards, setConfirmedCards] = useState<Card[]>([]);
  // you can leave your file‑upload & notes state here if you plan to wire them up later
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [paragraphText, setParagraphText] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleConfirm = () => {
    if (!question.trim() || !answer.trim()) return;
    setCards(prev => [...prev, { question, answer }]);
    setQuestion("");
    setAnswer("");
  };

  const handleDeleteCard = (i: number) => {
    setCards(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleFiles = (files: FileList | null) => files && setSelectedFiles(files);
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files);
  };

  const handleConfirmSet = async () => {
    if (!setName.trim() || cards.length === 0) {
      alert("Please provide a set name and at least one card.");
      return;
    }

    // build a pure-JSON payload
    const payload = {
      setName: setName.trim(),
      imgUrl: imgUrl.trim(),
      flashcards: cards,
    };

    try {
      const res = await fetch("http://localhost:3000/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.statusText);
      }

      alert("Flashcard set created successfully!");
      setConfirmedCards(cards);

      // reset form
      setCards([]);
      setSetName("");
      setImgUrl("");
      setParagraphText("");
      setSelectedFiles(null);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save. Try again.");
    }
  };

  return (
    <div
      className="qa-container"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: "2rem",
        padding: "1.5rem",
        fontFamily: "sans-serif",
        maxWidth: "960px",
        margin: "0 auto"
      }}
    >
      {/* Main column */}
      <section
        className="qa-main"
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "0.5rem", color: "#333", textAlign: "center" }}>
          Create a New Flashcard Set
        </h2>
        <p style={{ marginBottom: "1rem", color: "#555", textAlign: "center" }}>
          Fill in the details and add cards below.
        </p>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Set Name"
            value={setName}
            onChange={e => setSetName(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="url"
            placeholder="Cover Image URL"
            value={imgUrl}
            onChange={e => setImgUrl(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            onClick={handleConfirm}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              background: "#0070f3",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>

        {cards.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ color: "#333", textAlign: "center" }}>Current Cards</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cards.map((c, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    border: "1px solid #eee",
                    borderRadius: "4px",
                    marginBottom: "0.5rem"
                  }}
                >
                  <div>
                    <p style={{ margin: 0 }}>
                      <strong>Q:</strong> {c.question}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>A:</strong> {c.answer}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCard(i)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#e00",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleConfirmSet}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "none",
            background: "#28a745",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Save Flashcard Set
        </button>
      </section>

      {/* Sidebar (files & notes UI can stay for later wiring) */}
      <aside
        className="qa-side-panel"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <h3 style={{ marginBottom: "0.5rem", color: "#333", textAlign: "center" }}>Files</h3>
          <div
            onClick={() => {}}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: "2px dashed #ccc",
              borderRadius: "4px",
              padding: "1rem",
              textAlign: "center",
              cursor: "pointer",
              transition: "border-color 0.2s",
              borderColor: dragActive ? "#0070f3" : "#ccc"
            }}
          >
            {selectedFiles && selectedFiles.length > 0 ? (
              Array.from(selectedFiles).map(f => <p key={f.name}>{f.name}</p>)
            ) : (
              <p style={{ color: "#777" }}>Drag &amp; drop or click to upload</p>
            )}
            <input
              type="file"
              multiple
              onChange={e => handleFiles(e.target.files)}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: "0.5rem", color: "#333", textAlign: "center" }}>Notes</h3>
          <textarea
            placeholder="Additional description..."
            value={paragraphText}
            onChange={e => setParagraphText(e.target.value)}
            rows={6}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical"
            }}
          />
        </div>
      </aside>
    </div>
  );
};

export default QuestionAnswerForm;
