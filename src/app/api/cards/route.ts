import connectMongoDB from "../../../../config/mongodb";
import FlashcardSet from "../../../models/flashcardSetSchema";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// 501 error if user isn't unique 
export async function POST(request: NextRequest) {
  const { flashcards, setName, imgUrl, owner } = await request.json();
  console.log("Received payload:", { flashcards, setName, imgUrl, owner }); // Log received data
  await connectMongoDB();
  await FlashcardSet.create({ flashcards, setName, imgUrl, owner });
  return NextResponse.json({ message: "Item added successfully" }, { status: 201 });
}


export async function GET() {
    await connectMongoDB();
    const cards = await FlashcardSet.find().sort({ _id: -1 });
    return NextResponse.json({ cards }, { status: 200 });
  }