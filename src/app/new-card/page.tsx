"use client";

import React, { useState, useRef, DragEvent } from "react";
import "@/components/NewCard.css";

type Card = {
  question: string;
  answer: string;
};

const QuestionAnswerForm: React.FC = () => {
  const [setName, setSetName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [confirmedCards, setConfirmedCards] = useState<Card[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [paragraphText, setParagraphText] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files) {
      setSelectedFiles(files);
      setUploadStatus("idle");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  // Merge returned flashcards into `cards`
  const handleImageUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select at least one image first.");
      return;
    }

    setUploadStatus("uploading");
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch("http://localhost:3000/api/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Image API response:", data);

      if (Array.isArray(data.flashcards)) {
        setCards((prev) => [...prev, ...data.flashcards]);
      }

      setUploadStatus("success");
      setSelectedFiles(null);
    } catch (err) {
      console.error("Image upload error:", err);
      setUploadStatus("error");
    }
  };

  const handleConfirm = () => {
    if (!question.trim() || !answer.trim()) return;
    setCards((prev) => [...prev, { question, answer }]);
    setQuestion("");
    setAnswer("");
  };

  const handleDeleteCard = (i: number) => {
    setCards((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleConfirmSet = async () => {
    if (!setName.trim() || cards.length === 0) {
      alert("Please provide a set name and at least one card.");
      return;
    }

    const payload = {
      setName: setName.trim(),
      imgUrl: imgUrl.trim(),
      flashcards: cards,
    };

    try {
      const res = await fetch("http://localhost:3000/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.statusText);
      }

      alert("Flashcard set created successfully!");
      setConfirmedCards(cards);
      setCards([]);
      setSetName("");
      setImgUrl("");
      setParagraphText("");
      setSelectedFiles(null);
      setUploadStatus("idle");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save. Try again.");
    }
  };

  return (
    <div className="qa-container">
      <section className="qa-main">
        <h2>Create a New Flashcard Set</h2>
        <p>Fill in the details and add cards below.</p>

        <div className="qa-input-group">
          <input
            type="text"
            placeholder="Set Name"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
          <input
            type="url"
            placeholder="Cover Image URL"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
        </div>

        <div className="qa-input-group">
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            type="button"
            className="qa-button-add"
            onClick={handleConfirm}
          >
            Add
          </button>
        </div>

        {cards.length > 0 && (
          <div className="qa-cards-list-container">
            <h3>Current Cards</h3>
            <ul className="qa-cards-list">
              {cards.map((c, i) => (
                <li key={i} className="qa-card-item">
                  <div>
                    <p>
                      <strong>Q:</strong> {c.question}
                    </p>
                    <p>
                      <strong>A:</strong> {c.answer}
                    </p>
                  </div>
                  <button
                    className="qa-delete-button"
                    onClick={() => handleDeleteCard(i)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="qa-button-save" onClick={handleConfirmSet}>
          Save Flashcard Set
        </button>
      </section>

      <aside className="qa-side-panel">
        <div>
          <h3>Files</h3>
          <div
            className={`file-dropzone${dragActive ? " active" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFiles && selectedFiles.length > 0 ? (
              Array.from(selectedFiles).map((f) => <p key={f.name}>{f.name}</p>)
            ) : (
              <p>Drag &amp; drop or click to upload</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: "none" }}
            />
          </div>
          {selectedFiles && (
            <button
              type="button"
              className="qa-button-save"
              onClick={handleImageUpload}
              disabled={uploadStatus === "uploading"}
            >
              {uploadStatus === "idle" && "Upload Image"}
              {uploadStatus === "uploading" && "Uploading..."}
              {uploadStatus === "success" && "Uploaded!"}
              {uploadStatus === "error" && "Retry Upload"}
            </button>
          )}
        </div>

        <div>
          <h3>Notes</h3>
          <textarea
            className="notes-textarea"
            placeholder="Additional description..."
            value={paragraphText}
            onChange={(e) => setParagraphText(e.target.value)}
            rows={6}
          />
        </div>
      </aside>
    </div>
  );
};

export default QuestionAnswerForm;
