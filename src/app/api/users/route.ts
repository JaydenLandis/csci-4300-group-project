import { NextResponse } from "next/server";
import User from "../../../models/userSchema";  // Adjust the path according to your file structure
import bcrypt from "bcryptjs";
import connectMongoDB from "../../../../config/mongodb";  // Adjust the path accordingly


export const POST = async (request: any) => {
  const { username, email, password } = await request.json();
  if (!username || !email || !password) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  await connectMongoDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new NextResponse("User already exists", { status: 409 });
  }

  

  

  const hashedPassword = await bcrypt.hash(password, 10);  // Stronger hash


  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  try {
    await newUser.save();
    return new NextResponse("User created successfully", { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);  // Don't expose in prod
    return new NextResponse("Server error while creating user", { status: 500 });
  }
  
};
