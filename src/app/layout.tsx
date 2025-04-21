// app/layout.tsx
"use client"; // This directive marks this file as a client component

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    //@ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js"); // Dynamically imports Bootstrap JS
  }, []);

  // State to manage user authentication status
  // This can be replaced with actual authentication logic

  const [loggedInUser, setLoggedInUser] = useState(null);
  function loggedInUserHandler(user: any) {
    setLoggedInUser(user);
  }

  return (
    <html lang="en">
      <head />
      <body>
        <NavBar
          loggedInUser={loggedInUser}
          setLoggedInUser={loggedInUserHandler}
        />

        {children}
        <Footer />
      </body>
    </html>
  );
}
