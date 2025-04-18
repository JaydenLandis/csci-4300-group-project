import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../../../../config/mongodb";
import User from "@/models/userSchema";

interface RouteParams {
  params: { username: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { username } = await params;
  await connectMongoDB();

  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user }, { status: 200 });
}