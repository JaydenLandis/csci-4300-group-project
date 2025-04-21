"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  // Define the form states
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Handle form submission (retrieve user object)
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/username/${username}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const { user } = await res.json();
      if (user.password === password) {
        console.log("Login successful");
        // props.setLoggedInUser(user);
        router.push("/cards");
      } else {
        console.log("Incorrect password");
        setError("Incorrect password");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res: any = await fetch(`http://localhost:3000/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const newUser = await res.json();
      // props.setLoggedInUser(newUser);
      router.push("/cards");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-content-center text-center h-100 bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-2">
        Please enter your Username and Password
      </h1>
      <p className="text-3xl mb-3 pb-5">
        or register if you don't have an account
      </p>
      <form className="bg-white p-3 mx-auto rounded shadow-md w-50 rounded border shadow-lg">
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
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
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
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 shadow-sm p-4 mb-5 m-3"
          onClick={(e) => {
            handleLogin(e);
          }}
        >
          Login
        </button>
        <button
          type="button"
          className="btn w-full bg-blue-500 text-black py-2 rounded hover:bg-blue-600 shadow p-4 mb-5 m-3"
          onClick={(e) => {
            handleRegister(e);
          }}
        >
          {" "}
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
