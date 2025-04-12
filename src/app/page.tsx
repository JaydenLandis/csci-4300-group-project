"use client";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Splash from "@/components/Splash";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Splash />
    </main>
  );
}
