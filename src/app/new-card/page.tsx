"use client";

//import Image from "next/image";
import React, { useState, useRef, useCallback } from "react";
import { getClientUsername } from "../../../services/clientInfo";
import { useEffect } from "react";
import "@/components/NewCard.css";
import "./newcard.css";

type Card = {
  question: string;
  answer: string;
};

type UploadStatus = "idle" | "uploading" | "success" | "error";

/*
Component for creating a new flashcard set.


It allows for image/text uplaod to generate flashcards
*/
const QuestionAnswerForm: React.FC = () => {
  const [setName, setSetName] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [paragraphText, setParagraphText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] =
    useState<UploadStatus>("idle");
  const [textUploadStatus, setTextUploadStatus] =
    useState<UploadStatus>("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /*
  Adds a new flashcard to the list and validates data
  */
  const addCard = useCallback(() => {
    if (!question || !answer) return;
    setCards((prev) => [...prev, { question: question, answer: answer }]);
    setQuestion("");
    setAnswer("");
  }, [question, answer]);

  const deleteCard = useCallback((index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /*
  Function for sending files or text to the API.
  */
  const handleUpload = useCallback(
    async ({
      precondition,
      preconditionMsg,
      buildFormData,
      url,
      setStatus,
      onSuccess,
    }: {
      precondition: boolean;
      preconditionMsg: string;
      buildFormData: () => FormData;
      url: string;
      setStatus: React.Dispatch<React.SetStateAction<UploadStatus>>;
      onSuccess: (newCards: Card[]) => void;
    }) => {
      if (!precondition) {
        alert(preconditionMsg);
        return;
      }
      setStatus("uploading");
      try {
        const response = await fetch(url, {
          method: "POST",
          body: buildFormData(),
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (Array.isArray(data.flashcards)) {
          onSuccess(data.flashcards);
        }
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    },
    []
  );

  // Handles the image uplaod process
  const uploadImages = useCallback(() => {
    handleUpload({
      precondition: !!selectedFiles && selectedFiles.length > 0,
      preconditionMsg: "Please select at least one image first.",
      buildFormData: () => {
        const fd = new FormData();
        Array.from(selectedFiles as FileList).forEach((file) =>
          fd.append("images", file)
        );
        return fd;
      },
      url: "/api/image",
      setStatus: setImageUploadStatus,
      onSuccess: (newCards) => {
        setCards((prev) => [...prev, ...newCards]);
        setSelectedFiles(null);
      },
    });
  }, [selectedFiles, handleUpload]);

  // Handles the text upload process and ensures text is provided
  const uploadText = useCallback(() => {
    handleUpload({
      precondition: paragraphText.length > 0,
      preconditionMsg: "Please enter some text first.",
      buildFormData: () => {
        const fd = new FormData();
        fd.append("text", paragraphText);
        return fd;
      },
      url: "/api/text",
      setStatus: setTextUploadStatus,
      onSuccess: (newCards) => {
        setCards((prev) => [...prev, ...newCards]);
        setParagraphText("");
      },
    });
  }, [paragraphText, handleUpload]);

  // Validate the url
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Save the set and check for valid URL, at least 1 card, and set name
  const saveSet = useCallback(async () => {
    if (!setName || cards.length === 0) {
      alert("Please provide a set name and at least one card.");
      return;
    }
    if (!coverImageUrl || !isValidUrl(coverImageUrl)) {
      alert("Please provide a valid cover image URL");
      return;
    }

    const username = await getClientUsername();
    console.log("Username:", username);

    const payload = {
      setName: setName,
      imgUrl: coverImageUrl,
      flashcards: cards,
      owner: username,
    };

    console.log("Payload:", payload);
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await response.text());
      alert("Flashcard set created successfully!");
      // reset all
      setSetName("");
      setCoverImageUrl("");
      setCards([]);
      setSelectedFiles(null);
      setParagraphText("");
      setImageUploadStatus("idle");
      setTextUploadStatus("idle");
    } catch (error) {
      console.error(error);
      alert("Failed to save. Try again.");
    }
  }, [setName, coverImageUrl, cards]);

  const getButtonText = (status: UploadStatus, defaultText: string) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "success":
        return "Uploaded!";
      case "error":
        return "Retry Upload";
      default:
        return defaultText;
    }
  };

  return (
    <div className="qa-container">
      <main className="qa-main">
        <h2>Create a New Flashcard Set</h2>

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
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
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
          <button className="qa-button-add" onClick={addCard}>
            Add
          </button>
        </div>

        {cards.length > 0 && (
          <section className="qa-cards-list-container">
            <h3>Current Cards</h3>
            <ul className="qa-cards-list">
              {cards.map((card, i) => (
                <li key={i} className="qa-card-item">
                  <div>
                    <p>
                      <strong>Q:</strong> {card.question}
                    </p>
                    <p>
                      <strong>A:</strong> {card.answer}
                    </p>
                  </div>
                  <button
                    className="qa-delete-button"
                    onClick={() => deleteCard(i)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <button className="qa-button-save" onClick={saveSet}>
          Save Flashcard Set
        </button>
      </main>

      <aside className="qa-side-panel">
        <section>
          <h3>Images</h3>
          <div
            className={`file-dropzone${dragActive ? " active" : ""}`}
            role="button"
            aria-label="Drag & drop images or click to select"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              setSelectedFiles(e.dataTransfer.files);
            }}
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
              onChange={(e) => setSelectedFiles(e.target.files)}
              style={{ display: "none" }}
            />
          </div>
          {selectedFiles && (
            <button
              className="qa-button-save"
              onClick={uploadImages}
              disabled={imageUploadStatus === "uploading"}
            >
              {getButtonText(imageUploadStatus, "Upload Image")}
            </button>
          )}
        </section>

        <section>
          <h3>Notes</h3>
          <textarea
            className="notes-textarea"
            placeholder="Additional description..."
            value={paragraphText}
            onChange={(e) => setParagraphText(e.target.value)}
            rows={6}
          />
          {paragraphText && (
            <button
              className="qa-button-save"
              onClick={uploadText}
              disabled={textUploadStatus === "uploading"}
            >
              {getButtonText(textUploadStatus, "Upload Text")}
            </button>
          )}
        </section>
      </aside>
    </div>
  );
};

export default QuestionAnswerForm;
