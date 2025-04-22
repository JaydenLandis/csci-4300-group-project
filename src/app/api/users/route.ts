import { NextResponse } from "next/server";
import User from "../../../models/userSchema";  // Adjust the path according to your file structure
import bcrypt from "bcryptjs";
import connectMongoDB from "../../../../config/mongodb";  // Adjust the path accordingly

export const POST = async (request: any) => {
  const { username, email, password } = await request.json();

  await connectMongoDB();

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
    return new NextResponse("Error creating user", { status: 500 });
  }
};
