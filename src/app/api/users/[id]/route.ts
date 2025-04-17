import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "../../../../../config/mongodb";
import User from "../../../../models/userSchema";

interface RouteParams {
    params: { id: string };
  }

export async function PUT(request:NextRequest, { params}:RouteParams ) {
  const { id } = await params;
  const { username: username, password: password, flashcardSets: flashcardSets } = await request.json();
  await connectMongoDB();
  await User.findByIdAndUpdate(id, { username, password, flashcardSets});
  return NextResponse.json({ message: "User updated" }, { status: 200 });
}

export async function GET(request:NextRequest, { params }:RouteParams) {
  const { id } = await params;
  await connectMongoDB();
  const user = await User.findOne({ _id: id });
  return NextResponse.json({ user }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }
  
    await connectMongoDB();
    const deletedItem = await User.findByIdAndDelete(id);
  
    if (!deletedItem) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  }