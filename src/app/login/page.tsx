'use server'
import React from "react";
import { FormEvent } from "react";
import Router from "next/router";
import {signIn, signOut} from "../auth";

export async function doLogOut() {
  await signOut({redirectTo: "/"});
}

export async function doCredentialLogin(formData:FormData): Promise<any> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const response = await signIn("credentials", {
     username,
     password,
     redirect: false,
    });
    return response;
  } catch (e: any) {
    throw e;
  }
}
async function onSubmit(event: FormEvent<HTMLFormElement>):Promise<void> {
  event.preventDefault();

  try {
    const formData = new FormData(event.currentTarget);
    const response = await doCredentialLogin(formData);

    if (response?.error) {
      console.error(response.error);
      setError(response.error.message || "An error occured");
    } else{
      Router.push("/");
    }
  } catch (e:any) {
    console.error(e);
    setError("Check your Credentials");
  }
}


const Login = () => {

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
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 shadow-sm p-4 mb-5 m-3"
        >
          Login
        </button>
        <button
          type="submit"
          className="btn w-full bg-blue-500 text-black py-2 rounded hover:bg-blue-600 shadow p-4 mb-5 m-3"
        >
          {" "}
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
