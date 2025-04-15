"use client";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Splash from "@/components/Splash";
import connectMongoDB from "../../config/mongodb";

export default function Home() {
  connectMongoDB();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Splash />
    </main>
  );
}
