import connectMongoDB from "../../../../config/mongodb";
import User from "../../../models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: any) => {
  const {username, password, flashcardSets} = await request.json();

  console.log(username, password, flashcardSets);

  await connectMongoDB();
  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = {
    username,
    password: hashedPassword,
    flashcardSets: []
  }
  try {
    await User.create(newUser);
  } catch (e: any) {
    return new NextResponse(e.message, {
      status: 500,
    });
  }
  return new NextResponse("User has been created", {
    status: 201,
  });
}


export async function GET() {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  }
