"use client";

import Link from "next/link";
import React from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  // Handle form submission (retrieve user object)
  async function handleRegister(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      console.log("Registering user...");
      const formData = new FormData(e.currentTarget);

      const username = formData.get("username") as string | null;
      const password = formData.get("password") as string | null;

      if (!username || !password) {
        throw new Error("All fields are required.");
      }
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          flashcardSets: [],
        }),
      });

      if (response.status === 201) {
        router.push("/login");
      } else {
        console.log(`Failed to register: ${response.statusText}`);
      }
    } catch (e: any) {
      console.log(e.message || "An error occurred during registration.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-content-center text-center h-100 bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
      <form
        className="bg-white p-3 mx-auto rounded shadow-md w-50 rounded border shadow-lg"
        onSubmit={handleRegister}
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 m-3"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 margin-50 m-3"
          >
            Password
          </label>
          <input
            placeholder="Enter your password"
            name="password"
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 shadow-sm p-4 mb-5 m-3"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
