import connectMongoDB from "../../../../config/mongodb";
import User from "../../../models/userSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
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

  const hashedPassword = await bcrypt.hash(password,5);
  const newUser = {
    username,
    password: hashedPassword
  }
  try {
   await User.create(newUser);
  }
  catch (e:any){
    return NextResponse.json({message: "Item could not be added"},{status: 401});
  }
  finally{
    return NextResponse.json({ message: "Item added successfully" }, { status: 201 });
  }
}


export async function GET() {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  }
