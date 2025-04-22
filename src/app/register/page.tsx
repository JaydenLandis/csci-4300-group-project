"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const username = formData.get("username") as string | null;
      const email = formData.get("email") as string | null;
      const password = formData.get("password") as string | null;

      if (!username || !email || !password) {
        throw new Error("All fields are required.");
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 201) {
        router.push("/login");
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to register.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred during registration.");
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md shadow-lg p-8 rounded-lg bg-white border border-gray-300">
        <h1 className="text-xl text-black font-bold my-4 text-center">
          Signup
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              className="border border-gray-400 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              className="border border-gray-400 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              className="border border-gray-400 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-3 mt-2 hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </form>

        <p className="my-3 text-center text-sm text-black">
          Already have an account?
          <Link href="/login" className="mx-2 underline hover:text-gray-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
