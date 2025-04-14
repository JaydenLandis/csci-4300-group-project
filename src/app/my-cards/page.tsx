"use client";

import React from "react";
import Link from "next/link";

interface DemoCard {
  imageUrl: string;
  subject: string;
  numberOfCards: number;
}

export default function CardsPage() {
  const demoCards: DemoCard[] = [
    {
      imageUrl:
        "https://i0.wp.com/calmatters.org/wp-content/uploads/2021/08/math-curriculum.jpg?fit=2000%2C1500&ssl=1",
      subject: "Math",
      numberOfCards: 10,
    },
    {
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3DUEYnQt3Cqgszi5db8tByUkKoveVfBQfaA&s",
      subject: "Science",
      numberOfCards: 12,
    },
    {
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKyQLk2MtbGJNwxf9PORQjkUxeGyYBfDb1Bg&s",
      subject: "History",
      numberOfCards: 8,
    },
    {
      imageUrl: "https://www.open.edu/openlearn/pluginfile.php/3143042/tool_ocwmanage/image/0/dil_1_OLHP_786x400.jpg",
      subject: "Language",
      numberOfCards: 15,
    },
    {
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3RmDkiAyoth-ojPZzs4AP-yD3QmQC-TJAaw&s",
      subject: "Art",
      numberOfCards: 9,
    },

  ];

  // Combine the "Add Card" with demo cards.
  const cards = [{ type: "add" }, ...demoCards.map((card) => ({ type: "demo", ...card }))];

  // Helper function to chunk the array into rows of three cards.
  const chunkArray = <T,>(arr: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const rows = chunkArray(cards, 3);

  return (
    <div className="container mt-4">
      {rows.map((row, rowIndex) => (
        <div className="row mb-4" key={rowIndex}>
          {row.map((card, cardIndex) => (
            <div className="col-md-4" key={cardIndex}>
              {card.type === "add" ? (
                <Link href="/new-card" className="text-decoration-none">
                  <div className="card text-center h-100" style={{ minHeight: "350px" }}>
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title">Add Card</h5>
                      <p className="card-text">Click here to add a new card</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {console.log("Flash me")}}
                  className="btn btn-light w-100 h-100 p-0 border-0"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <div className="card text-center h-100" style={{ minHeight: "350px" }}>
                    <img
                      src={(card as DemoCard).imageUrl}
                      className="card-img-top"
                      alt={(card as DemoCard).subject}
                      style={{ width: "100%", height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{(card as DemoCard).subject}</h5>
                      <p className="card-text">{(card as DemoCard).numberOfCards} cards</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

