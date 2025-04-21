import connectMongoDB from "../../../../config/mongodb";
import User from "../../../models/userSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const hashedPassword = await bcrypt.hash("password", 10);
  const { username, password } = await request.json();
  await connectMongoDB();

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return NextResponse.json(
      { message: "Username already taken" },
      { status: 409 } // Conflict
    );
  }

  

  const newUser = await User.create({ username, password : hashedPassword });
  return NextResponse.json({ user: newUser }, { status: 201 });
}


export async function GET() {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  }
