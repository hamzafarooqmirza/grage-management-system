"use client";

import { createContext, useContext } from "react";

interface UserContextValue {
  email: string;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ email }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
