// app/layout.tsx
"use client"; // This directive marks this file as a client component

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { auth } from "../auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    //@ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js"); // Dynamically imports Bootstrap JS
  }, []);

  const session = await auth();
  return (
    <html lang="en">
      <body>
        <NavBar session={session} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
