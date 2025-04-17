import connectMongoDB from "../../../../config/mongodb";
import FlashcardSet from "../../../models/flashcardSetSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { flashcards, setName } = await request.json();
  await connectMongoDB();
  await FlashcardSet.create({ flashcards, setName });
  return NextResponse.json({ message: "Item added successfully" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const cards = await FlashcardSet.find();
    return NextResponse.json({ cards }, { status: 200 });
  }