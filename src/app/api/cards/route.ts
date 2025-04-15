import connectMongoDB from "../../../../config/mongodb";
import User from "../../../models/userSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// 501 error if user isn't unique 
export async function POST(request: NextRequest) {
  const {userName, password, subjects } = await request.json();
  await connectMongoDB();
  await User.create({userName, password, subjects})
  return NextResponse.json({message: "User added succesfully"}, {status: 201})
}

export async function GET() {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json({ users });
  }