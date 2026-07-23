"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ContextProvider,
  useGlobalContextApiState,
} from "../context/GlobalStateManager";
import { getSession } from "next-auth/react";
import { User } from "../../lib/userType";

interface UserProviderWrapperProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export default function UserProviderWrapper({
  children,
  initialUser,
}: UserProviderWrapperProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  //function to refresh the user state from the server
  const refreshUser = useCallback(async () => {
    try {
      const session = await getSession();
      if (session?.user) {
        const userData = {
          id: session.user.id || "",
          email: session.user.email || "",
          name: session.user.name || "",
          emailVerified: null,
          image: session.user.image || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  }, []);
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);
  return (
    <ContextProvider User={user} refreshUser={refreshUser}>
      {children}
    </ContextProvider>
  );
}
