"use client";

import React, { useState } from "react";
import "./single-card.css"; // or import specific flip styles

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export default function FlipCard({ front, back }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`big-card-container ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="big-card">
        <div className="card-front">{front}</div>
        <div className="card-back">{back}</div>
      </div>
    </div>
  );
}
