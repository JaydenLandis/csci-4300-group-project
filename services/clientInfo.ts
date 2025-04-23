"use client";

import { getSession } from "next-auth/react";

/**
 * Fetches the username of the currently logged-in user from client-side cookies.
 * @returns Promise<string | null>
 */
export async function getClientUsername(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.name || null;
}

export async function belongsToClient(owner: string) : Promise<boolean> {
  const session = await getSession();
  return session?.user?.name === owner;
}
