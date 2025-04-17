import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "../../../../../config/mongodb";
import FlashcardSet from "../../../../models/flashcardSetSchema";

interface RouteParams {
    params: { id: string };
  }

export async function PUT(request:NextRequest, { params }:RouteParams ) {
  const { id } = await params;
  const { flashcards: flashcards, setName: setName, imgUrl: imgUrl } = await request.json();
  await connectMongoDB();
  await FlashcardSet.findByIdAndUpdate(id, { flashcards, setName, imgUrl });
  return NextResponse.json({ message: "Flashcard Set updated" }, { status: 200 });
}

export async function GET(request:NextRequest, { params }:RouteParams) {
  const { id } = await params;
  await connectMongoDB();
  const flashcardSet = await FlashcardSet.findOne({ _id: id });
  return NextResponse.json({ flashcardSet }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }
  
    await connectMongoDB();
    const deletedItem = await FlashcardSet.findByIdAndDelete(id);
  
    if (!deletedItem) {
      return NextResponse.json({ message: "Card Set not found" }, { status: 404 });
    }
  
    return NextResponse.json({ message: "Flashcard Set deleted" }, { status: 200 });
  }