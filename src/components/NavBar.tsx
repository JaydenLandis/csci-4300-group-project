"use client";
// This is from my Nextjs resources, Navbar_basic
import Image from "next/image";
import logo from "../assets/UGAlogo_Arch_1in.png";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { doLogout } from "../app/actions/index";
import "./NavBar.css";

interface Session {
  user?: {
    username?: string;
    image?: string;
  };
}

interface NavbarProps {
  session: Session | null;
}

// Define the NavBar component
const NavBar = ({ session }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!session?.user);

  useEffect(() => {
    setIsLoggedIn(!!session?.user);
  }, [session]);

  const handleLogout = () => {
    doLogout();
    setIsLoggedIn(!!session?.user);
  };
  return (
    <div className="container-fluid sticky-top p-0 border-bottom">
      <nav
        className="navbar navbar-expand-md navbar-light bg-light p-3"
        aria-label="Fourth navbar example"
      >
        <Link className="navbar-brand" aria-current="page" href="/">
          AutoFlash
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample04"
          aria-controls="navbarsExample04"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample04">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item mx-3">
              <Link className="nav-link active" aria-current="page" href="/">
                Home
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link
                className="nav-link active"
                aria-current="page"
                href="/about"
              >
                About
              </Link>
            </li>
            {isLoggedIn && session?.user ? (
              <>
                <span>Welcome, {session.user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-400 hover:bg-gray-500 rounded-md px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="bg-gray-400 hover:bg-gray-500 rounded-md px-3 py-2">
                <Link href="/login" className="mr-1">
                  Login
                </Link>{" "}
                /{" "}
                <Link href="/register" className="ml-1">
                  Register
                </Link>
              </span>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
