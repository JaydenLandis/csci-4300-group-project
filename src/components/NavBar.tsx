"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doLogout } from "../app/actions/index";

interface Session {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

interface NavbarProps {
  session: Session | null;
}

const NavBar = ({ session }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!session?.user);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!session?.user);
  }, [session]);

  const handleLogout = async () => {
    await doLogout();
    setIsLoggedIn(false);
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-900">AutoFlash</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-black transition">
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-black transition"
          >
            About
          </Link>

          {isLoggedIn && session?.user ? (
            <>
              <Link
                href="/cards"
                className="text-gray-700 hover:text-black transition mr-10"
              >
                Cards
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Welcome, {session.user.name || session.user.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="text-sm bg-gray-300 rounded-md px-4 py-2">
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <span className="mx-1">/</span>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
          <Link href="/" className="block text-gray-700 hover:text-black">
            Home
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-black">
            About
          </Link>
          {isLoggedIn && session?.user ? (
            <div className="flex flex-col gap-2">
              <span className="text-gray-600">
                Welcome, {session.user.name || session.user.email}
              </span>
              <span className="text-gray-600">
                <Link
                  href="/cards"
                  className="text-gray-700 hover:text-black transition mr-10"
                >
                  Cards
                </Link>
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded-md transition w-fit"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="text-sm bg-gray-300 rounded-md px-4 py-2 inline-block">
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <span className="mx-1">/</span>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default NavBar;
